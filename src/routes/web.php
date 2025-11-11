<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PalabraController; // <-- Asegúrate de importar tu controlador

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Aquí es donde puedes registrar las rutas web para tu aplicación.
|
*/

// --- RUTA DE INICIO (Del PDF 10) ---
// Modifica la ruta raíz para que muestre tu vista 'lingo.welcome'
Route::get('/', function () {
    return view('lingo.welcome'); // [cite: 370, 371]
});

// --- RUTAS DEL DASHBOARD (De Breeze) ---
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// --- RUTAS DE PROFILE (De Breeze) ---
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// --- RUTAS DE PALABRAS (Del PDF 4 y 7) ---

// Ruta que devuelve todas las palabras (PDF 4)
//Route::get('/palabras', [PalabraController::class, 'index'])->name('palabras.index'); // [cite: 109, 110, 111]

// Ruta que devuelve todas las palabras con estilos (PDF 4)
//Route::get('/palabrasStyled', [PalabraController::class, 'indexStyled'])->name('palabras.indexStyled'); // [cite: 112, 113]

// Ruta que devuelve todas las palabras con layout (PDF 4)
//Route::get('/palabrasBlade', [PalabraController::class, 'indexBlade'])->name('palabras.indexBlade'); // [cite: 114, 115]

// Ruta que devuelve palabras aleatorias (PDF 7)
Route::get('/palabrasRandom/{cantidad?}', [PalabraController::class, 'indexRandom'])->name('palabras.indexRandomw'); // [cite: 484, 485]


// --- RUTA API PARA VERIFICAR (Del PDF 9) ---
// ¡La más importante para el juego!
Route::get('/verificarPalabra/{palabra}', [PalabraController::class, 'verificarPalabra']) // [cite: 261]
    ->middleware(['auth', 'verified']) // [cite: 262]
    ->name('palabras.verificarPalabra'); // [cite: 263]


// --- RUTAS DE AUTENTICACIÓN (De Breeze) ---
// Esto incluye las rutas de login, registro, etc.

//Ruta que verifica si la palabra dada en la ruta existe en la tabla 'palabras' y devuelve json
Route::get('/verificarPalabra/{palabra}', [PalabraController::class, 'verificarPalabra'])
         ->middleware(['auth', 'verified'])
         ->name('palabras.verificarPalabra');

Route::get('/', function () {
    return view('lingo.welcome');
});

Route::get('/game', function () {
    return view('lingo.game'); 
})->name('game');

require __DIR__.'/auth.php';