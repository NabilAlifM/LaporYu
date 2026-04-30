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

        $damageImages = [
            'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80', // pothole
            'https://images.unsplash.com/photo-1585253818961-d7d8e063f25e?auto=format&fit=crop&q=80', // trash
            'https://images.unsplash.com/photo-1605335930218-1c4b1eb4c619?auto=format&fit=crop&q=80', // abandoned building
            'https://images.unsplash.com/photo-1533035353720-98b11119b4fc?auto=format&fit=crop&q=80', // dirty alley
            'https://images.unsplash.com/photo-1582215354972-c51016d90a9b?auto=format&fit=crop&q=80', // broken sidewalk
            'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80', // broken bridge
            'https://images.unsplash.com/photo-1621290204273-03f4f9f74358?auto=format&fit=crop&q=80', // flood
            'https://images.unsplash.com/photo-1625244724123-1eeaa43d0017?auto=format&fit=crop&q=80', // trash pile
            'https://images.unsplash.com/photo-1590019156184-a55ca0998f0d?auto=format&fit=crop&q=80', // cracked wall
            'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80', // messy construction
            'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80', // pollution
            'https://images.unsplash.com/photo-1495556650867-99590cea3657?auto=format&fit=crop&q=80', // trash bag
            'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80', // broken light
        ];

        // 6. Create Media, Comments, and Upvotes for Reports
        foreach ($reports as $index => $report) {
            // Media (1-2 images per report)
            for ($i = 0; $i < rand(1, 2); $i++) {
                \App\Models\ReportMedia::create([
                    'report_id' => $report->id,
                    'url' => collect($damageImages)->random(),
                    'type' => 'image',
                ]);
            }
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
