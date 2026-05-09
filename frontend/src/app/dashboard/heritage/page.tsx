"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, AlertTriangle, Shield, Dna, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const regions = [
  "Province 1 (Koshi)", "Madhesh Pradesh", "Bagmati Pradesh", "Gandaki Pradesh",
  "Lumbini Pradesh", "Karnali Pradesh", "Sudurpashchim Pradesh",
];

const ethnicities = [
  "Brahmin/Chhetri", "Newar", "Tharu", "Tamang", "Magar", "Gurung",
  "Rai/Limbu", "Sherpa", "Madhesi", "Dalit", "Janajati (Other)",
];

interface DiseaseRisk {
  disease: string; gene: string; prevalence: string; risk: "High" | "Moderate" | "Low";
  reason: string; screening: string; environmental: string[];
}

const riskDatabase: Record<string, Record<string, DiseaseRisk[]>> = {
  "Madhesh Pradesh": {
    "Tharu": [
      { disease: "Sickle Cell Disease", gene: "HBB", prevalence: "5-15% carrier rate", risk: "High",
        reason: "Sickle cell trait is prevalent in Tharu communities as it historically provided malaria resistance in the Terai lowlands.",
        screening: "Hemoglobin electrophoresis, CBC with peripheral smear",
        environmental: ["Malaria-endemic region", "Hot and humid climate", "Limited healthcare access"] },
      { disease: "Beta Thalassemia", gene: "HBB", prevalence: "3-5% carrier rate", risk: "Moderate",
        reason: "Beta-globin mutations are common across South Asian populations including Terai communities.",
        screening: "Complete blood count, HbA2 levels, genetic testing",
        environmental: ["Iron-poor diet in some communities", "Limited genetic screening access"] },
      { disease: "G6PD Deficiency", gene: "G6PD", prevalence: "3-8%", risk: "Moderate",
        reason: "X-linked condition found across South Asian populations, particularly in malaria-endemic areas.",
        screening: "G6PD enzyme assay, fluorescent spot test",
        environmental: ["Fava bean consumption", "Use of traditional medicines", "Antimalarial drug exposure"] },
    ],
    "Madhesi": [
      { disease: "Beta Thalassemia", gene: "HBB", prevalence: "4-7% carrier rate", risk: "High",
        reason: "High carrier frequency in Indo-Gangetic plain populations with limited awareness and screening.",
        screening: "HbA2 quantification, HPLC, genetic testing",
        environmental: ["High consanguinity rates", "Limited genetic counseling"] },
      { disease: "Sickle Cell Disease", gene: "HBB", prevalence: "2-4%", risk: "Moderate",
        reason: "Found in certain Madhesi sub-communities, especially those near malaria-endemic zones.",
        screening: "Sickle solubility test, hemoglobin electrophoresis",
        environmental: ["Malaria exposure history", "Limited healthcare infrastructure"] },
    ],
  },
  "Bagmati Pradesh": {
    "Newar": [
      { disease: "Beta Thalassemia", gene: "HBB", prevalence: "2-4% carrier rate", risk: "Moderate",
        reason: "Beta thalassemia carriers have been identified in Kathmandu Valley's Newar population.",
        screening: "CBC, hemoglobin analysis, genetic counseling",
        environmental: ["Urban lifestyle", "Better healthcare access but low awareness"] },
      { disease: "G6PD Deficiency", gene: "G6PD", prevalence: "1-3%", risk: "Low",
        reason: "Lower prevalence compared to Terai populations but still present.",
        screening: "G6PD enzyme activity test",
        environmental: ["Varied diet", "Urban healthcare availability"] },
    ],
  },
};

function getDefaultRisks(region: string, ethnicity: string): DiseaseRisk[] {
  return [
    { disease: "Beta Thalassemia", gene: "HBB", prevalence: "2-5% estimated carrier rate", risk: "Moderate",
      reason: `Beta thalassemia is present across Nepal including ${region}. Limited screening in ${ethnicity} communities means carrier rates may be underestimated.`,
      screening: "Complete blood count, HbA2 levels, genetic testing recommended",
      environmental: ["Limited genetic screening infrastructure", "Low public awareness of carrier status"] },
    { disease: "G6PD Deficiency", gene: "G6PD", prevalence: "1-5%", risk: "Low",
      reason: "Found across South Asian populations. Prevalence varies by specific community and geography.",
      screening: "G6PD enzyme assay recommended, especially before prescribing antimalarials",
      environmental: ["Diet and medication awareness important", "Traditional medicine interactions possible"] },
  ];
}

const riskColors = { High: "#f43f5e", Moderate: "#f59e0b", Low: "#10b981" };

export default function HeritagePage() {
  const [region, setRegion] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [results, setResults] = useState<DiseaseRisk[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const regionData = riskDatabase[region];
    const ethnicData = regionData?.[ethnicity];
    setResults(ethnicData || getDefaultRisks(region, ethnicity));
    setSearched(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="h-6 w-6 text-gene-coral" /> LineageLink
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Discover region-specific genetic disease risks based on your heritage and ethnicity.
        </p>
      </motion.div>

      {/* Search Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="gene-card rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <TreePine className="h-5 w-5 text-gene-emerald" />
          <h3 className="font-semibold">Select Your Heritage</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Region / Province</Label>
            <Select value={region} onValueChange={(v) => v && setRegion(v)}>
              <SelectTrigger className="h-11 bg-background/50"><SelectValue placeholder="Select region..." /></SelectTrigger>
              <SelectContent>{regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Ethnicity / Community</Label>
            <Select value={ethnicity} onValueChange={(v) => v && setEthnicity(v)}>
              <SelectTrigger className="h-11 bg-background/50"><SelectValue placeholder="Select ethnicity..." /></SelectTrigger>
              <SelectContent>{ethnicities.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Button onClick={handleSearch} disabled={!region || !ethnicity}
            className="bg-gene-emerald hover:bg-gene-emerald/90 text-gene-deep font-semibold px-8 shadow-lg shadow-gene-emerald/20 disabled:opacity-40">
            <Search className="h-4 w-4 mr-2" /> Analyze Heritage Risk
          </Button>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {searched && results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">Risk Profile for {ethnicity} in {region}</h3>
            </div>

            {results.map((risk, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }} className="gene-card rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${riskColors[risk.risk]}15` }}>
                      {risk.risk === "High" ? <AlertTriangle className="h-5 w-5" style={{ color: riskColors[risk.risk] }} /> :
                       risk.risk === "Moderate" ? <Shield className="h-5 w-5" style={{ color: riskColors[risk.risk] }} /> :
                       <Dna className="h-5 w-5" style={{ color: riskColors[risk.risk] }} />}
                    </div>
                    <div>
                      <h4 className="font-semibold">{risk.disease}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs" style={{ borderColor: `${riskColors[risk.risk]}40`, color: riskColors[risk.risk] }}>
                          {risk.gene} Gene
                        </Badge>
                        <span className="text-xs text-muted-foreground">Prevalence: {risk.prevalence}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="text-xs shrink-0" style={{ backgroundColor: `${riskColors[risk.risk]}15`, color: riskColors[risk.risk], border: `1px solid ${riskColors[risk.risk]}30` }}>
                    {risk.risk} Risk
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Why Relevant:</p>
                    <p className="text-foreground/80">{risk.reason}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Recommended Screening:</p>
                    <p className="text-foreground/80">{risk.screening}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Environmental Factors:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {risk.environmental.map((env, ei) => (
                        <Badge key={ei} variant="outline" className="text-xs border-border/40 text-muted-foreground">{env}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
