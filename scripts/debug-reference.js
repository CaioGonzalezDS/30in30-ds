import fs from "fs";

// Load primitives file
const primitivesPath = "src/tokens/primitives.json";
const primitives = JSON.parse(fs.readFileSync(primitivesPath, "utf8"));

// Ensure primitives.Primitive exists
if (!primitives.Primitive) {
  console.error("Error: 'Primitive' key is missing in primitives.json");
  process.exit(1);
}

// Function to trace path resolution
function tracePath(reference, base) {
  const pathParts = reference.replace(/^{|}$/g, "").split(".");
  let current = base;
  console.log(`Tracing path for ${reference}:`);
  for (const part of pathParts) {
    console.log(`  Looking for key: "${part}" in`, current);
    if (current && current[part]) {
      current = current[part];
    } else {
      console.log(`  Key "${part}" not found at this level.`);
      return false;
    }
  }
  console.log("  Reference resolved successfully:", current);
  return true;
}

// References to debug
const referencesToCheck = [
  "{Primitive.Colors.Red.600}",
  "{Primitive.Colors.Jelly bean.500}"
];

// Debug each reference
referencesToCheck.forEach((reference) => {
  const result = tracePath(reference, primitives.Primitive)
    ? "Exists"
    : "Not Found";
  console.log(`Checking ${reference}: ${result}`);
});
