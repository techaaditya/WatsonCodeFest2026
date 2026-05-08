# GenoVault — Genomic Disease Prediction Platform

> **Watson CodeFest 2026** | Full-Stack Genomic Architecture of Disease Platform

## Product & Feature Naming

| Item | Proposed Name | Rationale |
|---|---|---|
| **Product Name** | **GenoVault** | "Geno" (genes/genomics) + "Vault" (secure, trusted repository of genetic insights). Premium, memorable, biotech-startup feel. |
| **Tagline** | *"Decode Your Legacy"* | Emotional, scientific, aspirational. |
| **Dashboard (Main)** | **Prediction Lab** | Core feature — feels like a lab environment. |
| **Chromosome Visualization** | **ChromoLens** | "Chromo" (chromosome) + "Lens" (visualize/focus). |
| **AI Genetic Counselor** | **GenoGuide** | AI assistant that guides users through genetic insights. |
| **Education Content** | **Gene Academy** | Learning hub for genomics basics. |
| **Community Risk Storyboard** | **Heritage Mapper** | Maps regional/ethnic disease prevalence. |
| **Profile** | **My Profile** | Clean, standard. |

### Sidebar Navigation Structure
```
🧬 Prediction Lab        (Dashboard — main feature)
🔬 ChromoLens            (Chromosome Visualization)
🤖 GenoGuide             (AI Genetic Counselor)
📚 Gene Academy          (Education)
🗺️ Heritage Mapper       (Community Risk Storyboard)
👤 My Profile            (User profile)
```

---

## Proposed Changes

### Phase 1 — Project Scaffolding & Configuration

#### [NEW] Frontend (Next.js + Tailwind + shadcn/ui)

