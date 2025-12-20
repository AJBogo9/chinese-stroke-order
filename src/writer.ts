// Type definitions for HanziWriter
interface HanziWriterOptions {
  width: number;
  height: number;
  padding: number;
  showOutline: boolean;
  showCharacter: boolean;
  strokeColor: string;
  outlineColor: string;
  radicalColor: string;
  delayBetweenStrokes: number;
  strokeAnimationSpeed: number;
  strokeHighlightSpeed: number;
  highlightColor: string;
  onLoadCharDataSuccess?: (data: CharacterData) => void;
  onLoadCharDataError?: (error: Error) => void;
}

interface CharacterData {
  strokes: string[];
  medians: number[][][];
}

interface HanziWriter {
  animateCharacter(options?: any): Promise<void>;
  animateStroke(strokeNum: number, options?: any): Promise<void>;
  highlightStroke(strokeNum: number, options?: any): Promise<void>;
  setCharacter(character: string): void;
  hideCharacter(options?: any): void;
  showCharacter(options?: any): void;
  pauseAnimation(): void;
  cancelAnimation(): void;
}

// Extend Window interface to include HanziWriter
declare global {
  interface Window {
    HanziWriter: {
      create(
        element: string | HTMLElement,
        character: string,
        options: HanziWriterOptions
      ): HanziWriter;
      loadCharacterData(character: string): Promise<CharacterData>;
    };
  }
}

// HanziWriter management
let writer: HanziWriter | null = null;
let currentChar: string = '你';
let currentStrokeNum: number = -1;
let characterData: CharacterData | null = null;
let isAnimating: boolean = false;

/**
 * Detects if the user prefers dark mode
 */
function isDarkMode(): boolean {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Stops any running animation
 */
function stopAnimation(): void {
  if (writer && isAnimating) {
    writer.pauseAnimation();
    isAnimating = false;
  }
}

/**
 * Gets the total number of strokes in the current character
 */
export function getTotalStrokes(): number {
  if (!characterData) {
    return 0;
  }
  return characterData.strokes.length;
}

/**
 * Creates a new HanziWriter instance for the given character
 * @param character - The Chinese character to display
 */
export function createWriter(character: string): void {
  const target = document.getElementById('character-target');
  if (!target) {
    console.error('Character target element not found');
    return;
  }

  target.innerHTML = '';
  currentStrokeNum = -1;
  characterData = null;
  isAnimating = false;

  // Choose colors based on theme
  const darkMode = isDarkMode();
  
  const options: HanziWriterOptions = {
    width: 300,
    height: 300,
    padding: 5,
    showOutline: true,
    showCharacter: true,
    strokeColor: darkMode ? '#e5e5e5' : '#1a1a1a',
    outlineColor: darkMode ? '#404040' : '#d0d0d0',
    radicalColor: darkMode ? '#a0a0a0' : '#606060',
    highlightColor: darkMode ? '#4A90E2' : '#FF6B6B',
    strokeHighlightSpeed: 1,
    delayBetweenStrokes: 500,
    strokeAnimationSpeed: 1,
    onLoadCharDataSuccess: (data: CharacterData) => {
      characterData = data;
      // Highlight the first stroke when character loads
      if (writer && data.strokes.length > 0) {
        currentStrokeNum = 0;
        window.dispatchEvent(new CustomEvent('strokeChanged'));
      }
    },
    onLoadCharDataError: (error: Error) => {
      target.innerHTML = '<p style="color: red;">Character not found or not supported.</p>';
      console.error('HanziWriter error:', error);
      characterData = null;
    }
  };

  writer = window.HanziWriter.create('character-target', character, options);
  currentChar = character;
}

/**
 * Highlights all strokes from next position to the end
 */
export async function animateCharacter(): Promise<void> {
  if (!writer || !characterData) return;
  
  stopAnimation();
  isAnimating = true;
  
  const totalStrokes = getTotalStrokes();
  if (totalStrokes === 0) {
    isAnimating = false;
    return;
  }
  
  // Start from next stroke after current position
  let startIndex = currentStrokeNum + 1;
  
  // If we're at or past the last stroke, loop to beginning
  if (startIndex >= totalStrokes) {
    startIndex = 0;
  }
  
  // Highlight from start position to end
  for (let i = startIndex; i < totalStrokes && isAnimating; i++) {
    currentStrokeNum = i;
    window.dispatchEvent(new CustomEvent('strokeChanged'));
    await writer.highlightStroke(i);
  }
  
  isAnimating = false;
}

/**
 * Highlights the next stroke in the sequence
 */
export function animateNextStroke(): void {
  if (!writer || !characterData) return;
  
  stopAnimation();
  
  const totalStrokes = getTotalStrokes();
  if (totalStrokes === 0) return;
  
  // Increment and wrap around
  currentStrokeNum++;
  if (currentStrokeNum >= totalStrokes) {
    currentStrokeNum = 0;
  }
  
  writer.highlightStroke(currentStrokeNum);
}

/**
 * Highlights the previous stroke in the sequence
 */
export function animatePreviousStroke(): void {
  if (!writer || !characterData) return;
  
  stopAnimation();
  
  const totalStrokes = getTotalStrokes();
  if (totalStrokes === 0) return;
  
  // Decrement and wrap around
  currentStrokeNum--;
  if (currentStrokeNum < 0) {
    currentStrokeNum = totalStrokes - 1;
  }
  
  writer.highlightStroke(currentStrokeNum);
}

/**
 * Repeats the highlight for the current stroke
 */
export function repeatCurrentStroke(): void {
  if (!writer || !characterData) return;
  if (currentStrokeNum < 0) return;
  
  stopAnimation();
  
  writer.highlightStroke(currentStrokeNum);
}

/**
 * Gets the current stroke number (0-indexed)
 */
export function getCurrentStrokeNum(): number {
  return currentStrokeNum;
}

/**
 * Gets the current character being displayed
 */
export function getCurrentChar(): string {
  return currentChar;
}