"""
Google Colab Notebook Script: Run Fine-Tuned Mistral-7B with Adaption LoRA Adapter
Free GPU: Use T4 in Google Colab (Runtime -> Change runtime type -> T4 GPU)
"""

# ==========================================
# CELL 1: Install Required Libraries
# ==========================================
# !pip install -q transformers peft bitsandbytes accelerate huggingface_hub

# ==========================================
# CELL 2: Download Your Trained Adapter from Adaption Labs
# ==========================================
import os
import urllib.request
import tarfile

API_KEY = "YOUR_ADAPTION_API_KEY"  # Paste your pt_live_... key here
RUN_ID = "792bafcc-e22b-4fdc-b91f-7b21352d1cce"

download_url = f"https://api.prod.adaptionlabs.ai/api/v1/autoscientist/{RUN_ID}/download"
tar_filename = "adapter.tar.gz"
adapter_dir = "./mistral_adapter"

print("📥 Downloading 441MB trained adapter archive from Adaption Labs...")
req = urllib.request.Request(download_url, headers={"Authorization": f"Bearer {API_KEY}"})
with urllib.request.urlopen(req) as response, open(tar_filename, "wb") as out_file:
    out_file.write(response.read())

print("📦 Extracting adapter weights using zstandard...")
os.makedirs(adapter_dir, exist_ok=True)

# Adaption Labs uses Zstandard compression (magic bytes 0x28 0xb5 0x2f 0xfd)
# In Colab/Linux, unpack using zstd:
os.system(f"zstd -d -f {tar_filename} -o adapter.tar")
os.system(f"tar -xvf adapter.tar -C {adapter_dir}")

print("✅ Files inside adapter directory:", os.listdir(adapter_dir))


# ==========================================
# CELL 3: Load Mistral-7B + Your Adaption LoRA Adapter
# ==========================================
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import PeftModel

base_model_id = "mistralai/Mistral-7B-Instruct-v0.2"

print("⏳ Loading Mistral-7B in 4-bit quantization on GPU...")
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,
)

tokenizer = AutoTokenizer.from_pretrained(base_model_id)
base_model = AutoModelForCausalLM.from_pretrained(
    base_model_id,
    quantization_config=bnb_config,
    device_map="auto",
    torch_dtype=torch.float16,
)

print("🚀 Attaching your Adaption Labs LoRA weights...")
model = PeftModel.from_pretrained(base_model, adapter_dir)

# ==========================================
# CELL 4: Run Inference on Customer Feedback!
# ==========================================
prompt = """<s>[INST] You are an elite CX and technical resolution assistant.
A customer reported:
"The checkout API failed twice and charged my card without confirming the order. Now my account is locked."

Provide:
1. Issue Category
2. Severity Level
3. Technical Root Cause
4. Immediate Customer SLA [/INST]"""

inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
with torch.no_grad():
    outputs = model.generate(
        **inputs,
        max_new_tokens=200,
        temperature=0.3,
        do_sample=True,
    )

response = tokenizer.decode(outputs[0], skip_special_tokens=True)
print("\n" + "="*50)
print("🤖 MISTRAL 7B MODEL RESPONSE:")
print("="*50)
print(response)


# ==========================================
# CELL 5 (OPTIONAL): Upload Adapter to Hugging Face
# ==========================================
# from huggingface_hub import HfApi
# api = HfApi()
# api.create_repo("your-username/insightflow-mistral-7b-lora", repo_type="model", exist_ok=True)
# api.upload_folder(
#     folder_path=adapter_dir,
#     repo_id="your-username/insightflow-mistral-7b-lora",
#     repo_type="model"
# )
# print("🎉 Adapter is now published on Hugging Face!")
