const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  const targets = ['privacy-policy', 'return-policy', 'shipping-policy', 'refund-policy', 'cookies-policy', 'terms-of-service'];
  
  for (const target of targets) {
    // Replace object property hrefs (e.g. href: "/privacy-policy")
    newContent = newContent.split(`href: "/${target}"`).join(`href: "/policies/${target}"`);
    
    // Replace JSX prop hrefs (e.g. href="/privacy-policy")
    newContent = newContent.split(`href="/${target}"`).join(`href="/policies/${target}"`);
  }
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated links in', file);
  }
}
