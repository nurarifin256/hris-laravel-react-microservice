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

    public function payrolls()
    {
        return $this->hasOne(PayrollModel::class, 'id_employee');
    }

    public function attendances()
    {
        return $this->hasMany(AttendanceModel::class, 'id_employee');
    }

    // public function positions()
    // {
    //     return $this->belongsToMany(PositionModel::class, 'id_position');
    // }
}
