<div class="mt-3 d-flex justify-content-end">
    <x-button
        x-show="!loading"
        type="submit"
        :class="'btn-'.($attributes->get('delete') ? 'danger' : 'success')"
    >
        {{ trans('action.'.($attributes->get('delete') ? 'delete' : 'submit')) }}
    </x-button>
    <x-alpinejs.loader />
</div>
