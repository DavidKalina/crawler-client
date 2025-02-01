import { Button } from "@/components/ui/button";
import { Boxes, Package } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  SiDocker,
  SiExpress,
  SiNodedotjs,
  SiRedis,
  SiTypescript,
  SiSupabase,
} from "react-icons/si";

interface TechStackItem {
  name: string;
  icon: React.ElementType;
  color: string;
}

const Hero = () => {
  const techStack: TechStackItem[] = [
    { name: "Docker", icon: SiDocker, color: "text-blue-400" },
    { name: "Redis", icon: SiRedis, color: "text-red-400" },
    { name: "TypeScript", icon: SiTypescript, color: "text-blue-400" },
    { name: "Express", icon: SiExpress, color: "text-zinc-400" },
    { name: "Node", icon: SiNodedotjs, color: "text-green-400" },
    { name: "BullMQ", icon: Boxes, color: "text-purple-400" },
    { name: "Supabase", icon: SiSupabase, color: "text-emerald-400" },
  ];

  return (
    <header className="relative overflow-hidden border-b border-zinc-800">
      {/* Background gradient effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-blue-500/5" />
        <div className="absolute -left-1/4 top-0 h-96 w-96 bg-blue-500/10 blur-3xl rounded-full" />
        <div className="absolute -right-1/4 bottom-0 h-96 w-96 bg-purple-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-8">
          {/* Free tier badge */}
          <div
            className="inline-flex items-center space-x-2 bg-blue-500/10 px-3 py-1 rounded-full 
                        animate-fade-in backdrop-blur-sm border border-blue-500/20"
          >
            <Package className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-400">5000 free pages monthly</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-100">
            Web<span className="text-blue-400 animate-pulse">Mine</span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-lg text-zinc-400">
            Distributed web scraping infrastructure that scales with your needs. Customizable depth,
            domain control, and powerful search capabilities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                className="bg-blue-500/10 border border-blue-500/20 text-blue-400 
                       hover:bg-blue-500/20 hover:text-blue-300 transition-all
                       group relative overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <div
                  className="absolute inset-0 bg-blue-400/10 transform translate-y-full 
                           group-hover:translate-y-0 transition-transform duration-300"
                />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tech stack showcase */}
      <div className="relative flex justify-center gap-3 pb-12 px-4 flex-wrap">
        {techStack.map((tech) => (
          <div
            key={tech.name}
            className="group px-3 py-1 bg-zinc-900/50 border border-zinc-800 rounded-full
                     hover:bg-zinc-800/50 transition-all duration-200 backdrop-blur-sm
                     cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <tech.icon
                className={`h-4 w-4 ${tech.color} group-hover:scale-110 transition-transform`}
              />
              <span className="text-sm text-zinc-400 group-hover:text-zinc-300">{tech.name}</span>
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};

export default Hero;
