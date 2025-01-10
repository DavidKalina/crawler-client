import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ChevronRight, RefreshCw, TreePine } from "lucide-react";
import ActiveCrawlCard from "./ActiveCrawlCard";
import CrawlInitiator from "./CrawlInitiator";
import QueueContainer from "./QueueMonitorContainer";

const ResultsPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crawl Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="p-4">
                <CardDescription>Total Pages</CardDescription>
                <CardTitle>145</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardDescription>Avg. Page Size</CardDescription>
                <CardTitle>256KB</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardDescription>Success Rate</CardDescription>
                <CardTitle>98.2%</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardDescription>Error Count</CardDescription>
                <CardTitle>3</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TreePine className="h-5 w-5" />
              <h3 className="font-medium">Crawl Tree</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                <span className="text-sm">example.com/</span>
              </div>
              <div className="ml-6 space-y-2">
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-sm">example.com/about</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-sm">example.com/products</span>
                </div>
              </div>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>3 pages encountered 404 errors during crawl</AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Web Crawler Dashboard</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
              Clear Queue
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - 1/4 width */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <CrawlInitiator />
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Active Crawls</h2>
                <ActiveCrawlCard />
              </div>
            </div>
          </div>

          {/* Right Column - 3/4 width */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="results">
              <TabsList className="mb-4">
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="errors">Errors</TabsTrigger>
              </TabsList>
              <TabsContent value="results">
                <ResultsPanel />
              </TabsContent>
              <TabsContent value="errors">
                <Card>
                  <CardHeader>
                    <CardTitle>Error Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">{/* Error log content would go here */}</div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Queue Monitor positioned below the results */}
            <QueueContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
