// Type definitions for HanziWriter
interface HanziWriterOptions {
  width: number;
  height: number;
  padding: number;
  showOutline: boolean;
  strokeColor: string;
  radicalColor: string;
  delayBetweenStrokes: number;
  strokeAnimationSpeed: number;
  onLoadCharDataError?: (error: Error) => void;
}

interface QuizOptions {
  onComplete?: () => void;
  onMistake?: (strokeData: any) => void;
}

interface HanziWriter {
  animateCharacter(): void;
  quiz(options?: QuizOptions): void;
  showOutline(): void;
  hideOutline(): void;
  setCharacter(character: string): void;
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
    };
  }
}

// HanziWriter management
let writer: HanziWriter | null = null;
let currentChar: string = '你';

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
  
  const options: HanziWriterOptions = {
    width: 300,
    height: 300,
    padding: 5,
    showOutline: true,
    strokeColor: '#555',
    radicalColor: '#168F16',
    delayBetweenStrokes: 500,
    strokeAnimationSpeed: 1,
    onLoadCharDataError: (error: Error) => {
      target.innerHTML = '<p style="color: red;">Character not found or not supported.</p>';
      console.error('HanziWriter error:', error);
    }
  };
  
  writer = window.HanziWriter.create('character-target', character, options);
  currentChar = character;
}

/**
 * Animates the stroke order of the current character
 */
export function animateCharacter(): void {
  if (writer) {
    writer.animateCharacter();
  }
}

/**
 * Starts a quiz mode for the current character
 */
export function quizCharacter(): void {
  if (writer) {
    const quizOptions: QuizOptions = {
      onComplete: () => {
        alert('Great job! 很好！');
      }
    };
    writer.quiz(quizOptions);
  }
}

/**
 * Shows the outline of the current character
 */
export function showOutline(): void {
  if (writer) {
    writer.showOutline();
  }
}

/**
 * Gets the current character being displayed
 */
export function getCurrentChar(): string {
  return currentChar;
}