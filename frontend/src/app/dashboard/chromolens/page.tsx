"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Microscope, Search, Info, Dna } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const chromosomeData = [
  { num: "1", size: 100, genes: 2058 }, { num: "2", size: 96, genes: 1309 },
  { num: "3", size: 82, genes: 1078 }, { num: "4", size: 78, genes: 752 },
  { num: "5", size: 75, genes: 876 }, { num: "6", size: 72, genes: 1048 },
  { num: "7", size: 68, genes: 989 }, { num: "8", size: 64, genes: 677 },
  { num: "9", size: 60, genes: 786 }, { num: "10", size: 58, genes: 733 },
  { num: "11", size: 56, genes: 1298, highlight: true, disease: "Beta Thalassemia & Sickle Cell", gene: "HBB", position: "11p15.4" },
  { num: "12", size: 54, genes: 1034 }, { num: "13", size: 48, genes: 327 },
  { num: "14", size: 44, genes: 610 }, { num: "15", size: 42, genes: 596 },
  { num: "16", size: 40, genes: 873 }, { num: "17", size: 38, genes: 1197 },
  { num: "18", size: 34, genes: 270 }, { num: "19", size: 28, genes: 1472 },
  { num: "20", size: 26, genes: 544 }, { num: "21", size: 20, genes: 234 },
  { num: "22", size: 22, genes: 488 },
  { num: "X", size: 66, genes: 842, highlight: true, disease: "G6PD Deficiency", gene: "G6PD", position: "Xq28" },
  { num: "Y", size: 24, genes: 63, highlight: true, disease: "Y-Chromosome Infertility", gene: "AZF", position: "Yq11" },
];

export default function HelixVisionPage() {
  const [selected, setSelected] = useState<typeof chromosomeData[0] | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Microscope className="h-6 w-6 text-gene-teal" /> HelixVision
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Interactive chromosome browser - click any chromosome to view details and gene mutations.
        </p>
      </motion.div>

      {/* Karyotype View */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="gene-card rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold flex items-center gap-2">
            <Search className="h-4 w-4 text-gene-teal" /> Human Karyotype
          </h3>
          <Badge variant="outline" className="border-gene-emerald/30 text-gene-emerald">23 Chromosome Pairs</Badge>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {chromosomeData.map((chr, i) => {
            const isSelected = selected?.num === chr.num;
            const isHighlighted = chr.highlight;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.02 * i }}
                onClick={() => setSelected(chr)}
                className={`relative flex flex-col items-center gap-1 group transition-all duration-300 ${isSelected ? "scale-110" : "hover:scale-105"}`}
              >
                {/* Chromosome shape */}
                <div
                  className={`rounded-full transition-all duration-300 ${
                    isSelected
                      ? "shadow-lg ring-2 ring-gene-emerald"
                      : isHighlighted
                      ? "ring-1 ring-gene-amber/50"
                      : ""
                  }`}
                  style={{
                    width: "22px",
                    height: `${Math.max(chr.size * 0.7, 18)}px`,
                    background: isSelected
                      ? "linear-gradient(180deg, #10b981 0%, #065f46 100%)"
                      : isHighlighted
                      ? "linear-gradient(180deg, rgba(245,158,11,0.6) 0%, rgba(245,158,11,0.2) 100%)"
                      : "linear-gradient(180deg, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.1) 100%)",
                    border: `1px solid ${isSelected ? "#10b981" : isHighlighted ? "rgba(245,158,11,0.4)" : "rgba(16,185,129,0.2)"}`,
                  }}
                >
                  {/* Centromere notch */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-background/40" />
                </div>
                {isHighlighted && !isSelected && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gene-amber animate-pulse" />
                )}
                <span className={`text-[10px] font-mono ${isSelected ? "text-gene-emerald font-bold" : "text-muted-foreground"}`}>
                  {chr.num}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Selected Chromosome Detail */}
      {selected && (
        <motion.div
          key={selected.num}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gene-card rounded-2xl p-6 sm:p-8"
        >
          <div className="flex items-start gap-6">
            {/* Chromosome Visual */}
            <div className="hidden sm:flex flex-col items-center shrink-0">
              <div
                className="rounded-full w-12 relative"
                style={{
                  height: `${Math.max(selected.size * 1.5, 60)}px`,
                  background: selected.highlight
                    ? "linear-gradient(180deg, #f59e0b 0%, rgba(245,158,11,0.3) 100%)"
                    : "linear-gradient(180deg, #10b981 0%, rgba(16,185,129,0.3) 100%)",
                  border: `2px solid ${selected.highlight ? "#f59e0b" : "#10b981"}`,
                }}
              >
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-background/50 rounded" />
                {selected.highlight && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-[30%] w-4 h-4 rounded-full border-2 border-gene-rose bg-gene-rose/20 animate-pulse"
                    title="Mutation site" />
                )}
              </div>
              <span className="text-sm font-mono font-bold mt-2 text-gene-emerald">Chr {selected.num}</span>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  Chromosome {selected.num}
                  {selected.highlight && <Badge className="bg-gene-amber/15 text-gene-amber border border-gene-amber/30 text-xs">Disease Gene</Badge>}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{selected.genes.toLocaleString()} known genes</p>
              </div>

              {selected.highlight && (
                <div className="p-4 rounded-xl bg-gene-amber/5 border border-gene-amber/15 space-y-2">
                  <div className="flex items-center gap-2">
                    <Dna className="h-4 w-4 text-gene-amber" />
                    <span className="font-semibold text-sm">{selected.disease}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Gene:</span> <span className="font-mono font-semibold text-gene-emerald">{selected.gene}</span></div>
                    <div><span className="text-muted-foreground">Locus:</span> <span className="font-mono">{selected.position}</span></div>
                  </div>
                </div>
              )}

              {!selected.highlight && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-muted/20 border border-border/30 text-sm text-muted-foreground">
                  <Info className="h-4 w-4 shrink-0" />
                  No disease-associated genes from our analysis panel are located on this chromosome.
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-background/50 border border-border/30 text-center">
                  <p className="text-lg font-bold text-gene-emerald">{selected.genes.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Genes</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-border/30 text-center">
                  <p className="text-lg font-bold text-gene-teal">{selected.size}</p>
                  <p className="text-xs text-muted-foreground">Relative Size</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-border/30 text-center">
                  <p className="text-lg font-bold text-gene-amber">{selected.highlight ? "1" : "0"}</p>
                  <p className="text-xs text-muted-foreground">Flagged Genes</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
