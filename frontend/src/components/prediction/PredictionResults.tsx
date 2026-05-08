"use client";

import { motion } from "framer-motion";
import { Droplet, ShieldAlert, Activity, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PredictionResultsProps {
  data: any;
  onReset: () => void;
}

export function PredictionResults({ data, onReset }: PredictionResultsProps) {
  if (!data) return null;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom border-t border-slate-800 pt-8 mt-12 pb-12">
      
      {/* Header & Immunity Score */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
            Genetic Prediction Results
          </h2>
          <p className="text-slate-400 mt-2">Comprehensive inherited trait analysis based on parental genotypes</p>
        </div>
        
        <div className="flex items-center gap-6 bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-xl">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-sm text-cyan-400 bg-cyan-950/30 rounded-lg hover:bg-cyan-900/50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> Adjust Genes
          </button>
          <div className="h-10 w-[1px] bg-slate-800"></div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Immunity Score</span>
            <div className="flex items-end gap-1">
              <span className={`text-4xl font-black ${
                data.immunityScore > 80 ? "text-emerald-400" :
                data.immunityScore > 50 ? "text-amber-400" : "text-rose-500"
              }`}>
                {data.immunityScore}
              </span>
              <span className="text-sm font-medium text-slate-500 mb-1">/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Blood Group Prediction Card */}
        <Card className="md:col-span-1 border-slate-800 bg-slate-900/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-rose-400">
              <Droplet className="h-5 w-5" /> Blood Group
            </CardTitle>
            <CardDescription>Predicted ABO and Rh Factor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.bloodGroup.combined.map((bg: any, i: number) => (
              <div key={i} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-red-600">
                  {bg.type}
                </span>
                <span className="text-xl text-slate-300 font-mono">
                  {(bg.probability * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Carrier Status Summary */}
        <Card className="md:col-span-2 border-slate-800 bg-slate-900/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <ShieldAlert className="h-5 w-5" /> Carrier Risk Summary
            </CardTitle>
            <CardDescription>Likelihood of offspring being a silent carrier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.carrierStatus.map((c: any, i: number) => (
                <div key={i} className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-300">{c.disease}</span>
                    <span className="text-cyan-400 font-mono">{(c.probability * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={c.probability * 100} className="h-2 bg-slate-800" indicatorcolor={
                    c.status === 'High' ? 'bg-rose-500' :
                    c.status === 'Moderate' ? 'bg-amber-400' : 'bg-emerald-400'
                  } />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Detailed Disease Breakdown */}
      <h3 className="text-xl font-bold text-slate-200 mt-12 flex items-center gap-2">
        <Activity className="text-emerald-400" /> Detailed Monogenic Risks
      </h3>
      
      <div className="grid grid-cols-1 gap-6">
        {data.diseases.map((d: any, i: number) => (
          <Card key={i} className="border-slate-800 bg-slate-900/30 overflow-hidden">
            <div className="h-1 w-full" style={{ backgroundColor: d.color }}></div>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* Left Col: Disease info */}
                <div className="w-full md:w-1/3 space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{d.disease}</h4>
                    <p className="text-sm text-slate-400">Gene: <Badge variant="outline" className="text-xs bg-slate-950">{d.gene}</Badge> | Chr {d.chromosome}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Inheritance</p>
                    <p className="text-sm text-slate-300">{d.inheritance}</p>
                  </div>
                  
                  <div className="space-y-1 p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Mutation Status</p>
                    <p className={`text-sm ${d.mutationDetected ? "text-amber-400" : "text-emerald-400"}`}>
                      {d.mutationDetails}
                    </p>
                  </div>
                </div>

                {/* Right Col: Probabilities & Punnett */}
                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Probabilities */}
                  <div className="space-y-4 flex flex-col justify-center">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Healthy</span>
                        <span className="text-emerald-400 font-mono font-bold">{(d.healthyProb * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={d.healthyProb * 100} className="h-2 bg-slate-800" indicatorcolor="bg-emerald-400" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Carrier (Trait)</span>
                        <span className="text-amber-400 font-mono font-bold">{(d.carrierProb * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={d.carrierProb * 100} className="h-2 bg-slate-800" indicatorcolor="bg-amber-400" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Affected (Disease)</span>
                        <span className="text-rose-500 font-mono font-bold">{(d.affectedProb * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={d.affectedProb * 100} className="h-2 bg-slate-800" indicatorcolor="bg-rose-500" />
                    </div>
                  </div>

                  {/* Punnett Square Visualization */}
                  <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
                    <p className="text-xs text-center text-slate-500 mb-2 uppercase tracking-wide">Genotype Breakdown</p>
                    <div className="grid grid-cols-2 gap-2 h-[80%]">
                      {d.punnettSquare.slice(0, 4).map((p: any, idx: number) => (
                        <div 
                          key={idx} 
                          className={`flex flex-col items-center justify-center rounded border ${
                            p.status === 'affected' ? 'bg-rose-500/10 border-rose-500/30' :
                            p.status === 'carrier' ? 'bg-amber-400/10 border-amber-400/30' :
                            'bg-emerald-400/10 border-emerald-400/30'
                          }`}
                        >
                          <span className={`text-lg font-bold ${
                            p.status === 'affected' ? 'text-rose-400' :
                            p.status === 'carrier' ? 'text-amber-400' : 'text-emerald-400'
                          }`}>{p.genotype}</span>
                          <span className="text-xs text-slate-500">{(p.probability * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
