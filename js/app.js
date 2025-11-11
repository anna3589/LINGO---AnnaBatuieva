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
        winPercentage: 0
    };

    userStats.gamesPlayed++;

    if (result === 'win') {
        userStats.gamesWon++;
        userStats.currentStreak++;
        userStats.maxStreak = Math.max(userStats.maxStreak, userStats.currentStreak);
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
    if (maxStreak) maxStreak.textContent = userStats.maxStreak;
    if (winPercentage) winPercentage.textContent = userStats.winPercentage + '%';
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

    console.log('app.js cargado - sistema de usuarios listo');
});