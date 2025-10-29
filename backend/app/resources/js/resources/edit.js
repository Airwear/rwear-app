import axios from "axios";

// Setup : make sure that you have install alpinejs and import them to resources/js/bootstrap
// import Alpine from 'alpinejs'
// window.Alpine = Alpine

// Move these code to resources/js/bootstrap
// import editResource from "./resources/edit.js";
// Alpine.data('editResource',editResource)

// Alpine.start()

export default (url = null, payload = {}) => ({
    loading: false,
    message: null,
    haveError: false,

    handle () {

        this.loading = true;
        this.haveError = false;

        axios.post(url, this._payload()).then(response => {

            if (response.data.error) {
                this.haveError = true;
                this.message = response?.data?.message;
            } else {
                this._redirectTo()
            }

        }).catch(error => {
            this.haveError = true;
            this.message = error.response.data.message;
        }).finally(() => {
            setTimeout(() => {
                this.loading = false
            }, 1000)
        })
    },

    init() {
        this._hydrate();
    },

    _hydrate() {

        const data = JSON.parse(payload)

        //console.log('payload', data)
        //console.log('resource for : url', url)

        for (const key in data) {
            this[key] = data[key]
        }
    },

    _payload() {

        const data = JSON.parse(payload)
        let values = {}
        const that = this

        for (const key in data) {
            values[key] = that[key]
        }

        return values
    },

    _redirectTo() {
        return window.location.reload()
    }
})
