const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');
const files = ['UserControl.jsx', 'Riders.jsx', 'Menu.jsx', 'Dashboard.jsx', 'Customers.jsx', 'Coupons.jsx'];

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // If it's already wrapped, skip
  if (content.includes('overflow-x-auto')) {
      console.log(`Skipping ${file}, already has overflow-x-auto`);
      return;
  }

  content = content.replace(/<table className="w-full text-left">/g, '<div className="overflow-x-auto w-full -mx-4 md:mx-0 px-4 md:px-0">\n        <table className="w-full text-left min-w-[800px]">');
  
  content = content.replace(/<\/table>/g, '</table>\n      </div>');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated tables in ${file}`);
});
