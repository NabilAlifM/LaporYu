<?php

namespace Database\Factories;

use App\Models\Instansi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Instansi>
 */
class InstansiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory()->create(['role' => 'instansi'])->id,
            'nama_instansi' => fake()->company(),
            'kategori_tanggung_jawab' => fake()->randomElement(\App\Models\Report::getKategoriList()),
            'kode_wilayah' => fake()->numerify('##.##.##'),
            'kontak' => fake()->phoneNumber(),
        ];
    }
}
