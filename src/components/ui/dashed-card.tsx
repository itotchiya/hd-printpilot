"use client"

import React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashedCardProps {
  children: React.ReactNode
  active?: boolean
  className?: string
  color?: "blue" | "orange" | "primary"
}

const colorMap = {
  blue: "border-blue-500",
  orange: "border-orange-500",
  primary: "border-primary",
}

const shadowMap = {
  blue: "shadow-[inset_0_0_0_2px_theme(colors.blue.500)]",
  orange: "shadow-[inset_0_0_0_2px_theme(colors.orange.500)]",
  primary: "shadow-[inset_0_0_0_2px_theme(colors.primary.DEFAULT)]",
}

export function DashedCard({
  children,
  active = false,
  className,
  color = "primary",
}: DashedCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[8px] transition-all duration-200 overflow-hidden bg-card",
        "border border-dashed border-muted-foreground/40", // Default: Higher contrast 1px dashed
        active 
          ? [colorMap[color], shadowMap[color], "border-solid"] 
          : cn("hover:border-solid hover:opacity-100", 
               color === "blue" ? "hover:border-blue-500" : 
               color === "orange" ? "hover:border-orange-500" : 
               "hover:border-primary"),
        className
      )}
    >
      {active && (
        <div 
          className={cn(
            "absolute top-2 right-2 z-10 p-0.5 rounded-full",
            color === "blue" ? "bg-blue-500 text-white" : 
            color === "orange" ? "bg-orange-500 text-white" : 
            "bg-primary text-primary-foreground dark:text-black"
          )}
        >
          <Check className="w-3 h-3" strokeWidth={3} />
        </div>
      )}
      <div className={cn("relative", className?.includes("h-full") && "h-full")}>
        {children}
      </div>
    </div>
  )
}
