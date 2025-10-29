@component('mail::message')
# Hello

{{ trans('auth.email_auth_info_text', ['appName' => config('app.name')]) }} : <br/> <br/>
{{ trans('auth.email') }} : {{ $user->email }} <br/>
{{ trans('auth.secret') }} : {{ $password }}

@component('mail::button', ['url' => route('dashboard')])
    {{ trans('auth.login') }}
@endcomponent

{{ trans('navigation.cordially') }}, <br/>

Team {{ config('app.name') }}
@endcomponent
