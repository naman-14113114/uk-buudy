/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// 1. Parse arguments
const args = process.argv.slice(2);
const targetArg = args.find((a) => a.startsWith('--target='));
const daysArg = args.find((a) => a.startsWith('--days='));

let targetDate = targetArg ? targetArg.split('=')[1] : null;
let daysToShift = null;
let targetProductHandle = null;

if (!targetDate && args.length > 0 && !args[0].startsWith('--')) {
  // Check if first arg is a number or date
  if (/^\d{4}-\d{2}-\d{2}$/.test(args[0])) {
    targetDate = args[0];
    targetProductHandle = args[1] || null;
  } else {
    daysToShift = parseInt(args[0], 10);
    if (!isNaN(daysToShift)) {
      targetProductHandle = args[1] || null;
    }
  }
} else if (daysArg) {
  daysToShift = parseInt(daysArg.split('=')[1], 10);
}

if (!targetDate && daysToShift === null) {
  // Default to 2026-11-22 target date if neither provided
  targetDate = '2026-11-22';
}

function addDaysToYmd(ymd, days) {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days, 12, 0, 0));
  const newY = dt.getUTCFullYear();
  const newM = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const newD = String(dt.getUTCDate()).padStart(2, '0');
  return `${newY}-${newM}-${newD}`;
}

function daysBetweenYmd(fromYmd, toYmd) {
  const [y1, m1, d1] = fromYmd.split('-').map(Number);
  const [y2, m2, d2] = toYmd.split('-').map(Number);
  const t1 = Date.UTC(y1, m1 - 1, d1);
  const t2 = Date.UTC(y2, m2 - 1, d2);
  return Math.round((t2 - t1) / (24 * 3600 * 1000));
}

// Main logic
function updateDatesInFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const reviews = JSON.parse(fileContent);
    if (!Array.isArray(reviews) || reviews.length === 0) return;

    let maxDateBefore = '';
    let minDateBefore = '9999-99-99';

    reviews.forEach(review => {
      const curDate = review.displayDate || (review.date ? review.date.slice(0, 10) : '');
      if (curDate && curDate > maxDateBefore) maxDateBefore = curDate;
      if (curDate && curDate < minDateBefore) minDateBefore = curDate;
    });

    let shift = daysToShift;
    if (targetDate) {
      if (!maxDateBefore) return;
      shift = daysBetweenYmd(maxDateBefore, targetDate);
    }

    let updatedCount = 0;
    let minDateAfter = '9999-99-99';
    let maxDateAfter = '';

    reviews.forEach(review => {
      const curYmd = review.displayDate || (review.date ? review.date.slice(0, 10) : '');
      if (curYmd) {
        const newYmd = addDaysToYmd(curYmd, shift);
        review.displayDate = newYmd;

        // Preserve time portion if present in "YYYY-MM-DD HH:mm:ss +0000 UTC"
        const timeMatch = review.date && review.date.match(/\d{4}-\d{2}-\d{2}(\s+\d{2}:\d{2}:\d{2}\s+\+0000\s+UTC)/);
        if (timeMatch) {
          review.date = `${newYmd}${timeMatch[1]}`;
        } else {
          review.date = `${newYmd} 00:00:00 +0000 UTC`;
        }

        if (newYmd < minDateAfter) minDateAfter = newYmd;
        if (newYmd > maxDateAfter) maxDateAfter = newYmd;
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2) + '\n', 'utf-8');
      console.log(`Updated ${updatedCount} reviews in ${path.basename(filePath)} (shift: ${shift >= 0 ? '+' : ''}${shift} days):`);
      console.log(`  Before: min=${minDateBefore}, max=${maxDateBefore}`);
      console.log(`  After:  min=${minDateAfter}, max=${maxDateAfter}`);
    }
  } catch (error) {
    console.error(`Failed to process ${filePath}:`, error.message);
  }
}

// Find files to process
const rootDir = process.cwd();
let reviewDirs = [];

const appsDir = path.join(rootDir, 'apps');
if (fs.existsSync(appsDir)) {
  const apps = fs.readdirSync(appsDir);
  apps.forEach(app => {
    const reviewsDir = path.join(appsDir, app, 'src', 'data', 'reviews');
    if (fs.existsSync(reviewsDir)) {
      reviewDirs.push(reviewsDir);
    }
  });
} else {
  // Fallback if not in monorepo root but in individual app root
  const reviewsDir = path.join(rootDir, 'src', 'data', 'reviews');
  if (fs.existsSync(reviewsDir)) {
    reviewDirs.push(reviewsDir);
  }
}

if (reviewDirs.length === 0) {
  console.log('No reviews directories found. Ensure you are running this from the monorepo root or an app root.');
  process.exit(0);
}

let totalUpdatedFiles = 0;

reviewDirs.forEach(reviewsDir => {
  const files = fs.readdirSync(reviewsDir);
  files.forEach(file => {
    if (!file.endsWith('.json') || file === 'customer_org_review.json') return;
    
    // If a target product handle is provided, only process matching file
    if (targetProductHandle) {
      const expectedFileName = `${targetProductHandle}-reviews.json`;
      if (file !== expectedFileName && file !== targetProductHandle) {
        return;
      }
    }
    
    const filePath = path.join(reviewsDir, file);
    updateDatesInFile(filePath);
    totalUpdatedFiles++;
  });
});

console.log(`Finished processing. Checked/Updated ${totalUpdatedFiles} files.`);
