<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayrollModel extends Model
{
    use HasFactory;
    use HasFactory;
    protected $guarded = ['id'];
    protected $table   = "payrolls";

    public function employees()
    {
        return $this->belongsTo(EmployeeModel::class, 'id_employee');
    }
}
