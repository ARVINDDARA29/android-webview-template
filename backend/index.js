const express = require("express");
const fileUpload = require("express-fileupload");
const buildRoute = require("./routes/build");

const app = express();
app.use(express.json());
app.use(fileUpload());
app.use("/", express.static("public"));  // frontend

app.use("/build", buildRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
