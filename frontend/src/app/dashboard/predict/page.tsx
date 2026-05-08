"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, FlaskConical, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DualParentInput } from "@/components/prediction/DualParentInput";
import { PredictionResults } from "@/components/prediction/PredictionResults";
import { api } from "@/services/api";

export default function PredictPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handlePredict = async (parent1: any, parent2: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = {
        mode: "dual",
        parent1,
        parent2
      };
      
      const response = await api.prediction.predict(data);
      setResult(response);
    } catch (err: any) {
      setError(err.message || "Failed to run prediction analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-800">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Prediction Lab
          </h1>
          <p className="text-slate-400">Configure parental genotypes to simulate potential offspring traits.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-rose-500/10 border border-rose-500/50 rounded-lg flex items-center gap-3 text-rose-400"
          >
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <motion.div 
          animate={{ opacity: result ? 0.3 : 1, y: result ? -20 : 0 }} 
          transition={{ duration: 0.5 }}
          className={result ? "pointer-events-none" : ""}
        >
          <DualParentInput onPredict={handlePredict} isLoading={isLoading} />
        </motion.div>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full pb-20"
          >
            <PredictionResults data={result} onReset={handleReset} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
  {
    id: "sickle_cell",
    name: "Sickle Cell Disease",
    gene: "HBB",
    chromosome: "11",
    inheritance: "Autosomal Recessive",
    color: "#14b8a6",
  },
  {
    id: "g6pd_deficiency",
    name: "G6PD Deficiency",
    gene: "G6PD",
    chromosome: "X",
    inheritance: "X-Linked Recessive",
    color: "#f59e0b",
  },
  {
    id: "y_chromosome_infertility",
    name: "Y-Chromosome Infertility",
    gene: "AZF",
    chromosome: "Y",
    inheritance: "Y-Linked",
    color: "#f97316",
  },
];

const genotypeOptions: Record<string, { value: string; label: string; desc: string }[]> = {
  beta_thalassemia: [
    { value: "AA", label: "AA — Healthy", desc: "Normal hemoglobin" },
    { value: "Aa", label: "Aα — Carrier", desc: "Thalassemia trait" },
    { value: "aa", label: "αα — Affected", desc: "Thalassemia major" },
  ],
  sickle_cell: [
    { value: "AA", label: "AA — Healthy", desc: "Normal hemoglobin" },
    { value: "AS", label: "AS — Carrier", desc: "Sickle cell trait" },
    { value: "SS", label: "SS — Affected", desc: "Sickle cell disease" },
  ],
  g6pd_deficiency: [
    { value: "XGX", label: "XᴳX — Healthy Female", desc: "Normal enzyme" },
    { value: "XGXg", label: "XᴳXᵍ — Carrier Female", desc: "One deficient allele" },
    { value: "XgXg", label: "XᵍXᵍ — Affected Female", desc: "G6PD deficient" },
    { value: "XGY", label: "XᴳY — Healthy Male", desc: "Normal enzyme" },
    { value: "XgY", label: "XᵍY — Affected Male", desc: "G6PD deficient" },
  ],
  y_chromosome_infertility: [
    { value: "normal", label: "Normal AZF", desc: "No microdeletions" },
    { value: "azfa_del", label: "AZFa Deletion", desc: "Sertoli cell-only syndrome" },
    { value: "azfb_del", label: "AZFb Deletion", desc: "Spermatogenic arrest" },
    { value: "azfc_del", label: "AZFc Deletion", desc: "Hypospermatogenesis" },
  ],
};

const bloodGroupOptions = [
  { value: "IAIA", label: "Iᴬ Iᴬ — Blood Type A (homozygous)" },
  { value: "IAi", label: "Iᴬ i — Blood Type A (heterozygous)" },
  { value: "IBIB", label: "Iᴮ Iᴮ — Blood Type B (homozygous)" },
  { value: "IBi", label: "Iᴮ i — Blood Type B (heterozygous)" },
  { value: "IAIB", label: "Iᴬ Iᴮ — Blood Type AB" },
  { value: "ii", label: "ii — Blood Type O" },
];

const rhOptions = [
  { value: "DD", label: "DD — Rh+ (homozygous)" },
  { value: "Dd", label: "Dd — Rh+ (heterozygous)" },
  { value: "dd", label: "dd — Rh−" },
];

function PredictContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") || "dual";
  const isDual = mode === "dual";

  const [parent1, setParent1] = useState<Record<string, string>>({});
  const [parent2, setParent2] = useState<Record<string, string>>({});
  const [parent1Blood, setParent1Blood] = useState("");
  const [parent2Blood, setParent2Blood] = useState("");
  const [parent1Rh, setParent1Rh] = useState("");
  const [parent2Rh, setParent2Rh] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePredict = () => {
    setLoading(true);
    const data = {
      mode,
      parent1: { genotypes: parent1, blood: parent1Blood, rh: parent1Rh },
      parent2: isDual ? { genotypes: parent2, blood: parent2Blood, rh: parent2Rh } : null,
    };
    localStorage.setItem("genovault_prediction_input", JSON.stringify(data));
    setTimeout(() => {
      router.push("/dashboard/results");
    }, 1500);
  };

  const isComplete = () => {
    const p1Done = diseases.every((d) => parent1[d.id]) && parent1Blood && parent1Rh;
    if (!isDual) return p1Done;
    const p2Done = diseases.every((d) => parent2[d.id]) && parent2Blood && parent2Rh;
    return p1Done && p2Done;
  };

  const ParentForm = ({
    title,
    values,
    setValues,
    blood,
    setBlood,
    rh,
    setRh,
    color,
  }: {
    title: string;
    values: Record<string, string>;
    setValues: (v: Record<string, string>) => void;
    blood: string;
    setBlood: (v: string) => void;
    rh: string;
    setRh: (v: string) => void;
    color: string;
  }) => (
    <div className="gene-card rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
          <Dna className="h-5 w-5" style={{ color }} />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-xs text-muted-foreground">Select genotype for each disease</p>
        </div>
      </div>

      <div className="space-y-5">
        {diseases.map((disease) => (
          <div key={disease.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">{disease.name}</Label>
              <Badge variant="outline" className="text-xs" style={{ borderColor: `${disease.color}40`, color: disease.color }}>
                {disease.gene} • Chr {disease.chromosome}
              </Badge>
            </div>
            <Select value={values[disease.id] || ""} onValueChange={(v) => { if (v) setValues({ ...values, [disease.id]: v }); }}>
              <SelectTrigger className="h-11 bg-background/50 border-border/50 focus:border-gene-emerald/50">
                <SelectValue placeholder="Select genotype..." />
              </SelectTrigger>
              <SelectContent>
                {genotypeOptions[disease.id]?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex flex-col">
                      <span>{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.desc}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        <div className="pt-4 border-t border-border/30 space-y-4">
          <h4 className="text-sm font-semibold text-gene-amber flex items-center gap-2">
            <Dna className="h-4 w-4" /> Blood Group
          </h4>
          <div className="space-y-2">
            <Label className="text-sm">ABO Type</Label>
            <Select value={blood} onValueChange={(v) => v && setBlood(v)}>
              <SelectTrigger className="h-11 bg-background/50 border-border/50"><SelectValue placeholder="Select ABO..." /></SelectTrigger>
              <SelectContent>
                {bloodGroupOptions.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Rh Factor</Label>
            <Select value={rh} onValueChange={(v) => v && setRh(v)}>
              <SelectTrigger className="h-11 bg-background/50 border-border/50"><SelectValue placeholder="Select Rh..." /></SelectTrigger>
              <SelectContent>
                {rhOptions.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-gene-emerald" />
            {isDual ? "Dual Parent" : "Single Parent"} Analysis
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isDual ? "Enter both parents' genotypes" : "Enter the parent's genotype data"}
          </p>
        </div>
      </motion.div>

      {/* Mode Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gene-emerald/5 border border-gene-emerald/10 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 text-gene-emerald shrink-0" />
        Select a genotype for each disease gene and blood group to generate predictions.
      </motion.div>

      {/* Forms */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className={isDual ? "grid lg:grid-cols-2 gap-6" : ""}>
        <ParentForm title="Parent 1" values={parent1} setValues={setParent1} blood={parent1Blood} setBlood={setParent1Blood} rh={parent1Rh} setRh={setParent1Rh} color="#10b981" />
        {isDual && (
          <ParentForm title="Parent 2" values={parent2} setValues={setParent2} blood={parent2Blood} setBlood={setParent2Blood} rh={parent2Rh} setRh={setParent2Rh} color="#14b8a6" />
        )}
      </motion.div>

      {/* Predict Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-center pt-4">
        <Button
          onClick={handlePredict}
          disabled={!isComplete() || loading}
          className="h-13 px-10 text-base bg-gene-emerald hover:bg-gene-emerald/90 text-gene-deep font-semibold shadow-xl shadow-gene-emerald/20 disabled:opacity-40 disabled:cursor-not-allowed group"
          size="lg"
        >
          {loading ? (
            <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Sequencing & Predicting...</span>
          ) : (
            <span className="flex items-center gap-2"><Dna className="h-5 w-5" /> Predict Genetic Outcomes</span>
          )}
        </Button>
      </motion.div>
    </div>
  );
}

export default function PredictPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-gene-emerald" /></div>}>
      <PredictContent />
    </Suspense>
  );
}
