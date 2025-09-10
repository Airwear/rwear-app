<div class="card mb-4">
    <div class="card-body">
        @include('partials.forms.text', [
            'label' => trans('roles.display_name'),
            'name' => 'display_name',
            'value' => $role->display_name,
            'required' => true,
        ])

        @include('partials.forms.text', [
            'label' => trans('roles.name'),
            'name' => 'name',
            'value' => $role->name,
            'required' => true,
        ])

        <input type="hidden" name="guard_name" value="web">
        <div class="form-group text-right">
            <div class="btn-group">
                @include('partials.forms.btn-submit')
            </div>
        </div>
    </div>
</div>
