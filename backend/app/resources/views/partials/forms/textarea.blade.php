<div class="form-group">
    <label for="{{$id ?? $name }}">{{ $label ?? '' }}</label>
    <div>
        @error($name)
        <small class="text-danger" role="alert">
            {{ $message ?? '' }}
        </small>
        @enderror
    </div>
   <textarea id="{{ $id ?? $name }}"
              class="form-control no-resize"
              name="{{ $name }}"
              placeholder="{{ $placeholder ?? '' }}"
             {{ !empty($readOnly) ? 'readonly' : '' }}
              style="{{$style ?? ''}}"
            {{ !empty($required) ? 'required' : '' }}
    >{{ old($name, $value ?? '') }}</textarea>
</div>

