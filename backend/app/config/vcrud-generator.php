<?php

return [

    /*
     * Guard name
     */
    'guard' => 'auth',

    'command' => 'php artisan vcrud:g',

    /*
     * Route name
     */
    'route-name' => 'vcrud.',

    /*
     * Layout
     */
    'layout' => 'layouts.admin',

    /*
     * Enabled
     */
    'enable' => true,

    'data' => [

        [
            'namespace' => 'Admin\ProjectPictures',
            'viewBaseName' => 'admin.project-pictures',
            'modelClassName' => 'Project',
            'locked' => true,
            'formsFields' => [
                [
                    'id' => 'designation',
                    'name' => 'designation',
                    'label' => 'Nom du projet',
                    'type' => 'text',
                    'model' => null,
                    'model_via' => null,
                    'model_key' => null,
                    'relation_type' => null,
                    'required' => true,
                    'multiple' => false,
                    'classes' => '',
                    'target' => 'main',
                ],
            ],
        ],
    ],

];
