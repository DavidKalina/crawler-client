import { Slider } from "@radix-ui/react-slider";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

const CrawlInitiator = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Start New Crawl</CardTitle>
        <CardDescription>Configure and initiate a new web crawling operation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Input placeholder="Enter start URL (e.g., https://example.com)" className="mb-2" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Crawl Depth</label>
            <div className="flex items-center gap-4">
              <Slider defaultValue={[3]} max={5} min={1} step={1} className="w-48" />
              <span className="text-sm">3 levels</span>
            </div>
          </div>
          <div>
            <Input placeholder="Allowed domains (optional, comma-separated)" />
          </div>
          <Button className="w-full">Start Crawl</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrawlInitiator;
