"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Input Gene Data",
    description:
      "Select parental genotypes for key monogenic diseases. Choose from dual-parent or single-parent analysis modes.",
    color: "text-gene-emerald",
    glowColor: "rgba(16, 185, 129, 0.15)",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI-Powered Analysis",
    description:
      "Our engine performs Punnett square crossing, allele frequency analysis, and probabilistic risk computation in real-time.",
    color: "text-gene-teal",
    glowColor: "rgba(20, 184, 166, 0.15)",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Get Predictions",
    description:
      "Receive comprehensive disease risk scores, carrier status, blood group prediction, immunity scoring, and sex-linked inheritance patterns.",
    color: "text-gene-amber",
    glowColor: "rgba(245, 158, 11, 0.15)",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-gene-amber uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold">
            Three Steps to{" "}
            <span className="gene-gradient-text">Genetic Clarity</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            From gene input to comprehensive prediction — a streamlined workflow
            designed for simplicity and scientific rigor.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-gene-emerald/30 via-gene-teal/30 to-gene-amber/30" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="relative"
            >
              <div className="gene-card rounded-2xl p-8 text-center h-full transition-all duration-500 hover:translate-y-[-4px]">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border"
                    style={{
                      backgroundColor: step.glowColor,
                      borderColor: step.glowColor,
                      color: step.color === "text-gene-emerald" ? "#10b981" : step.color === "text-gene-teal" ? "#14b8a6" : "#f59e0b",
                    }}
                  >
                    {step.step}
                  </div>
                </div>

                {/* Icon */}
                <div
                  className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mt-2"
                  style={{ backgroundColor: step.glowColor }}
                >
                  <step.icon
                    className={`h-8 w-8 ${step.color}`}
                  />
                </div>

                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
