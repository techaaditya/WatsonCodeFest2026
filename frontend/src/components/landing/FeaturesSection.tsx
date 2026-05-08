"use client";

import { motion } from "framer-motion";
import { FlaskConical, Microscope, Bot, GraduationCap, MapPin } from "lucide-react";

const features = [
  {
    icon: FlaskConical,
    title: "Prediction Lab",
    description: "Parent compatible and individual genetic analysis with Punnett square visualization, disease risk scoring, blood group prediction, and immunity assessment.",
    color: "#10b981",
    bgGlow: "rgba(16, 185, 129, 0.08)",
  },
  {
    icon: Microscope,
    title: "ChromoLens",
    description: "Interactive chromosome browser with karyotype view, gene region highlighting, and mutation location mapping across all 23 pairs.",
    color: "#14b8a6",
    bgGlow: "rgba(20, 184, 166, 0.08)",
  },
  {
    icon: Bot,
    title: "GenoGuide",
    description: "AI-powered genetic counselor with general Q&A and Get Specific mode for deep-diving into genes with environmental parameters.",
    color: "#f59e0b",
    bgGlow: "rgba(245, 158, 11, 0.08)",
  },
  {
    icon: GraduationCap,
    title: "Gene Academy",
    description: "Comprehensive educational modules covering DNA basics, inheritance patterns, mutations, and how to interpret your genetic predictions.",
    color: "#6ee7b7",
    bgGlow: "rgba(110, 231, 183, 0.08)",
  },
  {
    icon: MapPin,
    title: "Heritage Mapper",
    description: "Community risk profiling based on Nepal's regions and ethnic groups, showing prevalent diseases and screening recommendations.",
    color: "#f97316",
    bgGlow: "rgba(249, 115, 22, 0.08)",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 dna-bg-pattern opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-gene-amber uppercase tracking-widest">
            Platform Features
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold">
            A Complete <span className="gene-gradient-text">Genomic Toolkit</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Everything you need to understand, analyze, and act on genetic data.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`gene-card rounded-2xl p-7 transition-all duration-500 hover:translate-y-[-4px] group ${i === 0 ? "lg:col-span-2" : ""}`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: feature.bgGlow }}
              >
                <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              <div
                className="mt-5 h-1 w-12 rounded-full transition-all duration-500 group-hover:w-20"
                style={{ backgroundColor: feature.color, opacity: 0.6 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
