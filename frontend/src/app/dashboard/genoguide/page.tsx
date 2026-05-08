"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User, Sparkles, Dna, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const knowledgeBase: Record<string, string> = {
  "beta thalassemia": "**Beta Thalassemia** is an autosomal recessive blood disorder caused by mutations in the **HBB gene** on chromosome 11.\n\n**Inheritance:**\n- Both parents must be carriers (Aa) for a child to be affected\n- 25% chance affected, 50% carrier, 25% healthy\n\n**Symptoms:** Severe anemia, fatigue, bone deformities, enlarged spleen\n\n**Nepal Context:** Common in South Asian populations. Many carriers are undiagnosed due to limited genetic screening access.\n\n**Treatment:** Blood transfusions, iron chelation therapy, bone marrow transplant (potential cure)",
  "sickle cell": "**Sickle Cell Disease** is caused by a specific mutation (Glu6Val) in the **HBB gene**.\n\n**Inheritance:** Autosomal recessive\n- AS genotype = Sickle cell trait (carrier)\n- SS genotype = Sickle cell disease\n\n**Nepal Context:** Particularly prevalent in the **Tharu population** of Nepal's Terai region.\n\n**Symptoms:** Pain crises, anemia, organ damage, infections\n\n**Treatment:** Hydroxyurea, blood transfusions, bone marrow transplant",
  "g6pd": "**G6PD Deficiency** is an **X-linked recessive** enzyme deficiency affecting the **G6PD gene**.\n\n**Inheritance:**\n- Mothers carry the gene on their X chromosome\n- Sons have 50% chance of being affected if mother is a carrier\n- Daughters are typically carriers\n\n**Triggers:** Fava beans, certain medications (antimalarials), infections\n\n**Symptoms:** Hemolytic anemia episodes, jaundice, dark urine\n\n**Prevention:** Avoid known trigger foods and medications",
  "y chromosome": "**Y-Chromosome Infertility** involves microdeletions in the **AZF region** (AZFa, AZFb, AZFc) of the Y chromosome.\n\n**Inheritance:** Y-linked — passed from father to son\n\n**Types:**\n- AZFa deletion: Sertoli cell-only syndrome (most severe)\n- AZFb deletion: Spermatogenic arrest\n- AZFc deletion: Hypospermatogenesis (most common, least severe)\n\n**Nepal Context:** Male infertility is under-discussed; genetic testing is limited\n\n**Treatment:** IVF/ICSI, genetic counseling",
  "carrier": "**Carrier Status** means an individual has one normal and one mutated copy of a gene.\n\nCarriers typically show **no symptoms** but can pass the mutation to their children.\n\n**Key points:**\n- For autosomal recessive: both parents must be carriers for affected child\n- For X-linked: mother carriers pass to 50% of sons\n- **Carrier screening** is crucial, especially in populations with high consanguinity\n\n**In Nepal:** Many people unknowingly carry recessive disorders due to limited genetic screening infrastructure.",
  "punnett": "A **Punnett Square** is a diagram used to predict the genotypes of offspring.\n\n**How it works:**\n1. Write parent alleles on top and side\n2. Cross each combination\n3. Count outcomes for probabilities\n\n**Example (Both parents carriers Aa):**\n```\n     A    a\nA  | AA | Aa |\na  | Aa | aa |\n```\nResult: 25% AA (healthy), 50% Aa (carrier), 25% aa (affected)",
  "immunity": "The **Immunity Score** in GenoVault is calculated based on the combined genetic disease risks.\n\n**Formula:**\n- Joint probability of all disease risks is computed\n- Weighted by severity (severe diseases have higher impact)\n- Score = 100 × (1 - weighted_risk)\n\n**Interpretation:**\n- 80-100: Strong genetic immunity\n- 50-79: Moderate — some vulnerabilities\n- 0-49: Elevated risk — counseling recommended",
  "blood group": "**Blood Group Prediction** uses the ABO and Rh systems.\n\n**ABO System:**\n- 3 alleles: Iᴬ, Iᴮ, i\n- Iᴬ and Iᴮ are codominant; i is recessive\n- Results in types: A, B, AB, O\n\n**Rh Factor:**\n- D allele (Rh+) is dominant over d (Rh−)\n- DD or Dd = Rh+, dd = Rh−\n\n**Combined:** 8 possible blood types (A+, A−, B+, B−, AB+, AB−, O+, O−)",
};

