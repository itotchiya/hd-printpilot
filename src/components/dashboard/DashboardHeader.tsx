"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, FileText, Settings, BookOpen, LogOut, ChevronLeft, Check, X } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useWizard } from "@/context/WizardContext";
import { FRENCH_LABELS } from "@/lib/schemas/quote-schema";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper';
import { cn } from "@/lib/utils";
import { LeaveQuoteDialog } from "@/components/quote-wizard/LeaveQuoteDialog";

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    currentStep, 
    setCurrentStep, 
    formDataRef, 
    draftId, 
    highestVisitedStep, 
    stepsNeedingReview,
    isResultView 
  } = useWizard();
  
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const isNewQuotePage = pathname === "/dashboard/devis/new" || pathname.includes("/dashboard/devis/new?draft=");
  const showStepper = isNewQuotePage && !isResultView;

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

  const handleBackClick = () => {
    if (isResultView) {
      router.push("/dashboard/devis");
      return;
    }
    
    // If we have any form data (not just defaults), show dialog
    const data = formDataRef.current;
    const hasData = data && (data.quantity > 1 || data.interiorPages > 0 || data.printMode);
    
    if (hasData) {
      setShowLeaveDialog(true);
    } else {
      router.push("/dashboard/devis");
    }
  };

  const handleDiscard = () => {
    setShowLeaveDialog(false);
    router.push("/dashboard/devis");
  };

  const handleSaveAsDraft = async () => {
    setIsSavingDraft(true);
    try {
      const response = await fetch("/api/quotes/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formDataRef.current, id: draftId, currentStep }),
      });

      
      if (response.ok) {
        setShowLeaveDialog(false);
        router.push("/dashboard/devis");
      }
    } catch (error) {
      console.error("Failed to save draft:", error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/40 backdrop-blur-xl border-b supports-[backdrop-filter]:bg-background/30">
        <div className="flex items-center w-full px-12 py-3">
          
          {/* LEFT SECTION: Back Button or Logo */}
          <div className="flex items-center w-40 shrink-0">
            {isNewQuotePage ? (
              <Button 
                variant="ghost"
                size="icon" 
                onClick={handleBackClick}
                className="rounded-full h-10 w-10 hover:bg-muted"
              >
                {isResultView ? (
                  <X className="size-5 stroke-[2.5px]" />
                ) : (
                  <ChevronLeft className="size-5 stroke-[2.5px]" />
                )}
              </Button>
            ) : (
              <Link href="/dashboard" className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tighter">
                  HD <span className="text-primary">PrintPilot</span>
                </span>
              </Link>
            )}
          </div>

          {/* CENTER SECTION: Stepper or Main Navigation */}
          <div className="flex-1 flex justify-center items-center px-4 overflow-hidden">
            {showStepper ? (
              <div className="flex justify-center">
                <Stepper
                  value={currentStep}
                  onValueChange={(newStep) => {
                    // Allow navigation to any visited step (including forward to previously visited)
                    if (newStep <= highestVisitedStep) {
                      setCurrentStep(newStep);
                    }
                  }}
                  indicators={{
                    completed: <Check className="size-4" strokeWidth={3} />,
                  }}
                  className="flex justify-center"
                >
                  <StepperNav className="gap-4 items-center justify-center">
                    {FRENCH_LABELS.steps.map((stepTitle, index) => {
                      const step = index + 1;
                      const isActive = step === currentStep;
                      const isCompleted = step < currentStep;
                      const isVisited = step <= highestVisitedStep;
                      const isUnvisited = step > highestVisitedStep;
                      const needsReview = stepsNeedingReview.has(step);
                      return (
                        <StepperItem 
                          key={index} 
                          step={step} 
                          className="!flex-none !flex-grow-0"
                        >
                          <StepperTrigger 
                            className={cn(
                              "flex flex-row items-center gap-2 shrink-0 group px-0 outline-none",
                              isUnvisited && "cursor-not-allowed opacity-50",
                              isVisited && !isActive && "cursor-pointer"
                            )}
                            disabled={isUnvisited}
                            title={stepTitle}
                          >
                            <StepperIndicator 
                              className={cn(
                                "transition-all size-8 font-black border-none shadow-none",
                                isActive && "bg-primary text-primary-foreground",
                                isCompleted && !needsReview && "bg-muted-foreground/20 text-muted-foreground cursor-pointer hover:bg-muted-foreground/30",
                                needsReview && !isActive && "bg-red-500 text-white cursor-pointer hover:bg-red-600",
                                isUnvisited && "bg-muted text-muted-foreground/50",
                                // Visited but ahead of current step (and no review needed)
                                isVisited && step > currentStep && !needsReview && "bg-muted-foreground/20 text-muted-foreground cursor-pointer hover:bg-muted-foreground/30"
                              )}
                            >
                              {step}
                            </StepperIndicator>
                            {isActive && (
                              <StepperTitle className="text-sm font-medium tracking-tight text-foreground whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                                {stepTitle}
                              </StepperTitle>
                            )}
                          </StepperTrigger>
                        </StepperItem>
                      );
                    })}
                  </StepperNav>
                </Stepper>
              </div>
            ) : !isNewQuotePage ? (
              <div className="hidden md:flex">
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="bg-transparent border-none p-0 h-auto">
                    <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-md h-9 px-4">
                      <LayoutDashboard className="h-4 w-4" />
                      Vue d&apos;ensemble
                    </TabsTrigger>
                    <TabsTrigger value="quotes" className="gap-2 data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-md h-9 px-4">
                      <FileText className="h-4 w-4" />
                      Devis
                    </TabsTrigger>
                    <TabsTrigger value="config" className="gap-2 data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-md h-9 px-4">
                      <Settings className="h-4 w-4" />
                      Configuration
                    </TabsTrigger>
                    <TabsTrigger value="docs" className="gap-2 data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-md h-9 px-4">
                      <BookOpen className="h-4 w-4" />
                      Documentation
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            ) : null}
          </div>

          {/* RIGHT SECTION: Controls */}
          <div className="flex items-center gap-4 w-40 shrink-0 justify-end">
            {/* Theme Toggler */}
            <div className="rounded-full">
              <AnimatedThemeToggler className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted transition-all text-muted-foreground hover:text-foreground" />
            </div>

            {!isNewQuotePage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 flex items-center justify-center hover:bg-muted">
                    <Avatar className="h-8 w-8 border border-muted transition-all">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 shadow-none border" align="end" sideOffset={8}>
                  <div className="flex items-center justify-start gap-2 p-4 border-b">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">Administrateur</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        admin@havet-digital.fr
                      </p>
                    </div>
                  </div>
                  <div className="p-1">
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer transition-all rounded-md p-2.5 font-medium"
                    >
                      <LogOut className="mr-3 h-4 w-4 stroke-[2.5px]" />
                      <span>Se déconnecter</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Tabs */}
        {!isNewQuotePage && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden">
            <div className="flex min-w-full p-2">
               <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden bg-transparent p-0 h-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <TabsTrigger value="overview" className="gap-2 flex-none data-[state=active]:bg-muted shadow-none">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Vue d&apos;ensemble</span>
                  </TabsTrigger>
                  <TabsTrigger value="quotes" className="gap-2 flex-none data-[state=active]:bg-muted shadow-none">
                    <FileText className="h-4 w-4" />
                    <span>Devis</span>
                  </TabsTrigger>
                  <TabsTrigger value="config" className="gap-2 flex-none data-[state=active]:bg-muted shadow-none">
                    <Settings className="h-4 w-4" />
                    <span>Configuration</span>
                  </TabsTrigger>
                  <TabsTrigger value="docs" className="gap-2 flex-none data-[state=active]:bg-muted shadow-none">
                    <BookOpen className="h-4 w-4" />
                    <span>Documentation</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        )}
      </header>

      <LeaveQuoteDialog
        open={showLeaveDialog}
        onOpenChange={setShowLeaveDialog}
        onDiscard={handleDiscard}
        onSaveAsDraft={handleSaveAsDraft}
        isSaving={isSavingDraft}
      />
    </>
  );
}
