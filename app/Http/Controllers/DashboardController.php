<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Repositories\CategoryRepository;
use App\Repositories\CoachRepository;
use App\Repositories\TrainingRepository;
use App\Repositories\UserTrainingRepository;
use Illuminate\Http\Request;

class DashboardController extends Controller
{

    public function index(
        Request $request,
        TrainingRepository $trainingRepository,
        CategoryRepository $categoryRepository,
        CoachRepository $coachRepository,
        UserTrainingRepository $userTrainingRepository,
    )
    {
        $viewData = [
            'trainingCount' => $trainingRepository->count(),
            'categoryCount' => $categoryRepository->count(),
            'coachCount' => $coachRepository->count(),
            'userTrainings' => $userTrainingRepository->getList($request, 220),
            'lastConnectedUsers' => User::query()
                ->withCount(['trainings'])
                ->whereDate('created_at', '>', '2024-12-01')
                ->whereNotNull('last_connection')
                ->orderByDesc('trainings_count')
                ->orderByDesc('last_connection')
                ->get(),
        ];

        return view('dashboard', $viewData);
    }
}
