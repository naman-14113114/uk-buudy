const fs = require('fs');
const path = require('path');

// 1. Parse arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Error: Please provide the number of days to shift as the first argument.');
  console.error('Usage: node update-review-dates.js <days> [product-handle]');
  process.exit(1);
}

const daysToShift = parseInt(args[0], 10);
if (isNaN(daysToShift)) {
  console.error('Error: The first argument must be a valid number.');
  process.exit(1);
}

const targetProductHandle = args[1] || null;

// Helper to format date as "YYYY-MM-DD 00:00:00 +0000 UTC"
function formatFullDate(dateObj) {
  const yyyy = dateObj.getUTCFullYear();
  const mm = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} 00:00:00 +0000 UTC`;
}

// Helper to format date as "YYYY-MM-DD"
function formatDisplayDate(dateObj) {
  const yyyy = dateObj.getUTCFullYear();
  const mm = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Main logic
function updateDatesInFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const reviews = JSON.parse(fileContent);
    let updatedCount = 0;

    reviews.forEach(review => {
      if (review.date) {
        // Extract the "YYYY-MM-DD" part and parse it as UTC to avoid local timezone shifts
        const dateStr = review.date.split(' ')[0];
        const dateObj = new Date(`${dateStr}T00:00:00Z`);
        
        // Add/subtract days
        dateObj.setUTCDate(dateObj.getUTCDate() + daysToShift);
        
        // Format back
        review.date = formatFullDate(dateObj);
        review.displayDate = formatDisplayDate(dateObj);
        
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2) + '\n', 'utf-8');
      console.log(`Updated ${updatedCount} reviews in ${filePath}`);
    } else {
      console.log(`No reviews found to update in ${filePath}`);
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
    if (!file.endsWith('.json')) return;
    
    // If a target product handle is provided, only process matching file
    if (targetProductHandle) {
      const expectedFileName = `${targetProductHandle}-reviews.json`;
      if (file !== expectedFileName) {
        return;
      }
    }
    
    const filePath = path.join(reviewsDir, file);
    updateDatesInFile(filePath);
    totalUpdatedFiles++;
  });
});

console.log(`Finished processing. Checked/Updated ${totalUpdatedFiles} files.`);
