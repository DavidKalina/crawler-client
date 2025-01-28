import { startCrawl } from "@/app/actions/initiateCrawl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Globe, Layers, LinkIcon, Loader2, Info } from "lucide-react";
import { useCallback, useState } from "react";

const CrawlInitiator = () => {
  const [depth, setDepth] = useState(1);
  const [url, setUrl] = useState("https://books.toscrape.com");
  const [allowedDomains, setAllowedDomains] = useState("books.toscrape.com");
  const [isLoading, setIsLoading] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState(true);
  const { toast } = useToast();

  const validateUrl = useCallback((input: string) => {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setIsUrlValid(newUrl === "" || validateUrl(newUrl));
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

      if (!result.success) {
        throw new Error(result.error);
      }

      setUrl((prev) => prev);
      setAllowedDomains("");
      toast({
        title: "Success",
        description: "Crawl job started successfully",
        variant: "default",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to start crawl job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [allowedDomains, depth, toast, url, validateUrl]);

  return (
    <Card className="bg-zinc-900 border border-zinc-800 shadow-2xl">
      <CardHeader className="space-y-1 pb-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-blue-400" />
            <CardTitle className="text-md font-medium text-zinc-100">New Crawl</CardTitle>
          </div>
          <button
            className="p-1.5 rounded-md hover:bg-zinc-800 transition-colors group"
            title="Learn more about crawling"
          >
            <Info className="h-4 w-4 text-zinc-500 group-hover:text-zinc-400" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-4 w-4 text-zinc-500" />
            </div>
            <Input
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com"
              disabled={isLoading}
              aria-label="Start URL"
              className={`pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 
                       focus-visible:ring-blue-400/20 focus-visible:border-blue-400/20 focus-visible:ring-offset-0
                       transition-colors duration-200
                       disabled:opacity-50 ${!isUrlValid ? "border-red-500/50" : ""}`}
            />
          </div>
          {!isUrlValid && url !== "" && (
            <p className="text-xs text-red-400 ml-1">
              Please enter a valid URL including http:// or https://
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="h-4 w-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-300">Crawl Depth</span>
            </div>
            <span className="text-sm text-zinc-400 tabular-nums">
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
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Input
            value={allowedDomains}
            onChange={(e) => setAllowedDomains(e.target.value)}
            placeholder="Allowed domains (optional)"
            disabled={isLoading}
            aria-label="Allowed domains"
            className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 
                     focus-visible:ring-blue-400/20 focus-visible:border-blue-400/20 focus-visible:ring-offset-0
                     transition-colors duration-200
                     disabled:opacity-50"
          />
          <div className="text-xs text-zinc-500 ml-1">Separate multiple domains with commas</div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!url || isLoading || !isUrlValid}
          className="w-full bg-green-500/10 border border-green-500/20 text-green-400 
                   hover:bg-green-500/20 hover:text-green-300 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed
                   focus-visible:ring-offset-zinc-900 focus-visible:ring-green-400/20"
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
