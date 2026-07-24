const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, 'src', 'lib');
const files = fs.readdirSync(libDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(libDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove the import statement for getRequest
  content = content.replace(/import\s+{\s*getRequest\s*}\s*from\s*['"]@tanstack\/react-start\/server['"];?\r?\n?/g, '');

  // Remove the getReqOrThrow function block
  content = content.replace(/function\s+getReqOrThrow\s*\(\)\s*{[\s\S]*?return\s+req;\s*}\r?\n?/g, '');

  // In admin.functions.ts, remove specific leftover lines:
  // const req = getRequest();
  // if (!req) throw new Error("No request");
  // const auth = await getAuth(req);
  content = content.replace(/\s*const req = getRequest\(\);\s*if \(!req\) throw new Error\("No request"\);\s*const auth = await getAuth\(req\);/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Cleanup complete');
