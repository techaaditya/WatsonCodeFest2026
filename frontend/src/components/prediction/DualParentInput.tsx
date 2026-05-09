"use client";

import { useState } from "react";
import { Plus, Upload, User, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface DualParentInputProps {
  mode: "individual" | "parents";
  onPredict: (payload: { mode: "individual" | "parents"; sequence?: string; father_sequence?: string; mother_sequence?: string }) => void;
  isLoading: boolean;
}

const parseAndValidate = (content: string): { ok: true; normalized: string } | { ok: false; error: string } => {
  const raw = content.trim();
  if (!raw.startsWith(">")) return { ok: false, error: "Input must start with FASTA header '>'." };
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const sequence = lines.slice(1).join("").toUpperCase();
  if (!sequence) return { ok: false, error: "FASTA sequence payload is empty." };
  if (!/^[ATCGN]+$/.test(sequence)) return { ok: false, error: "Only A/T/C/G/N are allowed in sequence payload." };
  return { ok: true, normalized: `${lines[0]}\n${sequence}` };
};

export function DualParentInput({ mode, onPredict, isLoading }: DualParentInputProps) {
  const [sequence, setSequence] = useState("");
  const [fatherSequence, setFatherSequence] = useState("");
  const [motherSequence, setMotherSequence] = useState("");
  const [showMotherUploader, setShowMotherUploader] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File, setter: (v: string) => void) => {
    const text = await file.text();
    const parsed = parseAndValidate(text);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    setError(null);
    setter(parsed.normalized);
  };

  const isIndividualValid = !!sequence && parseAndValidate(sequence).ok;
  const isFatherValid = !!fatherSequence && parseAndValidate(fatherSequence).ok;
  const isMotherValid = !!motherSequence && parseAndValidate(motherSequence).ok;
  const canPredict = mode === "individual" ? isIndividualValid : isFatherValid && isMotherValid;

  const UploadZone = ({
    label,
    value,
    onChange,
    icon,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    icon: React.ReactNode;
  }) => (
    <Card className="border-border/60 bg-card/75 backdrop-blur-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-foreground">{icon} {label}</CardTitle>
        <CardDescription className="text-muted-foreground">Upload a `.fasta` file or paste raw FASTA sequence.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">FASTA File Upload</Label>
          <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border/70 bg-background/50 p-4 hover:bg-background/70">
            <Upload className="h-4 w-4" />
            <span className="text-sm">Choose `.fasta` file</span>
            <input
              type="file"
              accept=".fasta,.fa,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file, onChange);
              }}
            />
          </label>
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Raw FASTA Input</Label>
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={">sample_header\nATCGATCGNNATCG"}
            className="min-h-[140px] max-h-64 overflow-y-auto resize-y"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="grid grid-cols-1 gap-8">
        {mode === "individual" ? (
          <UploadZone label="Your Sequence" value={sequence} onChange={setSequence} icon={<User className="h-5 w-5 text-gene-forest" />} />
        ) : (
          <>
            <UploadZone label="Male (Father) Sequence" value={fatherSequence} onChange={setFatherSequence} icon={<Users className="h-5 w-5 text-gene-forest" />} />
            {isFatherValid && !showMotherUploader && (
              <div className="flex justify-center">
                <Button type="button" onClick={() => setShowMotherUploader(true)} className="rounded-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Female (Mother) Sequence
                </Button>
              </div>
            )}
            {showMotherUploader && (
              <UploadZone label="Female (Mother) Sequence" value={motherSequence} onChange={setMotherSequence} icon={<Users className="h-5 w-5 text-gene-teal" />} />
            )}
          </>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-center">
        <button
          onClick={() => {
            setError(null);
            if (mode === "individual") {
              const parsed = parseAndValidate(sequence);
              if (!parsed.ok) return setError(parsed.error);
              onPredict({ mode, sequence: parsed.normalized });
              return;
            }
            const father = parseAndValidate(fatherSequence);
            if (!father.ok) return setError(father.error);
            const mother = parseAndValidate(motherSequence);
            if (!mother.ok) return setError(mother.error);
            onPredict({ mode, father_sequence: father.normalized, mother_sequence: mother.normalized });
          }}
          disabled={isLoading || !canPredict}
          className="relative inline-flex h-14 w-64 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-olive/30 focus:ring-offset-2 focus:ring-offset-cream transition-transform active:scale-95 disabled:scale-100 disabled:opacity-70"
        >
          <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#546B41_0%,#99AD7A_50%,#DCCCAC_100%)]" />
          <span className="relative z-10 inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-olive px-8 py-1 text-lg font-bold text-cream transition-colors hover:bg-softgreen hover:text-slate backdrop-blur-3xl">
            {isLoading ? "Analyzing..." : "Analyze"}
          </span>
        </button>
      </div>
    </div>
  );
}
