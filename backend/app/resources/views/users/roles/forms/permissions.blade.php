<div class="card shadow p-4">
    <h3 class="clearfix">
        {!! trans('auth.user_permissions') !!} ({!! $role->permissions->count() !!}/{!! $permissions->count() !!})
    </h3>

    <div class="row">
        @foreach($permissions->groupBy('group_name') as $groupName => $permissions)
            <div class="col-sm-6 col-12 mb-2">
                <div>
                    <h6 class="text-info">{!! $groupName !!}</h6>
                    @foreach($permissions as $permission)
                        @include('partials.forms.checkbox', [
                            'label' => $permission->display_name,
                            'name' => "permission[$permission->id]",
                            'checked' => $role->hasPermissionTo($permission),
                            'text' => $permission->description,
                        ])
                    @endforeach
                </div>
            </div>
        @endforeach
    </div>

    <div class="form-group text-right">
        <div class="btn-group">
            @include('partials.forms.btn-submit')
        </div>
    </div>

</div>

