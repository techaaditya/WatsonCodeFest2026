"use client";

import { motion } from "framer-motion";
import { Dna, ExternalLink, Mail, Heart } from "lucide-react";
import Link from "next/link";

export function FooterSection() {
  return (
    <section id="contact" className="relative py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-beige/30 pt-10">
          <div className="flex flex-col items-center justify-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Dna className="h-8 w-8 text-olive" />
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-olive">DNA</span>
                <span className="text-softgreen">Dristi</span>
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <a href="mailto:contact@dnadristi.com" className="p-2 rounded-full border border-olive/25 text-olive hover:bg-beige/40 transition-colors" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full border border-olive/25 text-olive hover:bg-beige/40 transition-colors" aria-label="GitHub">
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>

            <div className="text-center space-y-2 mt-4">
              <span className="text-sm font-semibold text-softgreen uppercase tracking-widest">
                The Team
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate">
                Built by <span className="text-olive">GeneForge</span>
              </h2>
              <p className="text-slate/80 text-sm sm:text-base max-w-lg mx-auto">
                Watson CodeFest 2026 - Pioneering accessible genomic tools for Nepal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
