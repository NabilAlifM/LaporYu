<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Instansis (and their Instansi Users)
        $instansis = \App\Models\Instansi::factory(5)->create();

        // 2. Create Regular Users
        $users = \App\Models\User::factory(10)->create(['role' => 'user']);

        // 3. Create Specific Test User
        $testUser = \App\Models\User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'role' => 'user',
        ]);

        // 4. Create Routing Rules
        foreach (\App\Models\Report::getKategoriList() as $kategori) {
            \App\Models\RoutingRule::factory()->create([
                'kategori' => $kategori,
                'instansi_id' => $instansis->random()->id,
                'kode_wilayah' => '31.71.01', // Example default region
            ]);
        }

        // 5. Create Reports
        $reports = \App\Models\Report::factory(20)->create([
            'user_id' => function () use ($users, $testUser) {
                return rand(0, 1) ? $testUser->id : $users->random()->id;
            },
            'instansi_id' => function () use ($instansis) {
                return $instansis->random()->id;
            },
            'kode_wilayah' => '31.71.01',
        ]);

        // 6. Create Comments and Upvotes for Reports
        foreach ($reports as $report) {
            // Comments
            \App\Models\Comment::factory(rand(1, 5))->create([
                'report_id' => $report->id,
                'user_id' => $users->random()->id,
            ]);

            // Upvotes
            for ($i = 0; $i < rand(0, 5); $i++) {
                \App\Models\Upvote::firstOrCreate([
                    'report_id' => $report->id,
                    'user_id' => $users->random()->id,
                ]);
            }
        }
    }
}
