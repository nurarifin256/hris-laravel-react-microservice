<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoaModel extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $table   = "coas";

    public function petty_cash_coa()
    {
        return $this->hasMany(PettyCashModel::class, 'id_coa');
    }

    public function petty_cash_details_coa()
    {
        return $this->hasMany(PettyCashDetailModel::class, 'id_coa');
    }
}
