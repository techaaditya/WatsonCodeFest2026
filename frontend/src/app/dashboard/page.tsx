"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, User, ArrowRight, FlaskConical, Shield, Droplets, HeartPulse, Activity } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function PredictionLabPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserName(user.user_metadata?.full_name || user.email || "User");
    };
    fetchUser();
  }, []);

  const quickStats = [
    { icon: FlaskConical, label: "Diseases Analyzed", value: "4", color: "#10b981" },
    { icon: Shield, label: "Carrier Screening", value: "Active", color: "#14b8a6" },
    { icon: Droplets, label: "Blood Groups", value: "8 Types", color: "#f59e0b" },
    { icon: Activity, label: "Immunity Score", value: "Ready", color: "#f97316" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold">
          Hello, <span className="gene-gradient-text">{userName.split(" ")[0]}</span>
        </h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Welcome to your Prediction Lab. Choose an analysis mode to begin.
        </p>
      </motion.div>

      {/* Two Main Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Parent Compatible Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onClick={() => router.push("/dashboard/predict?mode=dual")}
          className="gene-card rounded-2xl p-8 cursor-pointer group transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-gene-emerald/10"
        >
          {/* Human Silhouettes */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="relative">
              <div className="w-20 h-28 rounded-t-full bg-gradient-to-b from-gene-emerald/20 to-gene-emerald/5 border border-gene-emerald/20 flex items-end justify-center pb-2 transition-all duration-300 group-hover:from-gene-emerald/30 group-hover:border-gene-emerald/40">
                <Users className="h-8 w-8 text-gene-emerald/60 group-hover:text-gene-emerald transition-colors" />
              </div>
              <div className="w-14 h-16 mx-auto -mt-1 bg-gradient-to-b from-gene-emerald/10 to-transparent rounded-b-lg border-x border-b border-gene-emerald/10" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gene-emerald/30 animate-pulse" />
            </div>
            <div className="relative">
              <div className="w-20 h-28 rounded-t-full bg-gradient-to-b from-gene-teal/20 to-gene-teal/5 border border-gene-teal/20 flex items-end justify-center pb-2 transition-all duration-300 group-hover:from-gene-teal/30 group-hover:border-gene-teal/40">
                <Users className="h-8 w-8 text-gene-teal/60 group-hover:text-gene-teal transition-colors" />
              </div>
              <div className="w-14 h-16 mx-auto -mt-1 bg-gradient-to-b from-gene-teal/10 to-transparent rounded-b-lg border-x border-b border-gene-teal/10" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gene-teal/30 animate-pulse" />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-center mb-2">Parent Compatible Analysis</h3>
          <p className="text-sm text-muted-foreground text-center leading-relaxed mb-6">
            Both parents provide their genetic data for comprehensive offspring prediction including disease risk, carrier status, and inheritance patterns.
          </p>
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gene-emerald/10 text-gene-emerald text-sm font-medium border border-gene-emerald/20 group-hover:bg-gene-emerald/20 transition-all">
              Start Analysis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </motion.div>

        {/* Individual Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          onClick={() => router.push("/dashboard/predict?mode=single")}
          className="gene-card rounded-2xl p-8 cursor-pointer group transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-gene-teal/10"
        >
          {/* Single Silhouette */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-32 rounded-t-full bg-gradient-to-b from-gene-amber/20 to-gene-amber/5 border border-gene-amber/20 flex items-end justify-center pb-3 transition-all duration-300 group-hover:from-gene-amber/30 group-hover:border-gene-amber/40">
                <User className="h-10 w-10 text-gene-amber/60 group-hover:text-gene-amber transition-colors" />
              </div>
              <div className="w-16 h-18 mx-auto -mt-1 bg-gradient-to-b from-gene-amber/10 to-transparent rounded-b-lg border-x border-b border-gene-amber/10 h-16" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gene-amber/30 animate-pulse" />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-center mb-2">Individual Analysis</h3>
          <p className="text-sm text-muted-foreground text-center leading-relaxed mb-6">
            One parent provides genetic data for carrier screening, mutation detection, and individual risk assessment based on known genotypes.
          </p>
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gene-amber/10 text-gene-amber text-sm font-medium border border-gene-amber/20 group-hover:bg-gene-amber/20 transition-all">
              Start Analysis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {quickStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
            className="gene-card rounded-xl p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}15` }}>
              <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Getting Started Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="gene-card rounded-2xl p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <HeartPulse className="h-5 w-5 text-gene-emerald" />
          <h3 className="font-semibold text-lg">Getting Started</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Choose Mode", desc: "Select parent compatible or individual analysis above." },
            { step: "2", title: "Input Genotypes", desc: "Enter parental genotypes for each disease gene." },
            { step: "3", title: "View Results", desc: "Get comprehensive risk scores and predictions." },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="w-7 h-7 rounded-full bg-gene-emerald/10 border border-gene-emerald/20 flex items-center justify-center text-xs font-bold text-gene-emerald shrink-0 mt-0.5">
                {item.step}
              </span>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
