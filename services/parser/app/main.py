import os
import httpx
from fastapi import FastAPI, File, HTTPException, UploadFile

app = FastAPI(title="PaperMaxing Parser", version="0.1.0")
GROBID_URL = os.getenv("GROBID_URL", "http://localhost:8070").rstrip("/")

@app.get("/health")
async def health():
    return {"ok": True, "service": "papermaxing-parser", "grobid_url": GROBID_URL}

@app.post("/parse/tei")
async def parse_tei(file: UploadFile = File(...)):
    if file.content_type not in {"application/pdf", "application/octet-stream"}:
        raise HTTPException(status_code=415, detail="Expected a PDF")
    raw = await file.read()
    if not raw.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="Invalid PDF signature")
    async with httpx.AsyncClient(timeout=180.0) as client:
        response = await client.post(
            f"{GROBID_URL}/api/processFulltextDocument",
            files={"input": (file.filename or "paper.pdf", raw, "application/pdf")},
            data={"consolidateHeader": "1", "consolidateCitations": "0"},
        )
    if response.status_code >= 400:
        raise HTTPException(status_code=502, detail=f"GROBID error: {response.status_code}")
    return {"tei": response.text}
