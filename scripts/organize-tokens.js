import fs from "fs";

// Load the tokens
const tokens = JSON.parse(fs.readFileSync("src/tokens/design.tokens30in30.json", "utf8"));

// Output file paths
const primitiveFile = "src/tokens/primitives.json";
const decisionFile = "src/tokens/decisions.json";

// Extract and organize primitives
const primitives = tokens.Primitive || {};
const decisions = tokens.Decision || {};

// Clean up primitives
function cleanPrimitives(obj) {
  const cleaned = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "object") {
      cleaned[key] = cleanPrimitives(value); // Recursively clean nested objects
    } else {
      cleaned[key] = value; // Copy value directly
    }
  });
  return cleaned;
}

// Clean up decisions and replace raw values with references
function cleanDecisions(obj) {
  const cleaned = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "object" && !Array.isArray(value)) {
      cleaned[key] = cleanDecisions(value); // Recursively clean nested objects
    } else if (typeof value === "string" && value.startsWith("{Primitive")) {
      cleaned[key] = value; // Keep references as-is
    } else {
      cleaned[key] = value; // Copy other values directly
    }
  });
  return cleaned;
}

// Clean and organize tokens
const organizedPrimitives = cleanPrimitives(primitives);
const organizedDecisions = cleanDecisions(decisions);

// Save cleaned tokens to files
fs.writeFileSync(primitiveFile, JSON.stringify(organizedPrimitives, null, 2));
fs.writeFileSync(decisionFile, JSON.stringify(organizedDecisions, null, 2));

console.log(`Primitives saved to ${primitiveFile}`);
console.log(`Decisions saved to ${decisionFile}`);
