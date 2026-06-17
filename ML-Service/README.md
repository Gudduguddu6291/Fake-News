# Fake News ML Service

This service provides the machine learning model used by the Fake News app.
It loads a trained TF-IDF + Logistic Regression pipeline and exposes a prediction endpoint via FastAPI.

---

## 🚀 What it does

- trains a fake news classifier from `dataset_clean.csv`
- saves the model to `fake_news_model.pkl`
- saves the TF-IDF vectorizer to `tfidf_vectorizer.pkl`
- serves predictions on `POST /predict`
- supports health checks on `GET /health`

---

## 📦 Requirements

Python 3.11+ is recommended.

Install dependencies:

```bash
cd "d:/MERN/Fake News/ML-Service"
pip install -r requirements.txt
```

---

## 🔧 Files

- `main.py` — FastAPI server and prediction API
- `train_model.py` — training script to build and save model artifacts
- `predict.py` — CLI helper for local predictions
- `dataset_clean.csv` — input data used for training
- `fake_news_model.pkl` — saved model artifact (generated after training)
- `tfidf_vectorizer.pkl` — saved vectorizer artifact (generated after training)
- `requirements.txt` — Python dependencies

---

## 🧠 Train the model

Run this first to generate the model and vectorizer files:

```bash
python train_model.py
```

Optional training arguments:

```bash
python train_model.py --data dataset_clean.csv --model-out fake_news_model.pkl --vec-out tfidf_vectorizer.pkl --test-size 0.2 --max-features 50000 --C 1.0
```

After training you should see:
- `fake_news_model.pkl`
- `tfidf_vectorizer.pkl`
- `confusion_matrix.png`
- `roc_curve.png`

---

## 🧪 Predict locally with CLI

After training, you can predict text directly from the terminal.

Interactive mode:

```bash
python predict.py
```

Single text prediction:

```bash
python predict.py --text "Example news headline to classify"
```

File-based prediction:

```bash
python predict.py --file articles.txt
```

Each line in `articles.txt` should contain one article or headline.

---

## 🌐 Run the API server

Start the FastAPI service on port `5000`:

```bash
python main.py
```

The backend expects this service to be available at:

```text
http://127.0.0.1:5000
```

### Endpoints

- `POST /predict` — predict fake news from JSON `{ "text": "..." }`
- `GET /health` — health check for service readiness

---

## ⚠️ Notes

- The backend app sends requests to `http://127.0.0.1:5000/predict`.
- Ensure `fake_news_model.pkl` and `tfidf_vectorizer.pkl` exist before starting `main.py`.
- The training dataset must contain `text` and `label` columns.

---

## 📌 Example workflow

1. Install Python dependencies
2. Run `python train_model.py`
3. Run `python main.py`
4. Start the backend and frontend apps
5. Submit text through the frontend to get predictions
