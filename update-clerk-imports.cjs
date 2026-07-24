const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, "src"));
files.push(path.join(__dirname, "scripts", "create-developer.ts"));

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  if (content.includes("@clerk/tanstack-start")) {
    content = content.replace(/@clerk\/tanstack-start/g, "@clerk/tanstack-react-start");
    fs.writeFileSync(file, content, "utf8");
    console.log("Updated", file);
  }
}
