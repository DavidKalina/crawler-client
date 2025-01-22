"use client";

import React, { useState } from "react";
import { Globe, Layers, LinkIcon, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { startCrawl } from "@/app/actions/initiateCrawl";

const CrawlInitiator = () => {
  const [depth, setDepth] = useState(1);
  const [url, setUrl] = useState("https://books.toscrape.com");
  const [allowedDomains, setAllowedDomains] = useState("books.toscrape.com");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await startCrawl({
        startUrl: url,
        maxDepth: depth,
        allowedDomains: allowedDomains ? allowedDomains.split(",").map((d) => d.trim()) : undefined,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setSuccess(`Crawl started successfully! Job ID: ${result.jobId}`);
      setUrl((prev) => prev);
      setAllowedDomains("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-xl font-semibold">New Crawl</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LinkIcon className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={isLoading}
            className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Crawl Depth</span>
            </div>
            <span className="text-sm text-gray-500">{depth} levels</span>
          </div>
          <Slider
            value={[depth]}
            onValueChange={(value) => setDepth(value[0])}
            max={5}
            min={1}
            step={1}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <div className="relative">
          <Input
            value={allowedDomains}
            onChange={(e) => setAllowedDomains(e.target.value)}
            placeholder="Allowed domains (optional)"
            disabled={isLoading}
            className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
          <div className="text-xs text-gray-500 mt-1 ml-1">
            Separate multiple domains with commas
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!url || isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting Crawl...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Start Crawling
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CrawlInitiator;
