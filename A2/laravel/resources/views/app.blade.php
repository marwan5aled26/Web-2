<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎬 Movie Tracker</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link rel="stylesheet" href="{{ asset('style.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>

@include('partials.header')

<main>
    @yield('content')
</main>

@include('partials.footer')

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="{{ asset('API_Ops.js') }}"></script>
<script src="{{ asset('DB_Ops.js') }}"></script>

</body>
</html>