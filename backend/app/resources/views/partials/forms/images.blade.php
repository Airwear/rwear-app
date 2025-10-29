<div class="mt-3">
    <div id="filePanel" class="bg-light">
        <label class="text-center d-block text-uppercase small" for="file" style="cursor: pointer">
            Ajouter une photo
            <input
                type="file"
                name="file"
                id="file"
                accept="image/*"
                style="width: 0.1px; height: 0.1px; z-index: -100"
            >
        </label>
    </div>
</div>

<div id="fileInfo" class="small text-center mb-2"></div>

@push('scripts')
    <script>
        function imageInfo() {

            document.getElementById('file').addEventListener('change', function(event) {

                const file = event.target.files[0];
                const fileInfo = document.getElementById('fileInfo');

                if (file) {

                    const fileName = file.name;
                    const fileSize = file.size;
                    const fileType = file.type;

                    fileInfo.innerHTML = `
                        <span>Nom: ${fileName}</span>
                        <span>Taille: ${fileSize} bytes</span>
                    `;

                } else {
                    fileInfo.innerHTML = "No file selected";
                }
            });
        }
    </script>
@endpush

@push('DOMLoaded')
    imageInfo()
@endpush
