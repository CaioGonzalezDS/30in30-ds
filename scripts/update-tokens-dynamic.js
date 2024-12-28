import fs from "fs";
import path from "path";

// Define paths
const tokensDir = "src/tokens";
const primitivesPath = path.join(tokensDir, "primitives.json");
const decisionsPath = path.join(tokensDir, "decisions.json");

// Find the new tokens file dynamically
const allFiles = fs.readdirSync(tokensDir);
const newTokensFile = allFiles.find(
  file => file !== "primitives.json" && file !== "decisions.json"
);

// Ensure the new tokens file exists
if (!newTokensFile) {
  console.error("No valid tokens file found in the directory!");
  process.exit(1);
}

console.log(`Using '${newTokensFile}' as the source file for updates.`);

// Load files
const newTokensPath = path.join(tokensDir, newTokensFile);
const newTokens = JSON.parse(fs.readFileSync(newTokensPath, "utf8"));
const primitives = JSON.parse(fs.readFileSync(primitivesPath, "utf8"));
const decisions = JSON.parse(fs.readFileSync(decisionsPath, "utf8"));

// Initialize logs
const addedPrimitives = [];
const updatedPrimitives = [];
const removedPrimitives = [];
const addedDecisions = [];
const updatedDecisions = [];
const removedDecisions = [];

// Update primitives with logging
function updatePrimitives(existing, updates) {
  Object.entries(updates.Primitive || {}).forEach(([key, value]) => {
    if (!existing[key]) {
      addedPrimitives.push(key);
    } else if (existing[key].value !== value.value) {
      updatedPrimitives.push(key);
    }
    existing[key] = value; // Add or update
  });
  return existing;
}

// Update decisions with logging
function updateDecisions(existing, updates) {
  Object.entries(updates.Decision || {}).forEach(([key, value]) => {
    if (!existing[key]) {
      addedDecisions.push(key);
    } else if (existing[key].value !== value.value) {
      updatedDecisions.push(key);
    }
    existing[key] = value; // Add or update
  });
  return existing;
}

// Remove tokens with logging
function cleanUpTokens(existing, updates, removedTokens) {
  const updateKeys = new Set(Object.keys(updates));
  return Object.keys(existing)
    .filter(key => {
      if (!updateKeys.has(key)) {
        removedTokens.push(key);
        return false; // Mark for removal
      }
      return true;
    })
    .reduce((acc, key) => {
      acc[key] = existing[key];
      return acc;
    }, {});
}

// Process updates and removals
const cleanedPrimitives = cleanUpTokens(
  updatePrimitives(primitives, newTokens),
  newTokens.Primitive || {},
  removedPrimitives
);
const cleanedDecisions = cleanUpTokens(
  updateDecisions(decisions, newTokens),
  newTokens.Decision || {},
  removedDecisions
);

// Write updated files
fs.writeFileSync(primitivesPath, JSON.stringify(cleanedPrimitives, null, 2));
fs.writeFileSync(decisionsPath, JSON.stringify(cleanedDecisions, null, 2));

// Log summary
console.log(`Added Primitives: ${addedPrimitives.length}`, addedPrimitives);
console.log(`Updated Primitives: ${updatedPrimitives.length}`, updatedPrimitives);
console.log(`Removed Primitives: ${removedPrimitives.length}`, removedPrimitives);
console.log(`Added Decisions: ${addedDecisions.length}`, addedDecisions);
console.log(`Updated Decisions: ${updatedDecisions.length}`, updatedDecisions);
console.log(`Removed Decisions: ${removedDecisions.length}`, removedDecisions);

console.log("Tokens have been updated!");
