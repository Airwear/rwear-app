<?php

namespace App\Http\Controllers\Groups;

use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\Request;

class CreateController extends Controller
{

    /**
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        try {

            Group::create($request->all());

            return redirect()
                ->route('groups.list')
                ->with('success', "Groupe crée");

        } catch (\Throwable $e) {
            return back()->with('error', trans('navigation.exception_error'));
        }
    }
}
