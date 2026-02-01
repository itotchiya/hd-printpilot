export default function DocumentationPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
      <div className="rounded-xl border-2 border-dashed border-muted p-12 flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-semibold mb-2">Guides et Logique</h3>
        <p className="text-muted-foreground max-w-sm">
          Retrouvez ici toute la documentation technique et les guides d'utilisation de HD-PrintPilot.
        </p>
      </div>
    </div>
  );
}
