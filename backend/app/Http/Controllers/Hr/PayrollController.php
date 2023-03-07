<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\EmployeeModel;
use App\Models\PayrollModel;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    public function getPayrolls(Request $request)
    {
        $employees = EmployeeModel::with('departmens.positions')->where('trashed', 0)->get();
        $payrolls  = PayrollModel::with('employees.departmens.positions')->where('trashed', 0)
            ->where(function ($query) use ($request) {
                if ($request->has('filter')) {
                    $query->where("basic_salary", "like", "%$request->filter%")

                        ->orWhereHas('employees', function ($q) use ($request) {
                            $q->where("name", "like", "%$request->filter%");
                        })

                        ->orWhereHas('employees.departmens', function ($q) use ($request) {
                            $q->where("name", "like", "%$request->filter%");
                        })

                        ->orWhereHas('employees.departmens.positions', function ($q) use ($request) {
                            $q->where("name", "like", "%$request->filter%");
                        });
                }
            });
        $meta     = [];
        $perPage  = $request->per_page ?? 15;
        $payrolls = $payrolls->paginate($perPage);

        $meta = [
            'current_page' => $payrolls->currentPage(),
            'last_page'    => $payrolls->lastPage(),
            'per_page'     => $payrolls->perPage(),
            'total'        => $payrolls->total()
        ];

        return response()->json([
            'data'         => $payrolls->items(),
            'employeeData' => $employees,
            'meta'         => $meta,
            'request'      => $request->per_page
        ]);
    }
}
