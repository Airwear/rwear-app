
<!DOCTYPE html>
<html lang="{!! app()->getLocale() !!}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{!! config('app.name') !!}</title>
        <link rel="stylesheet" href="{{ asset('css/app.css') }}">
        @include('partials.pwa.web-manifest')
    </head>
    <body lang="{!! app()->getLocale() !!}" id="auth">
        <main class="vh-100 d-flex justify-content-center align-items-center">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-8 col-sm-12 col-lg-4 col-12">
                        <div class="text-center mb-4">
                            <img src="/images/logo.png" alt="{!! config('app.name') !!}" width="100">
                        </div>
                        <div class="p-2 bg-white">
                            @yield('content')
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <script src="{{asset('js/app.js')}}"></script>
        @include('partials.pwa.script-service-worker')
        <script>
            $(document).ready(function () {
                @stack('DOMLoaded')
            })
        </script>
        @stack('scripts')
    </body>
</html>
