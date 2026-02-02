import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30 px-4 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
        <div className="relative h-24 w-24 bg-background border rounded-2xl flex items-center justify-center shadow-sm">
          <FileQuestion className="h-12 w-12 text-primary" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold tracking-tight mb-2">Page non trouvée</h1>
      <p className="text-muted-foreground max-w-[400px] mb-8">
        Désolé, nous ne trouvons pas la page que vous recherchez. Elle a peut-être été déplacée ou n&apos;existe plus.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour Dashboard
          </Link>
        </Button>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" /> Accueil
          </Link>
        </Button>
      </div>
    </div>
  );
}
