console.log('Content script loaded!');

// Initialize the highlighting functionality
let isEnabled = false;

// Create message passing channel between popup and content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggle") {
        isEnabled = isEnabled ^ true;
        console.log('Toggle action received:' + isEnabled);
    }
    if (request.action === "download") {
        console.log("calling download");
        downloadHighlights();
    }
});

// Handle text selection
document.addEventListener('mouseup', () => {
    if (!isEnabled) return;

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
        console.log(selectedText);
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'yellow-highlight';
        span.textContent = selectedText;

        range.deleteContents();
        range.insertNode(span);

        // Save highlight
        saveHighlight(selectedText);
    }
});


// Save highlight to localStorage
function saveHighlight(text) {
    const highlights = JSON.parse(localStorage.getItem('highlights') || '{}');
    const url = window.location.href;

    if (!highlights[url]) {
        highlights[url] = [];
    }

    highlights[url].push(text);
    localStorage.setItem('highlights', JSON.stringify(highlights));
}

// Download highlights
function downloadHighlights() {
    const highlights = JSON.parse(localStorage.getItem('highlights') || '{}');
    const url = window.location.href;
    const pageHighlights = highlights[url] || [];

    let content = `URL: ${url}\n\nHighlights:\n`;
    pageHighlights.forEach((text, index) => {
        content += `${index + 1}. ${text}\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'highlights.txt';
    a.click();
    cleanLocalStorage();
}

function cleanLocalStorage() {
const highlights = JSON.parse(localStorage.getItem('highlights') || '{}');
    const url = window.location.href;

    if (!highlights[url]) {
        highlights[url] = [];
    }

    highlights[url] = [];
    localStorage.setItem('highlights', JSON.stringify(highlights));
}