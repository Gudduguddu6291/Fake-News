"""
=============================================================
  FAKE NEWS DETECTION — TRAINING SCRIPT
  train_model.py
=============================================================
  Run this first to train and save the model.
  Usage:  python train_model.py
=============================================================
"""

import argparse
import os
import sys
import joblib
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# Ensure UTF-8 output encoding for terminals supporting it (prevents UnicodeEncodeError on Windows)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
    roc_curve,
)


# ── helpers ────────────────────────────────────────────────

def load_and_clean(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    before = len(df)
    df.dropna(subset=["text"], inplace=True)
    df["text"] = df["text"].astype(str).str.lower().str.strip()
    df = df[df["text"].str.len() > 5]          # drop near-empty rows
    after = len(df)
    print(f"  Loaded {before:,} rows  →  kept {after:,} after cleaning")
    print(f"  Label distribution:\n{df['label'].value_counts().to_string()}")
    return df


def plot_confusion_matrix(cm, output_path="confusion_matrix.png"):
    fig, ax = plt.subplots(figsize=(5, 4))
    im = ax.imshow(cm, interpolation="nearest", cmap="Blues")
    fig.colorbar(im, ax=ax)
    classes = ["Real (0)", "Fake (1)"]
    ax.set(
        xticks=[0, 1], yticks=[0, 1],
        xticklabels=classes, yticklabels=classes,
        xlabel="Predicted label", ylabel="True label",
        title="Confusion Matrix",
    )
    thresh = cm.max() / 2.0
    for i in range(2):
        for j in range(2):
            ax.text(j, i, format(cm[i, j], "d"),
                    ha="center", va="center",
                    color="white" if cm[i, j] > thresh else "black")
    plt.tight_layout()
    plt.savefig(output_path, dpi=120)
    plt.close()
    print(f"  Confusion matrix saved → {output_path}")


def plot_roc(y_true, y_prob, output_path="roc_curve.png"):
    fpr, tpr, _ = roc_curve(y_true, y_prob)
    auc = roc_auc_score(y_true, y_prob)
    plt.figure(figsize=(5, 4))
    plt.plot(fpr, tpr, label=f"AUC = {auc:.3f}")
    plt.plot([0, 1], [0, 1], "k--", linewidth=0.8)
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Curve")
    plt.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig(output_path, dpi=120)
    plt.close()
    print(f"  ROC curve saved      → {output_path}")


# ── main ───────────────────────────────────────────────────

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    default_data_path = os.path.join(script_dir, "dataset_clean.csv")

    parser = argparse.ArgumentParser(description="Train Fake News Detector")
    parser.add_argument("--data",  default=default_data_path,
                        help="Path to the CSV file (must have 'text' and 'label' columns)")
    parser.add_argument("--model-out",  default=os.path.join(script_dir, "fake_news_model.pkl"))
    parser.add_argument("--vec-out",    default=os.path.join(script_dir, "tfidf_vectorizer.pkl"))
    parser.add_argument("--test-size",  type=float, default=0.20)
    parser.add_argument("--max-features", type=int, default=50_000)
    parser.add_argument("--C",          type=float, default=1.0,
                        help="Logistic Regression regularisation strength")
    args = parser.parse_args()

    print("\n" + "="*55)
    print("  FAKE NEWS DETECTOR — TRAINING")
    print("="*55)

    # 1. Load data
    print("\n[1/5] Loading & cleaning data …")
    df = load_and_clean(args.data)
    X, y = df["text"], df["label"]

    # 2. Split
    print("\n[2/5] Splitting train / test …")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=args.test_size, random_state=42, stratify=y
    )
    print(f"  Train: {len(X_train):,}   Test: {len(X_test):,}")

    # 3. Vectorise
    print("\n[3/5] Building TF-IDF vectoriser (this may take a moment) …")
    vectorizer = TfidfVectorizer(
        max_features=args.max_features,
        ngram_range=(1, 2),      # unigrams + bigrams
        sublinear_tf=True,       # log-scale TF
        stop_words="english",
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec  = vectorizer.transform(X_test)
    print(f"  Vocabulary size: {len(vectorizer.vocabulary_):,}")

    # 4. Train
    print("\n[4/5] Training Logistic Regression …")
    model = LogisticRegression(max_iter=1000, C=args.C, solver="lbfgs")
    model.fit(X_train_vec, y_train)
    print("  Training complete.")

    # 5. Evaluate
    print("\n[5/5] Evaluating on test set …")
    y_pred = model.predict(X_test_vec)
    y_prob = model.predict_proba(X_test_vec)[:, 1]   # probability of FAKE

    acc = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_prob)
    cm  = confusion_matrix(y_test, y_pred)

    print(f"\n  ┌─────────────────────────────────┐")
    print(f"  │  Accuracy : {acc*100:6.2f}%              │")
    print(f"  │  ROC-AUC  : {auc*100:6.2f}%              │")
    print(f"  └─────────────────────────────────┘")
    print("\n  Per-class report:")
    print(classification_report(y_test, y_pred, target_names=["Real", "Fake"]))

    plot_confusion_matrix(cm, output_path=os.path.join(script_dir, "confusion_matrix.png"))
    plot_roc(y_test, y_prob, output_path=os.path.join(script_dir, "roc_curve.png"))

    # 6. Save
    joblib.dump(model,      args.model_out)
    joblib.dump(vectorizer, args.vec_out)
    print(f"\n  Model saved      → {args.model_out}")
    print(f"  Vectoriser saved → {args.vec_out}")
    print("\n  ✓ Training finished. Run  predict.py  to detect fake news.\n")


if __name__ == "__main__":
    print("ML server running")
    main()
