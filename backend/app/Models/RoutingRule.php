<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoutingRule extends Model
{
    use HasFactory;
    protected $fillable = [
        'kategori',
        'kode_wilayah',
        'instansi_id',
    ];

    public function instansi()
    {
        return $this->belongsTo(Instansi::class);
    }
}
