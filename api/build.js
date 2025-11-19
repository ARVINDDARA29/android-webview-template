import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    // Read JSON body
    const { app_name, url } = req.body;

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO = process.env.REPO;
    const BRANCH = process.env.BRANCH || "main";

    const configData = {
      app_name,
      url
    };

    const content = Buffer.from(
      JSON.stringify(configData, null, 2)
    ).toString("base64");

    // Get existing config.json so we know SHA
    const existing = await axios.get(
      `https://api.github.com/repos/${REPO}/contents/config.json`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
    );

    await axios.put(
      `https://api.github.com/repos/${REPO}/contents/config.json`,
      {
        message: "Update config.json",
        content,
        sha: existing.data.sha,
        branch: BRANCH
      },
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
    );

    return res.status(200).json({ message: "Build started! Check GitHub Actions." });
  } catch (error) {
    console.log(error.response?.data || error);
    return res.status(500).json({ error: "Build failed!" });
  }
}
