<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PositionModel extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $table   = "positions";

    public function departmens()
    {
        return $this->hasMany(DepartmentModel::class, 'id_position');
    }

    static function getPositions()
    {
        $positions = DB::table('positions')
            ->where('trashed', 0)
            ->select('name', 'id', 'created_at', 'created_by')
            ->get();

        return $positions;
    }
}
