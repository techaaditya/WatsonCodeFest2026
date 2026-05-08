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
    <div className="space-y-8 animate-in slide-in-from-bottom border-t border-beige pt-8 mt-12 pb-12">
      
      {/* Header & Immunity Score */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-olive">
            Genetic Prediction Results
          </h2>
          <p className="text-slate/80 mt-2">
            Comprehensive inherited trait analysis based on parental genotypes
          </p>
        </div>
        
        <div className="flex items-center gap-6 bg-white p-4 rounded-3xl border border-beige shadow-[0_18px_40px_rgba(45,58,35,0.10)]">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-sm text-olive bg-cream rounded-full border border-beige hover:bg-beige/25 transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> Adjust Genes
          </button>
          <div className="h-10 w-[1px] bg-beige"></div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate/70 uppercase tracking-widest font-bold">Immunity Score</span>
            <div className="flex items-end gap-1">
              <span className={`text-4xl font-black ${
                data.immunityScore > 80 ? "text-olive" :
                data.immunityScore > 50 ? "text-softgreen" : "text-destructive"
              }`}>
                {data.immunityScore}
              </span>
              <span className="text-sm font-medium text-slate/70 mb-1">/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Blood Group Prediction Card */}
        <Card className="md:col-span-1 border-beige bg-white rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-olive">
              <Droplet className="h-5 w-5" /> Blood Group
            </CardTitle>
            <CardDescription className="text-slate/80">Predicted ABO and Rh Factor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.bloodGroup.combined.map((bg: any, i: number) => (
              <div key={i} className="flex justify-between items-center bg-cream p-3 rounded-2xl border border-beige">
                <span className="text-2xl font-bold text-olive">
                  {bg.type}
                </span>
                <span className="text-xl text-slate font-mono">
                  {(bg.probability * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Carrier Status Summary */}
        <Card className="md:col-span-2 border-border/60 bg-card/75 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <ShieldAlert className="h-5 w-5" /> Carrier Risk Summary
            </CardTitle>
            <CardDescription>Likelihood of offspring being a silent carrier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.carrierStatus.map((c: any, i: number) => (
                <div key={i} className="bg-background/60 p-4 rounded-lg border border-border/60 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{c.disease}</span>
                    <span className="text-gene-forest font-mono">{(c.probability * 100).toFixed(0)}%</span>
                  </div>
                  <Progress
                    value={c.probability * 100}
                    className="h-2"
                    trackClassName="h-2 bg-muted"
                    indicatorClassName={
                      c.status === "High"
                        ? "bg-destructive"
                        : c.status === "Moderate"
                          ? "bg-gene-sage"
                          : "bg-gene-forest"
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Detailed Disease Breakdown */}
      <h3 className="text-xl font-bold text-olive mt-12 flex items-center gap-2">
        <Activity className="text-softgreen" /> Detailed Monogenic Risks
      </h3>
      
      <div className="grid grid-cols-1 gap-6">
        {data.diseases.map((d: any, i: number) => (
          <Card key={i} className="border-beige bg-white overflow-hidden rounded-3xl">
            <div className="h-1 w-full" style={{ backgroundColor: d.color }}></div>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* Left Col: Disease info */}
                <div className="w-full md:w-1/3 space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-olive mb-1">{d.disease}</h4>
                    <p className="text-sm text-slate/80">
                      Gene:{" "}
                      <Badge variant="outline" className="text-xs bg-cream border-beige text-slate">
                        {d.gene}
                      </Badge>{" "}
                      | Chr {d.chromosome}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-slate/70 uppercase font-bold tracking-wider">Inheritance</p>
                    <p className="text-sm text-slate">{d.inheritance}</p>
                  </div>
                  
                  <div className="space-y-1 p-3 bg-cream rounded-2xl border border-beige">
                    <p className="text-xs text-slate/70 uppercase font-bold tracking-wider">Mutation Status</p>
                    <p className={`text-sm ${d.mutationDetected ? "text-softgreen" : "text-olive"}`}>
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
                        <span className="text-muted-foreground">Healthy</span>
                        <span className="text-gene-forest font-mono font-bold">{(d.healthyProb * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={d.healthyProb * 100} className="h-2" trackClassName="h-2 bg-muted" indicatorClassName="bg-gene-forest" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Carrier (Trait)</span>
                        <span className="text-gene-sage font-mono font-bold">{(d.carrierProb * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={d.carrierProb * 100} className="h-2" trackClassName="h-2 bg-muted" indicatorClassName="bg-gene-sage" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Affected (Disease)</span>
                        <span className="text-destructive font-mono font-bold">{(d.affectedProb * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={d.affectedProb * 100} className="h-2" trackClassName="h-2 bg-muted" indicatorClassName="bg-destructive" />
                    </div>
                  </div>

                  {/* Punnett Square Visualization */}
                  <div className="bg-cream rounded-3xl p-3 border border-beige">
                    <p className="text-xs text-center text-slate/70 mb-2 uppercase tracking-wide">Genotype Breakdown</p>
                    <div className="grid grid-cols-2 gap-2 h-[80%]">
                      {d.punnettSquare.slice(0, 4).map((p: any, idx: number) => (
                        <div 
                          key={idx} 
                          className={`flex flex-col items-center justify-center rounded border ${
                            p.status === 'affected' ? 'bg-destructive/10 border-destructive/30' :
                            p.status === 'carrier' ? 'bg-softgreen/18 border-softgreen/40' :
                            'bg-olive/8 border-beige'
                          }`}
                        >
                          <span className={`text-lg font-bold ${
                            p.status === 'affected' ? 'text-destructive' :
                            p.status === 'carrier' ? 'text-softgreen' : 'text-olive'
                          }`}>{p.genotype}</span>
                          <span className="text-xs text-slate/70">{(p.probability * 100).toFixed(0)}%</span>
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
