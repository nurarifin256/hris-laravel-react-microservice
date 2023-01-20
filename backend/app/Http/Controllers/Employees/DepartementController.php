<?php

namespace App\Http\Controllers\Employees;

use App\Http\Controllers\Controller;
use App\Models\DepartmentModel;
use App\Models\PositionModel;
use Illuminate\Http\Request;

class DepartementController extends Controller
{
    public function getDepartment(Request $request)
    {
        $positions = PositionModel::where('trashed', 0)->select(['name', 'id'])->get();
        $departmens =  DepartmentModel::with('positions')->where('trashed', 0)
            ->where(function ($query) use ($request) {
                if ($request->has('filter')) {
                    $query->where("name", "like", "$request->filter%")
                        ->orWhereHas('positions', function ($q) use ($request) {
                            $q->where('name', 'like', '%' . $request->filter . '%');
                        });
                }
            });

        $meta = [];
        $perPage = $request->per_page ?? 10;
        $departmens = $departmens->paginate($perPage);

        $meta = [
            'current_page' => $departmens->currentPage(),
            'last_page'    => $departmens->lastPage(),
            'per_page'     => $departmens->perPage(),
            'total'        => $departmens->total()
        ];

        return response()->json([
            'data'          => $departmens->items(),
            'dataPositions' => $positions,
            'meta'          => $meta,
            'request'       => $request->per_page
        ]);
    }
}
