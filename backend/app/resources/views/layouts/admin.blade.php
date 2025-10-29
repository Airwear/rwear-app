<!DOCTYPE html>
<html lang="fr">
    <head>
        <!-- Custom fonts for this template-->
        <link href="{{ $publicAdminThemePath }}/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
        <link
            href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
            rel="stylesheet">
        <!-- Custom styles for this template-->
        <link href="{{ $publicAdminThemePath }}/css/sb-admin-2.min.css" rel="stylesheet">
        <title>{!! $title ?? config('app.name') !!}</title>
        @include('partials.pwa.web-manifest')
        <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
        <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
        @stack('styles')
        <style>
            .heading-info {
                top: 57px;
                z-index: 10;
            }
        </style>
    </head>

    <body id="page-top" class="sidebar-toggled">
        <!-- Page Wrapper -->
        <div id="wrapper">
            <!-- Sidebar -->
            @include('layouts.partials.admin.sidebar')
            <!-- End of Sidebar -->

            <!-- Content Wrapper -->
            <div id="content-wrapper" class="d-flex flex-column">
                <!-- Main Content -->
                <div id="content">
                    <!-- Topbar -->
                    @include('layouts.partials.admin.topbar')
                    <!-- End of Topbar -->
                    @if(! empty($headingInfo))
                        <div class="heading-info bg-white position-sticky py-2 px-4 text-black  border-bottom mb-4" style="min-height: 100px">
                            @yield('heading-info')
                        </div>
                    @endif

                    <h6 style="font-size: 10px" class="text-center small py-1 bg-light text-uppercase">
                        Vous êtes connecté en tant que :  <b>{!! auth()->user()->full_name !!}</b>
                    </h6>

                    <!-- Begin Page Content -->
                    <div class="container-fluid text-dark">
                        <!-- Page Heading -->
                        @include('layouts.partials.admin.heading.message-flash')
                        @if(empty($headingInfo))
                            @include('layouts.partials.admin.heading')
                        @endif
                        @yield('content')
                    </div>
                    <!-- /.container-fluid -->
                </div>
                <!-- End of Main Content -->
                <!-- Footer -->
                @stack('modal')
                @include('layouts.partials.admin.footer')
                <!-- End of Footer -->
            </div>
            <!-- End of Content Wrapper -->
        </div>
        <!-- End of Page Wrapper -->

        <!-- Scroll to Top Button-->
        <a class="scroll-to-top rounded" href="#page-top">
            <i class="fas fa-angle-up"></i>
        </a>

        <!-- Logout Modal-->
        @include('layouts.partials.admin.logout')

        <!-- Bootstrap core JavaScript-->
        <script src="{{ $publicAdminThemePath }}/js/jquery/jquery.min.js"></script>
        <script src="{{ $publicAdminThemePath }}/js/bootstrap/bootstrap.bundle.min.js"></script>
        <!-- Core plugin JavaScript-->
        <script src="{{ $publicAdminThemePath }}/js/jquery-easing/jquery.easing.min.js"></script>
        <!-- Custom scripts for all pages-->
        <script src="{{ $publicAdminThemePath }}/js/sb-admin-2.min.js"></script>
        {{--<!-- Page level plugins -->
        <script src="{{ $publicAdminThemePath }}/js/chart.js/Chart.min.js"></script>
        <!-- Page level custom scripts -->
        <script src="{{ $publicAdminThemePath }}/js/demo/chart-area-demo.js"></script>
        <script src="{{ $publicAdminThemePath }}/js/demo/chart-pie-demo.js"></script>--}}
        <script src="{{asset('js/app.js')}}"></script>
        <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

        @stack('scripts')
        @include('partials.pwa.script-service-worker')
        <script>
            (function _disableWhenSubmitForm() {

                const submit = document.querySelector('.submit')
                if (submit) {
                    submit.addEventListener('click', function (e) {

                        const target = e.target

                        if (target && target.nodeName === 'BUTTON') {

                            target.setAttribute('disabled', true)

                            const form = document.querySelector(target.getAttribute('data-form'))
                            if (form) {
                                form.submit();
                            }
                        }

                        setTimeout(function () {
                            target.removeAttribute('disabled')
                        }, 5000)
                    })
                }

            })()

            $(document).ready(function () {
                @stack('DOMLoaded')
                // Select 2
                $('select.select2')
                    .removeClass('select2')
                    .each(function() {
                        let $element = $(this);
                        let $emptyOption = $element.find('option[value=""]');
                        $element.select2({
                            placeholder: $emptyOption.text(),
                            allowClear: $emptyOption.length > 0,
                            containerCssClass: ':all:'
                        });
                    });
            })
        </script>
    </body>
</html>
