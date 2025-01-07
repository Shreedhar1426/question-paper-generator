const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const questionPaperGenerator = require("./questionPaperGenerator");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/generate", (req, res) => {
  const { totalMarks, distribution } = req.body;

  console.log("Total Marks:", totalMarks);

  try {
    const questionPaper = questionPaperGenerator.generateQuestionPaper(
      totalMarks,
      distribution
    );
    console.log("Question Paper:", questionPaper);
    res.render("questionPaper", { questionPaper });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000);
