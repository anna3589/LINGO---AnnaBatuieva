<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name', 'Lingo') }}</title>

        <!-- Google Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Krub:wght@300;400;600&display=swap" rel="stylesheet">

        @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
            @vite(['resources/css/launch.css', 'resources/js/launch.js'])
        @else
            <style>
                /* ! tailwindcss v3.4.0 | MIT License | https://tailwindcss.com */
            </style>
        @endif
    </head>

    <body>
        <!-- Encabezado para todos los usuarios -->
        <header style="position: absolute; top: 20px; right: 20px; z-index: 1000;">
            <nav>
                @auth
                    <a href="{{ url('/dashboard') }}" style="text-decoration: none;">
                        Dashboard
                    </a>
                @else
                    <a href="{{ route('login') }}" style="text-decoration: none; margin-right: 15px;">
                        Log in
                    </a>
                    @if (Route::has('register'))
                        <a href="{{ route('register') }}" style="text-decoration: none;">
                            Register
                        </a>
                    @endif
                @endauth
            </nav>
        </header>

        <div class="welcome-container">
            <div class="logo-section">
                <img src="{{ asset('img/1ffbee7d89c3431f919752e918f294d0-free.png') }}" alt="LINGO Logo" class="logo">
                <h1 class="welcome-title">Bienvenido</h1>
            </div>
            
            <div class="game-info">
                <p class="game-description">Lingo es un divertido juego de palabras en el que tienes que adivinar palabras ocultas con la ayuda de pistas. En cada intento recibes una pista:</p>
                <ul class="rules-list">
                    <li>Las letras que están en la posición correcta se iluminan en <span class="green-example">verde</span>.</li>
                    <li>Las letras que están en la palabra, pero en otra posición, se marcan en <span class="yellow-example">amarillo</span>.</li>
                </ul>
                <p class="game-description">Tu objetivo es adivinar la palabra completa en un número limitado de intentos. ¡Este juego entrena la memoria, la atención y el vocabulario, y además aporta mucha emoción y diversión!</p>
            </div>
            
            <!-- Botón con verificación de autorización -->
            @auth
                <a href="{{ route('game') }}" class="play-button">Jugar</a>
            @else
                <a href="{{ route('login') }}" class="play-button">Iniciar sesión para jugar</a>
            @endauth
        </div>
    </body>
</html>