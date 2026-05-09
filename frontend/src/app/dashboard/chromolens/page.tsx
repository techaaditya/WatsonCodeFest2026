"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Microscope, Info, Dna, Activity, AlertTriangle, CheckCircle, FileDown, Stethoscope, HeartPulse, UserPlus, User, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DualParentInput } from "@/components/prediction/DualParentInput";
import { api } from "@/services/api";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

const SvgChromosome = ({ alleleState, setAlleleState }: { alleleState: "Normal" | "Carrier" | "Affected", setAlleleState: (state: "Normal" | "Carrier" | "Affected") => void }) => {
  const colors = {
    Normal: "#10b981", // green-500
    Carrier: "#f59e0b", // amber-500
    Affected: "#ef4444" // red-500
  };
  const color = colors[alleleState];

  return (
    <div className="gene-card p-6 rounded-2xl border border-border/50 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1 space-y-6">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Dna className="h-6 w-6 text-gene-teal" /> Chromosome Map
        </h3>
        <p className="text-sm text-muted-foreground">
          Interactive view of Chromosome 11, specifically highlighting the HBB gene locus at 11p15.4.
        </p>

        <div>
          <label className="text-sm font-semibold mb-3 block">Locus State Visualization:</label>
          <div className="flex gap-2 p-1 bg-muted/50 rounded-lg max-w-[300px]">
            {["Normal", "Carrier", "Affected"].map(state => (
              <button
                key={state}
                onClick={() => setAlleleState(state as any)}
                className={`flex-1 text-sm py-1.5 rounded-md transition-all ${alleleState === state ? 'bg-background shadow-sm font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground p-4 bg-muted/20 rounded-xl border border-border/50">
          <p>
            <strong>{alleleState} State:</strong> {
              alleleState === "Normal" ? "Both copies of the HBB gene are healthy (HbA). Red blood cells function normally." :
              alleleState === "Carrier" ? "One healthy allele and one mutated allele (HbA/HbS). Usually asymptomatic, but can pass the trait." :
              "Both alleles contain the E6V mutation (HbS/HbS). Causes red blood cells to deform into a sickle shape."
            }
          </p>
        </div>
      </div>

      <div className="relative w-[300px] h-[300px] flex items-center justify-center shrink-0">
        <svg width="200" height="300" viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl transition-all duration-700 ease-in-out z-10 hover:scale-105">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="30%" stopColor={color} stopOpacity="0.3" />
              <stop offset="70%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <g className="transition-all duration-700" style={{ fill: "url(#grad)", stroke: color, strokeWidth: "1.5" }}>
            {/* p arm */}
            <path d="M 40 40 Q 40 10, 50 10 Q 60 10, 60 40 L 60 85 Q 60 95, 50 95 Q 40 95, 40 85 Z" />
            {/* q arm */}
            <path d="M 40 105 Q 40 95, 50 95 Q 60 95, 60 105 L 60 180 Q 60 190, 50 190 Q 40 190, 40 180 Z" />
          </g>
          
          {/* Centromere */}
          <circle cx="50" cy="95" r="6" fill="#2d3a23" opacity="0.5" />
          
          {/* Locus Band 11p15.4 */}
          <g className="cursor-pointer">
            <rect x="39" y="35" width="22" height="6" fill="#fff" opacity="0.9" filter="url(#glow)" />
            <line x1="65" y1="38" x2="85" y2="38" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="text-foreground" />
            <text x="90" y="41" fontSize="10" fill="currentColor" className="text-foreground font-mono font-bold">11p15.4 (HBB)</text>
          </g>
        </svg>

        {/* Ambient background glow */}
        <div 
          className="absolute inset-0 rounded-full blur-3xl opacity-20 transition-colors duration-700 pointer-events-none"
          style={{ backgroundColor: color, transform: 'scale(0.8)' }}
        />
      </div>
    </div>
  );
};

function ResultBanner({ result, title }: { result: any, title: string }) {
  const isPathogenic = result.prediction === "Pathogenic";
  const isCarrier = result.prediction === "Carrier";
  const colorClass = isPathogenic ? "text-red-500 border-red-500 bg-red-500/10" : isCarrier ? "text-gene-amber border-gene-amber bg-gene-amber/10" : "text-green-500 border-green-500 bg-green-500/10";
  const Icon = isPathogenic ? AlertTriangle : isCarrier ? Activity : CheckCircle;

  return (
    <div className={`p-6 rounded-2xl border ${colorClass.split(' ')[1]} ${colorClass.split(' ')[2]}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold opacity-80">{title}</h3>
        <Badge variant="outline" className={`${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`}>
          {Math.round(result.confidence * 100)}% Confidence
        </Badge>
      </div>
      
      <div className="flex items-center gap-4">
        <Icon className={`h-10 w-10 ${colorClass.split(' ')[0]}`} />
        <div>
          <h2 className={`text-3xl font-bold ${colorClass.split(' ')[0]}`}>
            {result.prediction}
          </h2>
          <p className="text-sm mt-1 opacity-80 text-foreground">
            {isPathogenic 
              ? "Your sequence contains a mutation classified as pathogenic. This means the detected change may affect how your body produces hemoglobin."
              : isCarrier
              ? "Your sequence indicates a carrier state. You have one mutated allele but are likely asymptomatic."
              : "Your sequence is classified as benign. No pathogenic mutations were detected in the targeted region."}
          </p>
        </div>
      </div>
      
      <div className="mt-6 w-full bg-background/50 rounded-full h-2 overflow-hidden border border-border/50">
        <div 
          className={`h-full ${isPathogenic ? "bg-red-500" : isCarrier ? "bg-gene-amber" : "bg-green-500"}`} 
          style={{ width: `${result.confidence * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function GeneAnalysisPage() {
  const [selectedDisease, setSelectedDisease] = useState<string | null>("sickle_cell");
  const [mode, setMode] = useState<"individual" | "parents">("individual");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [alleleState, setAlleleState] = useState<"Normal" | "Carrier" | "Affected">("Normal");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePredict = async (payload: { mode: "individual" | "parents"; sequence?: string; father_sequence?: string; mother_sequence?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.prediction.predictSickleCell(payload);
      setResult(data);
      
      // Auto-set the interactive SVG state based on prediction
      if (payload.mode === "individual" && data.individual_result) {
        if (data.individual_result.prediction === "Pathogenic") setAlleleState("Affected");
        else if (data.individual_result.prediction === "Carrier") setAlleleState("Carrier");
        else setAlleleState("Normal");
      } else if (payload.mode === "parents" && data.compatibility) {
        if (data.compatibility.outcome === "HIGH RISK") setAlleleState("Affected");
        else if (data.compatibility.outcome === "MODERATE RISK") setAlleleState("Carrier");
        else setAlleleState("Normal");
      }
    } catch (err: any) {
      setError(err.message || "Failed to run analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadClinicalReport = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    try {
      // Use html-to-image instead of html2canvas to fix lab color parsing error
      const imgData = await toPng(reportRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // We need to calculate the height based on the image's aspect ratio
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => { img.onload = resolve; });
      
      const pdfHeight = (img.height * pdfWidth) / img.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      const date = new Date().toISOString().split("T")[0];
      pdf.save(`Clinical_Report_${date}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="print-hidden">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Microscope className="h-8 w-8 text-gene-teal" /> Gene Analysis
        </h1>
        <p className="text-muted-foreground mt-2">
          Targeted clinical genetic analysis for specific monogenetic diseases.
        </p>
      </motion.div>

      {/* Disease Selector Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print-hidden">
        <button
          onClick={() => setSelectedDisease("sickle_cell")}
          className={`text-left relative overflow-hidden rounded-xl border p-4 shadow-sm transition-all h-full ${
            selectedDisease === "sickle_cell" 
              ? "border-gene-amber bg-gene-amber/10 ring-1 ring-gene-amber" 
              : "border-border bg-background hover:border-gene-amber/40"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Activity className={`h-5 w-5 ${selectedDisease === "sickle_cell" ? "text-gene-amber" : "text-muted-foreground"}`} />
            <Badge variant="outline" className={`text-[10px] ${selectedDisease === "sickle_cell" ? "border-gene-amber/30 text-gene-amber" : ""}`}>HBB</Badge>
          </div>
          <h3 className={`font-bold text-sm ${selectedDisease === "sickle_cell" ? "text-gene-amber" : ""}`}>Sickle Cell</h3>
        </button>

        <div className="relative overflow-hidden rounded-xl border border-border bg-muted/20 p-4 opacity-60 grayscale cursor-not-allowed">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <Badge variant="outline" className="text-[10px] border-border">HBB</Badge>
          </div>
          <h3 className="font-bold text-sm text-muted-foreground">Thalassemia</h3>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border bg-muted/20 p-4 opacity-60 grayscale cursor-not-allowed">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <Badge variant="outline" className="text-[10px] border-border">G6PD</Badge>
          </div>
          <h3 className="font-bold text-sm text-muted-foreground">G6PD Def.</h3>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border bg-muted/20 p-4 opacity-60 grayscale cursor-not-allowed">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <Badge variant="outline" className="text-[10px] border-border">AZF</Badge>
          </div>
          <h3 className="font-bold text-sm text-muted-foreground">Y-Infertility</h3>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!result && selectedDisease === "sickle_cell" && (
          <motion.div key="input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="bg-gene-amber/5 border border-gene-amber/20 rounded-xl p-4 flex gap-4">
              <Info className="h-5 w-5 text-gene-amber shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-foreground">Sickle Cell Analysis Module</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Analyzes the HBB gene sequence using a Random Forest model trained on ClinVar to determine E6V mutation pathogenicity.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Input Sequence</h3>
                <div className="flex gap-1 bg-muted/50 p-1 rounded-md">
                  <button onClick={() => setMode("individual")} className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${mode === "individual" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}>Individual</button>
                  <button onClick={() => setMode("parents")} className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${mode === "parents" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}>Couple</button>
                </div>
              </div>
              
              <DualParentInput mode={mode} onPredict={handlePredict} isLoading={isLoading} />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </motion.div>
        )}

        {result && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex items-center justify-between print-hidden">
              <h2 className="text-2xl font-bold text-gene-amber">Analysis Results</h2>
              <Button variant="outline" size="sm" onClick={() => setResult(null)}>New Analysis</Button>
            </div>

            {/* This div is what gets captured for the PDF */}
            <div ref={reportRef} className="bg-background rounded-2xl p-0 md:p-8 space-y-8 text-slate-800">
              
              {/* PDF Header - Only visible when generating PDF or within this container context */}
              <div className="border-b border-border/50 pb-6 mb-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Microscope className="h-8 w-8 text-[#2d3a23]" />
                    <div>
                      <h1 className="text-2xl font-bold text-[#2d3a23]">DNADristi Clinical Report</h1>
                      <p className="text-sm text-muted-foreground">Targeted Genetic Analysis</p>
                    </div>
                  </div>
                  <div className="text-right text-sm space-y-1">
                    <div className="flex items-center justify-end gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" /> {new Date().toLocaleDateString()}
                    </div>
                    <div className="flex items-center justify-end gap-2 text-muted-foreground">
                      <User className="h-4 w-4" /> Patient ID: XXXX-0001
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. Chromosome Visualization ALWAYS shows at top of results */}
              <SvgChromosome alleleState={alleleState} setAlleleState={setAlleleState} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Compatibility Summary or Individual Details */}
                <div className="space-y-8">
                  {mode === "parents" && result.compatibility ? (
                    <div className="gene-card p-6 rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/20 h-full">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-[#2d3a23]" /> Compatibility Summary
                      </h3>
                      
                      <div className="space-y-6">
                        <div className="flex justify-between items-center p-4 bg-background rounded-xl border border-border/50">
                          <span className="text-muted-foreground font-medium">Overall Risk:</span>
                          <span className={`font-bold px-3 py-1 rounded-full text-sm ${result.compatibility.outcome === "HIGH RISK" ? "bg-red-500/10 text-red-500 border border-red-500/20" : result.compatibility.outcome === "MODERATE RISK" ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" : "bg-green-500/10 text-green-600 border border-green-500/20"}`}>
                            {result.compatibility.outcome}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pt-2">
                          <div className="text-center p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                            <p className="text-2xl font-bold text-red-500">{result.compatibility.offspring_probabilities.affected}%</p>
                            <p className="text-xs text-muted-foreground mt-1">Affected</p>
                          </div>
                          <div className="text-center p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                            <p className="text-2xl font-bold text-amber-500">{result.compatibility.offspring_probabilities.carrier}%</p>
                            <p className="text-xs text-muted-foreground mt-1">Carrier</p>
                          </div>
                          <div className="text-center p-3 bg-green-500/5 rounded-xl border border-green-500/10">
                            <p className="text-2xl font-bold text-green-500">{result.compatibility.offspring_probabilities.healthy}%</p>
                            <p className="text-xs text-muted-foreground mt-1">Healthy</p>
                          </div>
                        </div>

                        <div className="flex justify-center mt-4">
                          <div className="p-4 bg-background border border-border/50 rounded-xl grid grid-cols-2 gap-1 w-48 h-48 shadow-inner">
                            {result.compatibility.outcome === "HIGH RISK" ? (
                              <>
                                <div className="bg-green-500/20 flex items-center justify-center font-mono text-xs rounded-tl-lg">HbA/HbA</div>
                                <div className="bg-amber-500/20 flex items-center justify-center font-mono text-xs rounded-tr-lg">HbA/HbS</div>
                                <div className="bg-amber-500/20 flex items-center justify-center font-mono text-xs rounded-bl-lg">HbA/HbS</div>
                                <div className="bg-red-500/20 flex items-center justify-center font-mono text-xs font-bold rounded-br-lg text-red-700">HbS/HbS</div>
                              </>
                            ) : result.compatibility.outcome === "MODERATE RISK" ? (
                              <>
                                <div className="bg-green-500/20 flex items-center justify-center font-mono text-xs rounded-tl-lg">HbA/HbA</div>
                                <div className="bg-green-500/20 flex items-center justify-center font-mono text-xs rounded-tr-lg">HbA/HbA</div>
                                <div className="bg-amber-500/20 flex items-center justify-center font-mono text-xs rounded-bl-lg">HbA/HbS</div>
                                <div className="bg-amber-500/20 flex items-center justify-center font-mono text-xs rounded-br-lg">HbA/HbS</div>
                              </>
                            ) : (
                              <>
                                 <div className="bg-green-500/20 flex items-center justify-center font-mono text-xs rounded-tl-lg">HbA/HbA</div>
                                 <div className="bg-green-500/20 flex items-center justify-center font-mono text-xs rounded-tr-lg">HbA/HbA</div>
                                 <div className="bg-green-500/20 flex items-center justify-center font-mono text-xs rounded-bl-lg">HbA/HbA</div>
                                 <div className="bg-green-500/20 flex items-center justify-center font-mono text-xs rounded-br-lg">HbA/HbA</div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <ResultBanner result={result.individual_result} title="Patient Mutation Detection" />
                      <div className="gene-card p-6 rounded-2xl border border-border/50">
                         <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Info className="h-5 w-5 text-gene-teal" /> Clinical Significance</h3>
                         <p className="text-sm text-muted-foreground leading-relaxed">
                           The analyzed sequence matches the expected pattern for the HBB gene at 11p15.4. The detection of an E6V mutation indicates the presence of Hemoglobin S (HbS). 
                         </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Parent Results & Clinical Recommendations */}
                <div className="space-y-6">
                  {mode === "parents" && (
                    <div className="space-y-4">
                      <ResultBanner result={result.father_result} title="Parent A ML Detection" />
                      <ResultBanner result={result.mother_result} title="Parent B ML Detection" />
                    </div>
                  )}

                  <div className="gene-card p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 h-full">
                     <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800"><Stethoscope className="h-5 w-5 text-blue-500" /> Clinical Recommendations</h3>
                     <p className="text-sm font-medium text-slate-700 mb-4">This result is powered by a Random Forest ML model and is not a definitive clinical diagnosis. Consult a certified genetic counselor.</p>
                     
                     <div className="space-y-6">
                       <div>
                         <h4 className="text-sm font-bold mb-2 text-slate-800 flex items-center gap-2"><Activity className="h-4 w-4 text-blue-500"/> Recommended Follow-up:</h4>
                         <ul className="text-sm text-slate-600 space-y-1 pl-6 list-disc marker:text-blue-500">
                           <li>Hemoglobin electrophoresis</li>
                           <li>Complete Blood Count (CBC)</li>
                           <li>Newborn screening panel</li>
                         </ul>
                       </div>
                       
                       <div>
                         <h4 className="text-sm font-bold mb-2 text-slate-800 flex items-center gap-2"><HeartPulse className="h-4 w-4 text-blue-500"/> Management Strategies:</h4>
                         <ul className="text-sm text-slate-600 space-y-1 pl-6 list-disc marker:text-blue-500">
                           <li>Prenatal genetic testing (Amniocentesis/CVS).</li>
                           <li>IVF with Preimplantation Genetic Testing (PGT).</li>
                           <li>Maintain hydration and avoid physiological stress.</li>
                         </ul>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GENERATE REPORT BUTTON */}
            <div className="pt-8 pb-4 flex justify-center print-hidden">
              <Button 
                onClick={downloadClinicalReport} 
                disabled={isGeneratingPdf}
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 gap-2 text-white shadow-lg h-14 px-8 text-lg rounded-full w-full max-w-md transition-all active:scale-95 disabled:opacity-70 disabled:scale-100"
              >
                {isGeneratingPdf ? (
                  <><span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span> Generating PDF...</>
                ) : (
                  <><FileDown className="h-6 w-6" /> Download Clinical Report</>
                )}
              </Button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
