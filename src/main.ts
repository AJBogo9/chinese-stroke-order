import { SUPPORTED } from './characters';
import * as writer from './writer';
import { state, type Mode } from './writer';

const HAN = /\p{Script=Han}/u;

const input = document.getElementById('charInput') as HTMLInputElement;
const target = document.getElementById('character-target') as HTMLElement;
const status = document.getElementById('status') as HTMLElement;
const watchControls = document.getElementById('watchControls') as HTMLElement;
const quizControls = document.getElementById('quizControls') as HTMLElement;
const outline = document.getElementById('outline') as HTMLInputElement;
const modeInputs = document.querySelectorAll<HTMLInputElement>('input[name="mode"]');

// a message about the input that replaces the status until the next change
let notice = '';

// storage fails in some private windows; the app works without it
function stored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function store(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function count(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

function statusText(): string {
  const { char, mode, load, strokes, stroke, mistakes, done } = state;
  if (load === 'loading') return `Loading ${char}…`;
  if (load === 'failed') return `Could not load the strokes of ${char}. Check your connection.`;
  if (mode === 'watch') return stroke < 0 ? count(strokes, 'stroke') : `Stroke ${stroke + 1} of ${strokes}`;
  if (done) return `Done with ${count(mistakes, 'mistake')}`;
  return `Stroke ${stroke + 1} of ${strokes}` + (mistakes > 0 ? `, ${count(mistakes, 'mistake')}` : '');
}

function render(): void {
  status.textContent = notice || statusText();
  document.body.dataset.mode = state.mode;
  watchControls.hidden = state.mode !== 'watch';
  quizControls.hidden = state.mode !== 'quiz';
  target.setAttribute(
    'aria-label',
    state.mode === 'watch' ? `Stroke order of ${state.char}` : `Drawing area for ${state.char}`,
  );
}

// the field keeps one character, so take the first new one typed or pasted next to it.
// after a failed load, typing the same character again retries it
function pickCharacter(): void {
  const chars = [...input.value];
  const typed = chars.filter((c) => c !== state.char);
  const retry = state.load === 'failed' && chars.includes(state.char);
  const char = typed.find((c) => SUPPORTED.has(c)) ?? (retry ? state.char : undefined);
  const unsupported = typed.find((c) => HAN.test(c));
  if (char) {
    input.value = char;
    notice = '';
    store('currentCharacter', char);
    writer.setCharacter(char);
  } else if (unsupported) {
    notice = `No stroke data for ${unsupported}`;
    render();
  } else if (chars.length > 1 && typed.length === 0) {
    // the same character typed again
    input.value = state.char;
  }
}

function size(): number {
  return Math.floor(target.clientWidth);
}

// ?embed: for an iframe on another page, which shows its own title and credits
const embed = new URLSearchParams(location.search).has('embed');
document.body.classList.toggle('embed', embed);
document.querySelector('h1')?.classList.toggle('sr-only', embed);

const saved = stored('currentCharacter');
const start = {
  char: saved && SUPPORTED.has(saved) ? saved : '你',
  mode: (stored('mode') === 'quiz' ? 'quiz' : 'watch') as Mode,
  outline: stored('showOutline') !== 'false',
};
input.value = start.char;
outline.checked = start.outline;
for (const radio of modeInputs) radio.checked = radio.value === start.mode;

writer.init(target, size(), start, () => {
  notice = '';
  render();
});

let currentSize = size();
new ResizeObserver(() => {
  if (size() === currentSize) return;
  currentSize = size();
  writer.resize(currentSize);
}).observe(target);

matchMedia('(prefers-color-scheme: light)').addEventListener('change', writer.applyTheme);

// chrome sends the last input event while still composing, firefox after compositionend
input.addEventListener('input', (e) => {
  if (!(e as InputEvent).isComposing) pickCharacter();
});
input.addEventListener('compositionend', pickCharacter);
input.addEventListener('blur', () => {
  input.value = state.char;
});

for (const radio of modeInputs) {
  radio.addEventListener('change', () => {
    store('mode', radio.value);
    writer.setMode(radio.value as Mode);
  });
}

outline.addEventListener('change', () => {
  store('showOutline', String(outline.checked));
  writer.setOutline(outline.checked);
});

document.getElementById('restartBtn')?.addEventListener('click', writer.restartQuiz);

const actions: Record<string, () => void> = {
  w: writer.animateAll,
  a: writer.previous,
  s: writer.repeat,
  d: writer.next,
};

for (const [key, action] of Object.entries(actions)) {
  document.querySelector(`[aria-keyshortcuts="${key.toUpperCase()}"]`)?.addEventListener('click', action);
}

document.addEventListener('keydown', (e) => {
  // chrome's autofill sends keydown events without a key
  const action = actions[e.key?.toLowerCase()];
  if (!action || e.ctrlKey || e.metaKey || e.altKey || e.target === input || state.mode !== 'watch') return;
  e.preventDefault();
  action();
});
