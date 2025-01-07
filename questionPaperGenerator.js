
const questionStore = require("./questionStore");

function generateQuestionPaper(totalMarks, distribution) {
  try {
    const questionDistribution = calculateQuestionDistribution(
      totalMarks,
      distribution
    );
    const questionPaper = [];

    for (const [difficulty, percentage] of Object.entries(
      questionDistribution
    )) {
      const questions = selectQuestions(difficulty, totalMarks, percentage);
      questionPaper.push(...questions);
    }

    return questionPaper;
  } catch (error) {
    console.error("Error in generating Question Paper:", error.message);
    throw error;
  }
}

function calculateQuestionDistribution(totalMarks, distribution) {
  const totalPercentage = Object.values(distribution).reduce(
    (acc, percentage) => acc + parseInt(percentage || 0, 10),
    0
  );
    //handling any error in percentage
  if (totalPercentage !== 100) {
    throw new Error("Invalid distribution: Total percentage must be 100");
  }

  const questionDistribution = {};

  for (const [key, value] of Object.entries(distribution)) {
    if (key === "total") {
      continue;
    }

    questionDistribution[key] = parseInt(value || 0, 10) / 100;
  }

  return questionDistribution;
}

function selectQuestions(difficulty, totalMarks, percentage, topic) {
  let filteredQuestions = questionStore.filter(
    (q) => q.difficulty === difficulty
  );

  if (topic) {
    filteredQuestions = filteredQuestions.filter((q) => q.topic === topic);
  }

  const selectedQuestions = [];
  let remainingMarks = totalMarks * percentage;
  let currentIndex = 0;

  // Shuffle the questions to get a random selection
  for (let i = filteredQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredQuestions[i], filteredQuestions[j]] = [
      filteredQuestions[j],
      filteredQuestions[i],
    ];
  }

  while (remainingMarks > 0 && currentIndex < filteredQuestions.length) {
    const currentQuestion = filteredQuestions[currentIndex];
    const questionMarks = getQuestionMarks(currentQuestion);

    if (questionMarks <= remainingMarks) {
      selectedQuestions.push(currentQuestion);
      remainingMarks -= questionMarks;
    }

    currentIndex++;
  }
  return selectedQuestions;
}

function getQuestionMarks(question) {
  return question.marks || 0;
}

module.exports = { generateQuestionPaper };
