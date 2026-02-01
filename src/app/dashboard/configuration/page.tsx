export default function ConfigurationPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
      <div className="rounded-xl border-2 border-dashed border-muted p-12 flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-semibold mb-2">Paramètres du système</h3>
        <p className="text-muted-foreground max-w-sm">
          Cette section permettra bientôt de configurer les prix de base, les marges et les transporteurs.
        </p>
      </div>
    </div>
  );
}
