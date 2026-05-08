"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Dna, BookOpen, Microscope, HeartPulse, Lightbulb, PlayCircle, BookMarked, MessageCircleQuestion, FileText, CheckCircle2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

const modules = [
  {
    id: "dna-basics",
    icon: Dna,
    title: "DNA Basics: The Blueprint",
    color: "#3b82f6",
    type: "video",
    content: (
      <div className="space-y-4">
        <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center group cursor-pointer">
          <img src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=2670&auto=format&fit=crop" alt="DNA Double Helix" className="opacity-50 object-cover w-full h-full absolute inset-0" />
          <PlayCircle className="h-16 w-16 text-white z-10 group-hover:scale-110 transition-transform" />
          <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded">Genetics 101</div>
        </div>
        <div>
          <h4 className="font-semibold text-lg mb-2">Quick Read: Core Concepts</h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• **DNA** is a double helix carrying genetic instructions.</li>
            <li>• Made up of 4 bases: Adenine (A), Thymine (T), Guanine (G), Cytosine (C).</li>
            <li>• A **<span className="bg-yellow-100 px-1 cursor-help" title="A specific segment of DNA that codes for a protein">Gene</span>** is a segment of DNA. Humans have ~20,000-25,000 genes.</li>
            <li>• **<span className="bg-yellow-100 px-1 cursor-help" title="Different versions of the same gene">Alleles</span>** are versions of genes inherited from each parent.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "inheritance",
    icon: BookOpen,
    title: "Inheritance Patterns",
    color: "#8b5cf6",
    type: "interactive",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-slate-700">
          Traits are passed down through specific patterns. A classic example is **Autosomal Recessive** inheritance
          (e.g., Sickle Cell or Beta Thalassemia), where both parents must be carriers for a child to be affected.
        </p>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h4 className="font-semibold mb-3 text-sm text-center">Interactive Punnett Square (Carrier x Carrier)</h4>
          <div className="grid grid-cols-3 gap-2 text-center text-sm font-mono max-w-sm mx-auto">
            <div className="p-2"></div>
            <div className="p-2 font-bold text-blue-600 bg-blue-50 rounded">A</div>
            <div className="p-2 font-bold text-blue-600 bg-blue-50 rounded">a</div>
            
            <div className="p-2 font-bold text-pink-600 bg-pink-50 rounded flex items-center justify-center">A</div>
            <div className="p-4 bg-green-100 text-green-800 rounded shadow-sm border border-green-200">AA<br/><span className="text-[10px]">Normal (25%)</span></div>
            <div className="p-4 bg-yellow-100 text-yellow-800 rounded shadow-sm border border-yellow-200">Aa<br/><span className="text-[10px]">Carrier (25%)</span></div>
            
            <div className="p-2 font-bold text-pink-600 bg-pink-50 rounded flex items-center justify-center">a</div>
            <div className="p-4 bg-yellow-100 text-yellow-800 rounded shadow-sm border border-yellow-200">Aa<br/><span className="text-[10px]">Carrier (25%)</span></div>
            <div className="p-4 bg-red-100 text-red-800 rounded shadow-sm border border-red-200">aa<br/><span className="text-[10px]">Affected (25%)</span></div>
          </div>
          <p className="text-xs text-center text-slate-500 mt-4">This demonstrates a 25% chance of the child inheriting the disease if both parents are carriers.</p>
        </div>
      </div>
    ),
  },
  {
    id: "mutations",
    icon: Microscope,
    title: "Understanding Mutations",
    color: "#f59e0b",
    type: "article",
    content: (
      <div className="space-y-4">
        <img src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2670&auto=format&fit=crop" alt="Microscope" className="w-full h-40 object-cover rounded-xl" />
        <div>
          <h4 className="font-semibold text-lg">Genetic Typos</h4>
          <p className="text-sm text-slate-700 leading-relaxed mt-2">
            **Mutations** are essentially "typos" in the DNA sequence. While the word "mutation" often sounds scary, 
            many are completely harmless. However, specific mutations can alter how critical proteins function.
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>• **Point Mutations:** A single letter change (e.g., A changing to T). This single typo causes Sickle Cell Disease.</li>
            <li>• **Deletions:** A chunk of DNA goes missing. Common in AZF microdeletions causing male infertility.</li>
          </ul>
        </div>
        <Button variant="outline" className="w-full mt-2" onClick={() => window.open('https://medlineplus.gov/genetics/understanding/mutationsanddisorders/mutations/', '_blank')}>
          Deep Dive: Read more on MedlinePlus
        </Button>
      </div>
    ),
  },
  {
    id: "nepal-diseases",
    icon: HeartPulse,
    title: "Genetic Diseases in Nepal",
    color: "#f97316",
    type: "impact",
    content: (
      <div className="space-y-4">
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <h4 className="font-semibold text-orange-900 mb-2">The Local Context</h4>
          <p className="text-sm text-orange-800 leading-relaxed">
            Nepal's diverse ethnic populations face unique genetic health challenges. Limited screening infrastructure 
            has historically made these diseases "invisible" until symptoms appear.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 border border-slate-200 rounded-lg">
            <h5 className="font-semibold text-sm">Beta Thalassemia</h5>
            <p className="text-xs text-slate-600 mt-1">Highly prevalent across Terai communities. Many are unaware they are carriers.</p>
          </div>
          <div className="p-3 border border-slate-200 rounded-lg">
            <h5 className="font-semibold text-sm">Sickle Cell Disease</h5>
            <p className="text-xs text-slate-600 mt-1">A significant public health concern, particularly in the Tharu community.</p>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-xl mt-4">
          <h5 className="font-semibold text-sm mb-2 opacity-90">Community Impact</h5>
          <p className="text-sm italic">
            "Before prenatal screening, many families in rural Nepal only discovered they carried the trait after losing a child. Early screening changes this narrative entirely."
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "personalized-rec",
    icon: Lightbulb,
    title: "Recommended for You",
    color: "#10b981",
    type: "urgent",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 bg-red-50 text-red-900 p-4 rounded-xl border border-red-200">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <HeartPulse className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Based on your Prediction Lab results:</h4>
            <p className="text-xs mt-1">You showed a potential carrier matching risk for Beta Thalassemia. We highly recommend reviewing the Inheritance Patterns module.</p>
          </div>
        </div>
        <Button className="w-full bg-red-600 hover:bg-red-700 text-white mt-2">
          Review Thalassemia Risks
        </Button>
      </div>
    ),
  }
];

