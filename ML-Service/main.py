import os
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Fake News Detection ML Service")
print("ML Service is running and ready to accept requests.")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "fake_news_model.pkl")
VEC_PATH = os.path.join(BASE_DIR, "tfidf_vectorizer.pkl")
TOP_EXPLANATION_TERMS = 10

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VEC_PATH)

class PredictionRequest(BaseModel):
    text: str

def explain_words(vector, top_n: int = TOP_EXPLANATION_TERMS) -> dict:
    if not hasattr(model, "coef_"):
        return {"fake_words": [], "real_words": []}

    feature_names = vectorizer.get_feature_names_out()
    coefs = model.coef_[0]
    present_feature_indexes = vector.nonzero()[1]

    contributions = []
    for feature_index in present_feature_indexes:
        score = float(vector[0, feature_index] * coefs[feature_index])
        contributions.append((feature_names[feature_index], score))

    fake_words = [
        {"word": word, "score": round(score, 4)}
        for word, score in sorted(
            (item for item in contributions if item[1] > 0),
            key=lambda item: item[1],
            reverse=True,
        )[:top_n]
    ]

    real_words = [
        {"word": word, "score": round(abs(score), 4)}
        for word, score in sorted(
            (item for item in contributions if item[1] < 0),
            key=lambda item: item[1],
        )[:top_n]
    ]

    return {"fake_words": fake_words, "real_words": real_words}

@app.post("/predict")
async def predict_news(payload: PredictionRequest):

    if not payload.text.strip():
        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty"
        )

    try:
        cleaned_text = payload.text.lower().strip()

        vector = vectorizer.transform([cleaned_text])

        prediction = model.predict(vector)[0]

        probabilities = model.predict_proba(vector)[0]
        words = explain_words(vector)

        real_prob = float(probabilities[0])
        fake_prob = float(probabilities[1])

        verdict = "REAL" if prediction == 0 else "FAKE"

        return {
            "verdict": verdict,
            "real_probability": round(real_prob * 100, 2),
            "fake_probability": round(fake_prob * 100, 2),
            "confidence": round(
                max(real_prob, fake_prob) * 100,
                2
            ),
            "fake_words": words["fake_words"],
            "real_words": words["real_words"],
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": True
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        reload=True
    )
