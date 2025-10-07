<?php

namespace App\Contracts;

interface DataTransformerContract
{
    public function transform(mixed $data): array;
}
