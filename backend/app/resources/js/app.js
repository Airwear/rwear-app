require('./bootstrap');

import Alpine from 'alpinejs';

window.Alpine = Alpine;

import editResource from "./resources/edit.js";

Alpine.data('editResource', editResource)

Alpine.start();

(function($) {

})(jQuery);
