import { animateCharacter, createWriter, getCurrentChar, quizCharacter, showOutline } from "./writer";

/**
 * Initializes the application by setting up event listeners
 * and creating the initial character writer
 */
function initializeApp(): void {
  // Get references to DOM elements
  const charInput = document.getElementById('charInput') as HTMLInputElement;
  const animateBtn = document.getElementById('animateBtn') as HTMLButtonElement;
  const quizBtn = document.getElementById('quizBtn') as HTMLButtonElement;
  const outlineBtn = document.getElementById('outlineBtn') as HTMLButtonElement;

  // Button event listeners
  animateBtn.addEventListener('click', () => animateCharacter());
  quizBtn.addEventListener('click', () => quizCharacter());
  outlineBtn.addEventListener('click', () => showOutline());

  // Input field event listeners
  charInput.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const char = charInput.value.trim();
      if (char.length === 1) {
        createWriter(char);
      }
    }
  });

  charInput.addEventListener('input', () => {
    const char = charInput.value.trim();
    if (char.length === 1) {
      createWriter(char);
    }
  });

  // Initialize with default character
  createWriter(getCurrentChar());
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);