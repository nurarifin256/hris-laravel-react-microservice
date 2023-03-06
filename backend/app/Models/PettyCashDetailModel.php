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

    static function get_number($number_refill, $number)
    {
        $get_number = DB::table('petty_cash_journal_details')
            ->where('number_refill', $number_refill)
            ->where('number_journal', 'like', '%' . $number . '%')
            ->where('trashed', 0)
            // ->orderBy('id', 'desc')
            ->orderBy('number_journal', 'desc')
            ->limit(1)
            ->select('number_journal')
            ->first();

        return $get_number;
    }

    static function get_ballance($number_refill, $set_number)
    {
        $get_number = DB::table('petty_cash_journal_details')
            ->where('number_refill', $number_refill)
            ->where('number_journal', 'like', '%' . $set_number . '%')
            ->where('trashed', 0)
            ->orderBy('number_journal', 'desc')
            ->orderBy('id', 'desc')
            ->limit(1)
            ->select('balance', 'debit', 'credit')
            ->first();

        return $get_number;
    }
}
