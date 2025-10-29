<div class="col-sm-12 col-md-6 col-lg-3 col-12 mb-2">
    <div class="rounded border-{{$theme ?? 'dark'}} shadow h-100 px-4">
        <div class="card-body">
            <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                    <div class="font-weight-bold text-uppercase mb-1">{{ $title ?? 'Earnings (Monthly)' }}</div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800 text-uppercase">{{ $number ?? 0 }}</div>
                    <div style="font-size: 10px" class="h6 mb-0 text-muted text-uppercase">{!! $moreInfo ?? '' !!}</div>
                </div>
                <div class="col-auto">
                    <i class="fas fa-{{ $fa ?? 'info' }} fa-2x tex-{{$theme ?? 'muted'}}"></i>
                </div>
            </div>
        </div>
    </div>
</div>
