<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeModel extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $table   = "employees";

    public function departmens()
    {
        return $this->belongsTo(DepartmentModel::class, 'id_department');
    }

    // public function positions()
    // {
    //     return $this->belongsToMany(PositionModel::class, 'id_position');
    // }
}
