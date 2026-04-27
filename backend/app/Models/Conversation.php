<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'participant_one_id',
        'participant_two_id',
        'last_message_at',
    ];

    public function participants()
    {
        return $this->belongsToMany(User::class, 'conversation_user');
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
