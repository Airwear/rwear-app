<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Server Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default server configuration (see below)
    | that should be used by Laravel Glide.
    |
    */

    'default' => 'images',

    /*
    |--------------------------------------------------------------------------
    | Configurations Servers
    |--------------------------------------------------------------------------
    |
    | Here you may configure as many server configuration as you wish.
    |
    */

    'servers' => [

        /*
         * Articles
         */
        'trainings' => include __DIR__.'/glide_servers/trainings.php',

        /*
         * Avatars server's configuration.
         */
        'avatars' => [

            'source' => 'local',

            'source_path_prefix' => '/avatars',

            'cache' => 'local',

            'cache_path_prefix' => '/avatars/cache',

            'driver' => env('GLIDE_IMAGE_DRIVER', 'gd'),

            'max_image_size' => 2000 * 2000,

            'signatures' => true,

            'sign_key' => env('GLIDE_SIGN_KEY'),

            'base_url' => '/avatars',
        ],
    ],
];
