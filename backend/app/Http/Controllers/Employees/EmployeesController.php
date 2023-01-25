<?php

namespace App\Http\Controllers\Employees;

use App\Http\Controllers\Controller;
use App\Models\EmployeeModel;
use Illuminate\Http\Request;

class EmployeesController extends Controller
{
    public function getEmployees(Request $request)
    {
        $employees = EmployeeModel::with('departmens.positions')->where('trashed', 0)
            ->where(function ($query) use ($request) {
                if ($request->has('filter')) {
                    $query->where("name", "like", "$request->filter%")
                        ->orWhereHas('departmens', function ($q) use ($request) {
                            $q->where('name', 'like', '%' . $request->filter . '%');
                        })
                        ->orWhereHas('departmens.positions', function ($q) use ($request) {
                            $q->where('name', 'like', '%' . $request->filter . '%');
                        });
                }
            });
        $meta      = [];
        $perPage   = $request->per_page ?? 10;
        $employees = $employees->paginate($perPage);

        $meta = [
            'current_page' => $employees->currentPage(),
            'last_page'    => $employees->lastPage(),
            'per_page'     => $employees->perPage(),
            'total'        => $employees->total()
        ];

        return response()->json([
            'data' => $employees->items(),
            'meta' => $meta,
            'request' => $request->per_page
        ]);
    }
}
