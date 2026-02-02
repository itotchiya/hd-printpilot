"use client";

import React, { useEffect, useState } from "react";
import { DashedCard } from "@/components/ui/dashed-card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Info,
  Scale,
  Truck,
  Box,
  Layers,
  Zap,
  Calculator,
  BookOpen,
  Settings,
  FileText,
  CheckCircle2,
  Printer,
  ChevronRight,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  OFFSET_LAMINATION,
  OFFSET_BINDING_COSTS,
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

          <DashedCard className="bg-emerald-500/[0.03] border-emerald-500/30 rounded-[12px] shadow-none" color="emerald">
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
          </DashedCard>
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
                Le système HD-PrintPilot repose sur un arbitrage dynamique ultra-précis. En analysant le format, la pagination et les quantités, le moteur bascule entre le flux <strong>numérique</strong> (recommandé {"<"} 300 ex.) et le flux <strong>offset</strong> (optimisé pour les grands volumes).
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

        {/* Pricing Grids Section */}
        <section id="pricing" className="space-y-32">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-foreground border-b-2 border-dashed border-border/80 pb-6 uppercase tracking-tighter">Grilles Tarifaires</h2>
            <p className="text-muted-foreground text-xl font-bold leading-relaxed">Données extraites des matrices industrielles HAVET-IMB.</p>
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
                      <TableCell className="text-center text-emerald-500 font-mono">{(prices as any)[80] || '-'}</TableCell>
                      <TableCell className="text-center text-emerald-500 font-mono">{(prices as any)[115] || '-'}</TableCell>
                      <TableCell className="text-center text-emerald-500 font-mono">{(prices as any)[170] || '-'}</TableCell>
                      <TableCell className="text-center text-emerald-500 font-mono">{(prices as any)[300] || '-'}</TableCell>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <DashedCard className="p-10 space-y-6" color="emerald">
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
              </DashedCard>
              <div className="flex flex-col justify-center space-y-6 p-10 bg-muted/5 rounded-[16px] border-2 border-dashed border-border/80">
                <Printer className="h-10 w-10 text-emerald-500/20" />
                <p className="text-lg font-bold leading-relaxed text-foreground/80">
                  Le flux numérique est calculé à la face. Il n&apos;intègre pas de frais de plaques, ce qui le rend optimal pour les petites séries d&apos;urgence.
                </p>
              </div>
            </div>
          </div>

          <div id="offset-printing" className="space-y-12">
            <h3 className="text-2xl font-black text-emerald-500 flex items-center gap-4 uppercase tracking-tighter border-l-4 border-emerald-500 pl-8 h-8">
              Impression Offset
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <DashedCard className="p-10 space-y-6" color="emerald">
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
              </DashedCard>
              <div className="p-10 bg-emerald-500/[0.03] rounded-[16px] border-2 border-dashed border-emerald-500/40 space-y-6">
                <Layers className="h-6 w-6 text-emerald-500" />
                <h4 className="text-sm font-black uppercase tracking-widest italic">Logique Offset</h4>
                <p className="text-sm font-bold text-foreground/70 leading-relaxed">
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
            <p className="text-muted-foreground text-xl font-bold leading-relaxed">Solidité structurelle et traitements de surface.</p>
          </div>

          <div id="binding" className="space-y-16">
            <h3 className="text-2xl font-black text-emerald-500 uppercase tracking-tighter border-l-4 border-emerald-500 pl-8 h-8">
              Reliure Industriel
            </h3>
            
            <div className="space-y-12">
              <DashedCard className="p-10 space-y-8" color="emerald">
                <div className="flex items-center gap-4 border-b border-dashed border-border/40 pb-6">
                  <BookOpen className="h-6 w-6 text-emerald-500" />
                  <h4 className="text-lg font-black uppercase tracking-tight">Setup Reliure (Frais Fixes)</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
              </DashedCard>

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                <p className="text-sm font-bold text-foreground/70 leading-relaxed">
                  Le pliage est crucial pour les dépliants. Le coût est dégressif selon la quantité (tranches de 100, 250, 500, 1000, 2000).
                </p>
              </div>
            </div>
          </div>

          <div id="lamination" className="space-y-16">
            <h3 className="text-2xl font-black text-emerald-500 uppercase tracking-tighter border-l-4 border-dashed border-emerald-500 pl-8 h-8">
              Pelliculage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <DashedCard className="p-10 space-y-6" color="emerald">
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
              </DashedCard>
              <DashedCard className="p-10 space-y-6 shadow-none" color="emerald">
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
              </DashedCard>
            </div>
          </div>
        </section>

        {/* Rules & Validation Section */}
        <section id="rules" className="space-y-32">
          <div className="space-y-8">
             <h2 className="text-4xl font-black text-foreground border-b-2 border-dashed border-border/80 pb-6 uppercase tracking-tighter">Règles & Validation</h2>
             <p className="text-muted-foreground text-xl font-bold leading-relaxed">Logique de validation métier et suppléments techniques.</p>
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
                      <p className="text-sm text-muted-foreground font-bold">{rule.desc}</p>
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
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <p className="text-muted-foreground text-xl font-bold leading-relaxed">Algorithmes de zonage et de colisage sécurisé.</p>
          </div>

          <div id="packaging" className="space-y-12">
            <h3 className="text-2xl font-black text-emerald-500 uppercase tracking-tighter border-l-4 border-dashed border-emerald-500 pl-8 h-8">
               Ratio de Colisage
            </h3>
            <div className="border-2 border-dashed border-border/80 rounded-[24px] p-16 bg-transparent flex flex-col md:flex-row gap-16 items-center">
                <div className="space-y-8 flex-1">
                  <p className="text-xl text-foreground/80 leading-relaxed font-bold border-l-4 border-emerald-500 pl-8">
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
