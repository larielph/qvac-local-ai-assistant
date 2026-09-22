import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel
} from "@qvac/sdk";

async function main() {
  console.log("Loading local AI model...");
  console.log("The first run may download the model.\n");

  const modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    onProgress: (p) => {
      console.log(`Downloading: ${p.percentage.toFixed(0)}%`);
    }
  });

  console.log("\nModel loaded!");
  console.log("Running QVAC locally...\n");

  const history = [
    {
      role: "user",
      content:
        "Explain photosynthesis in simple terms for a 12-year-old student."
    }
  ];

  const result = completion({
    modelId,
    history,
    stream: true
  });

  let answer = "";

  for await (const token of result.tokenStream) {
    process.stdout.write(token);
    answer += token;
  }

  console.log("\n\nAI response generated locally with QVAC.");

  await unloadModel({
    modelId
  });
}

main().catch((error) => {
  console.error("\nQVAC error:");
  console.error(error);
  process.exit(1);
});