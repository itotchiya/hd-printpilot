import { QuoteWizard } from "@/components/quote-wizard";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function NewQuotePage() {
  return (
    // Use negative margins to bypass the layout padding for full-height wizard
    <div className="-mx-4 sm:-mx-6 -my-8">
      <Suspense fallback={
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Chargement de l&apos;assistant...</p>
        </div>
      }>
        <QuoteWizard />
      </Suspense>
    </div>
  );
}
