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
  const diseases = data.monogenic_disease_risk_scoring || data.diseases || [];
  const bloodEntries = Object.entries(data.blood_group_probabilities || {}).filter(([, value]) => Number(value) > 0);
  const carrierSummary = data.carrier_status_prediction || [];
  const mutationDetails = data.mutation_detection_details || [];
  const severityItems = data.disease_severity_prediction || [];
  const sexSplit = data.sex_linked_split || data.sex_linked_split_predictions || { Male: {}, Female: {} };

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
                data.immunity_score?.value > 80 ? "text-olive" :
                data.immunity_score?.value > 50 ? "text-softgreen" : "text-destructive"
              }`}>
                {data.immunity_score?.value ?? 0}
              </span>
              <span className="text-sm font-medium text-slate/70 mb-1">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Monogenic Disease Risk Scoring */}
      <h3 className="text-xl font-bold text-olive mt-12 flex items-center gap-2">
        <Activity className="text-softgreen" /> Monogenic Disease Risk Scoring
      </h3>
      
      <div className="grid grid-cols-1 gap-6">
        {diseases.map((d: any, i: number) => (
          <Card key={i} className="border-beige bg-white overflow-hidden rounded-3xl">
            <div className="h-1 w-full bg-gene-forest/60"></div>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* Disease identity */}
                <div className="w-full md:w-1/3 space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-olive mb-1">{d.name}</h4>
                    <p className="text-sm text-slate/80">
                      Inheritance:{" "}
                      <Badge variant="outline" className="text-xs bg-cream border-beige text-slate">
                        {d.inheritance_type}
                      </Badge>
                    </p>
                  </div>
                  
                  <Badge variant="outline" className="bg-cream border-beige text-slate">
                    Core Risk Feature
                  </Badge>
                </div>

                {/* Probability bars */}
                <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div className="space-y-4 flex flex-col justify-center">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Healthy</span>
                        <span className="text-gene-forest font-mono font-bold">{(d.general_probabilities?.healthy ?? d.sex_split?.male_child?.healthy ?? 0).toFixed(1)}%</span>
                      </div>
                      <Progress value={d.general_probabilities?.healthy ?? d.sex_split?.male_child?.healthy ?? 0} className="h-2" trackClassName="h-2 bg-muted" indicatorClassName="bg-gene-forest" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Carrier (Trait)</span>
                        <span className="text-gene-sage font-mono font-bold">{(d.general_probabilities?.carrier ?? d.sex_split?.male_child?.carrier ?? 0).toFixed(1)}%</span>
                      </div>
                      <Progress value={d.general_probabilities?.carrier ?? d.sex_split?.male_child?.carrier ?? 0} className="h-2" trackClassName="h-2 bg-muted" indicatorClassName="bg-gene-sage" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Affected (Disease)</span>
                        <span className="text-destructive font-mono font-bold">{(d.general_probabilities?.affected ?? d.sex_split?.male_child?.affected ?? 0).toFixed(1)}%</span>
                      </div>
                      <Progress value={d.general_probabilities?.affected ?? d.sex_split?.male_child?.affected ?? 0} className="h-2" trackClassName="h-2 bg-muted" indicatorClassName="bg-destructive" />
                    </div>
                  </div>

                  <div className="bg-cream rounded-3xl p-3 border border-beige">
                    <p className="text-xs text-center text-slate/70 mb-2 uppercase tracking-wide">Mendelian Split</p>
                    <div className="grid grid-cols-2 gap-2 h-[80%]">
                      {[
                        { genotype: "Affected", probability: d.general_probabilities?.affected ?? d.sex_split?.male_child?.affected ?? 0, status: "affected" },
                        { genotype: "Carrier", probability: d.general_probabilities?.carrier ?? d.sex_split?.male_child?.carrier ?? 0, status: "carrier" },
                        { genotype: "Healthy", probability: d.general_probabilities?.healthy ?? d.sex_split?.male_child?.healthy ?? 0, status: "healthy" },
                        { genotype: "Inheritance", probability: 100, status: "healthy" },
                      ].map((p: any, idx: number) => (
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
                          <span className="text-xs text-slate/70">{idx === 3 ? d.inheritance_type : `${Number(p.probability).toFixed(1)}%`}</span>
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

      {/* 2. Immunity Points */}
      <Card className="border-beige bg-white rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-olive">
            <Activity className="h-5 w-5" /> Immunity Points
          </CardTitle>
          <CardDescription>Joint probability score across monogenic core diseases.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-2xl border border-beige bg-cream p-4">
            <span className="text-sm text-slate/80">{data.immunity_score?.classification}</span>
            <span className="text-3xl font-black text-olive">{data.immunity_score?.value ?? 0}/100</span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Carrier Status Prediction Summary */}
      <Card className="border-border/60 bg-card/75 backdrop-blur-md shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <ShieldAlert className="h-5 w-5" /> Carrier Status Prediction Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {carrierSummary.map((c: any, i: number) => (
              <div key={i} className="bg-background/60 p-4 rounded-lg border border-border/60 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{c.disease}</span>
                  <span className="text-gene-forest font-mono">{Number(c.carrier_probability || 0).toFixed(1)}%</span>
                </div>
                <Progress value={Number(c.carrier_probability || 0)} className="h-2" trackClassName="h-2 bg-muted" indicatorClassName="bg-gene-sage" />
                {c.warning ? <p className="text-xs text-gene-amber">{c.warning}</p> : null}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Predicted Blood Group */}
      <Card className="border-beige bg-white rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-olive">
            <Droplet className="h-5 w-5" /> Predicted Blood Group
          </CardTitle>
          <CardDescription>Only non-zero probabilities are displayed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {bloodEntries.map(([name, value], i) => (
            <div key={i} className="flex justify-between items-center bg-cream p-3 rounded-2xl border border-beige">
              <span className="text-xl font-bold text-olive">{name.replace("_", " ").replace("positive", "+").replace("negative", "-").toUpperCase()}</span>
              <span className="text-lg text-slate font-mono">{Number(value).toFixed(1)}%</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 5. Mutation Detection Details */}
      <Card className="border-beige bg-white rounded-3xl">
        <CardHeader>
          <CardTitle className="text-olive">Mutation Detection Details</CardTitle>
        </CardHeader>
        <CardContent>
          {mutationDetails.length > 0 ? (
            <div className="space-y-2">
              {mutationDetails.map((m: string, i: number) => (
                <p key={i} className="text-sm text-softgreen bg-cream border border-beige rounded-xl p-3">{m}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No target mutation detected.</p>
          )}
        </CardContent>
      </Card>

      {/* 6. Disease Severity Prediction */}
      <Card className="border-beige bg-white rounded-3xl">
        <CardHeader>
          <CardTitle className="text-olive">Disease Severity Prediction</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {severityItems.map((s: any, i: number) => (
            <div key={i} className="rounded-xl border border-beige bg-cream p-3 flex items-center justify-between">
              <span className="text-sm text-slate">{s.disease}</span>
              <Badge variant="outline" className="bg-white">{s.severity}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 7. Sex-Linked Split Predictions */}
      <Card className="border-beige bg-white rounded-3xl">
        <CardHeader>
          <CardTitle className="text-olive">Sex-Linked Split Predictions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-beige bg-cream p-4">
            <h4 className="font-semibold text-olive mb-3">Male Child</h4>
            <div className="space-y-2">
              {Object.entries(sexSplit.Male || {}).map(([k, v]: any) => (
                <div key={k} className="flex justify-between text-sm">
                  <span>{k.replaceAll("_", " ")}</span>
                  <span className="font-mono">{Number(v).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-beige bg-cream p-4">
            <h4 className="font-semibold text-olive mb-3">Female Child</h4>
            <div className="space-y-2">
              {Object.entries(sexSplit.Female || {}).map(([k, v]: any) => (
                <div key={k} className="flex justify-between text-sm">
                  <span>{k.replaceAll("_", " ")}</span>
                  <span className="font-mono">{Number(v).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
