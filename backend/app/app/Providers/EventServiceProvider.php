<?php

namespace App\Providers;

use App\Events\Interventions\CreatedEvent;
use App\Events\Interventions\StepperUpdatedEvent;
use App\Events\Interventions\ViewEvent;
use App\Listeners\Interventions\CreatedEventListener;
use App\Listeners\Interventions\StepperUpdatedEventListener;
use App\Listeners\Interventions\ViewEventListener;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],

        CreatedEvent::class => [
            CreatedEventListener::class,
        ],

        ViewEvent::class => [
            ViewEventListener::class,
        ],

        StepperUpdatedEvent::class => [
            StepperUpdatedEventListener::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
