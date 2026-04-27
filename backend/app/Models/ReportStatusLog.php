<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportStatusLog extends Model
{
    protected $fillable = [
        'report_id',
        'instansi_id',
        'status',
        'keterangan',
    ];

    public function report()
    {
        return $this->belongsTo(Report::class);
    }

    public function instansi()
    {
        return $this->belongsTo(Instansi::class);
    }
}
