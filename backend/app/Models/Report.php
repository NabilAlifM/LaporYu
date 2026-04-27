<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;
    const KATEGORI_INFRASTRUKTUR = 'Infrastruktur & Fasilitas Umum';
    const KATEGORI_KEBERSIHAN = 'Kebersihan & Lingkungan';
    const KATEGORI_KEAMANAN = 'Keamanan & Ketertiban';
    const KATEGORI_LAYANAN_PUBLIK = 'Layanan Publik & Administrasi';
    const KATEGORI_KESEHATAN = 'Kesehatan';
    const KATEGORI_PENDIDIKAN = 'Pendidikan';
    const KATEGORI_SOSIAL = 'Sosial & Kemasyarakatan';

    public static function getKategoriList(): array
    {
        return [
            self::KATEGORI_INFRASTRUKTUR,
            self::KATEGORI_KEBERSIHAN,
            self::KATEGORI_KEAMANAN,
            self::KATEGORI_LAYANAN_PUBLIK,
            self::KATEGORI_KESEHATAN,
            self::KATEGORI_PENDIDIKAN,
            self::KATEGORI_SOSIAL,
        ];
    }

    protected $fillable = [
        'user_id',
        'judul',
        'deskripsi',
        'kategori',
        'latitude',
        'longitude',
        'kelurahan',
        'kecamatan',
        'kota',
        'provinsi',
        'kode_wilayah',
        'instansi_id',
        'status',
        'upvotes_count',
        'comments_count',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function instansi()
    {
        return $this->belongsTo(Instansi::class);
    }

    public function media()
    {
        return $this->hasMany(ReportMedia::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function upvotes()
    {
        return $this->hasMany(Upvote::class);
    }

    public function statusLogs()
    {
        return $this->hasMany(ReportStatusLog::class);
    }
}
