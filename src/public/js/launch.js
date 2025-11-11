document.getElementById('playButton').addEventListener('click', function() {
    window.location.href = '/game';
});
const playButton = document.getElementById('playButton');

playButton.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-3px)';
});

playButton.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
});