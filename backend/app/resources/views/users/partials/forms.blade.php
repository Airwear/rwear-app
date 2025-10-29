<div class="row">
    <div class="col-md-5 col-12">
        @include('users.forms.account')

        @if($user->exists)
            <br />
            @include('users.forms.roles')
        @endif
    </div>
</div>
