// ==================== BASE DE DATOS DE USUARIOS ====================
const users = [
    {
        email: "ikdgf@plaiaundi.net",
        password: "sooyazin11111",
        name: "anna"
    }
];

// ==================== GESTIÓN DE USUARIOS ====================
let currentUser = null;

function getCurrentUser() {
    return currentUser || JSON.parse(localStorage.getItem('currentUser')) || null;
}

function setCurrentUser(user) {
    currentUser = user;
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
    updateUserInterface();
}

function updateUserInterface() {
    const userBtn = document.getElementById('userBtn');
    if (!userBtn) return;

    if (currentUser) {
        userBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        userBtn.classList.add('user-logged-in');
    } else {
        userBtn.innerHTML = '<i class="fas fa-user"></i>';
        userBtn.classList.remove('user-logged-in');
    }
}

// ==================== AUTENTICACIÓN ====================
function loginUser(email, password) {
    // Primero verificamos usuarios integrados
    const builtInUser = users.find(u => u.email === email && u.password === password);
    if (builtInUser) {
        setCurrentUser(builtInUser);
        updateStatsDisplay();
        return true;
    }

    // Luego verificamos usuarios registrados
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const registeredUser = registeredUsers.find(u => u.email === email && u.password === password);
    if (registeredUser) {
        setCurrentUser(registeredUser);
        updateStatsDisplay();
        return true;
    }

    return false;
}

function registerUser(name, email, password) {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    // Verificamos si el email ya existe
    if (registeredUsers.find(u => u.email === email)) {
        alert('¡El usuario con este email ya existe!');
        return false;
    }

    // Añadimos nuevo usuario
    const newUser = { name, email, password };
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    // Iniciamos sesión automáticamente
    setCurrentUser(newUser);
    return true;
}

function logoutUser() {
    setCurrentUser(null);
    updateStatsDisplay();
}

// ==================== ESTADÍSTICAS ====================
function saveGameStats(result, attempts, timeSpent) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const stats = getStats();
    const userStats = stats[currentUser.email] || {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        bestTime: 0,
        winPercentage: 0
    };

    userStats.gamesPlayed++;

    if (result === 'win') {
        userStats.gamesWon++;
        userStats.currentStreak++;
        
        if (userStats.currentStreak > userStats.maxStreak) {
            userStats.maxStreak = userStats.currentStreak;
        }
        
        if (timeSpent < userStats.bestTime || userStats.bestTime === 0) {
            userStats.bestTime = timeSpent;
        }
    } else {
        userStats.currentStreak = 0;
    }

    userStats.winPercentage = userStats.gamesPlayed > 0 
        ? Math.round((userStats.gamesWon / userStats.gamesPlayed) * 100)
        : 0;

    stats[currentUser.email] = userStats;
    localStorage.setItem('gameStats', JSON.stringify(stats));
    updateStatsDisplay();
}

function updateStatsDisplay() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const userStats = getUserStats(currentUser.email);

    const totalGames = document.getElementById('totalGames');
    const gamesWon = document.getElementById('gamesWon');
    const currentStreak = document.getElementById('currentStreak');
    const maxStreak = document.getElementById('maxStreak');
    const winPercentage = document.getElementById('winPercentage');

    if (totalGames) totalGames.textContent = userStats.gamesPlayed;
    if (gamesWon) gamesWon.textContent = userStats.gamesWon;
    if (currentStreak) currentStreak.textContent = userStats.currentStreak;
    if (maxStreak) {
        if (userStats.bestTime > 0) {
            maxStreak.textContent = `${userStats.maxStreak} (${userStats.bestTime}s)`;
        } else {
            maxStreak.textContent = userStats.maxStreak;
        }
    }
    if (winPercentage) winPercentage.textContent = userStats.winPercentage + '%';
}

function getStats() {
    return JSON.parse(localStorage.getItem('gameStats')) || {};
}

function getUserStats(email) {
    const stats = getStats();
    return stats[email] || {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        winPercentage: 0
    };
}

// ==================== FUNCIONES AUXILIARES ====================
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('hidden');
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
}

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
        console.log('Estadísticas guardadas:', {
            resultado: isWin ? 'win' : 'lose',
            intentos: rowId,
            tiempo: 60 - timeLeft,
            usuario: getCurrentUser()
        });
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
    // Restaurar usuario
    const savedUser = getCurrentUser();
    if (savedUser) {
        setCurrentUser(savedUser);
    }

    // Botón de usuario
    const userBtn = document.getElementById('userBtn');
    if (userBtn) {
        userBtn.addEventListener('click', function() {
            if (getCurrentUser()) {
                showModal('settingsModal');
            } else {
                showModal('loginModal');
            }
        });
    }

    // Botón de configuración
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            showModal('settingsModal');
        });
    }

    // Botón de estadísticas
    const statsBtn = document.getElementById('statsBtn');
    if (statsBtn) {
        statsBtn.addEventListener('click', function() {
            updateStatsDisplay();
            showModal('statsModal');
        });
    }

    // Cerrar modales
    document.getElementById('closeStatsBtn')?.addEventListener('click', () => hideModal('statsModal'));
    document.getElementById('closeSettingsBtn')?.addEventListener('click', () => hideModal('settingsModal'));
    document.getElementById('closeLoginBtn')?.addEventListener('click', () => hideModal('loginModal'));
    document.getElementById('closeRegisterBtn')?.addEventListener('click', () => hideModal('registerModal'));

    // Cambiar entre login y registro
    document.getElementById('showRegisterBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        hideModal('loginModal');
        showModal('registerModal');
    });

    document.getElementById('showLoginBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        hideModal('registerModal');
        showModal('loginModal');
    });

    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (loginUser(email, password)) {
                alert('¡Inicio de sesión exitoso!');
                hideModal('loginModal');
            } else {
                alert('¡Correo o contraseña incorrectos!');
            }
        });
    }

    // Formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            if (registerUser(name, email, password)) {
                alert('¡Registro exitoso!');
                hideModal('registerModal');
                updateStatsDisplay();
            }
        });
    }

    // Botón de cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logoutUser();
            alert('Sesión cerrada');
            hideModal('settingsModal');
        });
    }

    // Nuevo juego desde estadísticas
    document.getElementById('newGameStatsBtn')?.addEventListener('click', function() {
        hideModal('statsModal');
        location.reload();
    });

    // Reiniciar estadísticas
    document.getElementById('resetStatsBtn')?.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres reiniciar tus estadísticas?')) {
            const currentUser = getCurrentUser();
            if (currentUser) {
                const stats = getStats();
                stats[currentUser.email] = {
                    gamesPlayed: 0,
                    gamesWon: 0,
                    currentStreak: 0,
                    maxStreak: 0,
                    winPercentage: 0
                };
                localStorage.setItem('gameStats', JSON.stringify(stats));
                updateStatsDisplay();
            }
        }
    });

    resultElement = document.querySelector('.result');
    mainContainer = document.querySelector('.main-container');
    actualRow = document.querySelector('.row');

    // Iniciar el juego
    startGame();

    console.log('main.js cargado - juego y sistema de usuarios listo');
});