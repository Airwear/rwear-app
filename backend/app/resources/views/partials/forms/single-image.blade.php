<label
    class="text-center p-4 bg-light d-block text-uppercase"
    for="{{ $id }}"
    style="cursor: pointer; border: 2px dashed #ccc"
>
    {{ $label ?? '-' }}
    <input
        type="file"
        name="{{ $name ?? null }}"
        id="{{ $id }}"
        accept="image/*"
        style="width: 0.1px; height: 0.1px; z-index: -100"
    >
</label>
<div class="mb-2 text-center small" id="{{ $id }}-info"></div>

@push('DOMLoaded')
    $("#{{ $id }}").change(function () {
        const file = $(this)[0].files[0];
        $('#{{ $id }}-info').html(file.name)
    });
@endpush
