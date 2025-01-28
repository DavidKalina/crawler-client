"use client";

import { startCrawl } from "@/app/actions/initiateCrawl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Globe, Layers, LinkIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import UrlHistory from "./UrlHistory";

const CrawlInitiator = () => {
  const [depth, setDepth] = useState(1);
  const [url, setUrl] = useState("https://books.toscrape.com");
  const [allowedDomains, setAllowedDomains] = useState("books.toscrape.com");
  const [isLoading, setIsLoading] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const validateUrl = useCallback((input: string) => {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  }, []);

  const extractDomain = useCallback((input: string) => {
    try {
      const url = new URL(input);
      return url.hostname;
    } catch {
      return "";
    }
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setIsUrlValid(newUrl === "" || validateUrl(newUrl));
  };

  useEffect(() => {
    if (url && validateUrl(url)) {
      const domain = extractDomain(url);
      setAllowedDomains(domain);
    }
  }, [url, validateUrl, extractDomain]);

  const handleHistorySelect = (selectedUrl: string, selectedDomains: string) => {
    setUrl(selectedUrl);
    setAllowedDomains(selectedDomains);
  };

  // Function to update URL history
  const updateUrlHistory = (newUrl: string, domains: string) => {
    const savedHistory = localStorage.getItem("urlHistory");
    const history = savedHistory ? JSON.parse(savedHistory) : [];

    const newEntry = {
      url: newUrl,
      allowedDomains: domains,
      timestamp: Date.now(),
    };

    // Remove duplicates and keep only last 5 entries
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredHistory = history.filter((entry: any) => entry.url !== newUrl);
    const newHistory = [newEntry, ...filteredHistory].slice(0, 5);

    localStorage.setItem("urlHistory", JSON.stringify(newHistory));
  };

  const handleSubmit = useCallback(async () => {
    if (!validateUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await startCrawl({
        startUrl: url,
        maxDepth: depth,
        allowedDomains: allowedDomains ? allowedDomains.split(",").map((d) => d.trim()) : undefined,
      });
      if (!result.success) throw new Error(result.error);

      // Only update history on successful submission
      updateUrlHistory(url, allowedDomains);

      toast({
        variant: "success",
        title: "Success",
        description: "Crawl job queued successfully",
      });
      router.refresh();
    } catch {
      toast({
        title: "Error",
        description: "Failed to queue crawl job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [allowedDomains, depth, router, toast, url, validateUrl]);

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="py-3 border-b border-zinc-800">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-blue-400" />
          <CardTitle className="text-sm text-zinc-100">New Crawl</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <UrlHistory onSelect={handleHistorySelect} />
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <LinkIcon className="h-3.5 w-3.5 text-zinc-500" />
            </div>
            <Input
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com"
              disabled={isLoading}
              aria-label="Start URL"
              className={`pl-8 h-9 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 
                       focus-visible:ring-blue-400/20 focus-visible:border-blue-400/20 focus-visible:ring-offset-0
                       ${!isUrlValid ? "border-red-500/50" : ""}`}
            />
          </div>
          {!isUrlValid && url !== "" && (
            <p className="text-xs text-red-400 mt-1">
              Please enter a valid URL including http:// or https://
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="h-3.5 w-3.5 text-zinc-400" />
              <span className="text-sm text-zinc-300">Crawl Depth</span>
            </div>
            <span className="text-xs text-zinc-400 tabular-nums">
              {depth} level{depth > 1 ? "s" : ""}
            </span>
          </div>
          <Slider
            value={[depth]}
            onValueChange={(value) => setDepth(value[0])}
            max={5}
            min={1}
            step={1}
            disabled={isLoading}
            aria-label="Crawl depth"
          />
        </div>

        <div>
          <Input
            value={allowedDomains}
            onChange={(e) => setAllowedDomains(e.target.value)}
            placeholder="Allowed domains (optional)"
            disabled={isLoading}
            aria-label="Allowed domains"
            className="h-9 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 
                     focus-visible:ring-blue-400/20 focus-visible:border-blue-400/20 focus-visible:ring-offset-0"
          />
          <p className="text-xs text-zinc-500 mt-1">Separate multiple domains with commas</p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!url || isLoading || !isUrlValid}
          className="w-full h-9 bg-green-500/10 border-green-500/20 text-green-400 
                   hover:bg-green-500/20 hover:text-green-300
                   focus-visible:ring-offset-zinc-900 focus-visible:ring-green-400/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              <span>Starting Crawl...</span>
            </>
          ) : (
            <>
              <Globe className="mr-2 h-3.5 w-3.5" />
              <span>Start Crawling</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CrawlInitiator;
