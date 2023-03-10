<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\CoaModel;
use Illuminate\Http\Request;
use Validator;

class CoaController extends Controller
{
    public function getCoa(Request $request)
    {
        $meta = [];
        $coas = CoaModel::where('trashed', 0)->select('id', 'account_number', 'account_name')->where(function ($query) use ($request) {
            if ($request->has('filter')) {
                $query->where("account_number", "like", "%$request->filter%")
                    ->orWhere("account_name", "like", "%$request->filter%");
            }
        });

        $perPage = $request->per_page ?? 10;
        $coas = $coas->paginate($perPage);

        $meta = [
            'current_page' => $coas->currentPage(),
            'last_page'    => $coas->lastPage(),
            'per_page'     => $coas->perPage(),
            'total'        => $coas->total()
        ];

        return response()->json([
            'data' => $coas->items(),
            'meta' => $meta,
            'request' => $request->per_page,
        ]);
    }

    public function saveCoa(Request $request)
    {
        if ($request->isMethod('post')) {
            $data = $request->input();

            $rules = [
                "account_number" => "required|unique:coas",
                "account_name"   => "required",
            ];

            $customMesagges = [
                'account_number.required' => "Account number is required",
                'account_number.unique'   => "Account number already exists",
                'account_name.required'   => "Account name is required",
            ];

            $validator = Validator::make($data, $rules, $customMesagges);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $coas                 = new CoaModel();
            $coas->account_number = $data['account_number'];
            $coas->account_name   = $data['account_name'];
            $coas->created_by     = $data['created_by'];
            $coas->save();

            return response()->json([
                'status'  => true,
                'message' => 'Save data coa success',
                201
            ]);
        }
    }

    public function deleteCoa(Request $request)
    {
        if ($request->isMethod('post')) {
            $data = $request->input();

            $coa             = CoaModel::find($data['id']);
            $coa->trashed    = 1;
            $coa->updated_by = $data['updated_by'];
            $coa->save();

            return response()->json([
                'status' => true,
                'message' => 'Delete data coa success',
                201
            ]);
        }
    }

    public function editCoa(Request $request, $id)
    {
        if ($request->isMethod('get')) {
            $coas = CoaModel::where('id', $id)->select('id', 'account_number', 'account_name')->first();

            return response()->json([
                'status'  => true,
                'data' => $coas,
                200
            ]);
        }
    }

    public function updateCoa(Request $request)
    {
        if ($request->isMethod('patch')) {
            $data = $request->input();

            $rules = [
                "accountNumberEdit" => "required",
                "accountNameEdit"   => "required",
            ];

            $customMesagges = [
                'accountNumberEdit.required' => "Account number is required",
                'accountNameEdit.required'   => "Account name is required",
            ];

            $validator = Validator::make($data, $rules, $customMesagges);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $coa                 = CoaModel::find($data['id']);
            $coa->account_number = $data['accountNumberEdit'];
            $coa->account_name   = $data['accountNameEdit'];
            $coa->updated_by     = $data['updated_by'];
            $coa->save();

            return response()->json([
                'status'  => true,
                'message' => 'Update data coa success',
                201
            ]);
        }
    }
}
