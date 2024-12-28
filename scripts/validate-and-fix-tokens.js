import fs from "fs";
import path from "path";

const primitivesPath = "src/tokens/primitives.json";
const decisionsPath = "src/tokens/decisions.json";

const primitives = JSON.parse(fs.readFileSync(primitivesPath, "utf8"));
const decisions = JSON.parse(fs.readFileSync(decisionsPath, "utf8"));

const unresolvedReferences = [];
const corrections = [];

// Function to check if a path exists in primitives
function doesReferenceExist(reference) {
  const pathParts = reference.replace(/^{|}$/g, "").toLowerCase().split(".");
  let current = primitives;
  for (const part of pathParts) {
    if (current && current[part]) {
      current = current[part];
    } else {
      return false;
    }
  }
  return true;
}

// Function to suggest corrections (case-insensitive matching)
function suggestCorrection(reference) {
  const allPrimitivePaths = getAllPaths(primitives).map(path => path.toLowerCase());
  const referencePath = reference.replace(/^{|}$/g, "").toLowerCase();
  return allPrimitivePaths.filter(primitivePath => primitivePath.includes(referencePath));
}

// Function to get all paths in primitives
function getAllPaths(obj, parentPath = "") {
  const paths = [];
  Object.entries(obj).forEach(([key, value]) => {
    const currentPath = parentPath ? `${parentPath}.${key}` : key;
    if (typeof value === "object" && !value["$value"]) {
      paths.push(...getAllPaths(value, currentPath));
    } else {
      paths.push(currentPath);
    }
  });
  return paths;
}

// Function to validate decisions
function validateDecisions(obj) {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "object" && !Array.isArray(value)) {
      validateDecisions(value); // Recursively validate nested objects
    } else if (key === "$value" && typeof value === "string" && value.startsWith("{")) {
      const reference = value;
      if (!doesReferenceExist(reference)) {
        unresolvedReferences.push(reference);
        const suggested = suggestCorrection(reference);
        if (suggested.length > 0) {
          corrections.push({ reference, suggested });
        }
      }
    }
  });
}

// Run validation
validateDecisions(decisions);

// Output results
console.log("Validation Completed!");
console.log(`Unresolved References: ${unresolvedReferences.length}`, unresolvedReferences);
console.log(`Suggestions for Corrections: ${corrections.length}`, corrections);

// Save unresolved references and corrections for manual review
fs.writeFileSync(
  "unresolved-references.json",
  JSON.stringify({ unresolvedReferences, corrections }, null, 2)
);
