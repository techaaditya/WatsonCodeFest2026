"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DualParentInput } from "@/components/prediction/DualParentInput";
import { PredictionResults } from "@/components/prediction/PredictionResults";
import { api } from "@/services/api";

export default function PredictPage() {
  const router = useRouter();
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard")}
          className="rounded-full hover:bg-muted/60"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gene-forest to-gene-teal">
            Prediction Lab
          </h1>
          <p className="text-muted-foreground">
            Configure parental genotypes to simulate potential offspring traits.
          </p>
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
