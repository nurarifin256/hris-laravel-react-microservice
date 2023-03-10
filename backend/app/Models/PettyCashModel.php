<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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

    static function get_number($number)
    {
        $get_number = DB::table('petty_cash_journals')
            ->orWhere('number', 'like', '%' . $number . '%')
            ->orderBy('id', 'desc')
            ->limit(1)
            ->select('number')
            ->first();

        return $get_number;
    }

    static function save_credit($idDepartmentC, $idCoaC, $number, $descriptionC, $credit, $datetime, $created_by)
    {
        DB::select("CALL post_refill($idDepartmentC, $idCoaC, '$number', '$descriptionC', $credit, 0, '$created_by', '$datetime')");
    }

    static function save_debit($idDepartment, $idCoa, $number, $description, $debit, $datetime, $created_by)
    {
        DB::select("CALL post_refill($idDepartment, $idCoa, '$number', '$description', 0, $debit, '$created_by', '$datetime')");
    }

    static function update_debit($idD, $idDepartment, $idCoa, $description, $debit, $updated_by)
    {
        DB::select("CALL update_refill($idD, $idDepartment, $idCoa, '$description', 0, $debit, '$updated_by')");
    }

    static function update_credit($idC, $idDepartmentC, $idCoaC, $descriptionC, $credit, $updated_by)
    {
        DB::select("CALL update_refill($idC, $idDepartmentC, $idCoaC, '$descriptionC', $credit, 0, '$updated_by')");
    }

    static function delete_refill($updated_by, $number)
    {
        DB::select("CALL delete_refill('$updated_by', '$number')");
    }

    static function get_refill($number)
    {
        return DB::select("CALL get_refill('$number')");
    }
}
