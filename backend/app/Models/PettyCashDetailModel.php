<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PettyCashDetailModel extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $table   = "petty_cash_journal_details";

    public function departmens()
    {
        return $this->belongsTo(DepartmentModel::class, 'id_department');
    }

    public function coas()
    {
        return $this->belongsTo(CoaModel::class, 'id_coa');
    }

    static function get_number($number)
    {
        $get_number = DB::table('petty_cash_journal_details')
            ->orWhere('number_journal', 'like', '%' . $number . '%')
            ->orderBy('id', 'desc')
            ->limit(1)
            ->select('number')
            ->first();

        return $get_number;
    }
}
