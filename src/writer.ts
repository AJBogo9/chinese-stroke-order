import HanziWriter, { type ColorOptions } from 'hanzi-writer';

export type Mode = 'watch' | 'quiz';

export const state = {
  char: '',
  mode: 'watch' as Mode,
  load: 'loading' as 'loading' | 'ready' | 'failed',
  strokes: 0,
  // watch: the highlighted stroke, -1 for none. quiz: the next stroke to draw
  stroke: -1,
  mistakes: 0,
  done: false,
  outline: true,
};

let writer: HanziWriter;
let changed = (): void => {};
// bumping this ends a running animateAll loop
let animation = 0;

// both themes define these colors in css/styles.css
function themeColors() {
  const style = getComputedStyle(document.documentElement);
  const color = (name: string) => style.getPropertyValue(`--${name}`).trim();
  return {
    strokeColor: color('stroke'),
    radicalColor: color('radical'),
    outlineColor: color('outline'),
    highlightColor: color('highlight'),
    drawingColor: color('drawing'),
  };
}

function update(changes: Partial<typeof state>): void {
  Object.assign(state, changes);
  changed();
}

export function init(
  target: HTMLElement,
  size: number,
  start: { char: string; mode: Mode; outline: boolean },
  onChange: () => void,
): void {
  changed = onChange;
  state.mode = start.mode;
  state.outline = start.outline;
  writer = new HanziWriter(target, {
    width: size,
    height: size,
    padding: 5,
    showOutline: start.outline,
    strokeHighlightSpeed: 1,
    ...themeColors(),
    onLoadCharDataSuccess: (data) => update({ load: 'ready', strokes: data.strokes.length }),
    onLoadCharDataError: () => update({ load: 'failed' }),
  });
  setCharacter(start.char);
}

export function setCharacter(char: string): void {
  const recovering = state.load === 'failed';
  animation++;
  Object.assign(state, { char, load: 'loading', strokes: 0, stroke: -1, mistakes: 0, done: false });
  writer.setCharacter(char);
  // writer calls throw while a load has failed, so resend what changed meanwhile
  if (recovering) {
    applyTheme();
    setOutline(state.outline);
  }
  // the writer keeps the last show or hide, which setMode skips during a failed load.
  // hiding right away also beats the quiz's fade-out, which would show the answer
  if (state.mode === 'quiz') {
    writer.hideCharacter({ duration: 0 });
    startQuiz();
  } else {
    writer.showCharacter({ duration: 0 });
  }
  changed();
}

export function setMode(mode: Mode): void {
  animation++;
  state.mode = mode;
  if (state.load !== 'failed') {
    if (mode === 'quiz') {
      startQuiz();
    } else {
      writer.cancelQuiz();
      writer.showCharacter();
      state.stroke = -1;
    }
  }
  changed();
}

export function applyTheme(): void {
  if (state.load === 'failed') return;
  for (const [name, color] of Object.entries(themeColors())) {
    writer.updateColor(name as keyof ColorOptions, color, { duration: 0 });
  }
}

export function setOutline(show: boolean): void {
  state.outline = show;
  if (state.load === 'failed') return;
  if (show) writer.showOutline();
  else writer.hideOutline();
}

export function resize(size: number): void {
  writer.updateDimensions({ width: size, height: size });
}

// watch mode

function watching(): boolean {
  return state.mode === 'watch' && state.load === 'ready';
}

function highlight(stroke: number): void {
  animation++;
  update({ stroke });
  writer.highlightStroke(stroke);
}

export function next(): void {
  if (watching()) highlight((state.stroke + 1) % state.strokes);
}

export function previous(): void {
  if (watching()) highlight(state.stroke > 0 ? state.stroke - 1 : state.strokes - 1);
}

export function repeat(): void {
  if (watching() && state.stroke >= 0) highlight(state.stroke);
}

// highlights the strokes after the current one, or all of them from the last stroke
export async function animateAll(): Promise<void> {
  if (!watching()) return;
  const run = ++animation;
  const start = state.stroke + 1 < state.strokes ? state.stroke + 1 : 0;
  for (let stroke = start; stroke < state.strokes && run === animation; stroke++) {
    update({ stroke });
    await writer.highlightStroke(stroke);
  }
}

// quiz mode

function startQuiz(): void {
  Object.assign(state, { stroke: 0, mistakes: 0, done: false });
  writer
    .quiz({
      showHintAfterMisses: 1,
      onCorrectStroke: ({ strokeNum, totalMistakes }) =>
        update({ stroke: strokeNum + 1, mistakes: totalMistakes }),
      onMistake: ({ totalMistakes }) => update({ mistakes: totalMistakes }),
      onComplete: ({ totalMistakes }) => update({ done: true, mistakes: totalMistakes }),
    })
    // the quiz only exists once the data loads, so a switch back to watch before then
    // had nothing to cancel
    .then(() => {
      if (state.mode !== 'quiz') writer.cancelQuiz();
    });
}

export function restartQuiz(): void {
  if (state.mode !== 'quiz' || state.load !== 'ready') return;
  startQuiz();
  changed();
}
