<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎬 Movie Tracker</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{ url('resources/css/style.css') }}">
</head>

<body>

    @include('partials.header')

    <main>
        @yield('content')
    </main>

    @include('partials.footer')

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script>
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    </script>
    <script src="{{ url('resources/js/API_Ops.js') }}"></script>
    <script src="{{ url('resources/js/DB_Ops.js') }}"></script>

</body>
</html>