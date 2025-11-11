{{--
  Archivo: resources/views/palabras/index.blade.php
--}}


{{-- Esto asume que tienes un layout principal, lo cual es muy recomendable --}}
{{-- Si no lo tienes, puedes ignorar @extends y @section por ahora --}}
@extends('layouts.app') {{-- Ajusta 'layouts.app' a tu plantilla principal --}}


@section('content')
<div class="container">
    <h1>Listado de Palabras</h1>


    {{-- Enlace para ir al formulario de creación --}}
    <a href="{{ route('palabras.create') }}" class="btn btn-primary mb-3">
        Crear Nueva Palabra
    </a>


    <table class="table table-striped">
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Palabra</th>    {{-- ¡AJUSTA ESTO! --}}
                <th scope="col">Definición</th> {{-- ¡AJUSTA ESTO! --}}
                <th scope="col">Acciones</th>
            </tr>
        </thead>
        <tbody>
            {{--
                Usamos @forelse.
                Itera sobre $palabras si no está vacío.
                Muestra la sección @empty si está vacío.
            --}}
            @forelse ($palabras as $palabra)
                <tr>
                    <th scope="row">{{ $palabra->id }}</th>
                   
                    {{--
                      ¡IMPORTANTE!
                      Cambia 'nombre' y 'definicion' por los nombres
                      reales de las columnas en tu tabla 'palabras'.
                    --}}
                    <td>{{ $palabra->nombre }}</td>
                    <td>{{ $palabra->definicion }}</td>
                   
                    <td>
                        {{-- Enlace para Ver (show) --}}
                        <a href="{{ route('palabras.show', $palabra->id) }}" class="btn btn-info btn-sm">Ver</a>
                       
                        {{-- Enlace para Editar (edit) --}}
                        <a href="{{ route('palabras.edit', $palabra->id) }}" class="btn btn-warning btn-sm">Editar</a>
                       
                        {{-- Formulario para Eliminar (destroy) --}}
                        <form action="{{ route('palabras.destroy', $palabra->id) }}" method="POST" style="display: inline-block;">
                            @csrf             {{-- Token de seguridad --}}
                            @method('DELETE') {{-- Método HTTP para eliminar --}}
                            <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('¿Estás seguro de que quieres eliminar esta palabra?')">
                                Eliminar
                            </button>
                        </form>
                    </td>
                </tr>
            @empty
                {{-- Esto se mostrará si la variable $palabras está vacía --}}
                <tr>
                    <td colspan="4" class="text-center">No hay palabras registradas.</td>
                </tr>
            @endforelse
        </tbody>
    </table>


    {{-- Si estás usando paginación (ej. Palabra::paginate()), aquí podrías los enlaces --}}
    {{-- {{ $palabras->links() }} --}}
</div>
@endsection
