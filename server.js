const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🔌 Lost Boy is running via Render...");
});

app.listen(PORT, () => {
  console.log(`✅ Server online at http://localhost:${PORT}`);
  require("./index.js"); // Start bot
});
