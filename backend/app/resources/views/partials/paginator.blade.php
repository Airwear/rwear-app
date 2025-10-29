<div class="form-group d-flex justify-content-end">
    @if($list instanceof Illuminate\Pagination\LengthAwarePaginator)
        {{ $list->links() }}
    @endif
</div>