Initialize the Next.js app with TypeScript, Tailwind CSS, and App Router:
```
frontend/
├── app/
│   ├── layout.tsx              # Root layout with fonts, metadata, providers
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles, DNA-themed design tokens
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   └── (dashboard)/
│       ├── layout.tsx          # Dashboard shell with sidebar
│       ├── page.tsx            # Prediction Lab (home)
│       ├── chromolens/page.tsx
│       ├── genoguide/page.tsx
│       ├── academy/page.tsx
│       ├── heritage/page.tsx
│       └── profile/page.tsx
├── components/
│   ├── ui/                     # shadcn/ui components (button, card, dialog, etc.)
│   ├── landing/                # Landing page sections
│   ├── dashboard/              # Dashboard-specific components
│   ├── prediction/             # Prediction engine UI components
│   ├── chromolens/             # Chromosome visualization components
│   ├── genoguide/              # AI counselor chat components
│   ├── academy/                # Education content components
│   ├── heritage/               # Heritage mapper components
│   └── shared/                 # Shared components (navbar, sidebar, loader, etc.)
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client
│   │   └── middleware.ts       # Auth middleware helper
│   └── utils.ts                # Utility functions (cn, etc.)
├── hooks/                      # Custom React hooks
├── services/                   # API service layer
│   └── api.ts                  # Centralized API client for FastAPI
├── types/                      # TypeScript type definitions
│   ├── genetics.ts             # Genetic data types
│   └── user.ts                 # User-related types
├── utils/
│   └── genetics/               # Client-side genetic calculation utilities
├── middleware.ts                # Next.js middleware for route protection
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

#### [NEW] Backend (FastAPI)

```
backend/
├── app/
│   ├── main.py                 # FastAPI app entry point, CORS, lifespan
│   ├── config/
│   │   └── settings.py         # Environment config via pydantic-settings
│   ├── auth/
│   │   ├── dependencies.py     # Supabase JWT verification dependency
│   │   └── utils.py            # Auth helper functions
│   ├── routes/
│   │   ├── prediction.py       # Genetic prediction endpoints
│   │   ├── chromolens.py       # Chromosome data endpoints
│   │   ├── genoguide.py        # AI counselor endpoints
│   │   ├── heritage.py         # Community risk endpoints
│   │   └── user.py             # User profile endpoints
│   ├── services/
│   │   ├── genetics/
│   │   │   ├── engine.py       # Core genetic prediction engine
│   │   │   ├── diseases.py     # Disease database & configurations
│   │   │   ├── punnett.py      # Punnett square calculations
│   │   │   ├── risk_scoring.py # Monogenic risk scoring
│   │   │   ├── blood_group.py  # Blood group prediction
│   │   │   ├── immunity.py     # Immunity scoring
│   │   │   ├── carrier.py      # Carrier status prediction
│   │   │   ├── sex_linked.py   # Sex-linked disease prediction
│   │   │   ├── mutation.py     # Mutation detection logic
│   │   │   └── severity.py     # Disease severity estimation
│   │   ├── ai_counselor.py     # GenoGuide AI service
│   │   └── heritage.py         # Heritage/regional disease service
│   ├── models/
│   │   ├── prediction.py       # Pydantic models for predictions
│   │   ├── user.py             # User models
│   │   └── heritage.py         # Heritage/region models
│   └── utils/
│       └── constants.py        # Gene sequences, disease constants
├── requirements.txt
├── .env.example
└── README.md
```

---

### Phase 2 — Landing Page & Authentication

#### [NEW] Landing Page (`app/page.tsx`)
- **Hero Section**: Animated DNA helix background (CSS/canvas), product name "GenoVault", tagline "Decode Your Legacy", CTA buttons (Get Started / Learn More).
- **About Section**: What GenoVault does — brief product description with animated gene motifs.
- **How It Works**: 3-step visual flow (Input Genes → AI Analysis → Get Predictions) with animated cards.
- **Features Showcase**: Grid of feature cards (Prediction Lab, ChromoLens, GenoGuide, Gene Academy, Heritage Mapper) with hover animations.
- **Contact/Footer**: Team info, links.
- **Navbar**: Logo, nav links (Home, About, How It Works, Contact), Login/Sign Up buttons at top right.

#### [NEW] Auth Pages (`app/(auth)/login/page.tsx`, `signup/page.tsx`)
- Beautiful genomic-themed auth forms.
- Email/password fields.
- Google OAuth button.
- Animated DNA strand background.
- Form validation with error states.
- Supabase Auth integration on the client side.

#### [NEW] Auth Middleware (`middleware.ts`)
- Protect all `/dashboard/*` routes.
- Redirect unauthenticated users to `/login`.
- Redirect authenticated users away from `/login` and `/signup`.

#### [NEW] Backend Auth (`auth/dependencies.py`)
- `get_current_user` dependency that verifies Supabase JWT.
- Extracts user ID and email from token claims.

---

### Phase 3 — Dashboard Shell & Navigation

#### [NEW] Dashboard Layout (`app/(dashboard)/layout.tsx`)
- Left sidebar with navigation links (Prediction Lab, ChromoLens, GenoGuide, Gene Academy, Heritage Mapper).
- Top header bar with user avatar/profile dropdown, notifications icon.
- Collapsible sidebar for mobile.
- Active route highlighting.
- Genomic-themed sidebar design with subtle DNA patterns.

#### [NEW] Prediction Lab Home (`app/(dashboard)/page.tsx`)
- "Hello, {username}!" greeting with current date.
- Two prominent cards:
  1. **Dual Parent Analysis** — Card with two human silhouette shadows, description, "Start Analysis" button.
  2. **Single Parent Analysis** — Card with one human silhouette shadow, description, "Start Analysis" button.
- Below the cards: Dashboard summary panels showing:
  - Recent predictions (if any).
  - Quick stats.
  - Getting started guide for new users.

---

### Phase 4 — Core Genetic Prediction Engine (THE MAIN FEATURE)

This is the most critical phase. The prediction engine handles all genetic calculations.

#### [NEW] Backend: Genetic Engine (`services/genetics/engine.py`)

**Core Algorithm Flow:**
1. **Input Processing**: Accept gene sequences (as simplified genotype strings, e.g., `Aa`, `AS`, `XX'`).
2. **Allele Identification**: Parse parent genotypes for each disease gene.
3. **Punnett Square Crossing**: Generate all possible offspring genotype combinations.
4. **Probability Calculation**: Calculate percentage for each outcome (affected, carrier, healthy).
5. **Risk Scoring**: Generate Monogenic Risk Score (MRS) as a composite metric.

**Disease Database** (`services/genetics/diseases.py`):

```python
DISEASE_DATABASE = {
    "beta_thalassemia": {
        "name": "Beta Thalassemia",
        "gene": "HBB",
        "chromosome": 11,
        "position": "11p15.4",
        "inheritance": "autosomal_recessive",
        "alleles": {"normal": "A", "mutant": "a"},
        "genotype_phenotype": {
            "AA": {"status": "healthy", "severity": "none"},
            "Aa": {"status": "carrier", "severity": "mild"},
            "aA": {"status": "carrier", "severity": "mild"},
            "aa": {"status": "affected", "severity": "severe"}
        },
        "nepal_prevalence": 0.03,
        "description": "...",
        "symptoms": [...],
        "treatment": [...]
    },
    "sickle_cell": { ... },  # HBB gene, autosomal recessive
    "g6pd_deficiency": { ... },  # G6PD gene, X-linked recessive
    "y_chromosome_infertility": { ... }  # AZF region, Y-linked
}
```

**Punnett Square** (`services/genetics/punnett.py`):
```python
def punnett_square(parent1_genotype: str, parent2_genotype: str) -> dict:
    """
    For autosomal: standard 2x2 Punnett
    For X-linked: consider sex chromosomes
    For Y-linked: direct father-to-son inheritance
    Returns: {genotype: probability}
    """
```

**Blood Group Prediction** (`services/genetics/blood_group.py`):
- ABO system: IA, IB, i alleles → 3x3 Punnett
- Rh factor: Rh+/Rh- (D/d alleles) → separate 2x2 Punnett
- Combined output: e.g., "A+", "O-", "AB+"

**Immunity Score** (`services/genetics/immunity.py`):
```python
def calculate_immunity_score(disease_probabilities: dict) -> float:
    """
    Joint probability of all disease risks.
    High joint disease probability → Low immunity score (0-100).
    Score = 100 * (1 - joint_probability)
    Weighted by disease severity.
    """
```

**Carrier Status** (`services/genetics/carrier.py`):
- For each disease, determine if offspring is carrier.
- Output: probability of being a carrier for each disease.

**Sex-Linked Prediction** (`services/genetics/sex_linked.py`):
- Separate predictions for male vs female child.
- X-linked: Mother carrier × Father healthy → sons 50% affected, daughters 50% carrier.
- Y-linked: Father affected → all sons affected, daughters unaffected.

**Mutation Detection** (`services/genetics/mutation.py`):
- Compare input sequence against known normal/mutant sequences.
- Identify specific mutations (e.g., Glu6Val for sickle cell).
- Output: mutation type, location, clinical significance.

**Severity Prediction** (`services/genetics/severity.py`):
- Based on genotype (homozygous vs heterozygous).
- Mutation type classification.
- Output: mild/moderate/severe with explanation.

#### [NEW] Backend: Prediction Routes (`routes/prediction.py`)

```
POST /api/prediction/dual-parent    # Both parents' genes
POST /api/prediction/single-parent  # One parent's genes
GET  /api/prediction/diseases       # List available diseases
GET  /api/prediction/{id}           # Get a specific prediction result
GET  /api/prediction/history        # User's prediction history
```

#### [NEW] Frontend: Prediction Flow Components

**Input Portal** (`components/prediction/`):
- `DualParentInput.tsx` — Two human silhouette shadows side by side, each with gene input fields for all 4 diseases.
- `SingleParentInput.tsx` — One human silhouette shadow with gene input fields.
- `GeneInputForm.tsx` — Individual gene input component with:
  - Dropdown for disease selection.
  - Genotype input (simplified: select alleles like A/a, or enter sequence).
  - Validation and helper text.
- `PredictButton.tsx` — Animated "Predict" button with DNA helix loading animation.

**Results Display** (`components/prediction/`):
- `PredictionResults.tsx` — Main results container.
- `PunnettSquareVisual.tsx` — Interactive Punnett square visualization.
- `DiseaseRiskTable.tsx` — Tabular disease risk display with probability bars.
- `BloodGroupCard.tsx` — Blood group prediction with ABO + Rh visual.
- `ImmunityScoreGauge.tsx` — Circular gauge showing immunity score (0-100).
- `CarrierStatusCard.tsx` — Carrier probability per disease.
- `SexLinkedPrediction.tsx` — Split male/female prediction view.
- `MutationReport.tsx` — Detected mutations with chromosome location.
- `SeverityIndicator.tsx` — Mild/Moderate/Severe visual indicator.
- `RiskScoreChart.tsx` — Composite risk score visualization.

---

### Phase 5 — ChromoLens (Chromosome Visualization)

#### [NEW] Frontend: ChromoLens Page (`app/(dashboard)/chromolens/page.tsx`)
- Interactive chromosome browser.
- Select a chromosome (1-22, X, Y) from a karyotype view.
- Zoom into specific gene regions.
- Highlight mutation locations from prediction results.
- Gene annotation popups with disease information.
- Color-coded: normal (green), carrier (yellow), affected (red).

#### [NEW] Components (`components/chromolens/`):
- `KaryotypeView.tsx` — All 23 chromosome pairs in standard karyotype layout.
- `ChromosomeDetail.tsx` — Zoomed view of a single chromosome with gene bands.
- `GeneHighlight.tsx` — Highlighted gene region with mutation marker.
- `ChromosomeTooltip.tsx` — Info popup for gene regions.

#### [NEW] Backend: ChromoLens Routes (`routes/chromolens.py`)
```
GET /api/chromolens/chromosomes           # List all chromosomes with gene data
GET /api/chromolens/chromosome/{number}   # Specific chromosome details
GET /api/chromolens/gene/{gene_name}      # Gene location and details
```

---

### Phase 6 — GenoGuide (AI Genetic Counselor)

#### [NEW] Frontend: GenoGuide Page (`app/(dashboard)/genoguide/page.tsx`)
- Chat interface styled like a premium AI assistant.
- Two modes:
  1. **General Mode** — Ask any genetics question, get AI-powered answers.
  2. **Get Specific Mode** — Focus on a specific gene/disease for the 4 monogenic diseases. Input environmental parameters, family history (close relatives affected).
- Message bubbles with markdown rendering.
- Suggested questions/prompts.
- Typing indicator animation.

#### [NEW] Components (`components/genoguide/`):
- `ChatInterface.tsx` — Main chat container.
- `MessageBubble.tsx` — Individual message with avatar.
- `ModeSelector.tsx` — Toggle between General and Get Specific modes.
- `SpecificGeneForm.tsx` — Form for Get Specific mode (gene selection, environmental params, family history).
- `SuggestedPrompts.tsx` — Quick-access question chips.

#### [NEW] Backend: GenoGuide Service (`services/ai_counselor.py`)
- Uses a rule-based + template system for now (prepared for LLM integration later).
- Disease-specific knowledge base for the 4 monogenic diseases.
- Environmental factor integration (diet, altitude, climate).
- Family history risk adjustment algorithm.
- Structured response generation.

#### [NEW] Backend: GenoGuide Routes (`routes/genoguide.py`)
```
POST /api/genoguide/chat              # Send message, get response
POST /api/genoguide/specific          # Get Specific mode query
GET  /api/genoguide/suggestions       # Get suggested prompts
```

---

### Phase 7 — Gene Academy & Heritage Mapper

#### [NEW] Gene Academy Page (`app/(dashboard)/academy/page.tsx`)
- Beautiful educational content organized in modules:
  1. **What are Genes?** — DNA basics with animated visuals.
  2. **Inheritance Patterns** — Autosomal dominant/recessive, X-linked, Y-linked.
  3. **Understanding Mutations** — Types of mutations and their effects.
  4. **Genetic Diseases in Nepal** — Localized content about the 4 diseases.
  5. **Reading Your Results** — How to interpret GenoVault predictions.
- Interactive diagrams, expandable sections, progress tracking.

#### [NEW] Heritage Mapper Page (`app/(dashboard)/heritage/page.tsx`)
- **Form**: Select region/ethnicity within Nepal (Province, District, Ethnic group).
- **Results**: List of prevalent diseases in that region with:
  - Disease name and description.
  - Why it's relevant to that region.
  - Prevalence statistics.
  - Recommended screening.
  - Risk factors (environmental + genetic).
- Visually rich cards with regional context.

#### [NEW] Backend: Heritage Service (`services/heritage.py`)
- Nepal-specific disease prevalence data by region/ethnicity.
- Disease-region mapping.
- Environmental risk factors by geography.

#### [NEW] Backend: Heritage Routes (`routes/heritage.py`)
```
POST /api/heritage/risk-profile       # Get regional disease risk
GET  /api/heritage/regions            # List available regions
GET  /api/heritage/ethnicities        # List ethnic groups
```

---

### Phase 8 — User Profile & Database Schema

#### [NEW] Profile Page (`app/(dashboard)/profile/page.tsx`)
- User avatar with upload capability.
- Display name, email, phone.
- Prediction history list.
- Account settings.
- Edit profile functionality.

#### [NEW] Supabase Database Schema

```sql
-- Users (extended profile, synced with Supabase Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    region TEXT,
    ethnicity TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Predictions
CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    prediction_type TEXT NOT NULL, -- 'dual_parent' or 'single_parent'
    parent1_genotypes JSONB NOT NULL,
    parent2_genotypes JSONB,
    results JSONB NOT NULL,
    disease_risks JSONB,
    blood_group JSONB,
    immunity_score FLOAT,
    carrier_status JSONB,
    sex_linked_risks JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Chat history for GenoGuide
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    role TEXT NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    mode TEXT, -- 'general' or 'specific'
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Heritage lookups
CREATE TABLE heritage_lookups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    region TEXT,
    ethnicity TEXT,
    results JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## User Review Required

> [!IMPORTANT]
> **Product Name**: I'm proposing **GenoVault** with tagline *"Decode Your Legacy"*. Please confirm or suggest alternatives.

> [!IMPORTANT]
> **Feature Names**: The sidebar navigation uses: **Prediction Lab**, **ChromoLens**, **GenoGuide**, **Gene Academy**, **Heritage Mapper**. Please confirm these work for you.

> [!IMPORTANT]
> **Supabase Credentials**: I'll need your Supabase project URL and anon key to configure authentication and database. Please provide these or I'll use placeholder `.env.example` values.

> [!WARNING]
> **AI Counselor (GenoGuide)**: For the hackathon, I'll implement a **rule-based + template** system with comprehensive genetics knowledge built in. This avoids needing an external LLM API key. The architecture will be ready for LLM integration later. Is this acceptable, or do you have an OpenAI/Gemini API key available?

> [!IMPORTANT]
> **Gene Input Simplification**: For hackathon demo purposes, users will select genotypes via dropdowns (e.g., "Carrier - Aa", "Affected - aa", "Healthy - AA") rather than raw DNA sequence input. The UI will show the scientific notation but make it user-friendly. Is this approach acceptable?

## Open Questions

1. **Do you have Supabase project credentials ready**, or should I create the project with placeholder env values for now?
2. **For the AI Counselor**, do you want me to integrate a real LLM API (OpenAI/Gemini), or is the rule-based system sufficient for the hackathon demo?
3. **Color theme preference**: I'm planning a deep navy/dark teal primary palette with cyan/emerald accents and subtle DNA-helix patterns. The design will be primarily dark mode with scientific/biotech aesthetics. Does this match your vision?
4. **Team information**: What team name and member names should appear on the landing page?

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify frontend compiles without errors.
- Run `uvicorn app.main:app --reload` to verify backend starts correctly.
- Test all prediction endpoints with sample genotype data.
- Verify auth flow: signup → login → access dashboard → logout.
- Test prediction calculations against known Punnett square results.

### Manual Verification
- Open landing page in browser and verify all sections render correctly.
- Complete full auth flow (signup, login, logout).
- Run dual-parent and single-parent predictions with test data.
- Verify all dashboard feature pages load correctly.
- Test ChromoLens chromosome visualization.
- Test GenoGuide chat interface.
- Verify mobile responsiveness on all pages.
- Browser recording of complete user flow.

---

## Implementation Order

| Phase | What | Priority |
|-------|------|----------|
| 1 | Project scaffolding (Next.js + FastAPI + folder structure) | 🔴 Critical |
| 2 | Landing page + Auth (Supabase) | 🔴 Critical |
| 3 | Dashboard shell + Sidebar navigation | 🔴 Critical |
| 4 | **Core Prediction Engine** (backend + frontend) | 🔴 Critical |
| 5 | ChromoLens chromosome visualization | 🟡 High |
| 6 | GenoGuide AI counselor | 🟡 High |
| 7 | Gene Academy + Heritage Mapper | 🟢 Medium |
| 8 | Profile + Database schema + Polish | 🟢 Medium |
