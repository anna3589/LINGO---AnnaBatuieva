<?php

namespace App\Http\Controllers;

use App\Models\Palabra;        // <-- Importa el Modelo
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse; // <-- Importante para el método de verificar

class PalabraController extends Controller
{
    /**
     * Display a listing of the resource.
     * (Método del PDF 4)
     */
    public function index()
    {
        $palabras = Palabra::all(); // <-- Usa Eloquent
        return view('palabras.index', ['palabras' => $palabras]);
    }

    /**
     * Display a listing of the resource.
     * (Método del PDF 4)
     */
    public function indexStyled()
    {
        $palabras = Palabra::all(); // <-- Usa Eloquent
        return view('palabras.indexStyled', ['palabras' => $palabras]);
    }

    /**
     * Display a listing of the resource.
     * (Método del PDF 4)
     */
    public function indexBlade()
    {
        $palabras = Palabra::all(); // <-- Usa Eloquent
        return view('palabras.indexBlade', ['palabras' => $palabras]);
    }

    /**
     * Muestra una cantidad aleatoria de palabras.
     * (Método del PDF 7)
     */
    public function indexRandom($cantidad = 1)
    {
        $palabras = Palabra::inRandomOrder()->take($cantidad)->get();
        return view('palabras.index', ['palabras' => $palabras]);
    }

    /**
     * Verifica si una palabra existe en la BD y devuelve JSON.
     * (Método del PDF 9 - ¡El más importante para el juego!)
     */
    public function verificarPalabra(String $palabra): JsonResponse
    {
        $existe = Palabra::where('palabra', $palabra)->exists();
        return response()->json(['palabra_buscada' => $palabra, 'existe' => $existe]);

        //return view('palabras.verificar', ['existe' => $existe]);
    }


    /*
     * El resto de métodos (create, store, show, edit, update, destroy)
     * los dejamos vacíos por ahora, ya que no los pide el reto.
     */

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}