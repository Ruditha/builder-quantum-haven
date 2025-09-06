#!/usr/bin/env python3
import argparse
import csv
import os
from pathlib import Path
from Bio import SeqIO
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib


def parse_fasta_to_df(path: str) -> pd.DataFrame:
    records = []
    for rec in SeqIO.parse(path, "fasta"):
        seq = str(rec.seq).upper()
        records.append({"id": rec.id, "sequence": seq})
    return pd.DataFrame(records)


def featurize_sequence(seq: str):
    gc = float(seq.count("G") + seq.count("C")) / max(1, len(seq))
    return [len(seq), gc]


def preprocess(args):
    df = parse_fasta_to_df(args.input)
    df["len"] = df["sequence"].apply(len)
    df["gc"] = df["sequence"].apply(lambda s: (s.count("G") + s.count("C")) / max(1, len(s)))
    df.to_csv(args.output, index=False)
    print(f"Wrote processed CSV to {args.output}")


def train(args):
    df = pd.read_csv(args.input)
    # Dummy labels: sequence length > median => class 1 else 0 (placeholder for real labels)
    y = (df["len"] > df["len"].median()).astype(int)
    X = df[["len", "gc"]].values
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=10, random_state=42)
    model.fit(X_train, y_train)
    preds = model.predict(X_val)
    print(classification_report(y_val, preds))
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    joblib.dump(model, args.output)
    print(f"Saved model to {args.output}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Run quick preprocess+train on sample data")
    parser.add_argument("--preprocess", nargs=2, metavar=("INPUT", "OUTPUT"))
    parser.add_argument("--train", nargs=2, metavar=("INPUT", "OUTPUT"))
    args = parser.parse_args()

    if args.dry_run:
        sample = Path(__file__).parent / "data" / "sample_sequences.fasta"
        proc = Path(__file__).parent / "data" / "processed.csv"
        models = Path(__file__).parent / "models" / "model.joblib"
        preprocess(argparse.Namespace(input=str(sample), output=str(proc)))
        train(argparse.Namespace(input=str(proc), output=str(models)))
    elif args.preprocess:
        preprocess(argparse.Namespace(input=args.preprocess[0], output=args.preprocess[1]))
    elif args.train:
        train(argparse.Namespace(input=args.train[0], output=args.train[1]))
    else:
        parser.print_help()
