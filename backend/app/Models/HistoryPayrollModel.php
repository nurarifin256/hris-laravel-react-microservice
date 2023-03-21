<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoryPayrollModel extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $table   = "payroll_histories";

    public function payrolls()
    {
        return $this->belongsTo(PayrollModel::class, 'id_payroll');
    }
}
