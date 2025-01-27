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

      setSuccess(`Crawl started successfully!`);
      setUrl((prev) => prev);
      setAllowedDomains("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border border-zinc-800 shadow-2xl">
      <CardHeader className="space-y-1 pb-4 border-b border-zinc-800">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-blue-400" />
          <CardTitle className="text-md font-medium text-zinc-100">New Crawl</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {error && (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LinkIcon className="h-4 w-4 text-zinc-500" />
          </div>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={isLoading}
            className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 
                     focus-visible:ring-blue-400/20 focus-visible:border-blue-400/20 focus-visible:ring-offset-0
                     disabled:opacity-50"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="h-4 w-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-300">Crawl Depth</span>
            </div>
            <span className="text-sm text-zinc-400">{depth} levels</span>
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

        <div className="space-y-2">
          <Input
            value={allowedDomains}
            onChange={(e) => setAllowedDomains(e.target.value)}
            placeholder="Allowed domains (optional)"
            disabled={isLoading}
            className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 
                     focus-visible:ring-blue-400/20 focus-visible:border-blue-400/20 focus-visible:ring-offset-0
                     disabled:opacity-50"
          />
          <div className="text-xs text-zinc-500 ml-1">Separate multiple domains with commas</div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!url || isLoading}
          className="w-full bg-green-500/10 border border-green-500/20 text-green-400 
                   hover:bg-green-500/20 hover:text-green-300 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
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
