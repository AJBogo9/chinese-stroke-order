import { animateCharacter, createWriter, getCurrentChar, animateNextStroke, animatePreviousStroke, getCurrentStrokeNum, getTotalStrokes, repeatCurrentStroke } from "./writer";

/**
 * Updates the stroke info display
 */
function updateStrokeInfo(): void {
  const strokeInfo = document.getElementById('strokeInfo');
  if (strokeInfo) {
    const current = getCurrentStrokeNum();
    const total = getTotalStrokes();
    if (total > 0 && current >= 0) {
      strokeInfo.textContent = `Stroke: ${current + 1} / ${total}`;
    } else {
      strokeInfo.textContent = 'Stroke: -';
    }
  }
}

/**
 * Initializes the application by setting up event listeners
 * and creating the initial character writer
 */
function initializeApp(): void {
  // Get references to DOM elements
  const charInput = document.getElementById('charInput') as HTMLInputElement;
  const animateBtn = document.getElementById('animateBtn') as HTMLButtonElement;
  const prevStrokeBtn = document.getElementById('prevStrokeBtn') as HTMLButtonElement;
  const nextStrokeBtn = document.getElementById('nextStrokeBtn') as HTMLButtonElement;

  // Button event listeners
  animateBtn.addEventListener('click', () => animateCharacter());
  
  nextStrokeBtn.addEventListener('click', () => {
    animateNextStroke();
    updateStrokeInfo();
  });
  
  prevStrokeBtn.addEventListener('click', () => {
    animatePreviousStroke();
    updateStrokeInfo();
  });

  // Input field event listeners
  charInput.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const char = charInput.value.trim();
      if (char.length === 1) {
        createWriter(char);
        updateStrokeInfo();
      }
    }
  });

  charInput.addEventListener('input', () => {
    const char = charInput.value.trim();
    if (char.length === 1) {
      createWriter(char);
      updateStrokeInfo();
    }
  });

  // Listen for stroke changes during animation
  window.addEventListener('strokeChanged', updateStrokeInfo);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    // Don't trigger shortcuts if user is typing in the input field
    if (document.activeElement === charInput) {
      return;
    }

    switch(e.key.toLowerCase()) {
      case 'a':
        e.preventDefault();
        animatePreviousStroke();
        updateStrokeInfo();
        break;
      
      case 'd':
        e.preventDefault();
        animateNextStroke();
        updateStrokeInfo();
        break;
      
      case 's':
        e.preventDefault();
        repeatCurrentStroke();
        break;
      
      case 'w':
        e.preventDefault();
        animateCharacter().then(() => updateStrokeInfo());
        break;
    }
  });

  // Initialize with default character
  createWriter(getCurrentChar());
  updateStrokeInfo();
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);