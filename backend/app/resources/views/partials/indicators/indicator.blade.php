<div class="card border-left-dark shadow h-100 py-2">
    <div class="card-body">
        <div class="row no-gutters align-items-center">
            <div class="col mr-2">
                <div class="text-xs font-weight-bold text-dark text-uppercase mb-1">
                    {{ $title ?? null }}
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">
                    {{ $number ?? 0 }}
                </div>
            </div>
            <div class="col-auto">
                <i class="fas fa-{{ $fa ?? 'home' }} fa-2x text-gray-300"></i>
            </div>
        </div>
    </div>
</div>
