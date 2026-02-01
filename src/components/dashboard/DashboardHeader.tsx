"use client";

import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, FileText, Settings, BookOpen, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export function DashboardHeader() {
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab based on pathname
  let activeTab = "overview";
  if (pathname.includes("/dashboard/devis")) activeTab = "quotes";
  if (pathname.includes("/dashboard/configuration")) activeTab = "config";
  if (pathname.includes("/dashboard/documentation")) activeTab = "docs";

  const handleTabChange = (value: string) => {
    switch (value) {
      case "overview":
        router.push("/dashboard");
        break;
      case "quotes":
        router.push("/dashboard/devis");
        break;
      case "config":
        router.push("/dashboard/configuration");
        break;
      case "docs":
        router.push("/dashboard/documentation");
        break;
    }
  };

  const handleLogout = () => {
    document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative flex h-16 items-center justify-between w-full px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight">
              HD PrintPilot
            </span>
          </Link>
        </div>

        {/* Desktop Tabs - Centered */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="overview" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Vue d&apos;ensemble
              </TabsTrigger>
              <TabsTrigger value="quotes" className="gap-2">
                <FileText className="h-4 w-4" />
                Devis
              </TabsTrigger>
              <TabsTrigger value="config" className="gap-2">
                <Settings className="h-4 w-4" />
                Configuration
              </TabsTrigger>
              <TabsTrigger value="docs" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Documentation
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-10 w-10 flex items-center justify-center p-0"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Changer le thème</span>
          </Button>

          {/* User Profile - Dropdown with logout only as requested */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10 border-2 border-muted transition-colors hover:border-primary">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-muted text-muted-foreground font-medium">AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-4 border-b">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Administrateur</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@havet-digital.fr
                  </p>
                </div>
              </div>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer transition-colors p-3"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Tabs - Below Header */}
      <div className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden">
        <div className="flex min-w-full p-2">
           <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden bg-transparent p-0 h-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <TabsTrigger value="overview" className="gap-2 flex-none data-[state=active]:bg-muted">
                <LayoutDashboard className="h-4 w-4" />
                <span>Vue d&apos;ensemble</span>
              </TabsTrigger>
              <TabsTrigger value="quotes" className="gap-2 flex-none data-[state=active]:bg-muted">
                <FileText className="h-4 w-4" />
                <span>Devis</span>
              </TabsTrigger>
              <TabsTrigger value="config" className="gap-2 flex-none data-[state=active]:bg-muted">
                <Settings className="h-4 w-4" />
                <span>Configuration</span>
              </TabsTrigger>
              <TabsTrigger value="docs" className="gap-2 flex-none data-[state=active]:bg-muted">
                <BookOpen className="h-4 w-4" />
                <span>Documentation</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </header>
  );
}
