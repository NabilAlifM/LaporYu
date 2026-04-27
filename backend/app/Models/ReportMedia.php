<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportMedia extends Model
{
    protected $fillable = [
        'report_id',
        'type',
        'url',
        'order',
    ];

    public function report()
    {
        return $this->belongsTo(Report::class);
    }
}
