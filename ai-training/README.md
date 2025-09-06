# AI-Genomic-Surveillance — Training Skeleton

This folder contains a lightweight, ready-to-run training skeleton for genomic surveillance experiments.
It is designed for quick collaborative usage (Google Colab or local), integrated with DVC and MLflow for experiment tracking.

Getting started (local):

1. Create a Python environment (recommended: 3.9+)

python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

2. Run a quick dry-run training (does not require GPUs):

python train.py --dry-run

3. For full training, prepare your data under `data/` (FASTA files) and run:

python train.py

DVC
---
This skeleton includes a simple `dvc.yaml` describing preprocess and train stages. You can run `dvc repro` after installing DVC.

MLflow
------
Run `mlflow ui --backend-store-uri ./mlruns` to open the MLflow tracking UI.

Colab
-----
A Colab notebook `colab.ipynb` is included with step-by-step instructions to run this project on Google Colab and mount Google Drive for data storage.
