<?php

namespace App\Providers;

use App\Contracts\Auth\UserAccessInterface;
use App\Managers\Users\UserAccessManager;
use App\View\Composers\SharedViewData;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('context', function () {
            return SharedViewData::context();
        });

        $this->app->bind(UserAccessInterface::class, UserAccessManager::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Paginator::useBootstrap();
        Facades\View::composer('*', SharedViewData::class);
    }
}
