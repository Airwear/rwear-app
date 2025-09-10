<div class="">
    @include('partials.forms.text', [
        'label' => trans('auth.password'),
        'name' => 'password',
        'type' => 'password',
        'value' => '',
    ])

    <div class="form-group">
        <button id="generate_password" class="btn btn-outline-dark small btn-sm" type="button">
            <i class="fa fa-key mr-2"></i>
            {{ trans('auth.generate_password') }}
        </button>
    </div>

    @include('partials.forms.checkbox', [
        'label' => trans('auth.send_email_auth_info'),
        'name' => 'send_email_auth_info',
        'checked' => false,
    ])
</div>

@push('DOMLoaded')
    populate(8)
@endpush

@push('scripts')
    <script>
        function generatePassword(length) {
            let result= '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#';
            let charactersLength = characters.length;
            for (let i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        function populate(length) {
            $password = $('#password');
            $passwordConfirmation = $('#password_confirmation');

            $('#generate_password').click(function () {
                const text = generatePassword(length)
                $password.val(text);
                $passwordConfirmation.val(text);
            });

            $password.val(null);
            $passwordConfirmation.val(null);
        }
    </script>
@endpush
