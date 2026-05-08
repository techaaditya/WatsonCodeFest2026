"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ChevronDown, Dna, BookOpen, Microscope, HeartPulse, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const modules = [
  {
    id: "dna-basics",
    icon: Dna,
    title: "What are Genes & DNA?",
    color: "#10b981",
    content: `**DNA (Deoxyribonucleic Acid)** is the molecule that carries genetic instructions for all living organisms.

**Structure:**
• DNA is a double helix — two strands twisted together like a twisted ladder
• Made up of 4 bases: **Adenine (A)**, **Thymine (T)**, **Guanine (G)**, **Cytosine (C)**
• A always pairs with T, G always pairs with C

**Genes:**
• A gene is a specific segment of DNA that codes for a protein
• Humans have approximately **20,000-25,000 genes**
• Genes are organized into **23 pairs of chromosomes**

**Alleles:**
• Each gene has two copies — one from each parent
• Different versions of the same gene are called **alleles**
• Alleles can be **dominant** (always expressed) or **recessive** (only expressed if both copies are the same)

**From DNA to Traits:**
DNA → RNA → Protein → Trait (like eye color, blood type, or disease susceptibility)`,
  },
  {
    id: "inheritance",
    icon: BookOpen,
    title: "Inheritance Patterns",
    color: "#14b8a6",
    content: `Understanding how traits are passed from parents to children:

**1. Autosomal Dominant**
• Only ONE copy of the mutant allele needed
• Affected parent → 50% chance child is affected
• Examples: Huntington's disease

**2. Autosomal Recessive**
• TWO copies of the mutant allele needed
• Both parents must be carriers
• Carrier × Carrier → 25% affected, 50% carrier, 25% healthy
• Examples: Beta Thalassemia, Sickle Cell Disease

**3. X-Linked Recessive**
• Gene is on the X chromosome
• Males (XY) are more commonly affected — they only have one X
• Carrier mother → 50% of sons affected, 50% of daughters carriers
• Examples: G6PD Deficiency, Hemophilia

**4. Y-Linked**
• Gene is on the Y chromosome
• Only males are affected
• Father → ALL sons inherit the condition
• Examples: Y-Chromosome Infertility`,
  },
  {
    id: "mutations",
    icon: Microscope,
    title: "Understanding Mutations",
    color: "#f59e0b",
    content: `**Mutations** are changes in the DNA sequence that can alter how genes function.

**Types of Mutations:**

**1. Point Mutations** (single base change)
• **Missense**: Changes one amino acid (e.g., Glu6Val in Sickle Cell)
• **Nonsense**: Creates a premature stop signal
• **Silent**: No change in protein

**2. Insertions & Deletions**
• Adding or removing bases shifts the reading frame
• Can severely disrupt protein function
• AZF deletions cause Y-chromosome infertility

**3. Large-Scale Mutations**
• Deletion of entire gene regions
• Chromosome rearrangements

**Consequences:**
• **Loss of function**: Protein doesn't work (most recessive diseases)
• **Gain of function**: Protein becomes overactive
• **Dominant negative**: Mutant protein interferes with normal protein

**Not all mutations are bad!**
Some mutations are neutral or even beneficial (e.g., sickle cell trait provides malaria resistance).`,
  },
  {
    id: "nepal-diseases",
    icon: HeartPulse,
    title: "Genetic Diseases in Nepal",
    color: "#f97316",
    content: `**Nepal faces unique genetic health challenges** due to limited screening infrastructure and diverse ethnic populations.

**1. Beta Thalassemia (HBB gene, Chr 11)**
• Found across multiple ethnic groups in Nepal
• Many carriers are undiagnosed
• Regular blood transfusions needed for severe cases
• Carrier screening can prevent transmission

**2. Sickle Cell Disease (HBB gene, Chr 11)**
• Particularly common in **Tharu communities** of Terai
• Growing public health concern
• Pain management and hydroxyurea therapy available

**3. G6PD Deficiency (G6PD gene, Chr X)**
• Found in South Asian populations including Nepal
• Triggered by certain foods (fava beans) and medications
• Awareness about triggers is critical for prevention

**4. Y-Chromosome Infertility (AZF region, Chr Y)**
• Male infertility is under-discussed in Nepal
• Genetic testing is limited but increasingly available
• Assisted reproduction (IVF/ICSI) can help

**Why This Matters:**
Carrier screening and genetic awareness can prevent transmission of these disorders to future generations.`,
  },
  {
    id: "reading-results",
    icon: BarChart3,
    title: "Reading Your Results",
    color: "#6ee7b7",
    content: `**How to interpret your GenoVault prediction results:**

**Disease Risk Percentages**
• **Affected %**: Chance child inherits the disease
• **Carrier %**: Chance child carries one mutant allele (usually no symptoms)
• **Healthy %**: Chance child has no mutant alleles

**Punnett Square**
• Shows all possible genotype combinations
• Each cell represents a 25% probability (for simple crosses)
• Color-coded: Green (healthy), Yellow (carrier), Red (affected)

**Severity Rating**
• **None**: No disease risk detected
• **Mild**: Low probability or carrier status only
• **Moderate**: Significant carrier risk or heterozygous state
• **Severe**: High probability of affected offspring

**Immunity Score (0-100)**
• Combines all disease risks into one metric
• Higher = better genetic immunity profile
• Below 50 = professional counseling recommended

**Blood Group**
• Shows all possible blood types for offspring
• Combines ABO system and Rh factor
• Probabilities based on parental genotypes

**Important:** These predictions are probabilistic, not deterministic. Always consult a professional genetic counselor for medical decisions.`,
  },
];

export default function AcademyPage() {
  const [openModule, setOpenModule] = useState<string | null>("dna-basics");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-gene-mint" /> Gene Academy
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your guide to understanding the world of genes and genomics — simplified.
        </p>
      </motion.div>

      <div className="space-y-3">
        {modules.map((mod, i) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="gene-card rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}
              className="w-full flex items-center gap-4 p-5 sm:p-6 text-left hover:bg-muted/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${mod.color}15` }}>
                <mod.icon className="h-5 w-5" style={{ color: mod.color }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{mod.title}</h3>
              </div>
              <Badge variant="outline" className="text-xs mr-2" style={{ borderColor: `${mod.color}30`, color: mod.color }}>
                Module {i + 1}
              </Badge>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${openModule === mod.id ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {openModule === mod.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-border/20">
                    <div className="prose prose-sm prose-invert max-w-none">
                      {mod.content.split("\n").map((line, li) => {
                        if (line.startsWith("**") && line.endsWith("**")) {
                          return <h4 key={li} className="text-base font-semibold mt-4 mb-2" style={{ color: mod.color }}>{line.replace(/\*\*/g, "")}</h4>;
                        }
                        if (line.startsWith("•")) {
                          return <p key={li} className="text-sm text-muted-foreground ml-4 my-0.5">{line}</p>;
                        }
                        if (line.trim() === "") return <br key={li} />;
                        return (
                          <p key={li} className="text-sm text-muted-foreground my-1"
                            dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
