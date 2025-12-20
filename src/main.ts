import {
  initializeApp,
  createWriter,
  animateCharacter,
  animateNextStroke,
  animatePreviousStroke,
  repeatCurrentStroke,
  getCurrentStrokeNum,
  getTotalStrokes
} from './hanzi-writer';

// Update stroke info display
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

// Initialize app on load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the app with saved or default character
  initializeApp();

  // Set up input handler
  const charInput = document.getElementById('charInput') as HTMLInputElement;
  if (charInput) {
    charInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const char = target.value.trim();
      if (char && /[\u4e00-\u9fa5]/.test(char)) {
        createWriter(char);
      }
    });
  }

  // Set up button handlers
  const animateBtn = document.getElementById('animateBtn');
  if (animateBtn) {
    animateBtn.addEventListener('click', () => {
      animateCharacter();
    });
  }

  const nextStrokeBtn = document.getElementById('nextStrokeBtn');
  if (nextStrokeBtn) {
    nextStrokeBtn.addEventListener('click', () => {
      animateNextStroke();
    });
  }

  const prevStrokeBtn = document.getElementById('prevStrokeBtn');
  if (prevStrokeBtn) {
    prevStrokeBtn.addEventListener('click', () => {
      animatePreviousStroke();
    });
  }

  const repeatStrokeBtn = document.getElementById('repeatStrokeBtn');
  if (repeatStrokeBtn) {
    repeatStrokeBtn.addEventListener('click', () => {
      repeatCurrentStroke();
    });
  }

  // Set up keyboard handlers (WASD controls)
  document.addEventListener('keydown', (e) => {
    // Don't trigger if user is typing in input field
    if (document.activeElement?.tagName === 'INPUT') {
      return;
    }

    switch (e.key.toLowerCase()) {
      case 'w':
        e.preventDefault();
        animateCharacter();
        break;
      case 'a':
        e.preventDefault();
        animatePreviousStroke();
        break;
      case 's':
        e.preventDefault();
        repeatCurrentStroke();
        break;
      case 'd':
        e.preventDefault();
        animateNextStroke();
        break;
    }
  });

  // Listen for stroke changes to update display
  window.addEventListener('strokeChanged', () => {
    updateStrokeInfo();
  });

  // Initial stroke info update
  updateStrokeInfo();
});