import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Globe2,
  Search,
  Shield,
  Clock,
  Database,
  Boxes,
  ArrowRight,
  Settings2,
  Share2,
  Workflow,
} from "lucide-react";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  highlight?: string;
}

const Features = () => {
  const features: Feature[] = [
    {
      icon: Globe2,
      title: "Intelligent Crawling",
      description:
        "Smart depth control and domain restrictions to focus your scraping efforts where they matter most.",
      highlight: "Depth: 1-10 levels",
    },
    {
      icon: Search,
      title: "Advanced Search",
      description:
        "Powerful full-text search capabilities with filtering and aggregation to find exactly what you need.",
      highlight: "Instant results",
    },
    {
      icon: Shield,
      title: "Rate Limiting & Proxies",
      description:
        "Built-in rate limiting and proxy support ensures courteous and reliable data collection.",
      highlight: "Auto-scaling",
    },
    {
      icon: Clock,
      title: "Quota Management",
      description:
        "Monthly page quotas with automatic resets and flexible upgrade options to match your needs.",
      highlight: "5000 free pages",
    },
    {
      icon: Database,
      title: "Structured Storage",
      description:
        "Automatically organized and indexed storage of your scraped content with easy export options.",
      highlight: "JSON/CSV export",
    },
    {
      icon: Boxes,
      title: "Distributed System",
      description:
        "Horizontally scalable architecture built on Docker and Redis for reliable performance.",
      highlight: "99.9% uptime",
    },
    {
      icon: Settings2,
      title: "Customizable Parsing",
      description: "Define custom selectors and extraction rules to get exactly the data you need.",
      highlight: "CSS & XPath",
    },
    {
      icon: Share2,
      title: "API Access",
      description: "RESTful API for programmatic access to all features and seamless integration.",
      highlight: "OpenAPI spec",
    },
    {
      icon: Workflow,
      title: "Pipeline Integration",
      description: "Webhook support and event streaming for real-time data processing workflows.",
      highlight: "Real-time events",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/50 to-zinc-950" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold text-zinc-100">
            Everything you need to <span className="text-blue-400">scale</span> your web scraping
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Built for developers who need reliable, scalable web scraping infrastructure without the
            operational overhead.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <Card
              key={i}
              className="group bg-zinc-900 border-zinc-800 hover:border-blue-500/20 
                       transition-all duration-300 relative overflow-hidden"
            >
              <CardContent className="pt-6">
                {/* Feature icon */}
                <div
                  className="rounded-full w-12 h-12 bg-blue-500/10 flex items-center justify-center mb-4
                              group-hover:bg-blue-500/20 transition-colors duration-300"
                >
                  <feature.icon className="h-6 w-6 text-blue-400" />
                </div>

                {/* Feature content */}
                <h3 className="text-lg font-medium text-zinc-100 mb-2 flex items-center gap-2">
                  {feature.title}
                  <ArrowRight
                    className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 
                                     group-hover:translate-x-0 transition-all duration-300"
                  />
                </h3>
                <p className="text-zinc-400 mb-3">{feature.description}</p>

                {/* Highlight tag */}
                {feature.highlight && (
                  <div
                    className="inline-flex items-center px-2 py-1 rounded-md bg-blue-500/10 
                                border border-blue-500/20"
                  >
                    <span className="text-xs text-blue-400">{feature.highlight}</span>
                  </div>
                )}

                {/* Hover effect overlay */}
                <div
                  className="absolute inset-0 border-2 border-blue-400/20 opacity-0 
                              scale-95 group-hover:scale-100 group-hover:opacity-100 
                              transition-all duration-300 rounded-lg pointer-events-none"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
