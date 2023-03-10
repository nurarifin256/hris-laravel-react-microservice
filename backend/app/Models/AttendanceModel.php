<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceModel extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $table   = "attendances";

    public function employees()
    {
        return $this->belongsTo(EmployeeModel::class, 'id_employee');
    }
}
