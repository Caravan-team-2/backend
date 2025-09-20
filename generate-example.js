const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env");
const examplePath = path.join(__dirname, ".env.example");

if (!fs.existsSync(envPath)) {
  console.error(".env file not found!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");

const exampleContent = envContent
  .split("\n")
  .map((line) => {
    // Keep comments and empty lines
    if (line.trim().startsWith("#") || line.trim() === "") {
      return line;
    }
    // Extract key before '='
    const [key] = line.split("=");
    return `${key}=`;
  })
  .join("\n");

fs.writeFileSync(examplePath, exampleContent);

console.log(".env.example generated successfully!");

