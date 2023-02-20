<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepartmentModel extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $table   = "departmens";

    public function positions()
    {
        return $this->belongsTo(PositionModel::class, 'id_position');
    }

    public function employees()
    {
        return $this->hasMany(EmployeeModel::class, 'id_department');
    }

    public function petty_cash()
    {
        return $this->hasMany(PettyCashModel::class, 'id_department');
    }

    public function petty_cash_details()
    {
        return $this->hasMany(PettyCashDetailModel::class, 'id_department');
    }
}
