const axios = require("axios");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // cloud deploy ke liye env var
const REPO = process.env.REPO; 
const BRANCH = process.env.BRANCH || "main";

async function updateFile(path, content) {
  const url = `https://api.github.com/repos/${REPO}/contents/${path}`;
  const existing = await axios.get(url, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
  });
  await axios.put(
    url,
    {
      message: `Update ${path}`,
      content: Buffer.from(content).toString("base64"),
      sha: existing.data.sha,
      branch: BRANCH
    },
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
  );
}

module.exports = { updateFile };
