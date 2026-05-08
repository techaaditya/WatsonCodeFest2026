"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Activity, Droplet } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ParentData {
  genotypes: Record<string, string>;
  blood: string;
  rh: string;
}

interface DualParentInputProps {
  onPredict: (parent1: ParentData, parent2: ParentData) => void;
  isLoading: boolean;
}

const defaultParent: ParentData = {
  genotypes: {
    beta_thalassemia: "AA",
    sickle_cell: "AA",
    g6pd_deficiency: "XGX",
    y_chromosome_infertility: "normal",
  },
  blood: "ii",
  rh: "DD",
};

export function DualParentInput({ onPredict, isLoading }: DualParentInputProps) {
  const [parent1, setParent1] = useState<ParentData>({ ...defaultParent, genotypes: { ...defaultParent.genotypes, g6pd_deficiency: "XGY" } }); // Male default for Parent 1
  const [parent2, setParent2] = useState<ParentData>({ ...defaultParent, genotypes: { ...defaultParent.genotypes, g6pd_deficiency: "XGXG" } }); // Female default for Parent 2

  const handleUpdate = (parentNum: 1 | 2, field: string, value: string, isGenotype = false) => {
    const parent = parentNum === 1 ? parent1 : parent2;
    const setParent = parentNum === 1 ? setParent1 : setParent2;
    
    if (isGenotype) {
      setParent({ ...parent, genotypes: { ...parent.genotypes, [field]: value } });
    } else {
      setParent({ ...parent, [field]: value });
    }
  };

  const ParentForm = ({ num, data }: { num: 1 | 2; data: ParentData }) => (
    <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-foreground">
          <User className="h-5 w-5 text-gene-forest" /> Parent {num}{" "}
          <span className="text-muted-foreground font-medium">
            {num === 1 ? "(Father)" : "(Mother)"}
          </span>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Select genotypes and blood group
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Blood Group */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-medium text-foreground">
            <Droplet className="h-4 w-4 text-gene-teal" /> Blood Group & Rh Factor
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Blood Group (ABO)</Label>
              <Select value={data.blood} onValueChange={(v) => v && handleUpdate(num, "blood", v)}>
                <SelectTrigger className="bg-background/60 border-border/60 focus:border-gene-teal/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IAIA">A (IᴬIᴬ)</SelectItem>
                  <SelectItem value="IAi">A (Iᴬi)</SelectItem>
                  <SelectItem value="IBIB">B (IᴮIᴮ)</SelectItem>
                  <SelectItem value="IBi">B (Iᴮi)</SelectItem>
                  <SelectItem value="IAIB">AB (IᴬIᴮ)</SelectItem>
                  <SelectItem value="ii">O (ii)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Rh Factor</Label>
              <Select value={data.rh} onValueChange={(v) => v && handleUpdate(num, "rh", v)}>
                <SelectTrigger className="bg-background/60 border-border/60 focus:border-gene-teal/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD">Rh+ (DD - Homozygous)</SelectItem>
                  <SelectItem value="Dd">Rh+ (Dd - Heterozygous)</SelectItem>
                  <SelectItem value="dd">Rh− (dd - Negative)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Diseases */}
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 font-medium text-foreground">
            <Activity className="h-4 w-4 text-gene-forest" /> Genetic Markers
          </h4>
          
          <div className="space-y-2">
            <Label>Beta Thalassemia (HBB gen.) - Chr 11</Label>
            <Select
              value={data.genotypes.beta_thalassemia}
              onValueChange={(v) => v && handleUpdate(num, "beta_thalassemia", v, true)}
            >
              <SelectTrigger className="bg-background/60 border-border/60 focus:border-gene-teal/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AA">Healthy (AA)</SelectItem>
                <SelectItem value="Aa">Carrier / Trait (Aa)</SelectItem>
                <SelectItem value="aa">Affected (aa)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sickle Cell (HBB G6V) - Chr 11</Label>
            <Select
              value={data.genotypes.sickle_cell}
              onValueChange={(v) => v && handleUpdate(num, "sickle_cell", v, true)}
            >
              <SelectTrigger className="bg-background/60 border-border/60 focus:border-gene-teal/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AA">Healthy (AA)</SelectItem>
                <SelectItem value="AS">Carrier / Sickle Trait (AS)</SelectItem>
                <SelectItem value="SS">Affected / Disease (SS)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>G6PD Deficiency - Chr X</Label>
            {num === 1 ? (
              <Select
                value={data.genotypes.g6pd_deficiency}
                onValueChange={(v) => v && handleUpdate(num, "g6pd_deficiency", v, true)}
              >
                <SelectTrigger className="bg-background/60 border-border/60 focus:border-gene-teal/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XGY">Healthy Male (XᴳY)</SelectItem>
                  <SelectItem value="XgY">Affected Male (XᵍY)</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Select
                value={data.genotypes.g6pd_deficiency}
                onValueChange={(v) => v && handleUpdate(num, "g6pd_deficiency", v, true)}
              >
                <SelectTrigger className="bg-background/60 border-border/60 focus:border-gene-teal/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XGXG">Healthy Female (XᴳXᴳ)</SelectItem>
                  <SelectItem value="XGXg">Carrier Female (XᴳXᵍ)</SelectItem>
                  <SelectItem value="XgXg">Affected Female (XᵍXᵍ)</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label>Y-Chromosome Infertility (AZF)</Label>
            {num === 1 ? (
              <Select
                value={data.genotypes.y_chromosome_infertility}
                onValueChange={(v) => v && handleUpdate(num, "y_chromosome_infertility", v, true)}
              >
                <SelectTrigger className="bg-background/60 border-border/60 focus:border-gene-teal/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (Intact AZF)</SelectItem>
                  <SelectItem value="azfa_del">AZFa Deletion</SelectItem>
                  <SelectItem value="azfb_del">AZFb Deletion</SelectItem>
                  <SelectItem value="azfc_del">AZFc Deletion</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Select disabled value="normal">
                <SelectTrigger className="bg-background/40 text-muted-foreground border-border/60">
                  <SelectValue placeholder="Not applicable (Y-Linked)" />
                </SelectTrigger>
                <SelectContent><SelectItem value="normal">Not applicable to females</SelectItem></SelectContent>
              </Select>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ParentForm num={1} data={parent1} />
        <ParentForm num={2} data={parent2} />
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => onPredict(parent1, parent2)}
          disabled={isLoading}
          className="relative inline-flex h-14 w-64 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-olive/30 focus:ring-offset-2 focus:ring-offset-cream transition-transform active:scale-95 disabled:scale-100 disabled:opacity-70"
        >
          <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#546B41_0%,#99AD7A_50%,#DCCCAC_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-olive px-8 py-1 text-lg font-bold text-cream tracking-widest uppercase transition-colors hover:bg-softgreen hover:text-slate">
            {isLoading ? "ANALYZING..." : "PREDICT OUTCOME"}
          </span>
        </button>
      </div>
    </div>
  );
}
