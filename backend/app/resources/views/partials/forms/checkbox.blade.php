<div class="custom-control custom-switch my-3">
    <input
        type="checkbox"
        name="{{ $name }}"
        class="custom-control-input"
        id="{{ $id ?? $name }}"
        {{ $checked ? 'checked' : '' }}
        value="{{ $value ?? null }}"
    >
    <label class="custom-control-label font-weight-light" for="{{ $id ?? $name }}">
        {{ $label }}<br/>
        <span class="text-muted small">{!! $text ?? null !!}</span>
    </label>
</div>
