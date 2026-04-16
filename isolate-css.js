const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const prefixer = require('postcss-prefix-selector');

async function run() {
  const url = 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.css';
  console.log('Fetching', url);
  const response = await fetch(url);
  const css = await response.text();

  console.log('Processing CSS...');
  const result = await postcss([
    prefixer({
      prefix: '.formio-isolated',
      transform(prefix, selector, prefixedSelector) {
        if (selector === 'body' || selector === 'html') {
          return prefix;
        }
        return prefixedSelector;
      }
    })
  ]).process(css, { from: undefined });

  const outPath = path.join(__dirname, 'public', 'formio-isolated.css');
  fs.writeFileSync(outPath, result.css);
  console.log('Wrote', outPath);
}

run().catch(console.error);
