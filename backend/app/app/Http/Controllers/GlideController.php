<?php

namespace App\Http\Controllers;

use Glide;
use Illuminate\Http\Request;

class GlideController extends Controller
{
    /**
     * @param $path
     * @param Request $request
     * @return mixed
     */
    public function trainings($path, Request $request)
    {
        return Glide::server('trainings')->imageResponse($path, $request->all());
    }

}
