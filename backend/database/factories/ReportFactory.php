<?php

namespace Database\Factories;

use App\Models\Report;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'judul' => fake()->sentence(),
            'deskripsi' => fake()->paragraph(),
            'kategori' => fake()->randomElement(\App\Models\Report::getKategoriList()),
            'latitude' => fake()->latitude(-10, 5),
            'longitude' => fake()->longitude(95, 140),
            'kelurahan' => fake()->citySuffix(),
            'kecamatan' => fake()->streetName(),
            'kota' => fake()->city(),
            'provinsi' => fake()->state(),
            'kode_wilayah' => fake()->numerify('##.##.##'),
            'status' => fake()->randomElement(['baru', 'diproses', 'selesai', 'ditolak']),
            'upvotes_count' => fake()->numberBetween(0, 100),
            'comments_count' => fake()->numberBetween(0, 50),
        ];
    }
}
