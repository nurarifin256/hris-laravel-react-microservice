<?php

namespace App\Http\Controllers\Employees;

use App\Http\Controllers\Controller;
use App\Models\DepartmentModel;
use App\Models\EmployeeModel;
use Illuminate\Http\Request;

class EmployeesController extends Controller
{
    public function getEmployees(Request $request)
    {
        $departmentData = DepartmentModel::with('positions')->where('trashed', 0)->get();
        $employees = EmployeeModel::with('departmens.positions')->where('trashed', 0)
            ->where(function ($query) use ($request) {
                if ($request->has('filter')) {
                    $query->where("name", "like", "$request->filter%")
                        ->orWhere("mobile_phone_number", "like", "$request->filter%")
                        ->orWhere("gender", "like", "$request->filter%")
                        ->orWhere("address", "like", "$request->filter%")
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
            'data'           => $employees->items(),
            'departmentData' => $departmentData,
            'meta'           => $meta,
            'request'        => $request->per_page
        ]);
    }
}
