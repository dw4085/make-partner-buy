'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Link, Sparkles, ArrowRight, AlertCircle, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Header } from '@/components/layout/Header';
import { useSession } from '@/context/SessionContext';
import { CONTENT_LIMITS, ANIMATION } from '@/lib/constants';
import { RIVIAN_EXAMPLE_SCENARIO } from '@/lib/ai/prompts';

export function ScenarioInputScreen() {
  const { setStep, setScenario } = useSession();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'text' | 'example'>('text');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [urlDialogOpen, setUrlDialogOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [extractingContent, setExtractingContent] = useState(false);
  const [showUrlTip, setShowUrlTip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const characterCount = inputText.length;
  const isValidLength = characterCount >= CONTENT_LIMITS.scenario.min && characterCount <= CONTENT_LIMITS.scenario.max;
  const canSubmit = inputMode === 'example' || (inputMode === 'text' && isValidLength);

  const handleUseExample = useCallback(() => {
    setInputMode('example');
    setInputText('');
    setUploadedFile(null);
    setError(null);
    setShowUrlTip(false);
  }, []);

  const handleUseCustom = useCallback(() => {
    setInputMode('text');
    setError(null);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'text/plain', 'text/markdown'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
      setError('Please upload a PDF or text file');
      return;
    }

    setError(null);
    setExtractingContent(true);
    setUploadedFile(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract-content', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to extract content from file');
      }

      const { text } = await response.json();
      setInputText(text.substring(0, CONTENT_LIMITS.scenario.max));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setUploadedFile(null);
    } finally {
      setExtractingContent(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;

    // Basic URL validation
    try {
      new URL(urlInput);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setError(null);
    setExtractingContent(true);
    setUrlDialogOpen(false);

    try {
      const formData = new FormData();
      formData.append('url', urlInput);

      const response = await fetch('/api/extract-content', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to extract content from URL');
      }

      const { text } = await response.json();
      setInputText(text.substring(0, CONTENT_LIMITS.scenario.max));
      setUrlInput('');
      setShowUrlTip(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch URL content');
    } finally {
      setExtractingContent(false);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setInputText('');
    setShowUrlTip(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (inputMode === 'example') {
        setScenario(RIVIAN_EXAMPLE_SCENARIO);
        setStep('initial-stance');
        return;
      }

      const response = await fetch('/api/parse-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: inputText,
          sourceType: uploadedFile ? 'pdf' : 'text'
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to parse scenario');
      }

      const scenario = await response.json();
      setScenario(scenario);
      setStep('initial-stance');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showStep currentStep={1} totalSteps={6} />

      <main id="main-content" className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={ANIMATION.slideUp.initial}
            animate={ANIMATION.slideUp.animate}
            transition={ANIMATION.slideUp.transition}
          >
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="font-serif text-2xl text-foreground">
                  Describe Your Scenario
                </CardTitle>
                <div className="w-16 h-1 bg-[#B4975A] rounded-full mt-2" />
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Mode toggle */}
                <div className="flex gap-3">
                  <Button
                    variant={inputMode === 'example' ? 'default' : 'outline'}
                    onClick={handleUseExample}
                    className="flex-1"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Use Rivian Example
                  </Button>
                  <Button
                    variant={inputMode === 'text' ? 'default' : 'outline'}
                    onClick={handleUseCustom}
                    className="flex-1"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Custom Scenario
                  </Button>
                </div>

                {/* Example scenario preview */}
                {inputMode === 'example' && (
                  <motion.div
                    className="bg-muted rounded-xl p-5"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="font-semibold text-foreground mb-2">
                      {RIVIAN_EXAMPLE_SCENARIO.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {RIVIAN_EXAMPLE_SCENARIO.summary}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <strong>Key factors:</strong> Batteries, vertical integration, technology evolution, supplier relationships
                    </div>
                  </motion.div>
                )}

                {/* Custom text input */}
                {inputMode === 'text' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* File upload indicator */}
                    {uploadedFile && (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg text-green-700">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm font-medium">{uploadedFile.name}</span>
                        </div>
                        <button
                          onClick={clearFile}
                          className="p-1 hover:bg-green-100 rounded"
                          aria-label="Remove file"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* Extracting content indicator */}
                    {extractingContent && (
                      <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
                        <span className="text-sm text-blue-700">Extracting content...</span>
                      </div>
                    )}

                    {/* URL extraction tip */}
                    {showUrlTip && !extractingContent && (
                      <div className="flex items-start justify-between p-3 bg-amber-50 rounded-lg text-amber-800">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">
                            <strong>Tip:</strong> If the extracted content doesn&apos;t look right, try copying and pasting the article text directly from the webpage instead.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowUrlTip(false)}
                          className="p-1 hover:bg-amber-100 rounded ml-2 flex-shrink-0"
                          aria-label="Dismiss tip"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    <Textarea
                      placeholder="Describe a business scenario where a company faces a make-buy-partner decision. Include context about the company, the technology or capability in question, and relevant market conditions..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-[200px] resize-none text-base"
                      aria-label="Scenario description"
                      aria-describedby="char-count"
                      disabled={extractingContent}
                    />
                    <div
                      id="char-count"
                      className={`text-sm flex justify-between ${
                        characterCount > 0 && !isValidLength
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <span>
                        {characterCount < CONTENT_LIMITS.scenario.min
                          ? `Minimum ${CONTENT_LIMITS.scenario.min} characters`
                          : characterCount > CONTENT_LIMITS.scenario.max
                          ? `Maximum ${CONTENT_LIMITS.scenario.max} characters`
                          : 'Good length'}
                      </span>
                      <span>{characterCount} / {CONTENT_LIMITS.scenario.max}</span>
                    </div>

                    {/* PDF and URL buttons */}
                    <div className="flex gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={extractingContent}
                        className="flex-1"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload PDF
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setUrlDialogOpen(true)}
                        disabled={extractingContent}
                        className="flex-1"
                      >
                        <Link className="mr-2 h-4 w-4" />
                        Paste URL
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Error message */}
                {error && (
                  <motion.div
                    className="flex items-start gap-3 p-4 bg-red-50 rounded-lg text-red-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Error</p>
                      <p className="text-sm mt-1">{error}</p>
                    </div>
                  </motion.div>
                )}

                {/* Tip box */}
                <div className="bg-blue-50 rounded-lg p-4 flex gap-3">
                  <span className="text-lg">💡</span>
                  <p className="text-sm text-[#1E3A5F] italic">
                    <strong className="not-italic">Tip:</strong> A good scenario includes the company context,
                    what technology or capability is being evaluated, and why the decision matters strategically.
                  </p>
                </div>

                {/* Submit button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isLoading || extractingContent}
                  className="w-full py-6 text-lg"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Scenario...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* URL Dialog */}
      <Dialog open={urlDialogOpen} onOpenChange={setUrlDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter URL</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <input
              type="url"
              placeholder="https://example.com/article"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Paste a URL to a case study, article, or any webpage describing a business scenario.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUrlDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
              Extract Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
