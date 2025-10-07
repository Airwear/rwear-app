<?php

use Spatie\MediaLibrary\MediaCollections\Models\Media;

if (!function_exists('highlight')) {
    /**
     * Met en exergue un résultat de recherche (pattern) dans une chaîne (string).
     * Prend en compte les caractères accentués.
     *
     * @param  string $string
     * @param  string $pattern
     * @param  string $cssClass Classe CSS appliquée sur le <span> de la mise en exergue.
     * @return string
     */
    function highlight($string, $pattern, $cssClass = 'bg-warning')
    {
        if ($pattern === '') {
            return e($string);
        }

        static $replacements = [
            'a' => '[àáâãäåa]',
            'e' => '[èéêëe]',
            'i' => '[ìíîïi]',
            'o' => '[òóôõöo]',
            'u' => '[ùúûüu]',
            'c' => '[çc]',
            'n' => '[ñn]',
            'A' => '[ÂÃÄÀÁÅA]',
            'E' => '[ÈÉÊËE]',
            'I' => '[ÌÍÎÏI]',
            'O' => '[ÒÓÔÕÖO]',
            'U' => '[ÙÚÛÜU]',
            'C' => '[ÇC]',
            'N' => '[ÑN]',
        ];

        $pattern = addcslashes($pattern, '.*+?!<>=-|()[]{}^$/');
        $pattern = str_replace(array_keys($replacements), $replacements, $pattern);
        $pattern = str_replace(['_', '%'], ['.', '.*'], $pattern);

        if (mb_strpos($pattern, '"') === 0) {
            $pattern = '^(' . mb_substr($pattern, 1);
        } else {
            $pattern = '(' . $pattern;
        }

        if (mb_strrpos($pattern, '"') === mb_strlen($pattern) - 1) {
            $pattern = mb_substr($pattern, 0, -1) . ')$';
        } else {
            $pattern = $pattern . ')';
        }

        // On n'entoure pas directement la mise en exergue avec les balises <span>
        // et </span> car il faut d'abord échapper la chaîne (via helper "e")
        $highlighted = preg_replace('/' . $pattern . '/ui', '##START_HL##\\1##STOP_HL##', $string);

        // Une fois la chaîne échappée, on ajoute les balises <span> et </span>
        return strtr(e($highlighted), [
            '##START_HL##' => '<span class="' . $cssClass . '">',
            '##STOP_HL##'  => '</span>',
        ]);
    }
}

if (!function_exists('quotes')) {
    function quotes($text): string
    {
        return "« {$text} »";
    }
}



if (!function_exists('mime_type_icon')) {
    function mime_type_icon($inputMimeType, $default = 'fa-file-o')
    {
        static $mimeTypesFa4Classes = [

            // Media
            'image' => 'fa-file-image',
            'audio' => 'fa-file-audio',
            'video' => 'fa-file-video',

            // Documents
            'application/pdf' => 'fa-file-pdf',
            'application/msword' => 'fa-file-word',
            'application/vnd.ms-word' => 'fa-file-word',
            'application/vnd.oasis.opendocument.text' => 'fa-file-word',
            'application/vnd.openxmlformats-officedocument.wordprocessingml' => 'fa-file-word',
            'application/vnd.ms-excel' => 'fa-file-excel-o',
            'application/vnd.openxmlformats-officedocument.spreadsheetml' => 'fa-file-excel',
            'application/vnd.oasis.opendocument.spreadsheet' => 'fa-file-excel',
            'application/vnd.ms-powerpoint' => 'fa-file-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml' => 'fa-file-powerpoint',
            'application/vnd.oasis.opendocument.presentation' => 'fa-file-powerpoint',
            'text/plain' => 'fa-file-alt',
            'text/html' => 'fa-file-code',
            'application/json' => 'fa-file-code',

            // Archives
            'application/gzip' => 'fa-file-archive',
            'application/zip' => 'fa-file-archive',
        ];

        foreach ($mimeTypesFa4Classes as $mimeType => $fa4Class) {
            if (strpos($inputMimeType, $mimeType) === 0) {
                return $fa4Class;
            }
        }

        return $default;
    }
}

if (!function_exists('mime_type')) {
    function mime_type($mimeType): ?string
    {
        return [
            'image/png' => 'image',
            'image/png' => 'image',
            'image/jpeg' => 'image',
            'image/gif' => 'image',
            'audio' => 'audio',
            'video/mp4' => 'video',
            //'application/pdf' => 'pdf',
        ][$mimeType] ?? null;
    }
}

