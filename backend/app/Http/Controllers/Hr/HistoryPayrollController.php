<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\HistoryPayrollModel;
use Illuminate\Http\Request;

class HistoryPayrollController extends Controller
{
    public function getHistoryPayrolls(Request $request)
    {
        if ($request->isMethod('get')) {
            $payrollHistories = HistoryPayrollModel::with('payrolls.employees.departmens.positions')
                ->where(function ($query) use ($request) {
                    if ($request->has('filter')) {
                        $query->where("nett_salary", "like", "%$request->filter%")

                            ->orWhereHas('payrolls.employees', function ($q) use ($request) {
                                $q->where("name", "like", "%$request->filter%");
                            })

                            ->orWhereHas('payrolls.employees.departmens', function ($q) use ($request) {
                                $q->where("name", "like", "%$request->filter%");
                            })

                            ->orWhereHas('payrolls.employees.departmens.positions', function ($q) use ($request) {
                                $q->where("name", "like", "%$request->filter%");
                            });
                    }
                });

            $meta     = [];
            $perPage  = $request->per_page ?? 15;
            $payrollHistories = $payrollHistories->paginate($perPage);

            $meta = [
                'current_page' => $payrollHistories->currentPage(),
                'last_page'    => $payrollHistories->lastPage(),
                'per_page'     => $payrollHistories->perPage(),
                'total'        => $payrollHistories->total()
            ];

            return response()->json([
                'data'         => $payrollHistories->items(),
                'meta'         => $meta,
                'request'      => $request->per_page,
            ]);
        }
    }

    public function getDetailHistoryPayrolls(Request $request, $id)
    {
        if ($request->isMethod('get')) {

            $salaryDetail = HistoryPayrollModel::with('payrolls.employees.departmens.positions')->where('id', $id)->first();

            return response()->json([
                'status' => true,
                'data'   => $salaryDetail,
                200
            ]);
        }
    }

    public function deleteHistoryPayrolls(Request $request)
    {
        if ($request->isMethod('delete')) {
            $data = $request->input();

            $payrollHistory = HistoryPayrollModel::find($data['id']);
            $payrollHistory->delete();

            return response()->json([
                'status' => true,
                'message' => "History payroll success deleted",
                204
            ]);
        }
    }
}
