<?php

namespace Database\Factories;

use App\Models\RoutingRule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RoutingRule>
 */
class RoutingRuleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kategori' => fake()->randomElement(\App\Models\Report::getKategoriList()),
            'kode_wilayah' => fake()->numerify('##.##.##'),
            'instansi_id' => \App\Models\Instansi::factory(),
        ];
    }
}
