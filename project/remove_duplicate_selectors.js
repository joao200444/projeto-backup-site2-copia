const fs = require('fs');
const path = require('path');

function removeDuplicateSelectors(filePath) {
    const css = fs.readFileSync(filePath, 'utf8');
    const lines = css.split('\n');
    const uniqueSelectors = new Set();
    const cleanedLines = [];
    let inSelector = false;
    let currentSelector = '';

    for (const line of lines) {
        if (line.trim().endsWith('{')) {
            currentSelector = line.trim().replace('{', '').trim();
            if (!uniqueSelectors.has(currentSelector)) {
                uniqueSelectors.add(currentSelector);
                cleanedLines.push(line);
                inSelector = true;
            } else {
                console.log(`Skipping duplicate selector: ${currentSelector}`);
                inSelector = false;
            }
        } else if (inSelector) {
            cleanedLines.push(line);
        }
    }

    fs.writeFileSync(filePath, cleanedLines.join('\n'));
    console.log(`Removed duplicate selectors from ${filePath}`);
}

removeDuplicateSelectors(path.join(__dirname, 'styles.css'));