const suggestions = [
  "What is Beta Thalassemia?",
  "How does carrier screening work?",
  "Explain the Punnett Square",
  "What is G6PD Deficiency?",
  "How is the immunity score calculated?",
  "Tell me about Sickle Cell in Nepal",
  "How is blood group inherited?",
  "What is Y-chromosome infertility?",
];

function generateResponse(question: string): string {
  const q = question.toLowerCase();
  for (const [key, response] of Object.entries(knowledgeBase)) {
    if (q.includes(key)) return response;
  }
  if (q.includes("hello") || q.includes("hi")) {
    return "Hello! I'm **GenoGuide**, your genetic counselor assistant. 🧬\n\nI can help you understand:\n- Genetic diseases (Beta Thalassemia, Sickle Cell, G6PD, Y-Chromosome conditions)\n- Inheritance patterns and Punnett squares\n- Carrier screening and risk assessment\n- Blood group inheritance\n- Immunity scoring\n\nWhat would you like to know?";
  }
  if (q.includes("nepal") || q.includes("region")) {
    return "**Genetic Diseases in Nepal:**\n\n1. **Beta Thalassemia** — Common across multiple ethnic groups, limited screening\n2. **Sickle Cell Disease** — Prevalent in Tharu communities of Terai\n3. **G6PD Deficiency** — Found in South Asian populations\n4. **Y-Chromosome conditions** — Under-diagnosed due to social stigma\n\nNepal faces challenges in genetic screening access, making tools like GenoVault critical for early carrier detection and family planning.";
  }
  return "That's a great question! While I have detailed knowledge about our four focus diseases (Beta Thalassemia, Sickle Cell, G6PD Deficiency, and Y-Chromosome Infertility), I'd be happy to discuss related genetic concepts.\n\nTry asking about:\n- Specific diseases and their inheritance\n- Carrier screening importance\n- How Punnett squares work\n- Blood group prediction\n- Immunity scoring methodology";
}

export default function GenoGuidePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to **GenoGuide**! 🧬\n\nI'm your AI genetic counselor. I can help you understand genetic diseases, inheritance patterns, carrier risks, and more.\n\nChoose a suggested topic below or type your question.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"general" | "specific">("general");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const response = generateResponse(text);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="shrink-0 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bot className="h-6 w-6 text-gene-amber" /> GenoGuide
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">AI-Powered Genetic Counselor</p>
          </div>
          <Tabs value={mode} onValueChange={(v) => setMode(v as "general" | "specific")}>
            <TabsList className="bg-muted/30 border border-border/50">
              <TabsTrigger value="general" className="data-[state=active]:bg-gene-emerald/10 data-[state=active]:text-gene-emerald text-xs">
                <Sparkles className="h-3 w-3 mr-1" /> General
              </TabsTrigger>
              <TabsTrigger value="specific" className="data-[state=active]:bg-gene-amber/10 data-[state=active]:text-gene-amber text-xs">
                <Dna className="h-3 w-3 mr-1" /> Get Specific
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 gene-card rounded-2xl flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4 sm:p-6" ref={scrollRef}>
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gene-amber/10 border border-gene-amber/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-gene-amber" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                  }`}>
                    <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>')
                        .replace(/```([\s\S]*?)```/g, '<pre class="bg-background/50 rounded p-2 mt-2 mb-2 text-xs font-mono overflow-x-auto">$1</pre>')
                    }} />
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gene-emerald/10 border border-gene-emerald/20 flex items-center justify-center shrink-0 mt-1">
                      <User className="h-4 w-4 text-gene-emerald" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gene-amber/10 border border-gene-amber/20 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-gene-amber" />
                </div>
                <div className="chat-bubble-ai rounded-2xl px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {suggestions.slice(0, 4).map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)}
                className="px-3 py-1.5 rounded-full text-xs border border-gene-emerald/20 text-gene-emerald hover:bg-gene-emerald/5 transition-all">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border/30">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder={mode === "general" ? "Ask about genetics..." : "Ask about a specific gene or disease..."}
              className="min-h-[44px] max-h-[120px] resize-none bg-background/50 border-border/50 focus:border-gene-emerald/50"
              rows={1}
            />
            <Button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
              className="h-[44px] w-[44px] shrink-0 bg-gene-emerald hover:bg-gene-emerald/90 text-gene-deep p-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
