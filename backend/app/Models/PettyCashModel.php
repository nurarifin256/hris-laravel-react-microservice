<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PettyCashModel extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $table   = "petty_cash_journals";

    public function departmens()
    {
        return $this->belongsTo(DepartmentModel::class, 'id_department');
    }

    public function coas()
    {
        return $this->belongsTo(CoaModel::class, 'id_coa');
    }
}
