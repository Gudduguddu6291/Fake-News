"""
=============================================================
  FAKE NEWS DETECTION — PREDICTION SCRIPT
  predict.py
=============================================================
  Run AFTER train_model.py has saved the model files.

  Usage examples
  ──────────────
  # Interactive mode (type/paste a headline or article):
      python predict.py

  # Pass news text directly as a command-line argument:
      python predict.py --text "Scientists discover water on Mars"

  # Predict from a plain-text file (one article per line):
      python predict.py --file articles.txt
=============================================================
"""

import argparse
import os
import sys
import joblib
import numpy as np

# Ensure UTF-8 output encoding for terminals supporting it (prevents UnicodeEncodeError on Windows)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


# ── constants ──────────────────────────────────────────────

AUTHENTICITY_THRESHOLD = 0.80   # ≥ 80 % real  →  AUTHENTIC
TOP_EXPLANATION_TERMS = 10
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, "fake_news_model.pkl")
VEC_PATH   = os.path.join(SCRIPT_DIR, "tfidf_vectorizer.pkl")


# ── load artifacts ─────────────────────────────────────────

def load_model():
    try:
        model      = joblib.load(MODEL_PATH)
        vectorizer = joblib.load(VEC_PATH)
        return model, vectorizer
    except FileNotFoundError:
        print("\n  ✗  Model files not found.")
        print("     Please run  train_model.py  first to generate:")
        print(f"       {MODEL_PATH}")
        print(f"       {VEC_PATH}\n")
        sys.exit(1)


# ── core prediction ────────────────────────────────────────

def predict(text: str, model, vectorizer) -> dict:
    """
    authenticity  – probability the news is REAL
    fake_prob     – probability the news is FAKE
    verdict       – AUTHENTIC or FAKE NEWS
    confidence    – dominant probability
    """

    cleaned = text.lower().strip()
    vec = vectorizer.transform([cleaned])

    probs = model.predict_proba(vec)[0]

    # Assuming label 0 = REAL, label 1 = FAKE
    real_p = probs[0]
    fake_p = probs[1]

    words = explain_words(vec, model, vectorizer)

    # Custom rule: below 80% real = FAKE
    if real_p >= AUTHENTICITY_THRESHOLD:
        verdict = "AUTHENTIC ✅"
        confidence = real_p
    else:
        verdict = "FAKE NEWS ⚠️"
        confidence = 1 - real_p

    return {
        "authenticity": real_p,
        "fake_prob": fake_p,
        "verdict": verdict,
        "confidence": confidence,
        "fake_words": words["fake_words"],
        "real_words": words["real_words"],
    }


def explain_words(vec, model, vectorizer, top_n: int = TOP_EXPLANATION_TERMS) -> dict:
    """Return input words/ngrams that most influence the fake and real classes."""
    if not hasattr(model, "coef_"):
        return {"fake_words": [], "real_words": []}

    feature_names = vectorizer.get_feature_names_out()
    coefs = model.coef_[0]
    present_feature_indexes = vec.nonzero()[1]

    contributions = []
    for feature_index in present_feature_indexes:
        score = float(vec[0, feature_index] * coefs[feature_index])
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


def print_result(text: str, result: dict, index: int = None):
    """Pretty-print a single prediction result."""
    label = f"News #{index}" if index is not None else "News"
    bar_filled = int(result["authenticity"] * 30)
    bar = "█" * bar_filled + "░" * (30 - bar_filled)

    print("\n" + "─"*55)
    if index is not None:
        print(f"  {label}")
    snippet = text[:120] + ("…" if len(text) > 120 else "")
    print(f"  Text   : {snippet}")
    print(f"  {bar}  {result['authenticity']*100:.1f}% authentic")
    print(f"\n  Authenticity  : {result['authenticity']*100:.2f}%")
    print(f"  Fake prob.    : {result['fake_prob']*100:.2f}%")
    print("\n  Fake words    : " + format_words(result["fake_words"]))
    print("  Real words    : " + format_words(result["real_words"]))
    print(f"  Threshold     : {AUTHENTICITY_THRESHOLD*100:.0f}% (authentic if ≥ threshold)")
    print(f"\n  VERDICT ──▶   {result['verdict']}")
    if result["verdict"].startswith("AUTHENTIC"):
        print(f"  The news appears credible (authenticity ≥ {AUTHENTICITY_THRESHOLD*100:.0f}%).")
    else:
        print(f"  The news is likely FAKE (authenticity < {AUTHENTICITY_THRESHOLD*100:.0f}%).")
    print("─"*55)


# ── modes ──────────────────────────────────────────────────

def format_words(words: list[dict]) -> str:
    if not words:
        return "None found in the model vocabulary"

    return ", ".join(f"{item['word']} ({item['score']:.4f})" for item in words)


def run_interactive(model, vectorizer):
    print("\n" + "="*55)
    print("  FAKE NEWS DETECTOR — Interactive Mode")
    print(f"  Verdict: AUTHENTIC if authenticity ≥ {AUTHENTICITY_THRESHOLD*100:.0f}%")
    print("="*55)
    print("  Paste or type a news headline / article text.")
    print("  Type  'quit'  or  'exit'  to stop.\n")

    idx = 1
    while True:
        try:
            text = input("  Enter news text: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n  Goodbye!\n")
            break

        if not text:
            continue
        if text.lower() in {"quit", "exit", "q"}:
            print("\n  Goodbye!\n")
            break

        result = predict(text, model, vectorizer)
        print_result(text, result, index=idx)
        idx += 1


def run_single(text: str, model, vectorizer):
    result = predict(text, model, vectorizer)
    print_result(text, result)


def run_file(path: str, model, vectorizer):
    with open(path, "r", encoding="utf-8") as f:
        lines = [l.strip() for l in f if l.strip()]

    print(f"\n  Found {len(lines)} article(s) in '{path}'\n")
    for i, line in enumerate(lines, 1):
        result = predict(line, model, vectorizer)
        print_result(line, result, index=i)

    # summary
    results   = [predict(l, model, vectorizer) for l in lines]
    authentic = sum(1 for r in results if r["verdict"].startswith("AUTHENTIC"))
    fake      = len(results) - authentic
    print(f"\n  ── Summary ──────────────────────────────")
    print(f"  Total articles : {len(results)}")
    print(f"  Authentic      : {authentic}")
    print(f"  Fake           : {fake}")
    print(f"  ─────────────────────────────────────────\n")


# ── entry point ────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Fake News Detector – Prediction")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--text", type=str, help="News text to classify")
    group.add_argument("--file", type=str, help="Path to a .txt file (one article per line)")
    args = parser.parse_args()

    model, vectorizer = load_model()

    if args.text:
        run_single(args.text, model, vectorizer)
    elif args.file:
        run_file(args.file, model, vectorizer)
    else:
        run_interactive(model, vectorizer)


if __name__ == "__main__":
    main()