if (!function_exists('minutes_to_hours')) {
    function minutes_to_hours($time): string
    {
        if ($time < 1) {
            return '';
        }

        $format = '%02dh %02dmin';
        $hours = floor($time / 60);
        $minutes = ($time % 60);

        return sprintf($format, $hours, $minutes);
    }
}

if (!\function_exists('amount_format')) {
    function amount_format($price): string
    {
        return number_format(
            $price,
            2,
            ',',
            ' '
        );
    }
}

//test if a string is json
if (!\function_exists('isJson')) {
    function isJson($string)
    {
        return is_object(json_decode($string));
    }
}

//test if a string is json
if (!\function_exists('day_of_week')) {
    function day_of_week($index): ?string
    {
        $dayOfWeek = [
            0 => 'Dimanche',
            1 => 'Lundi',
            2 => 'Mardi',
            3 => 'Mercredi',
            4 => 'Jeudi',
            5 => 'Vendredi',
            6 => 'Samedi',
        ];

        return $dayOfWeek[$index] ?? null;
    }
}

if (!\function_exists('is_seller')) {
    function is_seller() {
        return auth()->user()->is_seller;
    }

    function is_not_seller(): bool
    {
        return ! is_seller();
    }
}

if (!\function_exists('current_classroom')) {

    function current_session(): \Illuminate\Database\Eloquent\Model|\Illuminate\Database\Eloquent\Builder
    {
        $user = auth()->user();
        return \App\Models\Session::query()
            ->where('active', true)
            ->where('sessionable_id', $user->group_id ?? auth()->id())
            ->where('sessionable_type', get_class($user->group ?? $user))
            ->firstOrNew();
    }
}

if (! function_exists('days_of_week')) {
    function days_of_week(): array
    {
        $lang = app()->getLocale();

        if ($lang == 'en') {
            return [
                1 => 'Monday',
                2 => 'Tuesday',
                3 => 'Wednesday',
                4 => 'Thursday',
                5 => 'Friday',
                6 => 'Saturday',
                0 => 'Sunday',
            ];
        }

        return [
            1 => 'Lundi',
            2 => 'Mardi',
            3 => 'Mercredi',
            4 => 'Jeudi',
            5 => 'Vendredi',
            6 => 'Samedi',
            0 => 'Dimanche',
        ];
    }
}

if (! function_exists('carbon'))
{
    function carbon($date): bool|\Illuminate\Support\Carbon
    {
        return \Illuminate\Support\Carbon::createFromFormat('Y-m-d', $date);
    }
}

if (!function_exists('url_media')) {
    function url_media($media, string $disk, string $preset = 'medium'): string
    {
        if (! $media) {
            return  asset('/images/logo.png');
        }

        return config('app.url').''. \Glide::server($disk)->url($media->getKey() . '/' . $media->file_name, ['p' => $preset]);
    }
}

if (!\function_exists('percent')) {

    function percent($count, $total): float
    {
        if ($count == 0) {
            return 0;
        }

        return round(($count / $total) * 100, 2);
    }
}

if (!\function_exists('super_admin')) {

    function super_admin(): \App\Models\User
    {
        return \App\Models\User::where('email', 'noutathierry@yahoo.fr')->first();
    }
}

if (! function_exists('number_formated')) {

    /**
     * @param $value
     * @param int $decimals
     * @return string
     */
    function number_formated($value, $decimals = 2)
    {
        return number_format($value, $decimals, ',', ' ');
    }
}

if (!function_exists('media_url')) {
    function media_url(?Media $media, $disk, $preset = 'medium'): string
    {
        return config('app.url') . '' . \Glide::server($disk)->url($media->getKey() . '/' . $media->file_name, ['p' => $preset]);
    }
}


if (! function_exists('parse_phone_number')) {

    function parse_phone_number($number) {
        // Supprimer tous les caractères non numériques du numéro de téléphone
        $number = preg_replace('/[^0-9]/', '', $number);

        // Vérifier si le numéro de téléphone a une longueur valide
        if (strlen($number) < 2) {
            return $number; // Renvoyer le numéro sans aucun regroupement
        }

        // Regrouper le numéro par groupe de deux chiffres
        $groupes = str_split($number, 2);

        return implode(' ', $groupes);
    }

}



