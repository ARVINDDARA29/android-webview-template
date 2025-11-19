export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const { app_name, url } = req.body;

    if (!app_name || !url) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Future: यहां APK build logic आएगा (GitHub Actions trigger)
    return res.status(200).json({
      success: true,
      message: "Build request received.",
      received: { app_name, url }
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
