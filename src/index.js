const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

/**
 * Extracts links in Markdown format [text](url)
 */
function extractLinks(markdownText) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  while ((match = linkRegex.exec(markdownText)) !== null) {
    links.push({ text: match[1], url: match[2] });
  }
  return links;
}

/**
 * Validates a single URL
 */
function checkUrl(urlStr, timeoutMs = 5000) {
  return new Promise((resolve) => {
    if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
      // Local file check
      resolve({ url: urlStr, status: fs.existsSync(path.resolve(urlStr)) ? 'ALIVE' : 'DEAD' });
      return;
    }

    const client = urlStr.startsWith('https://') ? https : http;
    const req = client.request(urlStr, { method: 'HEAD', timeout: timeoutMs }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve({ url: urlStr, status: 'ALIVE' });
      } else {
        resolve({ url: urlStr, status: 'DEAD' });
      }
    });

    req.on('error', () => {
      resolve({ url: urlStr, status: 'DEAD' });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ url: urlStr, status: 'DEAD' });
    });

    req.end();
  });
}

/**
 * Main Runner
 */
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: md-link-checker <file-path.md> [--timeout <ms>]');
    process.exit(0);
  }

  // Parse timeout argument
  let timeoutMs = 5000;
  const timeoutIndex = args.indexOf('--timeout');
  if (timeoutIndex !== -1 && args[timeoutIndex + 1]) {
    timeoutMs = parseInt(args[timeoutIndex + 1], 10);
    // Remove option from list of targets
    args.splice(timeoutIndex, 2);
  }

  const filePath = path.resolve(args[0]);
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at path: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const links = extractLinks(content);

  console.log(`Found ${links.length} link(s) in file. Validating with ${timeoutMs}ms timeout...\n`);

  const checks = links.map(l => checkUrl(l.url, timeoutMs));
  const results = await Promise.all(checks);

  results.forEach(res => {
    const symbol = res.status === 'ALIVE' ? '✅' : '❌';
    console.log(`${symbol} ${res.url} is ${res.status}`);
  });
}

if (require.main === module) {
  main();
}

module.exports = { extractLinks, checkUrl };
