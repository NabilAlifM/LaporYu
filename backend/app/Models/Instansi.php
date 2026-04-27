<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Instansi extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'nama_instansi',
        'kategori_tanggung_jawab',
        'kode_wilayah',
        'kontak',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function routingRules()
    {
        return $this->hasMany(RoutingRule::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function statusLogs()
    {
        return $this->hasMany(ReportStatusLog::class);
    }
}
