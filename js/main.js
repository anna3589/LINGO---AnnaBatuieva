// ==================== VARIABLES DEL JUEGO ====================
let timeLeft = 60;
let timerInterval;
let resultElement;
let mainContainer;
let rowId = 1;
let word = "";
let wordArray = [];
let actualRow;

// ==================== TEMPORIZADOR ====================
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 60;
    updateTimerDisplay();
    document.getElementById('timer').parentElement.classList.remove('warning');

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 10) {
            document.getElementById('timer').parentElement.classList.add('warning');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGameTime();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    if (timerElement) timerElement.textContent = timeLeft;
}

function endGameTime() {
    const inputs = document.querySelectorAll('.square');
    inputs.forEach(input => input.disabled = true);
    showResult('¡Tiempo agotado! ¡Inténtalo de nuevo!');
}

function updateAttemptCounter(attempt) {
    const attemptElem = document.getElementById('attemptCount');
    if (attemptElem) attemptElem.textContent = attempt;
}

// ==================== LÓGICA DEL JUEGO ====================
function showResult(textMsg) {
    if (!resultElement) return;

    resultElement.classList.remove('hidden');
    resultElement.innerHTML = `
        <p>${textMsg}</p>
        <button class="button">Jugar de nuevo</button>
    `;

    const resetBtn = resultElement.querySelector('.button');
    resetBtn.addEventListener('click', () => location.reload());

    // Guardar estadísticas
    const isWin = textMsg.includes('Ganaste') || textMsg.includes('🎉');
    if (typeof saveGameStats === 'function') {
        saveGameStats(isWin ? 'win' : 'lose', rowId, 60 - timeLeft);
    }
}

function compareArrays(array1, array2) {
    let correctIndexes = [];
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] === array2[i]) {
            correctIndexes.push(i);
        }
    }
    return correctIndexes;
}

function existLetter(array1, array2) {
    let existingIndexes = [];
    let tempArray1 = [...array1];
    
    for (let i = 0; i < array2.length; i++) {
        const letterIndex = tempArray1.indexOf(array2[i]);
        if (letterIndex !== -1) {
            existingIndexes.push(i);
            tempArray1[letterIndex] = null;
        }
    }
    return existingIndexes;
}

function createRow() {
    rowId++;
    if (rowId <= 5) {
        const newRow = document.createElement('div');
        newRow.classList.add('row');
        newRow.setAttribute('id', rowId);
        mainContainer.appendChild(newRow);
        return newRow;
    } else {
        clearInterval(timerInterval);
        showResult(`¡Inténtalo de nuevo! La palabra era: "${word.toUpperCase()}"`);
        return null;
    }
}

function drawSquares(row, wordArray) {
    if (!row) return;
    
    row.innerHTML = '';
    wordArray.forEach((_, index) => {
        row.innerHTML += `<input type="text" maxlength="1" class="square ${index === 0 ? 'focus' : ''}">`;
    });
}

function addFocus(row) {
    const focusElement = row.querySelector('.focus');
    if (focusElement) focusElement.focus();
}

function checkWord(squares, wordArray) {
    const userWord = squares.map(sq => sq.value.toUpperCase());
    
    // Verificar posiciones correctas (verde)
    for (let i = 0; i < wordArray.length; i++) {
        if (userWord[i] === wordArray[i]) {
            squares[i].classList.add('green');
        }
    }
    
    // Verificar letras existentes (amarillo)
    for (let i = 0; i < wordArray.length; i++) {
        if (userWord[i] !== wordArray[i] && wordArray.includes(userWord[i])) {
            squares[i].classList.add('gold');
        }
    }
    
    // Gris para letras incorrectas
    for (let i = 0; i < wordArray.length; i++) {
        if (!squares[i].classList.contains('green') && !squares[i].classList.contains('gold')) {
            squares[i].classList.add('gray');
        }
    }
    
    // Bloquear campos después de verificar
    squares.forEach(sq => sq.disabled = true);
    
    // Verificar victoria
    if (userWord.join('') === wordArray.join('')) {
        clearInterval(timerInterval);
        showResult('¡Ganaste!');
        return;
    }
    
    // Crear nueva fila
    const nextRow = createRow();
    if (!nextRow) return;
    
    updateAttemptCounter(rowId);
    drawSquares(nextRow, wordArray);
    listenInput(nextRow, wordArray);
    addFocus(nextRow);
}

function listenInput(row, wordArray) {
    const squares = [...row.querySelectorAll('.square')];
    
    squares.forEach((element, index) => {
        element.addEventListener('input', function(event) {
            const value = event.target.value.toUpperCase();
            
            if (event.inputType !== 'deleteContentBackward' && value) {
                // Mover al siguiente campo
                if (index < squares.length - 1) {
                    squares[index + 1].focus();
                } else {
                    // Verificar palabra cuando todos los campos están llenos
                    checkWord(squares, wordArray);
                }
            } else if (event.inputType === 'deleteContentBackward' && !value) {
                // Mover al campo anterior
                if (index > 0) {
                    squares[index - 1].focus();
                }
            }
        });

        // Manejar tecla Enter
        element.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                const allFilled = squares.every(sq => sq.value);
                if (allFilled) {
                    checkWord(squares, wordArray);
                }
            }
        });
    });
}

function startGame() {
    const words = [
        'perro', 'gatos', 'amigo', 'coche', 'libro', 'casa', 'silla',
        'dulce', 'plaza', 'fruta', 'grano', 'noche', 'suelo', 'verde', 'agua',
        'cielo', 'playa', 'arbol', 'hojas', 'mesa', 'puerta', 'calle', 'parque'
    ];
    const fiveLetterWords = words.filter(w => w.length === 5);
    word = fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];
    wordArray = word.toUpperCase().split('');

    startTimer();
    drawSquares(actualRow, wordArray);
    listenInput(actualRow, wordArray);
    addFocus(actualRow);
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    resultElement = document.querySelector('.result');
    mainContainer = document.querySelector('.main-container');
    actualRow = document.querySelector('.row');

    // Iniciar el juego
    startGame();

    console.log('main.js cargado - juego listo');
});