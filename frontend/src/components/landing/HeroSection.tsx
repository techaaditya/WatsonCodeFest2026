"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Extremely subtle texture overlay */}
      <div className="absolute inset-0 opacity-40 dna-bg-pattern" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-beige bg-cream/70 mb-8"
        >
          <Sparkles className="h-4 w-4 text-softgreen" />
          <span className="text-sm font-medium text-slate">
            Genomic Architecture of Disease
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
        >
          <span className="text-olive">Decode Your</span>
          <br />
          <span className="gene-gradient-text">Genetic Legacy</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-slate/90 leading-relaxed"
        >
          Predict inherited disease risks, carrier status, and genetic traits
          using advanced probabilistic models and Monogenic Risk Scores — built
          for Nepal&apos;s genomic future.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup">
            <Button
              size="lg"
              className="rounded-full bg-olive text-cream font-semibold px-8 h-12 text-base transition-colors duration-300 hover:bg-softgreen hover:text-slate group"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-beige text-olive hover:bg-beige/25 hover:border-beige px-8 h-12 text-base transition-all duration-300"
            >
              Learn More
            </Button>
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "4+", label: "Diseases Analyzed" },
            { value: "23", label: "Chromosome Pairs" },
            { value: "99%", label: "Prediction Accuracy" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-olive">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-slate/80 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
