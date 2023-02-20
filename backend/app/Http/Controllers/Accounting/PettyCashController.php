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

        $pettyCash      = PettyCashModel::with('coas', 'departmens.positions')->where('trashed', 0)
            ->where(function ($query) use ($request) {
                if ($request->has('filter')) {
                    $query->where("number", "like", "%$request->filter%")
                        ->orWhere("description", "like", "%$request->filter%")
                        ->orWhere("credit", "like", "%$request->filter%")
                        ->orWhere("debit", "like", "%$request->filter%")

                        ->orWhereHas('coas', function ($q) use ($request) {
                            $q->where("account_number", "like", "%$request->filter%")
                                ->orWhere("account_name", "like", "%$request->filter%");
                        })

                        ->orWhereHas('departmens.positions', function ($q) use ($request) {
                            $q->where("name", "like", "%$request->filter%");
                        });
                }
            });

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
            'request'        => $request->per_page,
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
            $datetime = date("Y-m-d H:i:s");

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
            PettyCashModel::save_debit($idDepartment, $idCoa, $number, $description, $debit, $datetime, $created_by);

            // save data credit
            $idCoaC        = $data['idCoaC'];
            $idDepartmentC = $data['idDepartmentC'];
            $descriptionC  = $data['descriptionC'];
            $credit        = $credit_str;
            PettyCashModel::save_credit($idDepartmentC, $idCoaC, $number, $descriptionC, $credit, $datetime, $created_by);

            return response()->json([
                'status'  => true,
                'message' => 'Save data refill success',
                201
            ]);
        }
    }

    public function deletePettyCash(Request $request)
    {
        if ($request->isMethod('patch')) {
            $data = $request->input();

            $number     = $data["number"];
            $updated_by = $data["updated_by"];

            PettyCashModel::delete_refill($updated_by, $number);

            return response()->json([
                'status'  => true,
                'message' => 'Delete data refill success',
                201
            ]);
        }
    }

    public function editPettyCash(Request $request, $number)
    {
        if ($request->isMethod('get')) {
            $refill = PettyCashModel::get_refill($number);

            return response()->json([
                'status'  => true,
                'data' => $refill ? $refill : NULL,
                200
            ]);
        }
    }

    public function updatePettyCash(Request $request)
    {
        if ($request->isMethod('patch')) {
            $data = $request->input();

            $rules = [
                "descriptionE"   => "required",
                "descriptionCE"  => "required",
                "debitE"         => "required|same:creditE",
                "creditE"        => "required|same:debitE",
            ];

            $customMesagges = [
                'descriptionE.required'   => "Description is required",
                'descriptionCE.required'  => "Description is required",
                'debitE.required'         => "Debit is required",
                'debitE.same'             => "Debit must be balance credit",
                'creditE.required'        => "Credit is required",
                'creditE.same'            => "Credit must be balance debit",
            ];

            $validator = Validator::make($data, $rules, $customMesagges);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $debit_str  = str_replace(',', '', $data['debitE']);
            $credit_str = str_replace(',', '', $data['creditE']);
            $updated_by = $data['updated_by'];

            // save data debit
            $idD = $data['idR'];
            $idDepartment = $data['idDepartmentE'];
            $idCoa        = $data['idCoaE'];
            $description  = $data['descriptionE'];
            $debit        = $debit_str;
            PettyCashModel::update_debit($idD, $idDepartment, $idCoa, $description, $debit, $updated_by);

            // save data credit
            $idC = $data['idRC'];
            $idDepartmentC = $data['idDepartmentCE'];
            $idCoaC        = $data['idCoaCE'];
            $descriptionC  = $data['descriptionCE'];
            $credit        = $credit_str;
            PettyCashModel::update_credit($idC, $idDepartmentC, $idCoaC, $descriptionC, $credit, $updated_by);

            return response()->json([
                'status'  => true,
                'message' => 'Update data refill success',
                201
            ]);
        }
    }
}
