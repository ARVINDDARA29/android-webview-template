import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", chunk => data += chunk);
      req.on("end", () => resolve(JSON.parse(data)));
      req.on("error", err => reject(err));
    });

    const { app_name, url } = body;

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO = process.env.REPO;
    const BRANCH = process.env.BRANCH || "main";

    const content = Buffer.from(JSON.stringify({ app_name, url })).toString("base64");

    // Fetch existing file SHA
    const existing = await axios.get(`https://api.github.com/repos/${REPO}/contents/config.json`, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    });

    // Update file
    await axios.put(`https://api.github.com/repos/${REPO}/contents/config.json`, {
      message: `Update config`,
      content,
      sha: existing.data.sha,
      branch: BRANCH,
    }, { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } });

    res.status(200).json({ status: "Build started. Check GitHub Actions." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Build failed" });
  }
}
