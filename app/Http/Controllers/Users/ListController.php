<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;

class ListController extends Controller
{
    /**
     * @param Request $request
     * @param UserRepository $userRepository
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function index(Request $request, UserRepository $userRepository)
    {
        return view('users.list', [
            'list' => $userRepository->getList($request),
            'searched' => $request->get('searched'),
        ]);
    }
}
