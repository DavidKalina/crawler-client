import { Progress } from "@radix-ui/react-progress";
import { StopCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";

const ActiveCrawlCard = () => {
  const progress = 65; // Example progress

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">example.com</CardTitle>
            <CardDescription className="text-xs">Job ID: abc-123</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <StopCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Progress value={progress} className="h-2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Status</div>
              <div className="font-medium">Active</div>
            </div>
            <div>
              <div className="text-muted-foreground">Pages Crawled</div>
              <div className="font-medium">45/70</div>
            </div>
            <div>
              <div className="text-muted-foreground">Time Elapsed</div>
              <div className="font-medium">2m 34s</div>
            </div>
            <div>
              <div className="text-muted-foreground">Queue Status</div>
              <div className="font-medium">12 waiting</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveCrawlCard;
