// HanziWriter management
let writer = null;
let currentChar = '你';

/**
 * Creates a new HanziWriter instance for the given character
 * @param {string} character - The Chinese character to display
 */
function createWriter(character) {
    const target = document.getElementById('character-target');
    target.innerHTML = '';
    
    writer = HanziWriter.create('character-target', character, {
        width: 300,
        height: 300,
        padding: 5,
        showOutline: true,
        strokeColor: '#555',
        radicalColor: '#168F16',
        delayBetweenStrokes: 500,
        strokeAnimationSpeed: 1,
        onLoadCharDataError: function(error) {
            target.innerHTML = '<p style="color: red;">Character not found or not supported.</p>';
        }
    });
    currentChar = character;
}

/**
 * Animates the stroke order of the current character
 */
function animateCharacter() {
    if (writer) {
        writer.animateCharacter();
    }
}

/**
 * Starts a quiz mode for the current character
 */
function quizCharacter() {
    if (writer) {
        writer.quiz({
            onComplete: function() {
                alert('Great job! 很好！');
            }
        });
    }
}

/**
 * Shows the outline of the current character
 */
function showOutline() {
    if (writer) {
        writer.showOutline();
    }
}