import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.ADAPTION_API_KEY;
const API_BASE = process.env.ADAPTION_API_BASE || "https://api.adaptionlabs.ai/v1";

// PHASE 1: Upload CSV to Adaption
export async function uploadDataset(csvPath) {
  try {
    console.log("📤 Uploading to Adaption...");
    
    const form = new FormData();
    form.append("file", fs.createReadStream(csvPath));
    form.append("name", "feedback.csv");

    const res = await axios.post(`${API_BASE}/datasets/upload`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    console.log("✅ Uploaded:", res.data.dataset_id);
    return { success: true, datasetId: res.data.dataset_id };
  } catch (error) {
    console.error("❌ Error uploading dataset:", error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || error.message };
  }
}

// PHASE 2: Run Adaption cleaning recipes
export async function runRecipes(datasetId) {
  try {
    console.log("🧹 Running recipes (dedup, normalize, filter noise)...");
    
    const res = await axios.post(
      `${API_BASE}/datasets/${datasetId}/adapt`,
      {
        column_mapping: { prompt: "text" },
        recipes: {
          deduplication: true,
          text_normalization: true,
          noise_filter: true,
        },
      },
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    );

    console.log("✅ Recipes started:", res.data.run_id);
    return { success: true, runId: res.data.run_id };
  } catch (error) {
    console.error("❌ Error running recipes:", error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || error.message };
  }
}

// PHASE 3: Poll job status
export async function checkStatus(runId) {
  try {
    const res = await axios.get(`${API_BASE}/runs/${runId}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    return {
      status: res.data.status, // "processing" | "completed" | "failed"
      progress: res.data.progress || 0,
    };
  } catch (error) {
    return { status: "error", error: error.response?.data?.error || error.message };
  }
}

// PHASE 4: Download cleaned data
export async function downloadCleanedData(runId) {
  try {
    console.log("💾 Downloading cleaned data...");
    
    const res = await axios.get(`${API_BASE}/runs/${runId}/download`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    const path = `./data/cleaned_${Date.now()}.json`;
    fs.mkdirSync("./data", { recursive: true });
    fs.writeFileSync(path, JSON.stringify(res.data, null, 2));

    console.log("✅ Saved to:", path);
    return { success: true, path, count: Array.isArray(res.data) ? res.data.length : 0 };
  } catch (error) {
    console.error("❌ Error downloading cleaned data:", error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || error.message };
  }
}

// PHASE 5: Upload labeled data for training
export async function uploadLabeledData(jsonlPath) {
  try {
    console.log("📤 Uploading labeled training data...");
    
    const form = new FormData();
    form.append("file", fs.createReadStream(jsonlPath));
    form.append("name", "labeled_feedback.jsonl");

    const res = await axios.post(`${API_BASE}/datasets/upload`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    console.log("✅ Uploaded:", res.data.dataset_id);
    return { success: true, datasetId: res.data.dataset_id };
  } catch (error) {
    console.error("❌ Error uploading labeled data:", error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || error.message };
  }
}

// PHASE 6: Start model training with AutoScientist
export async function startTraining(labeledDatasetId) {
  try {
    console.log("🤖 Starting AutoScientist training...");
    
    const res = await axios.post(
      `${API_BASE}/autoscientist/create`,
      {
        dataset_id: labeledDatasetId,
        max_iterations: 3,
        target_accuracy: 0.85,
        training_method: "instruction",
      },
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    );

    console.log("✅ Training started:", res.data.id);
    return { success: true, trainingId: res.data.id };
  } catch (error) {
    console.error("❌ Error starting AutoScientist:", error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || error.message };
  }
}

// PHASE 7: Check training status
export async function checkTrainingStatus(trainingId) {
  try {
    const res = await axios.get(`${API_BASE}/autoscientist/${trainingId}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    return {
      status: res.data.status,
      accuracy: res.data.best_win_rate || null,
    };
  } catch (error) {
    return { status: "error", error: error.response?.data?.error || error.message };
  }
}

export default {
  uploadDataset,
  runRecipes,
  checkStatus,
  downloadCleanedData,
  uploadLabeledData,
  startTraining,
  checkTrainingStatus,
};
