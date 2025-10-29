<x-modal :title="$title" :id="$target" size="md">
    <x-form
        x-data="editResource('{{ $route }}', `{{ json_encode($model->toAlpine()) }}`)"
        x-on:submit.prevent="handle"
        method="POST"
        :hasFiles="true"
    >
        <x-alpinejs.error />
        @includeFirst(['partials.forms.helpers', $view])
        <x-alpinejs.submit :delete="!empty($delete)" />
    </x-form>
</x-modal>
