"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Lock, Mail, Zap, FileText, BarChart3, Info, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { DashedCard } from "@/components/ui/dashed-card";

const formSchema = z.object({
  email: z.string().email({
    message: "Email invalide.",
  }),
  password: z.string().min(1, {
    message: "Le mot de passe est requis.",
  }),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    
    // Simulation de connexion pour les tests
    setTimeout(() => {
      if (values.password === "havet2026") {
        document.cookie = "auth_session=true; path=/";
        router.push("/dashboard");
      } else {
        alert("Mot de passe incorrect. Astuce: havet2026");
      }
      setLoading(false);
    }, 1000);
  }

  const fillAdmin = () => {
    form.setValue("email", "admin@havet-digital.fr");
    form.setValue("password", "havet2026");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#080808] overflow-hidden font-sans">
      {/* Côté Gauche : Dégradé & Fonctionnalités - TOUJOURS SOMBRE */}
      <div className="relative hidden md:flex md:w-1/2 flex-col justify-center items-center p-12 overflow-hidden bg-[#080808]">
        {/* Gradients animés - Thème Vert */}
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"
        />

        <div className="relative z-10 w-full max-w-md space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold tracking-tight text-white px-4">
              Havet <span className="text-emerald-500">PrintPilot</span>
            </h1>
            <p className="text-slate-400 mt-6 text-lg">
              Système de gestion et chiffrages haute précision.
            </p>
          </motion.div>

          <div className="grid gap-6">
            <FeatureCard 
              icon={<Zap className="h-5 w-5" />}
              title="Calcul Intelligent"
              description="Algorithmes de calcul optimisés pour l'impression."
              delay={0.2}
            />
            <FeatureCard 
              icon={<BarChart3 className="h-5 w-5" />}
              title="Création de Devis"
              description="Suivez et personnalisez chaque projet en temps réel."
              delay={0.4}
            />
            <FeatureCard 
              icon={<FileText className="h-5 w-5" />}
              title="Téléchargement PDF"
              description="Automatisation complète du cycle de vente."
              delay={0.6}
            />
          </div>
        </div>

        <div className="absolute bottom-12 text-slate-600 text-[10px] uppercase tracking-widest font-semibold">
          Plateforme Interne &bull; v1.0
        </div>
      </div>

      {/* Côté Droit : Formulaire de Connexion - ADAPTE AU THEME */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[400px] space-y-10"
        >
          <div className="space-y-3 px-1">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">Connexion</h2>
            <p className="text-muted-foreground">
              Accédez à vos outils de production et de gestion.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Email</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-emerald-500" />
                          <Input
                            placeholder="admin@havet-digital.fr"
                            {...field}
                            className="pl-10 bg-muted/30 border-muted focus:border-emerald-500/50 shadow-none focus-visible:ring-0"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <FormLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Mot de passe</FormLabel>
                        <button type="button" className="text-[10px] uppercase font-bold text-emerald-500 hover:text-emerald-400 transition-colors tracking-widest">Oublié ?</button>
                      </div>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-emerald-500" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className="pl-10 pr-10 bg-muted/30 border-muted focus:border-emerald-500/50 shadow-none focus-visible:ring-0"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-medium text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full text-base font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-[0.98] h-11" 
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Se connecter"
                  )}
                </Button>

                {/* Accès Rapide Admin */}
                <DashedCard className="bg-muted/10" color="emerald">
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                        <Info className="h-4 w-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80">Accès Administration</p>
                        <p className="text-xs font-medium text-muted-foreground truncate">admin@havet-digital.fr</p>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={fillAdmin}
                      className="shrink-0 h-8 px-3 rounded-lg text-[10px] font-bold uppercase hover:bg-emerald-500/10 text-emerald-500 transition-all tracking-widest"
                    >
                      Utiliser
                    </Button>
                  </div>
                </DashedCard>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <DashedCard className="bg-transparent group hover:bg-white/[0.02]" color="emerald">
        <div className="p-6 flex items-start gap-5">
          <div className="p-4 rounded-2xl bg-emerald-500/5 text-emerald-500 group-hover:bg-emerald-500/10 group-hover:scale-105 transition-all">
            {icon}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{title}</h3>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed font-medium">
              {description}
            </p>
          </div>
        </div>
      </DashedCard>
    </motion.div>
  );
}
