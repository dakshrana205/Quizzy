const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const dbConfig = require("./config/dbConfig");

const usersRoute = require("./routes/usersRoute");
const examsRoute = require("./routes/examsRoute");
const resportsRoute = require("./routes/reportsRoute");


app.use("/api/users", usersRoute);
app.use("/api/exams", examsRoute);
app.use("/api/reports", resportsRoute);
const port = process.env.PORT || 4000;
const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client" , "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });   
} 
const PDFDocument = require('pdfkit');
const fs = require('fs');
//const path = require('path');

// Certificate Download Route
app.get('/api/download-certificate', (req, res) => {
  const { name, score } = req.query;

  if (!name || !score) {
    return res.status(400).send('Missing required parameters');
  }

  // Create a new PDF document
  const doc = new PDFDocument();
  const fileName = `${name}_certificate.pdf`;
  const filePath = path.join(__dirname, 'certificates', fileName);

  // Write PDF to file
  doc.pipe(fs.createWriteStream(filePath));

  // Add certificate content
  doc.fontSize(25).text('Certificate of Achievement', { align: 'center' });
  doc.moveDown();
  doc.fontSize(18).text(`This is to certify that`, { align: 'center' });
  doc.fontSize(22).text(`${name}`, { align: 'center', bold: true });
  doc.fontSize(18).text(`has successfully completed the quiz with a score of`, { align: 'center' });
  doc.fontSize(20).text(`${score}/100`, { align: 'center', bold: true });
  doc.moveDown(2);
  doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
  doc.end();

  // Send the generated file as a response
  doc.on('end', () => {
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error downloading certificate');
      }
      // Delete file after sending
      fs.unlinkSync(filePath);
    });
  });
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
