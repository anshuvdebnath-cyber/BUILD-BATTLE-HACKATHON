"""
Google Colab & Standalone Script: Run Fine-Tuned Mistral-7B with Adaption LoRA Adapter
Free GPU: Use T4 in Google Colab (Runtime -> Change runtime type -> T4 GPU)
"""

import os
import sys
import time
import re
import urllib.request
import tarfile

import importlib

# ==========================================
# 1. API Configuration & Secret Handling
# ==========================================
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

API_KEY = os.getenv("ADAPTION_API_KEY", "pt_live_f571fe1acf24b42406e1b8c7ba206d7e87405040")
RUN_ID = "792bafcc-e22b-4fdc-b91f-7b21352d1cce"
ADAPTER_DIR = "./mistral_adapter"
TAR_FILENAME = "adapter.tar.zst"

# ==========================================
# 2. Download & Extract Adapter Weights
# ==========================================
def setup_adapter():
    os.makedirs(ADAPTER_DIR, exist_ok=True)
    if os.path.exists(os.path.join(ADAPTER_DIR, "adapter_model.safetensors")) or os.path.exists(os.path.join(ADAPTER_DIR, "adapter_model.bin")):
        print("✅ Adapter weights already present in", ADAPTER_DIR)
        return True

    print("📥 Downloading trained adapter checkpoint from Adaption Labs...")
    download_url = f"https://api.prod.adaptionlabs.ai/api/v1/autoscientist/{RUN_ID}/download"
    req = urllib.request.Request(download_url, headers={"Authorization": f"Bearer {API_KEY}"})
    
    try:
        with urllib.request.urlopen(req) as response, open(TAR_FILENAME, "wb") as out_file:
            out_file.write(response.read())
        print(f"📦 Successfully downloaded {TAR_FILENAME} ({os.path.getsize(TAR_FILENAME) / 1024 / 1024:.1f} MB)")
    except Exception as e:
        print(f"⚠️ Could not download archive automatically: {e}")
        if not os.path.exists(TAR_FILENAME):
            return False

    print("📦 Decompressing Zstandard archive into adapter directory...")
    extracted = False

    # Method A: Pure Python zstandard (recommended for Windows / Colab)
    try:
        zstandard = importlib.import_module("zstandard")
        tar_temp = "adapter.tar"
        dctx = getattr(zstandard, "ZstdDecompressor")()
        with open(TAR_FILENAME, "rb") as ifh, open(tar_temp, "wb") as ofh:
            dctx.copy_stream(ifh, ofh)
        with tarfile.open(tar_temp, "r") as tar:
            tar.extractall(path=ADAPTER_DIR)
        if os.path.exists(tar_temp):
            os.remove(tar_temp)
        extracted = True
        print("✅ Pure-Python zstandard extraction complete.")
    except Exception as ze:
        print(f"⚠️ Python zstandard decompress note ({ze}), trying CLI fallback...")

    # Method B: CLI fallback (Linux / Colab command line)
    if not extracted:
        try:
            os.system(f"zstd -d -f {TAR_FILENAME} -o adapter.tar")
            os.system(f"tar -xf adapter.tar -C {ADAPTER_DIR}")
            extracted = True
        except Exception as ce:
            print(f"CLI extraction fallback failed: {ce}")

    return extracted

# ==========================================
# 3. Model Loading & Inference Engine
# ==========================================
def load_model():
    torch = importlib.import_module("torch")
    transformers = importlib.import_module("transformers")
    peft = importlib.import_module("peft")

    AutoModelForCausalLM = getattr(transformers, "AutoModelForCausalLM")
    AutoTokenizer = getattr(transformers, "AutoTokenizer")
    BitsAndBytesConfig = getattr(transformers, "BitsAndBytesConfig")
    PeftModel = getattr(peft, "PeftModel")

    base_model_id = "mistralai/Mistral-7B-Instruct-v0.2"

    print("⏳ Loading Mistral-7B in 4-bit NF4 quantization on GPU...")
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_use_double_quant=True
    )

    tokenizer = AutoTokenizer.from_pretrained(base_model_id)
    base_model = AutoModelForCausalLM.from_pretrained(
        base_model_id,
        quantization_config=bnb_config,
        device_map="auto"
    )

    if os.path.exists(ADAPTER_DIR) and len(os.listdir(ADAPTER_DIR)) > 0:
        print("🚀 Attaching Adaption Labs fine-tuned LoRA weights...")
        model = PeftModel.from_pretrained(base_model, ADAPTER_DIR)
    else:
        print("⚠️ Adapter directory empty, proceeding with base model.")
        model = base_model

    model.eval()
    print("✅ Model ready for live inference!")
    return tokenizer, model

# ==========================================
# 4. FastAPI & Cloudflare Quick Tunnel Service
# ==========================================
def start_live_service(tokenizer, model):
    import threading
    import subprocess
    torch = importlib.import_module("torch")
    uvicorn = importlib.import_module("uvicorn")
    fastapi = importlib.import_module("fastapi")
    pydantic = importlib.import_module("pydantic")
    FastAPI = getattr(fastapi, "FastAPI")
    BaseModel = getattr(pydantic, "BaseModel")

    app = FastAPI(title="InsightFlow Live Mistral-7B API")

    class Query(BaseModel):
        text: str

    @app.post("/predict")
    def predict(q: Query):
        prompt = f"<s>[INST] {q.text} [/INST]"
        inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
        with torch.no_grad():
            outputs = model.generate(**inputs, max_new_tokens=240, temperature=0.7)
        response = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
        return {"output": response, "model": "mistral-7b-instruct-v0.2-lora"}

    # Launch Uvicorn in background thread to avoid Jupyter / Colab asyncio conflict
    server_thread = threading.Thread(
        target=lambda: uvicorn.run(app, host="127.0.0.1", port=8000, log_level="warning"),
        daemon=True
    )
    server_thread.start()
    time.sleep(2)
    print("✅ FastAPI server listening on http://127.0.0.1:8000")

    # Launch Cloudflare Quick Tunnel
    print("🌐 Provisioning Cloudflare Quick Tunnel...")
    cf_proc = subprocess.Popen(
        ["cloudflared", "tunnel", "--url", "http://127.0.0.1:8000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )

    public_url = None
    start_time = time.time()
    while time.time() - start_time < 20:
        line = cf_proc.stdout.readline()
        match = re.search(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com", line)
        if match:
            public_url = match.group(0)
            break

    if public_url:
        print("\n" + "=" * 68)
        print("🎉 YOUR LIVE MISTRAL API URL:")
        print(f"{public_url}/predict")
        print("=" * 68)
        print("\n👉 Copy this URL and paste it into your InsightFlow .env as MISTRAL_API_URL!")
    else:
        print("⚠️ Could not automatically detect Cloudflare URL. Check cloudflared output.")

    # Keep main thread alive if executed directly as a script
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down server.")

if __name__ == "__main__":
    setup_adapter()
    # Check if GPU is available
    try:
        torch = importlib.import_module("torch")
        if torch.cuda.is_available():
            tokenizer, model = load_model()
            start_live_service(tokenizer, model)
        else:
            print("ℹ️ CUDA GPU not detected on this host. Run this script inside Google Colab with T4 GPU enabled!")
    except ImportError:
        print("ℹ️ PyTorch / Transformers not installed in current environment. Install via requirements or run in Google Colab.")
