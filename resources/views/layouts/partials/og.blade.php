<meta property="og:title" content="{!! $title ?? config('app.name') !!}">
<meta property="og:type" content="website" />
<meta property="og:url" content="{!! request()->fullUrl() !!}" />
<meta property="og:determiner" content="{{ $determiner ?? config('app.name') }}">
<meta property="og:locale" content="{!! str_replace('_', '-', app()->getLocale()) !!}">
<meta property="og:description" content="😉 😉 {{ $description ?? 'Postuler sur '.config('app.name') }} 😉">

@if(! empty($urlImage))
    <meta property="og:image" content="{!! $urlImage !!}" />
    <meta property="og:image:secure_url" content="{!! $urlImage !!}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="{!! $title !!}" />
@endif
