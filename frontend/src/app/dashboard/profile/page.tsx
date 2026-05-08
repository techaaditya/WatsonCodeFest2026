"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Save, Dna } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAuth } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [ethnicity, setEthnicity] = useState("");

  useEffect(() => {
    const user = mockAuth.getUser();
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
    }
  }, []);

  const handleSave = () => {
    const user = mockAuth.getUser();
    if (user) {
      mockAuth.setUser({ ...user, full_name: fullName, email });
      toast.success("Profile updated successfully!");
    }
  };

  const initials = fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "GV";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="h-6 w-6 text-gene-emerald" /> My Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account details and preferences.</p>
      </motion.div>

      {/* Avatar Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="gene-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <Avatar className="h-24 w-24 border-2 border-gene-emerald/20">
          <AvatarFallback className="bg-gene-emerald/10 text-gene-emerald text-2xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold">{fullName || "GenoVault User"}</h2>
          <p className="text-sm text-muted-foreground mt-1">{email || "user@genovault.com"}</p>
          <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
            <Dna className="h-4 w-4 text-gene-emerald" />
            <span className="text-xs text-gene-emerald font-medium">GenoVault Member</span>
          </div>
        </div>
      </motion.div>

      {/* Personal Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="gene-card rounded-2xl p-6 sm:p-8 space-y-5">
        <h3 className="font-semibold text-lg">Personal Information</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profileName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="profileName" value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="pl-10 h-11 bg-background/50 border-border/50 focus:border-gene-emerald/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profileEmail">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="profileEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 bg-background/50 border-border/50 focus:border-gene-emerald/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profilePhone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="profilePhone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+977"
                className="pl-10 h-11 bg-background/50 border-border/50 focus:border-gene-emerald/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Region</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Select value={region} onValueChange={(v) => v && setRegion(v)}>
                <SelectTrigger className="pl-10 h-11 bg-background/50 border-border/50">
                  <SelectValue placeholder="Select region..." />
                </SelectTrigger>
                <SelectContent>
                  {["Province 1", "Madhesh Pradesh", "Bagmati Pradesh", "Gandaki Pradesh", "Lumbini Pradesh", "Karnali Pradesh", "Sudurpashchim Pradesh"]
                    .map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Ethnicity</Label>
          <Select value={ethnicity} onValueChange={(v) => v && setEthnicity(v)}>
            <SelectTrigger className="h-11 bg-background/50 border-border/50 max-w-sm">
              <SelectValue placeholder="Select ethnicity..." />
            </SelectTrigger>
            <SelectContent>
              {["Brahmin/Chhetri", "Newar", "Tharu", "Tamang", "Magar", "Gurung", "Rai/Limbu", "Sherpa", "Madhesi", "Janajati (Other)"]
                .map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave}
            className="bg-gene-emerald hover:bg-gene-emerald/90 text-gene-deep font-semibold px-6 shadow-lg shadow-gene-emerald/20">
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </div>
      </motion.div>

      {/* Account Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="gene-card rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-4">Account Activity</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Predictions", value: "0", color: "#10b981" },
            { label: "Chat Sessions", value: "0", color: "#f59e0b" },
            { label: "Member Since", value: "Today", color: "#14b8a6" },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-background/50 border border-border/30 text-center">
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
