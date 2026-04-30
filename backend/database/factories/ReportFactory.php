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
            ['city' => 'Tangerang Selatan', 'area' => 'Ciputat'],
            ['city' => 'Tangerang Selatan', 'area' => 'Pondok Ranji'],
            ['city' => 'Tangerang Selatan', 'area' => 'Pamulang'],
            ['city' => 'Jakarta', 'area' => 'Sudirman'],
            ['city' => 'Bandung', 'area' => 'Dago'],
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
            'latitude' => fake()->latitude(-10, 5),
            'longitude' => fake()->longitude(95, 140),
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
