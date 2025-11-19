import { buffer } from "micro";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false, // file upload ke liye
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    // Parse multipart/form-data (basic example)
    const raw = await buffer(req);
    // यहाँ multer/micro-busboy library use करके req.body और req.files parse कर सकते हो
    // या अगर simple JSON input है:
    const { app_name, url } = JSON.parse(raw.toString());

    // GitHub update logic
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO = process.env.REPO;
    const BRANCH = process.env.BRANCH || "main";

    // Example: Update config.json in GitHub repo
    const content = Buffer.from(JSON.stringify({ app_name, url })).toString("base64");
    const existing = await axios.get(`https://api.github.com/repos/${REPO}/contents/config.json`, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    });

    await axios.put(
      `https://api.github.com/repos/${REPO}/contents/config.json`,
      {
        message: `Update config`,
        content,
        sha: existing.data.sha,
        branch: BRANCH,
      },
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
    );

    return res.status(200).json({ status: "Build started. Check GitHub Actions." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Build failed" });
  }
}
