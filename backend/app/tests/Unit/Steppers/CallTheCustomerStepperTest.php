<?php

namespace Tests\Unit\Steppers;

use App\Models\InterventionHasStepper;
use App\Steppers\CallTheCustomerStepper;
use PHPUnit\Framework\TestCase;

class CallTheCustomerStepperTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_class_name()
    {
        $stepper = new CallTheCustomerStepper(new InterventionHasStepper());

        $this->assertInstanceOf(CallTheCustomerStepper::class, $stepper);
        $this->assertSame('interventions.steppers.call-the-customer', $stepper->viewName());
    }
}
