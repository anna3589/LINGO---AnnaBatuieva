document.getElementById('playButton').addEventListener('click', function() {
    // Перехід на сторінку гри
    window.location.href = 'game.html';
});

// Додаємо ефект наведення на кнопку
const playButton = document.getElementById('playButton');

playButton.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-3px)';
});

playButton.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
});