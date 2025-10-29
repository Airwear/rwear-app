<x-form.group>
    <x-label for="name">
        {{ trans('labels.designation') }}
    </x-label>
    <x-input.text
        name="name"
        type="text"
        :value="$model->designation"
        x-model="designation"
    />
    <div x-text="designation"></div>
</x-form.group>
