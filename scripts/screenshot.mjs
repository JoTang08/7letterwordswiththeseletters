import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "../public/images");

const pages = [
  { n: 3,  url: "http://localhost:3000/3-letter-words-with-these-letters/",  file: "3-letter-words-finder.png" },
  { n: 4,  url: "http://localhost:3000/4-letter-words-with-these-letters/",  file: "4-letter-words-finder.png" },
  { n: 5,  url: "http://localhost:3000/5-letter-words-with-these-letters/",  file: "5-letter-words-finder.png" },
  { n: 6,  url: "http://localhost:3000/6-letter-words-with-these-letters/",  file: "6-letter-words-finder.png" },
  { n: 7,  url: "http://localhost:3000/",                                    file: "7-letter-words-finder.png" },
  { n: 8,  url: "http://localhost:3000/8-letter-words-with-these-letters/",  file: "8-letter-words-finder.png" },
  { n: 9,  url: "http://localhost:3000/9-letter-words-with-these-letters/",  file: "9-letter-words-finder.png" },
  { n: 10, url: "http://localhost:3000/10-letter-words-with-these-letters/", file: "10-letter-words-finder.png" },
  { n: 11, url: "http://localhost:3000/11-letter-words-with-these-letters/", file: "11-letter-words-finder.png" },
];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });

for (const { n, url, file } of pages) {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const outPath = path.join(outputDir, file);
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(`✓ ${n}-letter → ${file}`);
  await page.close();
}

await browser.close();
console.log("Done.");
