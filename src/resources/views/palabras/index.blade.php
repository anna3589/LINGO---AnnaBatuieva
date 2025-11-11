<!DOCTYPE html>
<html>
<head>
    <title>Lista de Palabras</title>
</head>
<body>
    <h1>Palabras del Diccionario</h1>
    <ul>
        @foreach ($palabras as $palabra)
            <li>{{ $palabra->palabra }}</li>
        @endforeach
    </ul>
</body>
</html>