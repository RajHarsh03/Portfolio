// Disable right-click context menu
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// Block DevTools keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12') { e.preventDefault(); return false; }
    // Ctrl+Shift+I (DevTools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') { e.preventDefault(); return false; }
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') { e.preventDefault(); return false; }
    // Ctrl+Shift+C (Inspect element)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') { e.preventDefault(); return false; }
    // Ctrl+U (View source)
    if (e.ctrlKey && e.key === 'u') { e.preventDefault(); return false; }
    // Ctrl+S (Save page)
    if (e.ctrlKey && e.key === 's') { e.preventDefault(); return false; }
});

// Disable drag on images
document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') e.preventDefault();
});

// Disable text selection
document.addEventListener('selectstart', function (e) {
    e.preventDefault();
});
