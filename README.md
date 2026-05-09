# DNADristi

**DNADristi** (formerly GenoVault) is an advanced genomic disease prediction platform designed to decode your legacy. Built for the **Watson CodeFest 2026** by team **GeneForge**, this platform uses probabilistic models and Monogenic Risk Scores to predict inherited disease risks, carrier status, and genetic traits, specifically tailored for Nepal's genomic future.

---

## 🧬 Key Modules & Features

1. **Prediction Lab**
   Comprehensive genetic analysis available in "Parent Compatible" or "Individual" modes. It features dynamic Punnett square visualization, disease risk scoring, blood group prediction, and immunity assessments.
2. **Gene Analysis**
   An interactive chromosome browser that provides a karyotype view, highlights specific gene regions, and maps mutation locations across all 23 chromosome pairs.
3. **Geneie**
   Your personal AI-powered genetic counselor. Geneie offers general Q&A and clinical explanations to help users understand complex inheritance patterns and carrier risks, powered by a local medical LLM.
4. **Community Risks**
   A heritage mapping tool that profiles community risk based on specific regions and ethnic groups in Nepal, displaying prevalent diseases and screening recommendations.
5. **Gene Academy**
   Bite-sized educational modules covering DNA basics, inheritance patterns, mutations, and how to interpret genetic predictions.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14+ (App Router), React, Tailwind CSS, Framer Motion, `lucide-react`.
- **Backend**: FastAPI, Python, PyPDF2.
- **Database & Authentication**: Supabase (PostgreSQL, Row-Level Security, OAuth, and server-side cookies).
- **AI / ML**: Local LLM integration using Ollama (`medgemma1.5:4b`).
- **Data Tracking**: Git Large File Storage (LFS) for heavy ML datasets.

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (3.10+)
- [Supabase](https://supabase.com/) Account & Project
- [Ollama](https://ollama.com/) (with `medgemma1.5:4b` pulled locally for Geneie)
- [Git LFS](https://git-lfs.com/)

### 1. Clone the Repository & Pull LFS Data
```bash
git clone https://github.com/techaaditya/WatsonCodeFest2026.git
cd WatsonCodeFest2026
git lfs pull
```

### 2. Database Setup (Supabase)
1. Go to your Supabase project dashboard.
2. Navigate to the **SQL Editor**.
3. Copy the contents of `supabase_schema.sql` located in the root of this repository.
4. Paste and run the SQL script to create the necessary `profiles` and `analysis_results` tables with automatic triggers and Row-Level Security.
5. Enable **Google** in the Authentication > Providers menu.

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend` directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```
Run the development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:3000`.

### 4. Backend Setup
Open a new terminal and navigate to the backend folder:
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
The FastAPI backend will be available at `http://localhost:8000`.

---

## 👥 The Team
**Built by GeneForge**
Pioneering accessible genomic tools for Nepal at Watson CodeFest 2026.
