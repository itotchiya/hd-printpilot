"use client";

import React, { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead,
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Scale,
  Box,
  Layers,
  BookOpen,
  Settings,
  FileText,
  CheckCircle2,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Local DashedCard component to match the page's custom style
interface LocalDashedCardProps {
  children: React.ReactNode;
  className?: string;
  color?: "emerald" | "orange" | "blue" | "primary";
}

const LocalDashedCard = ({ children, className, color = "emerald" }: LocalDashedCardProps) => {
  const colorClasses = {
    emerald: "border-emerald-500/30 bg-emerald-500/[0.03]",
    orange: "border-orange-500/30 bg-orange-500/[0.03]",
    blue: "border-blue-500/30 bg-blue-500/[0.03]",
    primary: "border-border/80 bg-transparent",
  };

  return (
    <div className={cn(
      "border-2 border-dashed rounded-[16px] shadow-none",
      colorClasses[color],
      className
    )}>
      {children}
    </div>
  );
};
import { 
  CONSTANTS, 
  PAPER_PRICES, 
  DIGITAL_PRINT_COSTS,
  DIGITAL_BINDING_COSTS,
  DIGITAL_BINDING_SETUP,
  DIGITAL_LAMINATION_COSTS,
  LAMINATION_FINISH_MULTIPLIERS,
  DIGITAL_FOLDING_COSTS,
  DIGITAL_FOLDING_SETUP,
  OFFSET_MAKE_READY,
  OFFSET_SUPPLEMENTS,
  TRANSPORT_COSTS,
  VALIDATION
} from "@/lib/pricing/pricing-data";

const sections = [
  {
    id: "overview",
    title: "Vue d'ensemble",
    subsections: [
      { id: "intro", title: "Introduction" },
      { id: "constants", title: "Constantes" },
    ],
  },
  {
    id: "engine",
    title: "Moteur de Calcul",
    subsections: [
      { id: "flow", title: "Flux Wizard → API → PDF" },
      { id: "digital-engine", title: "Algorithme Numérique" },
      { id: "offset-engine", title: "Algorithme Offset" },
    ],
  },
  {
    id: "pricing",
    title: "Grilles Tarifaires",
    subsections: [
      { id: "paper-grid", title: "Papier & Grammage" },
      { id: "digital-printing", title: "Impression Numérique" },
      { id: "offset-printing", title: "Impression Offset" },
    ],
  },
  {
    id: "finishing",
    title: "Façonnage & Finition",
    subsections: [
      { id: "binding", title: "Reliure" },
      { id: "folding", title: "Pliage (Dépliants)" },
      { id: "lamination", title: "Pelliculage" },
    ],
  },
  {
    id: "rules",
    title: "Règles & Validation",
    subsections: [
      { id: "formats", title: "Formats" },
      { id: "constraints", title: "Contraintes" },
      { id: "supplements", title: "Suppléments" },
    ],
  },
  {
    id: "logistics",
    title: "Logistique",
    subsections: [
      { id: "packaging", title: "Colisage" },
      { id: "delivery", title: "Grille Transport" },
    ],
  },
];

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        threshold: [0.1, 0.4, 0.7, 0.9], 
        rootMargin: "-100px 0px -60% 0px" 
      }
    );

    document.querySelectorAll("section[id], div[id]").forEach((el) => {
      const isTracked = sections.some(s => s.id === el.id || s.subsections.some(sub => sub.id === el.id));
      if (isTracked) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const formatPrice = (price: number) => price.toFixed(2) + "€";

  return (
    <div className="flex flex-col md:flex-row gap-20 min-h-screen animate-in fade-in duration-700">
      {/* Sidebar Navigation - High Contrast */}
      <aside className="hidden md:block w-72 shrink-0 border-r-2 border-dashed border-border/80 px-4">
        <div className="sticky top-24 space-y-12">
          <nav className="space-y-8">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-8 ml-2">Navigation</p>
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="space-y-1.5">
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm font-black transition-all cursor-pointer rounded-lg",
                        activeSection === section.id || section.subsections.some(s => s.id === activeSection)
                          ? "text-emerald-500 bg-emerald-500/10 shadow-none" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/20 shadow-none border-none"
                      )}
                    >
                      {section.title}
                    </button>
                    <div className="ml-5 space-y-1 mt-1.5 border-l-2 border-dashed border-border/60">
                      {section.subsections.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => scrollToSection(sub.id)}
                          className={cn(
                            "w-full text-left px-5 py-1.5 text-[11px] font-bold transition-all relative cursor-pointer",
                            activeSection === sub.id
                              ? "text-emerald-500 font-extrabold"
                              : "text-muted-foreground/60 hover:text-foreground"
                          )}
                        >
                          {activeSection === sub.id && (
                            <span className="absolute left-[-3px] top-1/2 -translate-y-1/2 w-1.5 h-4 bg-emerald-500 rounded-full" />
                          )}
                          {sub.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </nav>

          <LocalDashedCard className="bg-emerald-500/[0.03] border-emerald-500/30 rounded-[12px] shadow-none" color="emerald">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-500 text-[11px] font-black uppercase tracking-widest">
                <CheckCircle2 className="h-4 w-4" />
                <span>État du Système</span>
              </div>
              <p className="text-[12px] text-foreground/80 leading-relaxed font-bold">
                PRICING-V2.4.2<br/>
                <span className="text-muted-foreground font-medium">Synchronisation temps réel active.</span>
              </p>
            </div>
          </LocalDashedCard>
        </div>
      </aside>

      {/* Main Content Area - Full Width Design & High Spacing */}
      <main className="flex-1 space-y-40 pb-60 max-w-4xl pt-4">
        {/* Overview Section */}
        <section id="overview" className="space-y-24">
          <div className="space-y-8">
            <h1 className="text-6xl font-black tracking-tight text-foreground leading-[1.1]">
              Moteur <span className="text-emerald-500 italic">Core</span> Logic
            </h1>
            <p className="text-muted-foreground text-2xl leading-relaxed font-semibold max-w-3xl border-l-4 border-dashed border-emerald-500/40 pl-10 py-4">
              Référentiel technique interactif détaillant les algorithmes de tarification et les contraintes industrielles de HD-PrintPilot.
            </p>
          </div>

          <div id="intro" className="space-y-12">
            <h2 className="text-3xl font-black text-foreground border-b-2 border-dashed border-border/80 pb-6 w-full uppercase tracking-tighter">Introduction</h2>
            <div className="prose prose-xl prose-slate dark:prose-invert max-w-none">
              <p className="text-foreground/80 text-xl leading-relaxed font-bold">
                Le système HD-PrintPilot repose sur un arbitrage dynamique ultra-précis. En analysant le format, la pagination et les quantités, le moteur bascule entre le flux <span className="font-semibold text-foreground">numérique</span> (recommandé {"<"} 300 ex.) et le flux <span className="font-semibold text-foreground">offset</span> (optimisé pour les grands volumes).
              </p>
            </div>
          </div>

          <div id="constants" className="space-y-12">
            <h3 className="text-2xl font-black text-emerald-500 flex items-center gap-4 uppercase tracking-tighter">
              <Settings className="h-6 w-6" />
              Algorithme : Constantes Systèmes
            </h3>
            
            <div className="border-2 border-dashed border-border/80 rounded-[16px] bg-transparent shadow-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-dashed border-border/80 bg-muted/10 h-20">
                    <TableHead className="text-foreground font-black uppercase text-[12px] tracking-[0.2em] px-10">Paramètre</TableHead>
                    <TableHead className="text-foreground font-black uppercase text-[12px] tracking-[0.2em] text-center">Valeur</TableHead>
                    <TableHead className="text-foreground font-black uppercase text-[12px] tracking-[0.2em] px-10 text-right">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-dashed border-border/60 hover:bg-emerald-500/[0.02] transition-colors h-20">
                    <TableCell className="font-black text-foreground px-10 text-sm">WEIGHT_DIVISOR</TableCell>
                    <TableCell className="text-emerald-500 font-mono font-black text-center text-lg">{CONSTANTS.WEIGHT_DIVISOR}</TableCell>
                    <TableCell className="text-foreground/70 text-sm px-10 text-right font-bold">Calcul de conversion surface × grammage → Poids.</TableCell>
                  </TableRow>
                  <TableRow className="border-dashed border-border/60 hover:bg-emerald-500/[0.02] transition-colors h-20">
                    <TableCell className="font-black text-foreground px-10 text-sm">MARGE_DIGITAL</TableCell>
                    <TableCell className="text-emerald-500 font-mono font-black text-center text-lg">{CONSTANTS.DIGITAL_MARGIN * 100}%</TableCell>
                    <TableCell className="text-foreground/70 text-sm px-10 text-right font-bold">Marge commerciale appliquée sur le flux Numérique.</TableCell>
                  </TableRow>
                  <TableRow className="border-dashed border-border/60 hover:bg-emerald-500/[0.02] transition-colors h-20">
                    <TableCell className="font-black text-foreground px-10 text-sm">MARGE_OFFSET</TableCell>
                    <TableCell className="text-emerald-500 font-mono font-black text-center text-lg">{CONSTANTS.OFFSET_MARGIN * 100}%</TableCell>
                    <TableCell className="text-foreground/70 text-sm px-10 text-right font-bold">Marge commerciale appliquée sur le flux Offset.</TableCell>
                  </TableRow>
                  <TableRow className="border-transparent hover:bg-emerald-500/[0.02] transition-colors h-20">
                    <TableCell className="font-black text-foreground px-10 text-sm">TAIL_LIFT_SURCHARGE</TableCell>
                    <TableCell className="text-emerald-500 font-mono font-black text-center text-lg">{formatPrice(CONSTANTS.TAIL_LIFT_SURCHARGE)}</TableCell>
                    <TableCell className="text-foreground/70 text-sm px-10 text-right font-bold">Forfait Hayon Élévateur par point de livraison.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Engine Section - End‑to‑End Flow & Algorithms */}
        <section id="engine" className="space-y-32">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-foreground border-b-2 border-dashed border-border/80 pb-6 uppercase tracking-tighter">
              Moteur de Calcul
            </h2>
            <p className="text-muted-foreground text-xl font-bold leading-relaxed">
              Description structurée du flux complet : Wizard → Validation → Moteur Numérique / Offset → Base de données → PDF.
            </p>
          </div>

          {/* Wizard → API → DB → PDF Flow */}
          <div id="flow" className="space-y-12">
            <h3 className="text-2xl font-black text-emerald-500 flex items-center gap-4 uppercase tracking-tighter border-l-4 border-emerald-500 pl-8 h-8">
              Flux Wizard &rarr; API &rarr; Moteur &rarr; PDF
            </h3>
            <div className="space-y-6">
              <LocalDashedCard className="p-8 space-y-4" color="emerald">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">
                  1. Wizard (10 étapes)
                </h4>
                <ul className="text-sm text-foreground/80 space-y-3 font-medium list-none ml-2">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>L&apos;algorithme Numérique consomme les paramètres du wizard : quantité, format fini (cm), pagination, papiers intérieur/couverture, couleurs, reliure, pelliculage, type de produit, colisage et destinations de livraison. Ces données sont injectées dans la structure <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] border border-border/50">DigitalQuoteInput</span>.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Chaque étape est validée en temps réel par <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] border border-border/50">quoteSchema</span> (Zod) avec des règles fortes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Post-validation, le bouton envoie les données vers <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] border border-border/50">POST /api/quotes</span>.</span>
                  </li>
                </ul>
              </LocalDashedCard>

              <LocalDashedCard className="p-8 space-y-4" color="emerald">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">
                  2. API &amp; Persistance
                </h4>
                <ul className="text-sm text-foreground/80 space-y-3 font-medium list-none ml-2">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Validation secondaire via <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] border border-border/50">quoteSchema.safeParse</span> pour la sécurité.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Parsing des formats (largeur/hauteur) pour le moteur de calcul.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Arbitrage automatique entre les moteurs <span className="font-bold text-foreground">Numérique</span> et <span className="font-bold text-foreground">Offset</span>.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Enregistrement dans la table <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] border border-border/50">Quote</span> (Prisma).</span>
                  </li>
                </ul>
              </LocalDashedCard>

              <LocalDashedCard className="p-8 space-y-4 border-2 border-dashed border-border/80 bg-muted/20" color="primary">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-foreground flex items-center gap-3">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  3. Génération du PDF
                </h4>
                <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                  Au téléchargement, la route <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] border border-border/50">GET /api/quotes/[id]/pdf</span> hydrate le composant <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] border border-border/50">QuotePDFTemplate</span> pour générer le document final certifié.
                </p>
              </LocalDashedCard>
            </div>
          </div>

          {/* Digital Engine */}
          <div id="digital-engine" className="space-y-16">
            <h3 className="text-2xl font-black text-emerald-500 uppercase tracking-tighter border-l-4 border-emerald-500 pl-8 h-8">
              Algorithme Numérique
            </h3>

            <div className="space-y-10">
              <div className="border-2 border-dashed border-border/80 rounded-[16px] p-10 bg-transparent space-y-4">
                <h4 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-500">
                  Entrées principales
                </h4>
                <p className="text-sm text-foreground/80 font-bold leading-relaxed">
                  L&apos;algorithme Numérique consomme les paramètres du wizard : quantité, format fini (cm), pagination, papiers intérieur/couverture,
                  couleurs, reliure, pelliculage, type de produit, colisage et destinations de livraison. Ces données sont injectées dans la structure
                  <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] border border-border/50">DigitalQuoteInput</span>.
                </p>
              </div>

              <div className="space-y-10">
                <LocalDashedCard className="p-10 space-y-6" color="emerald">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">
                    Étape 1 — Poids (kg)
                  </h4>
                  <p className="text-sm text-foreground/80 font-bold leading-relaxed">
                    On calcule le poids d&apos;un exemplaire en fonction du format, des grammages et de la pagination :
                  </p>
                  <ul className="text-xs text-foreground/80 space-y-3 font-medium list-none ml-2">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>surface_cm2 = largeur_cm × hauteur_cm</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>feuilles_int = pages_int / 2</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>poids_int_g = surface_cm2 × feuilles_int × grammage_int / {CONSTANTS.WEIGHT_DIVISOR}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>poids_couv_g (si couverture) calculé de façon analogue</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>poids_exemplaire_kg = (poids_int_g + poids_couv_g) / 1000</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>poids_total_kg = poids_exemplaire_kg × quantité</span>
                    </li>
                  </ul>
                </LocalDashedCard>

                <LocalDashedCard className="p-10 space-y-6" color="emerald">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">
                    Étape 2 — Coût Papier (€)
                  </h4>
                  <p className="text-sm text-foreground/80 font-medium leading-relaxed">
                    Le moteur normalise le libellé de papier saisi et utilise la table <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] border border-border/50">PAPER_PRICES</span> pour déterminer le prix €/kg.
                  </p>
                  <ul className="text-xs text-foreground/80 space-y-3 font-medium list-none ml-2">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>prix_int_kg = index(PAPER_PRICES, type_int, grammage_int) (ou le plus proche disponible)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_int = poids_int_kg × quantité × prix_int_kg</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_couv (optionnel) = poids_couv_kg × quantité × prix_couv_kg</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_papier_total = coût_int + coût_couv</span>
                    </li>
                  </ul>
                </LocalDashedCard>
              </div>

              <div className="space-y-10">
                <LocalDashedCard className="p-10 space-y-6" color="emerald">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">
                    Étape 3 — Impression &amp; Façonnage
                  </h4>
                  <ul className="text-xs text-foreground/80 space-y-3 font-medium list-none ml-2">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_impression_int = pages_int × quantité × DIGITAL_PRINT_COSTS.perSide[couleur_int]</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_impression_couv (si couleurs) calculé par analogie</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>tranche_pages ∈ {'{'}32-72, 76-152, &gt;152{'}'} selon la pagination</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>tranche_qté ∈ {'{'}25‑50, 100‑200, 200‑300, 300‑400, 400‑500, &gt;500{'}'}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_reliure = (prix_unitaire × quantité) + frais_setup (DIGITAL_BINDING_SETUP)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_pelliculage = coût_unitaire(orientation, seuil_qté) × multiplicateur_finition × quantité</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_pliage (dépliants) = (prix_unitaire × quantité) + frais_setup_pli</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_colisage = (prix_unitaire × quantité) + forfait (PACKAGING_BROCHURE_COSTS / CARD_COSTS)</span>
                    </li>
                  </ul>
                </LocalDashedCard>

                <LocalDashedCard className="p-10 space-y-6" color="emerald">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">
                    Étape 4 — Transport &amp; Marge
                  </h4>
                  <ul className="text-xs text-foreground/80 space-y-3 font-medium list-none ml-2">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>pour chaque livraison : poids_colis = poids_exemplaire × quantité_livrée</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>zone = TRANSPORT_ZONES[code_département]</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>tranche_poids ∈ {'{'}0‑5, 5‑10, 10‑20, 20‑30, 30‑50, 50‑100, 100‑200, 200‑500, 500+{'}'}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_transport = Σ TRANSPORT_COSTS[zone][tranche_poids] (+ {CONSTANTS.TAIL_LIFT_SURCHARGE}€ si hayon)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>sous_total = somme de tous les postes (papier + impression + reliure + pelliculage + pliage + colisage + transport)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>marge = sous_total × {CONSTANTS.DIGITAL_MARGIN * 100}%</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>total_TTC_estimat. = sous_total + marge</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>prix_unitaire = total / quantité</span>
                    </li>
                  </ul>
                </LocalDashedCard>
              </div>
            </div>
          </div>

          {/* Offset Engine */}
          <div id="offset-engine" className="space-y-16">
            <h3 className="text-2xl font-black text-emerald-500 uppercase tracking-tighter border-l-4 border-emerald-500 pl-8 h-8">
              Algorithme Offset
            </h3>

            <div className="space-y-10">
              <div className="border-2 border-dashed border-border/80 rounded-[16px] p-10 bg-transparent space-y-4">
                <h4 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-500">
                  Logique de bascule
                </h4>
                <p className="text-sm text-foreground/80 font-medium leading-relaxed">
                  Pour les volumes importants (en pratique &gt; 300 ex.) ou lorsque l&apos;utilisateur force le mode Offset, le système calcule un scénario
                  Offset complet en parallèle du scénario Numérique, puis compare les totaux. Le mode recommandé est celui dont le total est le plus faible,
                  avec une marge commerciale de {CONSTANTS.OFFSET_MARGIN * 100}% appliquée sur l&apos;Offset.
                </p>
              </div>

              <div className="space-y-10">
                <LocalDashedCard className="p-10 space-y-6" color="emerald">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">
                    Signatures, Feuilles &amp; Papier
                  </h4>
                  <ul className="text-sm text-foreground/80 space-y-3 font-medium list-none ml-2">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>l&apos;algorithme découpe les pages intérieures en signatures 16p, 12p, 8p, 6p, 4p de façon optimale</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>cahiers_total = Σ signatures</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>format_offset optimal choisi via heuristique <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] border border-border/50">(64x90, 65x92, 70x102, 72x102)</span></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>feuilles_nécessaires ≈ combinaison(signatures) × quantité × (1 + facteur_gâche ≈ 10%)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_papier_int = (feuilles_int / 1000) × <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] border border-border/50">OFFSET_SHEET_PRICES</span>[grammage_int][format_offset]</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_papier_couv similaire (1 feuille par exemplaire + 10% de gâche)</span>
                    </li>
                  </ul>
                </LocalDashedCard>

                <LocalDashedCard className="p-10 space-y-6" color="emerald">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">
                    Plaques, Calage &amp; Tirage
                  </h4>
                  <ul className="text-sm text-foreground/80 space-y-3 font-medium list-none ml-2">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>plaques_intérieur = signatures_total × nb_couleurs_par_face × 2 faces</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>plaques_couverture = nb_couleurs_couv × 2 (recto/verso)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_plaques ≈ nb_plaques × 25€</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>impressions ≈ signatures_total × quantité × nb_couleurs_par_face × 2</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_tirage ≈ impressions × 0,01€</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_calage = <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] border border-border/50">OFFSET_MAKE_READY</span>.interiorBase (+ optionnellement cover2Pages / cover4Pages, + facteur vernis)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_impression_total = coût_plaques + coût_tirage + coût_calage</span>
                    </li>
                  </ul>
                </LocalDashedCard>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <LocalDashedCard className="p-10 space-y-6" color="emerald">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">
                    Reliure &amp; Suppléments
                  </h4>
                  <ul className="text-sm text-foreground/80 space-y-3 font-medium list-none ml-2">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>cahiers = signatures_total + (1 si couverture)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>on indexe <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] border border-border/50">OFFSET_BINDING_COSTS</span> par nombre de cahiers pour obtenir un setup + un coût « running » / 1000 ex.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_reliure = setup + (quantité / 1000) × coût_running</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>si non disponible, fall‑back sur la grille numérique <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] border border-border/50">(DIGITAL_BINDING)</span></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>suppléments_papier : +5% ou +15% pour certains couchés &gt;115g, +20% pour papiers &lt;70g</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>d&apos;autres suppléments (ex. spine extrême) sont ajoutés en fonction de l&apos;épaisseur de dos.</span>
                    </li>
                  </ul>
                </LocalDashedCard>

                <LocalDashedCard className="p-10 space-y-6" color="emerald">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">
                    Pelliculage, Transport &amp; Marge
                  </h4>
                  <ul className="text-sm text-foreground/80 space-y-3 font-medium list-none ml-2">
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>surface_m2 = (largeur_cm × hauteur_cm) / 10 000</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_pelliculage = surface_m2 × quantité × tarif_m2 <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[11px] border border-border/50">(OFFSET_LAMINATION)</span> + frais_setup</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>coût_transport_offset : même logique que le numérique (zones + tranches de poids)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>sous_total_offset = somme de tous les postes + suppléments</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>marge_offset = sous_total_offset × {CONSTANTS.OFFSET_MARGIN * 100}%</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>total_offset = sous_total_offset + marge_offset</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>prix_unitaire_offset = total_offset / quantité</span>
                    </li>
                  </ul>
                </LocalDashedCard>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Grids Section */}
        <section id="pricing" className="space-y-32">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-foreground border-b-2 border-dashed border-border/80 pb-6 uppercase tracking-tighter">Grilles Tarifaires</h2>
            <p className="text-muted-foreground text-xl font-medium leading-relaxed">Données extraites des matrices industrielles HAVET-IMB.</p>
          </div>

          <div id="paper-grid" className="space-y-12">
            <h3 className="text-2xl font-black text-emerald-500 flex items-center gap-4 uppercase tracking-tighter border-l-4 border-emerald-500 pl-8 h-8">
              Index Papier (€/Kg)
            </h3>
            <div className="border-2 border-dashed border-border/80 rounded-[16px] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-dashed border-border/80 bg-muted/10 h-16">
                    <TableHead className="px-10 text-foreground font-black uppercase text-[10px] tracking-widest">Type Papier</TableHead>
                    <TableHead className="text-center text-foreground font-black uppercase text-[10px] tracking-widest">80g</TableHead>
                    <TableHead className="text-center text-foreground font-black uppercase text-[10px] tracking-widest">115g</TableHead>
                    <TableHead className="text-center text-foreground font-black uppercase text-[10px] tracking-widest">170g</TableHead>
                    <TableHead className="text-center text-foreground font-black uppercase text-[10px] tracking-widest">300g</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(PAPER_PRICES).slice(0, 5).map(([key, prices]) => (
                    <TableRow key={key} className="border-dashed border-border/60 hover:bg-muted/10 h-16 transition-colors font-bold">
                      <TableCell className="px-10 uppercase text-xs">{key.replace('_', ' ')}</TableCell>
                      <TableCell className="text-center text-emerald-500 font-mono">{(prices as Record<number, number>)[80] || '-'}</TableCell>
                      <TableCell className="text-center text-emerald-500 font-mono">{(prices as Record<number, number>)[115] || '-'}</TableCell>
                      <TableCell className="text-center text-emerald-500 font-mono">{(prices as Record<number, number>)[170] || '-'}</TableCell>
                      <TableCell className="text-center text-emerald-500 font-mono">{(prices as Record<number, number>)[300] || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div id="digital-printing" className="space-y-12">
            <h3 className="text-2xl font-black text-emerald-500 flex items-center gap-4 uppercase tracking-tighter border-l-4 border-emerald-500 pl-8 h-8">
              Impression Numérique
            </h3>
            <div className="space-y-10">
              <LocalDashedCard className="p-10 space-y-6" color="emerald">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">Coût par Face Imprimée</h4>
                <div className="space-y-4 font-bold text-sm">
                  <div className="flex justify-between border-b border-dashed border-border/40 pb-2">
                    <span className="text-muted-foreground">Quadrichromie</span>
                    <span className="text-foreground font-black font-mono">{formatPrice(DIGITAL_PRINT_COSTS.perSide.quadrichromie)}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-border/40 pb-2">
                    <span className="text-muted-foreground">Quadri + Vernis</span>
                    <span className="text-foreground font-black font-mono">{formatPrice(DIGITAL_PRINT_COSTS.perSide.quadrichromie_vernis)}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-border/40 pb-2">
                    <span className="text-muted-foreground">Bichromie</span>
                    <span className="text-foreground font-black font-mono">{formatPrice(DIGITAL_PRINT_COSTS.perSide.bichromie)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Noir Standard</span>
                    <span className="text-foreground font-black font-mono">{formatPrice(DIGITAL_PRINT_COSTS.perSide.noir)}</span>
                  </div>
                </div>
              </LocalDashedCard>
              <div className="flex flex-col justify-center space-y-6 p-10 bg-muted/5 rounded-[16px] border-2 border-dashed border-border/80">
                <Printer className="h-10 w-10 text-emerald-500/20" />
                <p className="text-lg font-medium leading-relaxed text-foreground/80">
                  Le flux numérique est calculé à la face. Il n&apos;intègre pas de frais de plaques, ce qui le rend optimal pour les petites séries d&apos;urgence.
                </p>
              </div>
            </div>
          </div>

          <div id="offset-printing" className="space-y-12">
            <h3 className="text-2xl font-black text-emerald-500 flex items-center gap-4 uppercase tracking-tighter border-l-4 border-emerald-500 pl-8 h-8">
              Impression Offset
            </h3>
            <div className="space-y-10">
              <LocalDashedCard className="p-10 space-y-6" color="emerald">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">Make-Ready (Frais Fixes)</h4>
                <div className="space-y-4 font-bold text-sm">
                  <div className="flex justify-between border-b border-dashed border-border/40 pb-2">
                    <span className="text-muted-foreground">Base Intérieur</span>
                    <span className="text-foreground font-black font-mono">{formatPrice(OFFSET_MAKE_READY.interiorBase)}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-border/40 pb-2">
                    <span className="text-muted-foreground">Couv. (2p / 4p)</span>
                    <span className="text-foreground font-black font-mono">{OFFSET_MAKE_READY.cover2Pages}€ / {OFFSET_MAKE_READY.cover4Pages}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vernis Machine</span>
                    <span className="text-foreground font-black font-mono">Factor {OFFSET_MAKE_READY.varnishFactor}</span>
                  </div>
                </div>
              </LocalDashedCard>
              <div className="p-10 bg-emerald-500/[0.03] rounded-[16px] border-2 border-dashed border-emerald-500/40 space-y-6">
                <Layers className="h-6 w-6 text-emerald-500" />
                <h4 className="text-sm font-black uppercase tracking-widest italic">Logique Offset</h4>
                <p className="text-sm font-medium text-foreground/70 leading-relaxed">
                  Basée sur le montage de signatures (cahiers). Les frais de calage et de plaques sont élevés mais le coût unitaire chute drastiquement au volume.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Finishing & Binding Section */}
        <section id="finishing" className="space-y-32">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-foreground border-b-2 border-dashed border-border/80 pb-6 uppercase tracking-tighter">Façonnage & Finition</h2>
            <p className="text-muted-foreground text-xl font-medium leading-relaxed">Solidité structurelle et traitements de surface.</p>
          </div>

          <div id="binding" className="space-y-16">
            <h3 className="text-2xl font-black text-emerald-500 uppercase tracking-tighter border-l-4 border-emerald-500 pl-8 h-8">
              Reliure Industriel
            </h3>
            
            <div className="space-y-12">
              <LocalDashedCard className="p-10 space-y-8" color="emerald">
                <div className="flex items-center gap-4 border-b border-dashed border-border/40 pb-6">
                  <BookOpen className="h-6 w-6 text-emerald-500" />
                  <h4 className="text-lg font-black uppercase tracking-tight">Setup Reliure (Frais Fixes)</h4>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Dos Carré</p>
                    <p className="text-2xl font-black text-foreground font-mono">{DIGITAL_BINDING_SETUP.dos_carre_colle}€</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Dos PUR</p>
                    <p className="text-2xl font-black text-foreground font-mono">{DIGITAL_BINDING_SETUP.dos_carre_colle_pur}€</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Couture</p>
                    <p className="text-2xl font-black text-foreground font-mono">{DIGITAL_BINDING_SETUP.dos_carre_colle_couture}€</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Piqûre</p>
                    <p className="text-2xl font-black text-foreground font-mono">{DIGITAL_BINDING_SETUP.piqure}€</p>
                  </div>
                </div>
              </LocalDashedCard>

              <div className="border-2 border-dashed border-border/80 rounded-[16px] overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/10 h-16 border-dashed border-border/80">
                      <TableHead className="px-10 text-foreground font-black uppercase text-[10px] tracking-widest">Type Reliure</TableHead>
                      <TableHead className="text-center text-foreground font-black uppercase text-[10px] tracking-widest">32-72p</TableHead>
                      <TableHead className="text-center text-foreground font-black uppercase text-[10px] tracking-widest">76-152p</TableHead>
                      <TableHead className="text-center text-foreground font-black uppercase text-[10px] tracking-widest">{">"}152p</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-dashed border-border/60 h-16 transition-colors font-bold">
                      <TableCell className="px-10">Dos Carré Collé (Unit.)</TableCell>
                      <TableCell className="text-center text-emerald-500 font-mono">{DIGITAL_BINDING_COSTS.dos_carre_colle['32-72']['25-50']}€</TableCell>
                      <TableCell className="text-center text-emerald-500 font-mono">{DIGITAL_BINDING_COSTS.dos_carre_colle['76-152']['25-50']}€</TableCell>
                      <TableCell className="text-center text-emerald-500 font-mono">{DIGITAL_BINDING_COSTS.dos_carre_colle['>152']['25-50']}€</TableCell>
                    </TableRow>
                    <TableRow className="border-transparent h-16 transition-colors font-bold">
                      <TableCell className="px-10">Dos PUR (Unit.)</TableCell>
                      <TableCell className="text-center text-emerald-500 font-mono">{DIGITAL_BINDING_COSTS.dos_carre_colle_pur['32-72']['25-50']}€</TableCell>
                      <TableCell className="text-center text-emerald-500 font-mono">{DIGITAL_BINDING_COSTS.dos_carre_colle_pur['76-152']['25-50']}€</TableCell>
                      <TableCell className="text-center text-emerald-500 font-mono">{DIGITAL_BINDING_COSTS.dos_carre_colle_pur['>152']['25-50']}€</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div id="folding" className="space-y-16">
            <h3 className="text-2xl font-black text-emerald-500 uppercase tracking-tighter border-l-4 border-dashed border-emerald-500 pl-8 h-8">
              Pliage Industriel
            </h3>
            <div className="space-y-10">
              <div className="border-2 border-dashed border-border/80 rounded-[16px] overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/10 h-16 border-dashed border-border/80">
                      <TableHead className="px-10 text-foreground font-black uppercase text-[10px] tracking-widest">Nb Plis</TableHead>
                      <TableHead className="text-center text-foreground font-black uppercase text-[10px] tracking-widest">Setup</TableHead>
                      <TableHead className="text-center text-foreground font-black uppercase text-[10px] tracking-widest">Unit (1k)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4].map((pli) => (
                      <TableRow key={pli} className="border-dashed border-border/60 h-16 font-bold">
                        <TableCell className="px-10">{pli} {pli > 1 ? 'plis' : 'pli'}</TableCell>
                        <TableCell className="text-center text-emerald-500 font-mono">{DIGITAL_FOLDING_SETUP[pli]}€</TableCell>
                        <TableCell className="text-center text-emerald-500 font-mono">{DIGITAL_FOLDING_COSTS[pli][1000]}€</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-10 bg-muted/5 rounded-[16px] border-2 border-dashed border-border/80 flex flex-col justify-center space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest">Note Technique</h4>
                <p className="text-sm font-medium text-foreground/70 leading-relaxed">
                  Le pliage est crucial pour les dépliants. Le coût est dégressif selon la quantité (tranches de 100, 250, 500, 1000, 2000).
                </p>
              </div>
            </div>
          </div>

          <div id="lamination" className="space-y-16">
            <h3 className="text-2xl font-black text-emerald-500 uppercase tracking-tighter border-l-4 border-dashed border-emerald-500 pl-8 h-8">
              Pelliculage
            </h3>
            <div className="space-y-10">
              <LocalDashedCard className="p-10 space-y-6" color="emerald">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">Flux Numérique (Ref 100 ex)</h4>
                <div className="space-y-4 font-bold text-sm">
                  <div className="flex justify-between border-b border-dashed border-border/40 pb-2">
                    <span className="text-muted-foreground">Recto Only</span>
                    <span className="text-foreground font-black font-mono">{formatPrice(DIGITAL_LAMINATION_COSTS.recto[100])}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recto Verso</span>
                    <span className="text-foreground font-black font-mono">{formatPrice(DIGITAL_LAMINATION_COSTS.recto_verso[100])}</span>
                  </div>
                </div>
              </LocalDashedCard>
              <LocalDashedCard className="p-10 space-y-6 shadow-none" color="emerald">
                 <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">Multiplicateurs de Finition</h4>
                 <div className="space-y-4 font-bold text-sm">
                   <div className="flex justify-between border-b border-dashed border-border/40 pb-2">
                     <span className="text-muted-foreground">Mat / Brillant</span>
                     <span className="text-foreground font-black font-mono">x {LAMINATION_FINISH_MULTIPLIERS.mat}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-muted-foreground">Soft Touch (Peau de pêche)</span>
                     <span className="text-emerald-500 font-black font-mono">x {LAMINATION_FINISH_MULTIPLIERS.soft_touch}</span>
                   </div>
                 </div>
              </LocalDashedCard>
            </div>
          </div>
        </section>

        {/* Rules & Validation Section */}
        <section id="rules" className="space-y-32">
          <div className="space-y-8">
             <h2 className="text-4xl font-black text-foreground border-b-2 border-dashed border-border/80 pb-6 uppercase tracking-tighter">Règles & Validation</h2>
             <p className="text-muted-foreground text-xl font-medium leading-relaxed">Logique de validation métier et suppléments techniques.</p>
          </div>

          <div id="constraints" className="space-y-16">
             <h3 className="text-2xl font-black text-orange-500 flex items-center gap-4 uppercase tracking-tighter border-l-4 border-dashed border-orange-500 pl-8 h-8">
                Contraintes de Production
             </h3>
             <div className="space-y-6">
                {[
                  { label: "Multiple de page", value: VALIDATION.PAGE_MULTIPLE, desc: "Obligatoire pour les montages en cahiers ou piqûres." },
                  { label: "Min Pages Dos Carré", value: VALIDATION.PERFECT_BINDING_MIN_PAGES, desc: "Seuil physique pour une application de colle durable." },
                  { label: "Max Pages Piqûre", value: VALIDATION.SADDLE_STITCH_MAX_PAGES, desc: "Limite pour éviter le &quot;bec de canne&quot; sur le dos." },
                  { label: "Capacité Numérique", value: VALIDATION.DIGITAL_MAX_PAGES, desc: "Limite machine pour le flux Digital." },
                ].map((rule, i) => (
                  <div key={i} className="flex items-center justify-between p-10 border-2 border-dashed border-border/80 rounded-[16px] hover:border-orange-500/40 transition-colors bg-orange-500/[0.01]">
                    <div className="space-y-2">
                      <p className="text-xl font-black text-foreground uppercase tracking-tight">{rule.label}</p>
                      <p className="text-sm text-muted-foreground font-medium">{rule.desc}</p>
                    </div>
                    <div className="text-4xl font-black text-orange-500 font-mono">{rule.value}</div>
                  </div>
                ))}
             </div>
          </div>

          <div id="supplements" className="space-y-16">
             <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter border-l-4 border-dashed border-border/80 pl-8 h-8">
                Surcharges & Suppléments Offset
            </h3>
            <div className="space-y-8">
                {Object.entries(OFFSET_SUPPLEMENTS).map(([key, val]) => (
                  <div key={key} className="p-8 border-2 border-dashed border-border/60 rounded-[16px] flex justify-between items-center group">
                    <span className="font-bold text-foreground/70 uppercase text-xs tracking-tight group-hover:text-foreground transition-colors">{key.replace('_', ' ').replace('+', ' Plus')}</span>
                    <span className="text-orange-500 font-extrabold font-mono">+{(val * 100).toFixed(0)}%</span>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Logistics Section */}
        <section id="logistics" className="space-y-32 pt-20">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-foreground border-b-2 border-dashed border-border/80 pb-6 uppercase tracking-tighter">Logistique</h2>
            <p className="text-muted-foreground text-xl font-medium leading-relaxed">Algorithmes de zonage et de colisage sécurisé.</p>
          </div>

          <div id="packaging" className="space-y-12">
            <h3 className="text-2xl font-black text-emerald-500 uppercase tracking-tighter border-l-4 border-dashed border-emerald-500 pl-8 h-8">
               Ratio de Colisage
            </h3>
            <div className="border-2 border-dashed border-border/80 rounded-[24px] p-16 bg-transparent flex flex-col md:flex-row gap-16 items-center">
                <div className="space-y-8 flex-1">
                  <p className="text-xl text-foreground/80 leading-relaxed font-medium border-l-4 border-emerald-500 pl-8">
                    La sécurité matière impose une limite de <strong>15 Kg</strong> par colis pour garantir l&apos;ergonomie de déchargement et la protection des arêtes papier. 
                  </p>
                  <div className="flex items-center gap-6">
                    <span className="h-1 w-20 bg-emerald-500 rounded-full" />
                    <p className="text-sm font-black font-mono text-emerald-500 uppercase tracking-[0.3em]">Coût : 1.85€ / carton HT</p>
                  </div>
                </div>
                <div className="relative h-52 w-52 flex items-center justify-center border-2 border-dashed border-border/40 rounded-full bg-muted/5">
                   <Box className="h-24 w-24 text-emerald-500 opacity-20" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-8xl font-black text-foreground opacity-[0.05]">15</span>
                   </div>
                </div>
            </div>
          </div>

          <div id="delivery" className="space-y-16">
            <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter border-l-4 border-dashed border-border/80 pl-8 h-8">
               Grille de Transport (Zonage A-D)
            </h3>
            
            <div className="border-2 border-dashed border-border/80 rounded-[20px] overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/10 h-20 border-dashed border-border/80">
                  <TableRow>
                    <TableHead className="px-12 text-foreground font-black uppercase text-[10px] tracking-widest">Tranche</TableHead>
                    <TableHead className="text-center text-foreground font-black uppercase text-[10px] tracking-widest">Zone A</TableHead>
                    <TableHead className="text-center text-foreground font-black uppercase text-[10px] tracking-widest">Zone B</TableHead>
                    <TableHead className="text-center text-foreground font-black uppercase text-[10px] tracking-widest">Zone C</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(TRANSPORT_COSTS.A).slice(0, 5).map(([bracket]) => (
                    <TableRow key={bracket} className="border-dashed border-border/40 h-20 font-bold transition-colors hover:bg-muted/10">
                      <TableCell className="px-12 text-sm">{bracket} Kg</TableCell>
                      <TableCell className="text-center text-emerald-500 font-mono">{TRANSPORT_COSTS.A[bracket]}€</TableCell>
                      <TableCell className="text-center text-foreground/80 font-mono">{TRANSPORT_COSTS.B[bracket]}€</TableCell>
                      <TableCell className="text-center text-foreground/60 font-mono">{TRANSPORT_COSTS.C[bracket]}€</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Final Footer */}
        <div className="pt-40 border-t-4 border-dashed border-border/20 flex flex-col md:flex-row justify-between items-center text-muted-foreground gap-12 bg-transparent relative overflow-hidden pb-20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          <div className="space-y-4 text-center md:text-left">
            <p className="text-[14px] font-black uppercase tracking-[0.8em] text-emerald-500 font-mono italic">Havet Digital System Hub</p>
            <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em] italic">© 2026 — PRICING ENGINE CERTIFIED V2.4.2 — FULL CONTRAST DESIGN</p>
          </div>
          <div className="flex gap-16 opacity-10 grayscale pointer-events-none">
             <BookOpen className="h-8 w-8" />
             <FileText className="h-8 w-8" />
             <Scale className="h-8 w-8" />
          </div>
        </div>
      </main>
    </div>
  );
}
