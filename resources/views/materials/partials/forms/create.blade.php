<x-form.group>
    <x-label for="name">
        {{ trans('labels.designation') }}
    </x-label>
    <x-input.text
        name="name"
        type="text"
        placeholder="Ex: bouteille d'eau"
        :value="$model->designation"
        x-model="designation"
    />
</x-form.group>
