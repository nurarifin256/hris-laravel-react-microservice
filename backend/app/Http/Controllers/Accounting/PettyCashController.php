<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\CoaModel;
use App\Models\DepartmentModel;
use App\Models\PettyCashModel;
use Illuminate\Http\Request;
use Validator;

class PettyCashController extends Controller
{
    public function getPettyCash(Request $request)
    {
        $departmentData = DepartmentModel::with('positions')->where('trashed', 0)->get();
        $coasData       = CoaModel::where('trashed', 0)->get();
        $pettyCash      = PettyCashModel::with('coas', 'departmens.positions')->where('trashed', 0);

        $meta      = [];
        $perPage   = $request->per_page ?? 10;
        $pettyCash = $pettyCash->paginate($perPage);

        $meta = [
            'current_page' => $pettyCash->currentPage(),
            'last_page'    => $pettyCash->lastPage(),
            'per_page'     => $pettyCash->perPage(),
            'total'        => $pettyCash->total()
        ];

        return response()->json([
            'data'           => $pettyCash->items(),
            'departmentData' => $departmentData,
            'coasData'       => $coasData,
            'meta'           => $meta,
            'request'        => $request->per_page
        ]);
    }

    public function savePettyCash(Request $request)
    {
        if ($request->isMethod('post')) {
            $data = $request->input();

            $rules = [
                "idCoa"        => "required",
                "idDepartment" => "required",
                "description"  => "required",
                "debit"        => "required|same:credit",
                "credit"       => "required|same:debit",
            ];

            $customMesagges = [
                'idCoa.required'        => "COA is required",
                'idDepartment.required' => "Department is required",
                'description.required'  => "Description is required",
                'debit.required'        => "Debit is required",
                'debit.same'            => "Debit must be balance credit",
                'credit.required'       => "Credit is required",
                'credit.same'           => "Credit must be balance debit",
            ];

            $validator = Validator::make($data, $rules, $customMesagges);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }
        }
    }
}
