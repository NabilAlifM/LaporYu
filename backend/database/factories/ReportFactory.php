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
        $topics = ['Jalan Berlubang di', 'Lampu Jalan Mati di', 'Tumpukan Sampah di', 'Saluran Air Mampet di', 'Fasilitas Taman Rusak di', 'Pohon Tumbang di'];
        $locations = [
            ['city' => 'Tangerang Selatan', 'area' => 'Ciputat', 'lat' => -6.3134, 'lng' => 106.7490],
            ['city' => 'Tangerang Selatan', 'area' => 'Pondok Ranji', 'lat' => -6.2825, 'lng' => 106.7454],
            ['city' => 'Tangerang Selatan', 'area' => 'Pamulang', 'lat' => -6.3458, 'lng' => 106.7381],
            ['city' => 'Jakarta', 'area' => 'Sudirman', 'lat' => -6.2238, 'lng' => 106.8080],
            ['city' => 'Bandung', 'area' => 'Dago', 'lat' => -6.8841, 'lng' => 107.6160],
        ];
        
        $loc = fake()->randomElement($locations);
        $topic = fake()->randomElement($topics) . ' ' . $loc['area'];

        $descriptions = [
            'Mohon segera diperbaiki karena sangat membahayakan pengendara yang lewat, terutama saat malam hari.',
            'Sudah hampir seminggu belum ada penanganan dari pihak terkait. Bau menyengat mulai mengganggu warga sekitar.',
            'Kondisi ini sudah terjadi cukup lama dan semakin parah setiap kali hujan turun. Mohon atensinya.',
            'Fasilitas ini sangat dibutuhkan oleh warga, sangat disayangkan jika dibiarkan rusak begitu saja.',
            'Kami berharap ada tindakan cepat sebelum terjadi hal-hal yang tidak diinginkan di lingkungan kami.',
            'Laporan ini saya sampaikan mewakili keresahan warga yang setiap hari melintasi jalur ini.'
        ];

        return [
            'user_id' => \App\Models\User::factory(),
            'judul' => $topic,
            'deskripsi' => fake()->randomElement($descriptions),
            'kategori' => fake()->randomElement(\App\Models\Report::getKategoriList()),
            'latitude' => $loc['lat'] + (mt_rand(-50, 50) / 10000),
            'longitude' => $loc['lng'] + (mt_rand(-50, 50) / 10000),
            'kelurahan' => $loc['area'],
            'kecamatan' => $loc['area'],
            'kota' => $loc['city'],
            'provinsi' => 'Jawa',
            'kode_wilayah' => fake()->numerify('##.##.##'),
            'status' => fake()->randomElement(['baru', 'diproses', 'selesai', 'ditolak']),
            'upvotes_count' => fake()->numberBetween(0, 100),
            'comments_count' => fake()->numberBetween(0, 50),
        ];
    }
}
