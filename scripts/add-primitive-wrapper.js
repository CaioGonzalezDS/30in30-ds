import fs from "fs";

const primitivesPath = "src/tokens/primitives.json";

// Load primitives file
const primitives = JSON.parse(fs.readFileSync(primitivesPath, "utf8"));

// Check if "Primitive" key is already present
if (!primitives.Primitive) {
  const updatedPrimitives = { Primitive: primitives };
  fs.writeFileSync(primitivesPath, JSON.stringify(updatedPrimitives, null, 2));
  console.log("Wrapped primitives in 'Primitive' key and saved.");
} else {
  console.log("'Primitive' key already exists.");
}
