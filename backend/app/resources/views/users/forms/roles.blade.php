<div class="card">
    <div class="card-header text-dark">
        Permissions ({!! $permissions->count() !!})
    </div>

    <div class="card-body">
        <div class="row">
            @foreach($permissions as $permission)
                <div class="col-sm-6 col-12 mb-2">
                    <div>
                        @include('partials.forms.checkbox', [
                            'label' =>  $permission->description,
                            'name' => "permissions[$permission->id]",
                            'checked' => $user->hasPermissionTo($permission),
                            'value' => $permission->id,
                        ])
                    </div>
                </div>
            @endforeach
        </div>

        @include('partials.forms.btn-submit')
    </div>
</div>

