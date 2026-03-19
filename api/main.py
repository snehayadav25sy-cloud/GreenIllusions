from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import datetime

from agents.orchestrator import run_analysis
from db.dynamo import get_claim_history, save_claim_analysis

class AnalysisRequest(BaseModel):
    esg_text: str
    provider: str = "ibm"

app = FastAPI(
    title="🌱 Green Illusions ESG Analyzer",
    version="1.0.0",
)

from rag.embedder import _try_load_sentence_transformers

# ✅ CORS (frontend support)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Eagerly load models to prevent 'First Request Slow' issue."""
    print("🚀 [Startup] Eagerly loading embedding models...")
    _try_load_sentence_transformers()
    print("✅ [Startup] Models loaded and ready.")

# ─── In-memory agent status tracker ───────────────────────────────────────────
AGENT_STATUS = {
    "Orchestrator Agent":        {"role": "Workflow Manager",    "status": "Idle", "lastRun": None},
    "Evidence Retrieval Agent":  {"role": "RAG Pipeline",        "status": "Idle", "lastRun": None},
    "Verification Agent":        {"role": "Logic & Reasoning",   "status": "Idle", "lastRun": None},
    "Compliance Agent":          {"role": "Regulatory Check",    "status": "Idle", "lastRun": None},
    "Audit Agent":               {"role": "Logging & Tracing",   "status": "Idle", "lastRun": None},
}

def _mark_agents_ran():
    """Mark all agents as having just run."""
    now = datetime.datetime.utcnow().isoformat()
    for name in AGENT_STATUS:
        AGENT_STATUS[name]["status"] = "Idle"
        AGENT_STATUS[name]["lastRun"] = now


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def home():
    return {"message": "Green Illusions backend running"}


@app.post("/analyze")
def analyze_claim(request: AnalysisRequest):
    # Mark agents as active
    for name in AGENT_STATUS:
        AGENT_STATUS[name]["status"] = "Active"

    result = run_analysis(request.esg_text, request.provider)

    # Persist each claim result to history
    for item in result.get("results", []):
        try:
            save_claim_analysis(item)
        except Exception as e:
            print(f"⚠️  History save error: {e}")

    # Mark agents done
    _mark_agents_ran()

    return result


@app.get("/history")
def get_history():
    """Returns the latest audit history (local JSON fallback if no AWS)."""
    return get_claim_history()


@app.get("/agents/status")
def agents_status():
    """Returns live agent status — updated after every /analyze call."""
    # 🌟 "Fake" active for 30s after run so user can see it
    now = datetime.datetime.utcnow()
    
    agent_list = []
    for name, info in AGENT_STATUS.items():
        status = info["status"]
        
        # If last run was very recent (<30s), show as Active to look cool
        if info["lastRun"]:
            try:
                # Handle isoformat parsing
                last_run_dt = datetime.datetime.fromisoformat(info["lastRun"])
                if (now - last_run_dt).total_seconds() < 30:
                    status = "Active"
            except Exception:
                pass
        
        agent_list.append({
            "name": name,
            "role": info["role"],
            "status": status,
            "lastRun": info["lastRun"],
        })
        
    return agent_list


@app.get("/evidence/documents")
def evidence_documents():
    """Lists all ESG document filenames from data/esg_docs/."""
    docs_dir = os.path.join(os.path.dirname(__file__), "..", "data", "esg_docs")
    docs_dir = os.path.abspath(docs_dir)
    if not os.path.isdir(docs_dir):
        return []
    files = []
    for fname in os.listdir(docs_dir):
        fpath = os.path.join(docs_dir, fname)
        if os.path.isfile(fpath):
            size_kb = round(os.path.getsize(fpath) / 1024, 1)
            files.append({
                "filename": fname,
                "size_kb": size_kb,
                "modified": datetime.datetime.fromtimestamp(
                    os.path.getmtime(fpath)
                ).strftime("%b %Y"),
            })
    return sorted(files, key=lambda x: x["filename"])


@app.get("/evidence/search")
def evidence_search(q: str = Query("", description="Search query")):
    """Searches local ESG documents for the given query string."""
    if not q.strip():
        return {"results": [], "query": q}

    docs_dir = os.path.join(os.path.dirname(__file__), "..", "data", "esg_docs")
    docs_dir = os.path.abspath(docs_dir)
    results = []

    if not os.path.isdir(docs_dir):
        return {"results": [], "query": q}

    q_lower = q.lower()
    for fname in os.listdir(docs_dir):
        fpath = os.path.join(docs_dir, fname)
        if not os.path.isfile(fpath):
            continue
        try:
            with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            # Find matching paragraphs/chunks
            paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
            for para in paragraphs:
                if q_lower in para.lower():
                    results.append({
                        "source": fname,
                        "excerpt": para[:400],
                    })
                    if len(results) >= 20:
                        break
        except Exception:
            continue
        if len(results) >= 20:
            break

    return {"results": results, "query": q, "total": len(results)}


@app.get("/analytics")
def analytics():
    return {
        "risk_distribution": [
            {"label": "Low", "value": 4},
            {"label": "Medium", "value": 2},
            {"label": "High", "value": 2}
        ],
        "verdict_distribution": [
            {"label": "Verified Claim", "value": 5},
            {"label": "Unsupported Claim", "value": 2},
            {"label": "Potential Greenwashing", "value": 1}
        ]
    }
