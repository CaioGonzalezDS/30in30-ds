import fs from "fs";

const decisionsPath = "src/tokens/decisions.json";
const decisions = JSON.parse(fs.readFileSync(decisionsPath, "utf8"));

// Function to update references
function updateReferences(obj) {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "object") {
      updateReferences(value);
    } else if (key === "$value" && value.startsWith("{Primitive.")) {
      obj[key] = value.replace("{Primitive.", "{");
      console.log(`Updated reference: ${value} -> ${obj[key]}`);
    }
  });
}

updateReferences(decisions);

// Save updated decisions.json
fs.writeFileSync(decisionsPath, JSON.stringify(decisions, null, 2));
console.log("Updated references in decisions.json.");
