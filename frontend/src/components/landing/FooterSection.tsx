"use client";

import { motion } from "framer-motion";
import { Dna, ExternalLink, Mail, Heart } from "lucide-react";
import Link from "next/link";

export function FooterSection() {
  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-gene-amber uppercase tracking-widest">
            The Team
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold">
            Built by <span className="gene-gradient-text">GeneForge</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto">
            Watson CodeFest 2026 — Pioneering accessible genomic tools for Nepal.
          </p>
        </motion.div>

        {/* Team Cards */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-20">
          {[
            { name: "Jyotshana Baidawar", role: "Co-Founder & Developer" },
            { name: "Aaditya Sapkota", role: "Co-Founder & Developer" },
          ].map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="gene-card rounded-2xl p-6 text-center group transition-all duration-300 hover:translate-y-[-2px]"
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gene-emerald/10 border border-gene-emerald/20 text-gene-emerald font-bold text-xl">
                {member.name.split(" ").map(n => n[0]).join("")}
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gene-emerald/10 pt-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Dna className="h-6 w-6 text-gene-emerald" />
              <span className="text-lg font-bold">
                <span className="text-foreground">Geno</span>
                <span className="text-gene-emerald">Vault</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <a href="mailto:contact@genovault.com" className="p-2 text-muted-foreground hover:text-gene-emerald transition-colors" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 text-muted-foreground hover:text-gene-emerald transition-colors" aria-label="GitHub">
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>

            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="h-3.5 w-3.5 text-gene-coral fill-gene-coral" /> by GeneForge
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
