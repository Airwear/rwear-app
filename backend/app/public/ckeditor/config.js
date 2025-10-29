/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

 CKEDITOR.editorConfig = function( config ) {
    // Define changes to default configuration here.
    // For complete reference see:
    // https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html

    // The toolbar groups arrangement, optimized for a single toolbar row.
    config.toolbarGroups = [
        { name: 'clipboard', groups: [ 'clipboard', 'undo' ] }
        ,{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ] }
        ,{ name: 'forms' }
        ,{ name: 'titles' }
        ,{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] }
        ,{ name: 'paragraph', groups: [ 'list', 'blocks', 'bidi' ] }
        ,{ name: 'align' }
        ,{ name: 'links' }
        ,{ name: 'insert' }
        ,{ name: 'styles' }
        ,{ name: 'colors' }
        ,{ name: 'tools' }
        ,{ name: 'others' }
        ,{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] }
        ,{ name: 'about' }
    ];

    config.toolbar = [
		{ name: 'clipboard', items: [ 'Undo', 'Redo' ] }
		,{ name: 'titles', items: [ 'h2', 'h3', 'h4', 'h5' ] }
		,{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Strike' ] }
		,{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList' ] }
		,{ name: 'align', items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight' ] }
		,{ name: 'links', items: [ 'Link', 'Unlink' ] }
		//,{ name: 'document', items: [ 'Source' ] }
	];

    // The default plugins included in the basic setup define some buttons that
    // are not needed in a basic editor. They are removed here.
    config.removeButtons = 'h1,h6,Cut,Copy,Paste,Anchor,Superscript,Subscript';

    // Dialog windows are also simplified.
    config.removeDialogTabs = 'link:advanced';

    // autoGrow plugin
    config.autoGrow_onStartup = true;
    config.autoGrow_minHeight = 250;
    config.autoGrow_maxHeight = 800;

    config.format_tags = 'p;h2;h3;h4;h5;pre;address;div';
};
