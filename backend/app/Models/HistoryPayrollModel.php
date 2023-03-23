<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HistoryPayrollModel extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded = ['id'];
    protected $table   = "payroll_histories";
    protected $dates   = ['deleted_at'];

    public function payrolls()
    {
        return $this->belongsTo(PayrollModel::class, 'id_payroll');
    }
}