export default function AcademyPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<typeof modules[0] | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const filteredModules = modules.filter(mod => 
    mod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    mod.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      
      {/* Header & Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-olive" /> Genetic Knowledge Hub
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Explore interactive modules, videos, and articles to master genomics.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search modules..." 
            className="pl-9 bg-white border-beige rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredModules.map((mod, i) => {
            const isCompleted = completedModules.includes(mod.id);
            return (
              <motion.div
                key={mod.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className={`relative group bg-white border border-beige rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all flex flex-col h-full
                  ${mod.id === 'personalized-rec' ? 'ring-2 ring-emerald-400 bg-emerald-50/30' : ''}`}
                onClick={() => setSelectedModule(mod)}
              >
                {/* Type Badge */}
                <div className="absolute top-4 right-4">
                  {mod.id === 'personalized-rec' ? (
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider animate-pulse">Urgent</span>
                  ) : (
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{mod.type}</Badge>
                  )}
                </div>

                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: `${mod.color}15` }}>
                  <mod.icon className="h-7 w-7" style={{ color: mod.color }} />
                </div>
                
                <h3 className="font-bold text-lg text-slate-900 mb-2 leading-tight">{mod.title}</h3>
                
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <button 
                    onClick={(e) => toggleComplete(mod.id, e)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isCompleted ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <CheckCircle2 className={`h-4 w-4 ${isCompleted ? 'fill-green-100' : ''}`} />
                    {isCompleted ? 'Completed' : 'Mark Complete'}
                  </button>
                  <span className="text-xs font-bold text-olive opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                    Open <BookMarked className="h-3 w-3 ml-1" />
                  </span>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/dashboard/genoguide')}
        className="fixed bottom-8 right-8 z-40 bg-olive text-white shadow-xl rounded-full px-5 py-3 flex items-center gap-2 font-medium hover:bg-olive/90 transition-colors"
      >
        <MessageCircleQuestion className="h-5 w-5" />
        Got questions? Ask GenoGuide
      </motion.button>

      {/* Module Modal */}
      <Dialog open={!!selectedModule} onOpenChange={(open) => !open && setSelectedModule(null)}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-white">
          {selectedModule && (
            <>
              {/* Modal Header */}
              <div className="p-6 pb-4 border-b border-beige flex items-center gap-4" style={{ backgroundColor: `${selectedModule.color}08` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${selectedModule.color}15` }}>
                  <selectedModule.icon className="h-6 w-6" style={{ color: selectedModule.color }} />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">{selectedModule.title}</DialogTitle>
                  <DialogDescription className="text-sm mt-1 uppercase tracking-wider font-semibold" style={{ color: selectedModule.color }}>
                    {selectedModule.type} Module
                  </DialogDescription>
                </div>
              </div>
              
              {/* Modal Content */}
              <ScrollArea className="max-h-[60vh] p-6">
                {selectedModule.content}
              </ScrollArea>

              {/* Modal Footer/Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center rounded-b-xl">
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 border-dashed">
                  <FileText className="h-4 w-4 mr-2" /> Download Cheat Sheet (PDF)
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedModule(null)}>Close</Button>
                  <Button 
                    className="bg-olive text-white hover:bg-olive/90"
                    onClick={() => {
                      if (!completedModules.includes(selectedModule.id)) {
                        setCompletedModules(p => [...p, selectedModule.id]);
                      }
                      setSelectedModule(null);
                    }}
                  >
                    Complete Module
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

