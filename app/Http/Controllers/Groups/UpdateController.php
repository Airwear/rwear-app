<?php

namespace App\Http\Controllers\Groups;

use App\Http\Controllers\Controller;

use App\Models\Group;
use Illuminate\Http\Request;

class UpdateController extends Controller
{
    /**
     * @param Group $group
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function edit(Group $group)
    {
        return view('groups.edit', [
            'group' => $group,
        ]);
    }

    /**
     * @param Request $request
     * @param Group $group
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Group $group)
    {
        try {
            $group->update([
                'designation' => $request->input('designation'),
                'description' => $request->input('description'),
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'zip_code' => $request->input('zip_code'),
                'city' => $request->input('city'),
                'address' => $request->input('address'),
                'currency' => $request->input('currency'),
                'payment_term' => $request->input('payment_term'),
                'web_site_url' => $request->input('web_site_url'),
                'accept_click_on_collect' => $request->filled('accept_click_on_collect'),
                'accept_payment_on_line' => $request->filled('accept_payment_on_line'),
                'active' => $request->filled('active'),
            ]);
            return back()->with('success', trans('auth.updated'));
        } catch (\Throwable $e) {
            return back()->with('error', trans('navigation.exception_message'));
        }
    }
}
