import fs from "fs";

// Load the tokens
const tokens = JSON.parse(fs.readFileSync("src/tokens/design.tokens30in30.json", "utf8"));

// Log the top-level keys and sample data
console.log("Top-level keys:", Object.keys(tokens));

// If there are nested structures, log a few samples
Object.entries(tokens).forEach(([key, value]) => {
  console.log(`Key: ${key}`, "Sample:", JSON.stringify(value, null, 2).substring(0, 200));
});
