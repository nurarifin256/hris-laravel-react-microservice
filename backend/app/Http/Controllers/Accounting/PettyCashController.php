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
        $pettyCash      = PettyCashModel::with('coas', 'departmens.positions')->where('trashed', 0)->orderBy('id', 'asc');

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
                "idCoa"         => "required",
                "idCoaC"        => "required",
                "idDepartment"  => "required",
                "idDepartmentC" => "required",
                "description"   => "required",
                "descriptionC"  => "required",
                "debit"         => "required|same:credit",
                "credit"        => "required|same:debit",
            ];

            $customMesagges = [
                'idCoa.required'         => "COA is required",
                'idCoaC.required'        => "COA is required",
                'idDepartment.required'  => "Department is required",
                'idDepartmentC.required' => "Department is required",
                'description.required'   => "Description is required",
                'descriptionC.required'  => "Description is required",
                'debit.required'         => "Debit is required",
                'debit.same'             => "Debit must be balance credit",
                'credit.required'        => "Credit is required",
                'credit.same'            => "Credit must be balance debit",
            ];

            $validator = Validator::make($data, $rules, $customMesagges);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $month      = date("ym");
            $set_number = "JPC" . $month;
            $get_number = PettyCashModel::get_number($set_number);

            if ($get_number) {
                $number_n     = $get_number->number;
                $number_n2    = substr($number_n, -2);
                $number_n3    = $number_n2 + 01;
                $number_final = sprintf("%02d", $number_n3);
            } else {
                $number_final = sprintf("%02d", 1);
            }

            $debit_str  = str_replace(',', '', $data['debit']);
            $credit_str = str_replace(',', '', $data['credit']);
            $number     = $set_number . $number_final;
            $created_by = $data['created_by'];

            // save data debit
            $idCoa        = $data['idCoa'];
            $idDepartment = $data['idDepartment'];
            $description  = $data['description'];
            $debit        = $debit_str;
            PettyCashModel::save_debit($idDepartment, $idCoa, $number, $description, $debit, $created_by);

            // save data credit
            $idCoaC        = $data['idCoaC'];
            $idDepartmentC = $data['idDepartmentC'];
            $descriptionC  = $data['descriptionC'];
            $credit        = $credit_str;
            PettyCashModel::save_credit($idDepartmentC, $idCoaC, $number, $descriptionC, $credit, $created_by);

            return response()->json([
                'status'  => true,
                'message' => 'Save data refill success',
                201
            ]);
        }
    }
}
