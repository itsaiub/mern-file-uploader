const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

app.use(fileUpload());

// Upload Endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded." });
  }

  const file = req.files.file;

  file.mv(
    `${__dirname}/client/public/uploads/${file.name.replace(/\s+/g, "_")}`,
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      res.json({
        fileName: file.name,
        filePath: `/uploads/${file.name.replace(/\s+/g, "_")}`
      });
    }
  );
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Express Server listening on ${PORT}`);
});
