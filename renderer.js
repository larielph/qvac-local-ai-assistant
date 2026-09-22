const questionInput = document.getElementById("question");
const askButton = document.getElementById("ask");
const answer = document.getElementById("answer");
const status = document.getElementById("status");

window.qvac.onProgress((progress) => {
  status.textContent =
    `Downloading AI model: ${progress.toFixed(0)}%`;
});

window.qvac.onToken((token) => {
  answer.textContent += token;
});

askButton.addEventListener("click", async () => {
  const question = questionInput.value.trim();

  if (!question) {
    status.textContent = "Please enter a question.";
    return;
  }

  answer.textContent = "";
  status.textContent = "Running QVAC locally...";
  askButton.disabled = true;

  try {
    await window.qvac.loadModel();

    await window.qvac.ask(question);

    status.textContent = "Done — generated locally.";
  } catch (error) {
    status.textContent = "Error: " + error.message;
  }

  askButton.disabled = false;
});