from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import AnalysisRequest, AnalysisResponse
from analyzer import analyze_review_batch

app = FastAPI(
    title="FeedbackOS NLP Engine",
    description="Customer Intelligence Sentiment Analysis & Topic Detection Microservice",
    version="1.0.0",
)

# Enable CORS for Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "FeedbackOS NLP Engine",
        "version": "1.0.0",
    }


@app.post("/api/v1/analyze", response_model=AnalysisResponse)
def analyze_feedback(request: AnalysisRequest):
    try:
        if not request.reviews:
            raise HTTPException(status_code=400, detail="Review list cannot be empty.")

        response = analyze_review_batch(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
