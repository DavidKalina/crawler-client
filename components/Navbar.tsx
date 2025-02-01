"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { Box, Diamond, LogOut, Menu, Settings, UserCircle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  // Navigation items based on auth status
  const navigationItems = [
    ...(user
      ? [
          { name: "Settings", href: "/settings", icon: <Settings className="h-4 w-4" /> },
          { name: "Upgrade", href: "/checkout/upgrade", icon: <Box className="h-4 w-4" /> },
        ]
      : []),
  ];

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full group-hover:bg-blue-500/30 transition-colors" />
                <div className="relative p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 transition-all">
                  <Diamond className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
              </div>
              <span className="text-lg font-medium text-zinc-100 group-hover:text-white transition-colors">
                Web<span className="text-blue-400 group-hover:text-blue-300">Mine</span>
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}

            {/* User dropdown - only show when logged in */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
                  <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer flex items-center gap-2"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                onClick={() => router.push("/auth/login")}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                Sign in
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-zinc-800 px-3 py-2 rounded-md text-sm transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            {user ? (
              <Button
                variant="ghost"
                className="w-full text-left px-3 text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center gap-2"
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="w-full text-left px-3 text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center gap-2"
                onClick={() => {
                  router.push("/auth/login");
                  setIsOpen(false);
                }}
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
