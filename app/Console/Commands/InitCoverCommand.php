<?php

namespace App\Console\Commands;

use App\Services\Trainings\InitCoverService;
use Illuminate\Console\Command;

class InitCoverCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'init:cover';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        (new InitCoverService())->initEmptyCover();
        return Command::SUCCESS;
    }
}
