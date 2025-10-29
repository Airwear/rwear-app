window._ = require('lodash');// jQuery
window.$ = window.jQuery = require('jquery');

import CompressorManager from "./compressorjs/index.js";
import customVirtualSelect from "./virtual-select";

window.compressorManager = new CompressorManager();
window.customVirtualSelect = customVirtualSelect;

require('fslightbox');

try {

    require('bootstrap');
    require('admin-lte');
} catch (e) {}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// CKEditor 5
import ClassicEditor from '@ckeditor/ckeditor5-build-classic/build/ckeditor';
require('@ckeditor/ckeditor5-build-classic/build/translations/fr.js');
window.ClassicEditor = ClassicEditor;
require('./setup/ckeditor5.js');

// import Echo from 'laravel-echo';

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     forceTLS: true
// });

