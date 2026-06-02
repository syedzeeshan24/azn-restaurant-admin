const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace padding
  content = content.replace(/className="p-10 /g, 'className="p-4 md:p-10 ');
  content = content.replace(/className="p-10"/g, 'className="p-4 md:p-10"');

  // Replace text-5xl
  content = content.replace(/text-5xl/g, 'text-3xl md:text-5xl');

  // Replace flex header
  content = content.replace(/<div className="flex justify-between items-end">/g, '<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">');
  
  // Also replace Dashboard flex header if different
  content = content.replace(/<div className="flex justify-between items-center mb-8">/g, '<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-0">');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
