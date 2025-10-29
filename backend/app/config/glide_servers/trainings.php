<?php

return [

    // Source filesystem
    'source' => 'local',

    // Source filesystem path prefix
    'source_path_prefix' => '/trainings',

    // Cache filesystem
    'cache' => 'local',

    // Cache filesystem path prefix
    'cache_path_prefix' => '/trainings/cache',

    // Watermarks filesystem
    'watermarks' => 'local',

    // Watermarks filesystem path prefix
    'watermarks_path_prefix' => '/watermarks',

    // Image driver (gd or imagick)
    'driver' => env('GLIDE_IMAGE_DRIVER', 'gd'),

    // Image size limit
    'max_image_size' => 2000 * 2000,

    // Secure your Glide image server with HTTP signatures.
    'signatures' => false,

    // Sign Key - A 128 character (or larger) signing key is recommended.
    'sign_key' => env('GLIDE_SIGN_KEY'),

    // Base URL of the images
    'base_url' => '/trainings/medias',

    // Default image manipulations
    // see http://glide.thephpleague.com/1.0/config/defaults-and-presets/
    'defaults' => [
        // Examples:
        // 'mark' => 'logo.png',
        // 'markw' => '30w',
        // 'markpad' => '5w',
    ],

    // Preset image manipulations
    // see http://glide.thephpleague.com/1.0/config/defaults-and-presets/
    'presets' => [

        // Examples:
        'xxs-small' => [
            'w' => 60,
            'h' => 60,
            'fit' => 'crop',
        ],

        'xs-small' => [
            'w' => 100,
            'h' => 100,
            'fit' => 'crop',
        ],

        'small' => [
            'w' => 200,
            'h' => 200,
            'fit' => 'crop',
        ],

        'medium' => [
            'w' => 600,
            'h' => 400,
            'fit' => 'crop',
        ],

        'lg' => [
            'w' => 1920,
            'h' => 1080,
            'fit' => 'crop',
        ],
    ],
];
