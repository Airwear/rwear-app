<div class="content-header">

    @if($message = session('success'))
        <div class="alert alert-success">{!! $message !!}</div>
    @endif

    @if($message = session('error'))
        <div class="alert alert-danger">{!! $message !!}</div>
    @endif

    <div class="container-fluid mb-2">
        <div class="row">
            <div class="col-sm-7">
                <h1 class="h3">{!! $icon ?? '' !!}{!! $title ?? '' !!}</h1>
            </div>
            <div class="col-sm-5">
                <div class="d-flex justify-content-end">
                    {!! Breadcrumbs::render() !!}
                </div>
            </div>
        </div>
    </div>
</div>

