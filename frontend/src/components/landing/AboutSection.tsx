"use client";

import { motion } from "framer-motion";
import { Shield, Dna, HeartPulse } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-sm font-semibold text-gene-amber uppercase tracking-widest">
              About GenoVault
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight">
              Empowering Nepal&apos;s{" "}
              <span className="gene-gradient-text">Genomic Future</span>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              GenoVault is an advanced genomic analysis platform designed to make
              genetic disease prediction accessible and understandable. By
              leveraging probabilistic models and Monogenic Risk Scores, we help
              families understand their inherited disease risks before they
              manifest.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Built specifically with Nepal&apos;s underdiagnosed carrier
              populations in mind, GenoVault addresses the critical gap in
              genetic screening access across South Asia. Our platform analyzes
              key monogenic diseases prevalent in the region, providing
              actionable genetic insights.
            </p>
          </motion.div>

          {/* Right - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-4"
          >
            {[
              {
                icon: Dna,
                title: "Monogenic Risk Scoring",
                description:
                  "Probabilistic models calculate disease risk using Punnett square crossing and allele frequency analysis for accurate predictions.",
                color: "text-gene-emerald",
                bg: "bg-gene-emerald/10",
                border: "border-gene-emerald/20",
              },
              {
                icon: Shield,
                title: "Carrier Detection",
                description:
                  "Identify silent carriers of recessive genetic disorders — critical for communities with high consanguinity rates and limited screening.",
                color: "text-gene-teal",
                bg: "bg-gene-teal/10",
                border: "border-gene-teal/20",
              },
              {
                icon: HeartPulse,
                title: "Nepal-Focused Diseases",
                description:
                  "Targeted analysis for Beta Thalassemia, Sickle Cell Disease, G6PD Deficiency, and Y-Chromosome conditions prevalent in Nepal.",
                color: "text-gene-amber",
                bg: "bg-gene-amber/10",
                border: "border-gene-amber/20",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                className={`gene-card rounded-xl p-6 flex gap-5 items-start transition-all duration-300 hover:translate-x-2`}
              >
                <div
                  className={`${feature.bg} ${feature.border} border rounded-lg p-3 shrink-0`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
