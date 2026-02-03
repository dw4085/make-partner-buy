import { NextRequest, NextResponse } from 'next/server';

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Validate URL to prevent SSRF attacks
function isValidExternalUrl(urlString: string): { valid: boolean; error?: string } {
  try {
    const url = new URL(urlString);

    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
    }

    // Block localhost and internal IPs
    const hostname = url.hostname.toLowerCase();

    // Block localhost variations
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return { valid: false, error: 'Cannot fetch from localhost' };
    }

    // Block private IP ranges
    const ipPatterns = [
      /^10\./,                     // 10.0.0.0/8
      /^172\.(1[6-9]|2[0-9]|3[01])\./, // 172.16.0.0/12
      /^192\.168\./,               // 192.168.0.0/16
      /^169\.254\./,               // Link-local
      /^0\./,                      // 0.0.0.0/8
    ];

    for (const pattern of ipPatterns) {
      if (pattern.test(hostname)) {
        return { valid: false, error: 'Cannot fetch from internal network addresses' };
      }
    }

    // Block common internal hostnames
    if (
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.localhost') ||
      hostname === 'metadata.google.internal' ||
      hostname === 'metadata'
    ) {
      return { valid: false, error: 'Cannot fetch from internal hostnames' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

// Polyfill DOMMatrix for pdf.js in Node.js environment
if (typeof globalThis.DOMMatrix === 'undefined') {
  // @ts-expect-error - Polyfill for Node.js
  globalThis.DOMMatrix = class DOMMatrix {
    constructor() {
      return {
        a: 1, b: 0, c: 0, d: 1, e: 0, f: 0,
        m11: 1, m12: 0, m13: 0, m14: 0,
        m21: 0, m22: 1, m23: 0, m24: 0,
        m31: 0, m32: 0, m33: 1, m34: 0,
        m41: 0, m42: 0, m43: 0, m44: 1,
        is2D: true,
        isIdentity: true,
      };
    }
  };
}

// Helper function to parse PDF using pdf-parse
async function parsePDF(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse/lib/pdf-parse.js');
  const data = await pdfParse(buffer);
  return data.text;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const url = formData.get('url') as string | null;

    let extractedText = '';

    if (file) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File too large. Maximum size is 10MB.' },
          { status: 400 }
        );
      }

      // Handle PDF file
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        extractedText = await parsePDF(buffer);
      } else {
        // Handle text files
        extractedText = await file.text();
      }
    } else if (url) {
      // Validate URL to prevent SSRF
      const urlValidation = isValidExternalUrl(url);
      if (!urlValidation.valid) {
        return NextResponse.json(
          { error: urlValidation.error || 'Invalid URL' },
          { status: 400 }
        );
      }

      // Handle URL - fetch the page content
      try {
        // Use browser-like headers to avoid being blocked
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
          redirect: 'follow',
        });

        if (!response.ok) {
          console.error(`URL fetch failed with status ${response.status}: ${response.statusText}`);
          throw new Error(`Website returned error ${response.status}. The site may be blocking automated requests.`);
        }

        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/pdf')) {
          // PDF from URL
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          extractedText = await parsePDF(buffer);
        } else {
          // HTML content - extract text
          const html = await response.text();

          // Better HTML to text conversion
          extractedText = html
            // Remove script and style tags with their content
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
            // Remove HTML comments
            .replace(/<!--[\s\S]*?-->/g, '')
            // Convert common block elements to newlines
            .replace(/<\/(p|div|h[1-6]|li|tr|br|hr)[^>]*>/gi, '\n')
            // Remove remaining tags
            .replace(/<[^>]+>/g, ' ')
            // Decode common HTML entities
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            // Clean up whitespace
            .replace(/\s+/g, ' ')
            .replace(/\n\s+/g, '\n')
            .trim();
        }
      } catch (fetchError) {
        console.error('URL fetch error:', fetchError);
        if (fetchError instanceof Error && fetchError.message.includes('Website returned')) {
          throw fetchError;
        }
        throw new Error('Failed to fetch content from URL. The site may be blocking automated requests, or the URL may be invalid.');
      }
    } else {
      return NextResponse.json(
        { error: 'No file or URL provided' },
        { status: 400 }
      );
    }

    // Limit extracted text length
    if (extractedText.length > 50000) {
      extractedText = extractedText.substring(0, 50000);
    }

    if (extractedText.length < 100) {
      return NextResponse.json(
        { error: 'Could not extract enough text from the provided source. Please try a different file or URL.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error('Content extraction error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to extract content' },
      { status: 500 }
    );
  }
}
