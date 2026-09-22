import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel
} from "@qvac/sdk";

try {
  console.log("Starting QVAC Local AI...");

  const modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    onProgress: (p) => {
      const percent = p.percentage.toFixed(0);
      process.stdout.write(`\rDownloading model: ${percent}%`);
      
      if (p.percentage >= 100) {
        process.stdout.write("\n");
      }
    }
  });

  console.log("Model loaded successfully!");
  console.log("\nQVAC Local AI response:\n");

  const history = [
    {
      role: "user",
      content:
        "You are a helpful local AI assistant. Introduce yourself in two short sentences and explain that you run locally on the user's device."
    }
  ];

  const result = completion({
    modelId,
    history,
    stream: true
  });

  for await (const token of result.tokenStream) {
    process.stdout.write(token);
  }

  console.log("\n");

  await unloadModel({ modelId });

  console.log("QVAC Local AI finished successfully!");
} catch (error) {
  console.error("\nQVAC error:", error);
  process.exit(1);
}