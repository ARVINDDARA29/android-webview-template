const express = require("express");
const router = express.Router();
const { updateFile } = require("../services/github");

router.post("/", async (req, res) => {
  try {
    const { app_name, url } = req.body;

    // Update config in Android template
    const config = JSON.stringify({ app_name, url });
    await updateFile("config.json", config);

    // Replace images
    if (req.files?.logo) {
      await updateFile("app/src/main/res/drawable/logo.png", req.files.logo.data);
    }
    if (req.files?.splash) {
      await updateFile("app/src/main/res/drawable/splash.png", req.files.splash.data);
    }

    res.json({ status: "Build started. APK will be ready shortly." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Build failed" });
  }
});

module.exports = router;
