// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const charInput = document.getElementById('charInput');
    const animateBtn = document.getElementById('animateBtn');
    const quizBtn = document.getElementById('quizBtn');
    const outlineBtn = document.getElementById('outlineBtn');

    // Button event listeners
    animateBtn.addEventListener('click', animateCharacter);
    quizBtn.addEventListener('click', quizCharacter);
    outlineBtn.addEventListener('click', showOutline);

    // Input field event listeners
    charInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const char = this.value.trim();
            if (char.length === 1) {
                createWriter(char);
            }
        }
    });

    charInput.addEventListener('input', function(e) {
        const char = this.value.trim();
        if (char.length === 1) {
            createWriter(char);
        }
    });

    // Initialize with default character
    createWriter(currentChar);
});