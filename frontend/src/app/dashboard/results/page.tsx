"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Dna, Shield, Droplets, Activity, AlertTriangle,
  CheckCircle2, Heart, Users, User, FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { runPrediction, PredictionInput, PredictionResult } from "@/utils/genetics/engine";

const statusColors: Record<string, string> = {
  healthy: "#10b981",
  carrier: "#f59e0b",
  affected: "#f43f5e",
  High: "#f43f5e",
  Moderate: "#f59e0b",
  Low: "#14b8a6",
  None: "#10b981",
};

const statusIcons: Record<string, typeof CheckCircle2> = {
  healthy: CheckCircle2,
  carrier: Shield,
  affected: AlertTriangle,
};

const severityColors: Record<string, string> = {
  none: "#10b981",
  mild: "#f59e0b",
  moderate: "#f97316",
  severe: "#f43f5e",
};

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<PredictionResult | null>(null);
  const [input, setInput] = useState<PredictionInput | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("genovault_prediction_input");
    if (!raw) { router.push("/dashboard"); return; }
    const parsed: PredictionInput = JSON.parse(raw);
    setInput(parsed);
    const result = runPrediction(parsed);
    setResults(result);
  }, [router]);

  if (!results || !input) {
    return (
      <div className="flex items-center justify-center h-64">
        <Dna className="h-8 w-8 animate-spin text-gene-emerald" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}
          className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-gene-emerald" /> Prediction Results
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {input.mode === "dual" ? "Parent Compatible" : "Individual"} Analysis Complete
          </p>
        </div>
      </motion.div>

      <Tabs defaultValue="diseases" className="space-y-6">
        <TabsList className="bg-muted/30 border border-border/50 p-1">
          <TabsTrigger value="diseases" className="data-[state=active]:bg-gene-emerald/10 data-[state=active]:text-gene-emerald">
            <Dna className="h-4 w-4 mr-1.5" /> Disease Risk
          </TabsTrigger>
          <TabsTrigger value="blood" className="data-[state=active]:bg-gene-amber/10 data-[state=active]:text-gene-amber">
            <Droplets className="h-4 w-4 mr-1.5" /> Blood Group
          </TabsTrigger>
          <TabsTrigger value="immunity" className="data-[state=active]:bg-gene-teal/10 data-[state=active]:text-gene-teal">
            <Activity className="h-4 w-4 mr-1.5" /> Immunity
          </TabsTrigger>
          <TabsTrigger value="sexlinked" className="data-[state=active]:bg-gene-coral/10 data-[state=active]:text-gene-coral">
            <Users className="h-4 w-4 mr-1.5" /> Sex-Linked
          </TabsTrigger>
        </TabsList>

        {/* === DISEASE RISK TAB === */}
        <TabsContent value="diseases" className="space-y-6">
          {/* Risk Overview Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="gene-card rounded-2xl p-6 overflow-x-auto">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Dna className="h-5 w-5 text-gene-emerald" /> Disease Risk Overview
            </h3>
            <Table>
              <TableHeader>
                <TableRow className="border-border/30">
                  <TableHead>Disease</TableHead>
                  <TableHead>Gene</TableHead>
                  <TableHead>Affected</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Healthy</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Mutation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.diseases.map((d, i) => (
                  <TableRow key={i} className="border-border/20">
                    <TableCell className="font-medium">{d.disease}</TableCell>
                    <TableCell>
                      <Badge variant="outline" style={{ borderColor: `${d.color}40`, color: d.color }}>
                        {d.gene} • Chr {d.chromosome}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold" style={{ color: d.affectedProb > 0 ? "#f43f5e" : "#10b981" }}>
                        {(d.affectedProb * 100).toFixed(0)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold" style={{ color: d.carrierProb > 0 ? "#f59e0b" : "#10b981" }}>
                        {(d.carrierProb * 100).toFixed(0)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-gene-emerald">
                        {(d.healthyProb * 100).toFixed(0)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className="text-xs" style={{ backgroundColor: `${severityColors[d.severity]}20`, color: severityColors[d.severity], border: `1px solid ${severityColors[d.severity]}40` }}>
                        {d.severity.charAt(0).toUpperCase() + d.severity.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {d.mutationDetected ? (
                        <span className="text-xs text-gene-amber">⚠ {d.mutationDetails}</span>
                      ) : (
                        <span className="text-xs text-gene-emerald">✓ Clean</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>

          {/* Punnett Squares + Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {results.diseases.map((d, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }} className="gene-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${d.color}15` }}>
                    <Dna className="h-4 w-4" style={{ color: d.color }} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{d.disease}</h4>
                    <p className="text-xs text-muted-foreground">{d.inheritance}</p>
                  </div>
                </div>

                {/* Punnett Square Visual */}
                <div className="mb-4 p-4 rounded-xl bg-background/50 border border-border/30">
                  <p className="text-xs text-muted-foreground mb-3 font-medium">Punnett Square</p>
                  <div className="grid grid-cols-2 gap-2 max-w-[220px] mx-auto">
                    {d.punnettSquare.slice(0, 4).map((cell, ci) => {
                      const Icon = statusIcons[cell.status] || CheckCircle2;
                      return (
                        <div key={ci} className="punnett-cell p-3 rounded-lg text-center border"
                          style={{ backgroundColor: `${statusColors[cell.status]}08`, borderColor: `${statusColors[cell.status]}25` }}>
                          <Icon className="h-4 w-4 mx-auto mb-1" style={{ color: statusColors[cell.status] }} />
                          <p className="text-xs font-mono font-semibold">{cell.genotype}</p>
                          <p className="text-xs mt-0.5" style={{ color: statusColors[cell.status] }}>
                            {(cell.probability * 100).toFixed(0)}%
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Risk Bars */}
                <div className="space-y-3">
                  {[
                    { label: "Affected", prob: d.affectedProb, color: "#f43f5e" },
                    { label: "Carrier", prob: d.carrierProb, color: "#f59e0b" },
                    { label: "Healthy", prob: d.healthyProb, color: "#10b981" },
                  ].map((bar, bi) => (
                    <div key={bi} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{bar.label}</span>
                        <span className="font-semibold" style={{ color: bar.color }}>{(bar.prob * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.prob * 100}%` }}
                          transition={{ delay: 0.5 + bi * 0.1, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: bar.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Carrier Status Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="gene-card rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-gene-teal" /> Carrier Status Prediction
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {results.carrierStatus.map((cs, i) => (
                <div key={i} className="p-4 rounded-xl bg-background/50 border border-border/30 text-center">
                  <p className="text-sm font-medium mb-2">{cs.disease}</p>
                  <p className="text-2xl font-bold" style={{ color: statusColors[cs.status] }}>
                    {(cs.probability * 100).toFixed(0)}%
                  </p>
                  <Badge className="mt-2 text-xs" style={{ backgroundColor: `${statusColors[cs.status]}15`, color: statusColors[cs.status], border: `1px solid ${statusColors[cs.status]}30` }}>
                    {cs.status} Risk
                  </Badge>
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* === BLOOD GROUP TAB === */}
        <TabsContent value="blood" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="gene-card rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Droplets className="h-5 w-5 text-gene-amber" /> Blood Group Prediction
            </h3>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-4">ABO Blood Type</h4>
                <div className="space-y-3">
                  {results.bloodGroup.possibleGroups.map((g, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 shrink-0"
                        style={{ borderColor: "#f59e0b", color: "#f59e0b", backgroundColor: "rgba(245,158,11,0.08)" }}>
                        {g.group}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Type {g.group}</span>
                          <span className="font-semibold text-gene-amber">{(g.probability * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${g.probability * 100}%` }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                            className="h-full rounded-full bg-gene-amber" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Rh Factor</h4>
                <div className="space-y-3">
                  {results.bloodGroup.possibleRh.map((r, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 shrink-0"
                        style={{ borderColor: "#f97316", color: "#f97316", backgroundColor: "rgba(249,115,22,0.08)" }}>
                        {r.type}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{r.type}</span>
                          <span className="font-semibold text-gene-coral">{(r.probability * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${r.probability * 100}%` }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                            className="h-full rounded-full bg-gene-coral" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Combined */}
            <div className="mt-8 pt-6 border-t border-border/30">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Combined Blood Type Probabilities</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {results.bloodGroup.combined.map((c, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                    className="p-4 rounded-xl text-center border border-border/30 bg-background/50">
                    <p className="text-xl font-bold text-gene-amber">{c.type}</p>
                    <p className="text-sm text-muted-foreground mt-1">{(c.probability * 100).toFixed(1)}%</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* === IMMUNITY TAB === */}
        <TabsContent value="immunity" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="gene-card rounded-2xl p-8 text-center">
            <h3 className="font-semibold text-lg mb-8 flex items-center justify-center gap-2">
              <Activity className="h-5 w-5 text-gene-teal" /> Immunity Score
            </h3>
            {/* Gauge */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
                <motion.circle
                  cx="100" cy="100" r="85" fill="none"
                  stroke={results.immunityScore > 70 ? "#10b981" : results.immunityScore > 40 ? "#f59e0b" : "#f43f5e"}
                  strokeWidth="14" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 85}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 85 * (1 - results.immunityScore / 100) }}
                  transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-4xl font-bold"
                  style={{ color: results.immunityScore > 70 ? "#10b981" : results.immunityScore > 40 ? "#f59e0b" : "#f43f5e" }}
                >
                  {results.immunityScore}
                </motion.span>
                <span className="text-sm text-muted-foreground">out of 100</span>
              </div>
            </div>

            <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
              {results.immunityScore > 70
                ? "Strong genetic immunity profile. Low combined disease susceptibility detected across analyzed genes."
                : results.immunityScore > 40
                ? "Moderate genetic immunity profile. Some disease susceptibility detected. Carrier screening recommended."
                : "Elevated genetic risk detected. Multiple disease susceptibilities identified. Professional genetic counseling strongly recommended."}
            </p>

            {/* Disease contribution breakdown */}
            <div className="mt-8 pt-6 border-t border-border/30 max-w-lg mx-auto">
              <h4 className="text-sm font-medium text-muted-foreground mb-4 text-left">Risk Contribution by Disease</h4>
              {results.diseases.map((d, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <span className="text-sm w-40 text-left truncate">{d.disease}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted/30 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.affectedProb * 100}%`, backgroundColor: d.color }} />
                  </div>
                  <span className="text-xs w-10 text-right font-semibold" style={{ color: d.color }}>
                    {(d.affectedProb * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* === SEX-LINKED TAB === */}
        <TabsContent value="sexlinked" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Male Child */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="gene-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gene-teal/10 border border-gene-teal/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-gene-teal" />
                </div>
                <div>
                  <h3 className="font-semibold">Male Child Prediction</h3>
                  <p className="text-xs text-muted-foreground">X-linked recessive inheritance</p>
                </div>
              </div>
              {results.sexLinked.maleChild.length > 0 ? (
                <div className="space-y-4">
                  {results.sexLinked.maleChild.map((r, i) => {
                    const Icon = statusIcons[r.status] || CheckCircle2;
                    return (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border/30 bg-background/50">
                        <Icon className="h-6 w-6" style={{ color: statusColors[r.status] }} />
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">{r.status}</p>
                          <Progress value={r.probability * 100} className="h-2 mt-2" />
                        </div>
                        <span className="text-xl font-bold" style={{ color: statusColors[r.status] }}>
                          {(r.probability * 100).toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Select G6PD genotypes for sex-linked predictions
                </p>
              )}
            </motion.div>

            {/* Female Child */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="gene-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gene-rose/10 border border-gene-rose/20 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-gene-rose" />
                </div>
                <div>
                  <h3 className="font-semibold">Female Child Prediction</h3>
                  <p className="text-xs text-muted-foreground">X-linked carrier analysis</p>
                </div>
              </div>
              {results.sexLinked.femaleChild.length > 0 ? (
                <div className="space-y-4">
                  {results.sexLinked.femaleChild.map((r, i) => {
                    const Icon = statusIcons[r.status] || CheckCircle2;
                    return (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border/30 bg-background/50">
                        <Icon className="h-6 w-6" style={{ color: statusColors[r.status] }} />
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">{r.status}</p>
                          <Progress value={r.probability * 100} className="h-2 mt-2" />
                        </div>
                        <span className="text-xl font-bold" style={{ color: statusColors[r.status] }}>
                          {(r.probability * 100).toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Select G6PD genotypes for sex-linked predictions
                </p>
              )}
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action buttons */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="flex justify-center gap-4 pt-4 pb-8">
        <Button variant="outline" onClick={() => router.push("/dashboard/predict?mode=" + input.mode)}
          className="border-gene-emerald/30 text-gene-emerald hover:bg-gene-emerald/5">
          Run Another Analysis
        </Button>
        <Button onClick={() => router.push("/dashboard/chromolens")}
          className="bg-gene-emerald hover:bg-gene-emerald/90 text-gene-deep font-semibold">
          View in Gene Analysis
        </Button>
      </motion.div>
    </div>
  );
}
