"""
Official Adaption Labs Dataset Adaptation & AutoScientist Pipeline (Python SDK)
Adapted from Adaption Labs official documentation.

Prerequisites:
  pip install adaption python-dotenv

Usage:
  python scripts/adaption_pipeline.py
"""

import os
import sys
import time
import importlib

def _load_env_fallback():
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
    if not os.path.exists(env_path):
        env_path = ".env"
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

try:
    dotenv = importlib.import_module("dotenv")
    dotenv.load_dotenv()
except Exception:
    _load_env_fallback()

API_KEY = os.getenv("ADAPTION_API_KEY")
if not API_KEY:
    print("❌ ERROR: ADAPTION_API_KEY environment variable not found in .env file.")
    sys.exit(1)

try:
    _adaption_mod = importlib.import_module("adaption")
    Adaption = getattr(_adaption_mod, "Adaption")
except Exception:
    print("⚠️  'adaption' package is not installed.")
    print("Install it with: pip install adaption")
    sys.exit(1)

client = Adaption(api_key=API_KEY)

candidate_files = [
    "public/hackathon_feedback.csv",
    "server/data/sample.csv",
    "test_feedback_dataset.csv",
    "cx_feedback_preferences.csv"
]
CSV_FILE = next((f for f in candidate_files if os.path.exists(f)), None)

if not CSV_FILE:
    CSV_FILE = "sample_feedback.csv"
    with open(CSV_FILE, "w", encoding="utf-8") as f:
        f.write("review,category\n")
        f.write('"Checkout API failed twice and charged card without confirming order.","Fraud and Scam"\n')
        f.write('"Delivery was delayed by 5 days with zero courier tracking updates.","Operational Issues"\n')
        f.write('"Customer service representative never responded within SLA.","Customer Service"\n')
        f.write('"Unable to authenticate via SAML SSO on mobile app.","Authentication & SSO"\n')
    print(f"ℹ️ Auto-generated valid sample dataset: {CSV_FILE}")
else:
    print(f"📁 Using detected dataset: {CSV_FILE}")

print(f"🚀 [Step 1] Uploading file: {CSV_FILE}...")
dataset = client.datasets.upload_file(
    CSV_FILE,
    name=f"cx_feedback_{int(time.time())}",
)
print(f"✅ Dataset Created! ID: {dataset.dataset_id}")

print("⏳ [Step 2] Waiting for ingestion to finish...")
while True:
    status = client.datasets.get_status(dataset.dataset_id)
    if status.status == "failed":
        err = status.error_data
        msg = (err and err.message) or "unknown error"
        raise RuntimeError(f"Ingestion failed: {msg}")
    if status.row_count is not None:
        print(f"✅ Ingestion complete: {status.row_count} rows indexed.")
        break
    time.sleep(5)

print("🎯 [Step 3] Adapting dataset with preference pairs (DPO)...")
job = client.datasets.adapt(
    dataset.dataset_id,
    training_type="preference_pairs",
)
est_min = getattr(job, "estimated_minutes", 5)
print(f"Launched — estimated time: {est_min:.0f} minutes")

print("⏳ [Step 4] Polling until adaptation is complete...")
while True:
    status = client.datasets.get_status(dataset.dataset_id)
    if status.status == "succeeded":
        print("✅ Dataset adaptation succeeded!")
        break
    if status.status == "failed":
        err = status.error_data
        msg = (err and err.message) or "unknown error"
        raise RuntimeError(f"Adaptation failed: {msg}")
    print(f"   Current status: {status.status}... checking in 10s")
    time.sleep(10)

print("📊 [Step 5] Reviewing evaluation results...")
ds = client.datasets.get(dataset.dataset_id)
if hasattr(ds, "evaluation_summary") and ds.evaluation_summary:
    print(f"   Quality Grade: {ds.evaluation_summary.grade_before} → {ds.evaluation_summary.grade_after}")
    print(f"   Quality Improvement: {ds.evaluation_summary.improvement_percent:.0f}%")

print("💾 [Step 6] Downloading adapted dataset...")
client.datasets.download(dataset.dataset_id)
print("✅ Download complete.")

print("🤖 [Step 7] Training Mistral-7B model with AutoScientist...")
run = client.autoscientist.create(
    dataset_id=dataset.dataset_id,
    target_win_rate=0.9,
)
print(f"   AutoScientist Run launched: {run.id}")

run = client.autoscientist.wait_for_completion(run.id)
print(f"✅ AutoScientist {run.status} — Best Win Rate: {run.best_win_rate}")

print("📦 [Step 8] Downloading the best adapter weights...")
if getattr(run, "download_available", False):
    dl = client.autoscientist.download(run.id)
    if hasattr(dl, "write_to_file"):
        dl.write_to_file("adapter.tar.gz")
    elif isinstance(dl, bytes):
        with open("adapter.tar.gz", "wb") as f:
            f.write(dl)
    print("🎉 Adapter downloaded successfully to adapter.tar.gz!")
