import { QuoteWizard } from "@/components/quote-wizard";

export default function NewQuotePage() {
  return (
    // Use negative margins to bypass the layout padding for full-height wizard
    <div className="-mx-4 sm:-mx-6 -my-8">
      <QuoteWizard />
    </div>
  );
}
