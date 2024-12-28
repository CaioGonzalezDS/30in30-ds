// Import the 'fs' module using ES module syntax
import { readFileSync, writeFileSync } from 'fs';

// Load your exported tokens file
const tokens = JSON.parse(readFileSync("src/tokens/design.tokens30in30.json", "utf8"));

// Initialize separate objects for primitives and decisions
const primitives = {};
const decisions = {};

// Function to classify tokens
function classifyTokens(obj, parentKey = "") {
  Object.entries(obj).forEach(([key, value]) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof value === "object" && value.value === undefined) {
      classifyTokens(value, fullKey);
    } else if (fullKey.includes("-")) {
      // Decisions often have more descriptive names
      decisions[fullKey] = value;
    } else {
      // Primitives have simpler, raw values
      primitives[fullKey] = value;
    }
  });
}

classifyTokens(tokens);

// Save the split tokens into new files
writeFileSync("src/tokens/primitives.json", JSON.stringify(primitives, null, 2));
writeFileSync("src/tokens/decisions.json", JSON.stringify(decisions, null, 2));

console.log("Tokens split into primitives.json and decisions.json");
