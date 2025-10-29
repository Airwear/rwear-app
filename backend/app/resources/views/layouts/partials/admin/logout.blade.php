<div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Déconnexion</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body">Voulez-vous vous déconnecter de l'application ?</div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">Non</button>
                <button id="logout" class="btn btn-primary" type="button">
                    Oui
                </button>
            </div>
        </div>
    </div>
</div>

<form id="form-logout" method="POST" action="{{ route('logout') }}" class="d-inline-block" style="z-index: 10001">
    @csrf
</form>

@push('scripts')
    <script>
        function _logout() {
            $('#logout').click(function () {
                $('#form-logout').submit()
            })
        }
    </script>
@endpush

@push('DOMLoaded')
    _logout()
@endpush
