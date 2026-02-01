import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <DashboardHeader />
      <main className="flex-1 max-w-[1440px] mx-auto w-full py-8 px-4 sm:px-6">
        {children}
      </main>
    </div>
  );
}
