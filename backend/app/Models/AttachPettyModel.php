<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttachPettyModel extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $table   = "attach_pettys";
}
