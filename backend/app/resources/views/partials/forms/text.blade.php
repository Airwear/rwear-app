<div class="form-group">
    <div class="form-label-group in-border mb-0">
        <input
            id={!! $id ?? $name !!}
                type="{!! $type ?? 'text' !!}"
            class="form-control form-group-sm @error($name) is-invalid @enderror"
            name={!! $name !!}
                value="{{ old($name, $value ?? null) }}"
            @if(! empty($required))
            required
            @endif
            @if(! empty($readOnly))
            readonly
            @endif
            autocomplete="{!! $name !!}"
            placeholder="{{ $placeholder ?? null }}"
        >
        <label for="{!! $id ?? $name !!}" class="font-weight-light">
            {{ $label ?? '' }}
        </label>
        @error($name)
            <span class="invalid-feedback app-error-validation" role="alert">
                <strong>{{ $message }}</strong>
            </span>
        @enderror
    </div>
    <small>{{ $text ?? '' }}</small>
</div>

