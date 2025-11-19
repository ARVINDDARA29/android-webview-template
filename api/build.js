import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { app_name, url } = req.body;

  if (!app_name || !url) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Trigger GitHub workflow
  const ghUser = process.env.GITHUB_USER;
  const ghRepo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  const triggerURL = `https://api.github.com/repos/${ghUser}/${ghRepo}/actions/workflows/build.yml/dispatches`;

  await fetch(triggerURL, {
    method: "POST",
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      ref: "main",
      inputs: {
        app_name,
        url
      }
    })
  });

  return res.status(200).json({
    success: true,
    message: "Build started! APK will be ready soon.",
    received: { app_name, url }
  });
}
