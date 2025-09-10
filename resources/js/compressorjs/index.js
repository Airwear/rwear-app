import Compressor from 'compressorjs';

export default class CompressorManager {

    constructor() {
        this._images = [];
        this._notImages = [];
        this._files = [];
    }

    /**
     *
     * @param files la collection d'objet File | Blob à traiter
     * @param formElementId l'ID du formulaire à soumettre
     * @param options les options de compressors JS
     */
    compress(files, formElementId, options) {

        if (! files || files.length === 0) {
            return;
        }

        const htmlFormElement = document.getElementById(formElementId);
        let index = 1;
        for (const file of files) {
            this.makeCompressor(file, htmlFormElement, options, index);
            index++;
        }
    }

    makeCompressor(file, formElement, options, index) {
        let that = this;

        new Compressor(file, {

            quality : options?.quality ?? 0.6,
            maxWidth : options?.maxWidth ?? 1920,
            maxHeight : options?.maxHeight ?? 1080,

            success(imgBlob) {
                _blobToBase64(imgBlob).then(result => {
                    let id = 'image-' + index;
                    const image = {name: file.name, id, value: result};
                    _createInputElement(image, formElement);
                    _showImageElement(image);
                }).catch(error => console.log('_error', error.message))
            },

            error(error) {
                // Compressor Js ne travaille qu'avec des images.
                // Donc lorsqu'une image n'est pas reconnue il déclenche cet évènement
                // Nous utilisons donc cet astuce pour auto-soumettre le formulaire
                // lorsqu'il n y a pas des images (PDF, ect) dans la requête.
            },
        });
    }
}

function _blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject(error)

        reader.readAsDataURL(blob);
    });
}

function _createInputElement({name, id, value}, parent) {
    let newInput = document.createElement("input");
    newInput.name = `raw_data[${name}]`;
    newInput.type = 'hidden';
    //newInput.value = value;
    newInput.value = id;
    newInput.id = id;
    newInput.setAttribute('class', 'raw-data');
    parent.appendChild(newInput);
    //trashImage()
}

function _showImageElement({name, id, value}) {
    $('#images').append(`
        <div class='col-sm-3 col-12 mb-2'>
            <button data-id="#${id}" type="button" class='position-absolute btn btn-sm btn-danger trash d-none' style="right: 10px">Supprimer</button>
            <img alt='${name}' src='${value}' class='img-fluid d-block img-thumbnail' />
        </div>
    `);

    trashImage();
}

function trashImage() {
    $('.trash').click(function () {
        const $target = $(this)
        $($target.data('id')).remove();
        $target.parent().remove();
        console.log('__', $target.data('id'))
    })
}
