import React, { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Code, FileText } from "lucide-react";

const PageDetailsDialog = ({
  page,
  open,
  onOpenChange,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page: any;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) => {
  if (!page) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800 p-0">
        <DialogHeader className="px-6 py-4 border-b border-zinc-800">
          {/* Top row with close button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-3.5 w-3.5 text-blue-400" />
              <DialogTitle className="text-sm font-medium text-zinc-100">Page Details</DialogTitle>
            </div>
            <div className="flex items-center space-x-3">
              <StatusIndicator status={page.processing_status} />
              {/* The close button is handled by the Dialog component */}
            </div>
          </div>

          {/* Content title and URL */}
          <div className="space-y-1.5">
            <h3 className="text-lg font-medium text-zinc-100">{page.title || "Untitled"}</h3>
            <a
              href={page.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1.5 w-fit transition-colors"
            >
              {page.url}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </DialogHeader>

        <Tabs defaultValue="content" className="p-6">
          <TabsList className="bg-zinc-800/50 border border-zinc-800">
            <TabsTrigger
              value="content"
              className="data-[state=active]:bg-zinc-900 data-[state=active]:text-blue-400 text-zinc-400"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Content
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="data-[state=active]:bg-zinc-900 data-[state=active]:text-blue-400 text-zinc-400"
            >
              <Code className="h-3.5 w-3.5 mr-1.5" />
              Raw Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 space-y-4">
                <div className="prose prose-zinc prose-invert max-w-none">
                  <div className="text-sm text-zinc-300">
                    {page.content_text || "No content available"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="mt-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="h-[32rem] rounded-lg border border-zinc-800">
                  <div className="h-full overflow-auto">
                    <pre className="text-sm text-zinc-100 bg-zinc-800/50 p-4 whitespace-pre-wrap break-all">
                      {JSON.stringify(page.extracted_content, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PageDetailsDialog;
