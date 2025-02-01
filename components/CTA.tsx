import React from "react";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Mail, Package } from "lucide-react";

const Footer = () => {
  const links = {
    product: [
      { name: "Features", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Status", href: "#" },
      { name: "API Status", href: "#" },
      { name: "Contact", href: "#" },
    ],
    legal: [
      { name: "Privacy", href: "#" },
      { name: "Terms", href: "#" },
      { name: "License", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="py-12 text-center">
          <div
            className="inline-flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-full
                        border border-blue-500/20 mb-6"
          >
            <Package className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-400">5000 free pages monthly</span>
          </div>
          <h2 className="text-2xl font-semibold text-zinc-100 mb-4">Start scraping with WebMine</h2>
          <Button
            className="bg-blue-500/10 border border-blue-500/20 text-blue-400 
                     hover:bg-blue-500/20 hover:text-blue-300 transition-all"
          >
            Create Free Account
          </Button>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-zinc-800">
          {/* Company/Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-semibold text-zinc-100">
              Web<span className="text-blue-400">Mine</span>
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              Reliable, scalable web scraping infrastructure for developers.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Product</h3>
            <ul className="mt-4 space-y-2">
              {links.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Support</h3>
            <ul className="mt-4 space-y-2">
              {links.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Legal</h3>
            <ul className="mt-4 space-y-2">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center py-8 border-t border-zinc-800">
          <div className="text-sm text-zinc-400">
            © {new Date().getFullYear()} WebMine. All rights reserved.
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-zinc-400 hover:text-zinc-300 transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-zinc-400 hover:text-zinc-300 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-zinc-400 hover:text-zinc-300 transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
