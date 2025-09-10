<div class="content-header" style="z-index: 100">
    @if($message = session('success'))
        <div class="alert alert-success">{!! $message !!}</div>
    @endif
    @if($message = session('error'))
        <div class="alert alert-danger">{!! $message !!}</div>
    @endif

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
</div>
