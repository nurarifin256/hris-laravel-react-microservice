<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\CoaModel;
use App\Models\DepartmentModel;
use App\Models\PettyCashDetailModel;
use Illuminate\Http\Request;

class PettyCashDetailController extends Controller
{
    public function getPettyCashDetail(Request $request, $number)
    {
        $departmentData = DepartmentModel::with('positions')->where('trashed', 0)->get();
        $coasData       = CoaModel::where('trashed', 0)->get();

        $pettyCash      = PettyCashDetailModel::with('coas', 'departmens.positions')->where(['number_refill' => $number, 'trashed' => 0])
            ->where(function ($query) use ($request) {
                if ($request->has('filter')) {
                    $query->where("number_journal", "like", "%$request->filter%")
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

    public function savePettyCashDetail(Request $request)
    {
        if ($request->isMethod('post')) {
            $data           = $request->input();
            $number_invoice = $data["numberInvoice"];
            $number_refill  = $data["number"];
            $created_by     = $data['created_by'];
            $data_debit     = $data['inputFields'];
            $data_credit    = $data['inputFieldsC'];


            foreach ($data_debit as $key => $value) {
                $debit_str = str_replace(',', '', $data_debit[$key]['debit']);
                $data = [
                    [
                        'number_refill'  => $number_refill,
                        'id_department'  => $data_debit[$key]['idDepartment'],
                        'id_coa'         => $data_debit[$key]['idCoa'],
                        'invoice_number' => $number_invoice,
                        'description'    => $data_debit[$key]['description'],
                        'debit'          => $debit_str,
                        'created_by'     => $created_by,
                        'created_at'     => date("y-m-d H:i:s"),
                    ]
                ];
                PettyCashDetailModel::insert($data);
            }

            foreach ($data_credit as $key => $value) {
                $credit_str = str_replace(',', '', $data_credit[$key]['credit']);
                $datas = [
                    [
                        'number_refill'  => $number_refill,
                        'id_department'  => $data_credit[$key]['idDepartmentC'],
                        'id_coa'         => $data_credit[$key]['idCoaC'],
                        'invoice_number' => $number_invoice,
                        'description'    => $data_credit[$key]['descriptionC'],
                        'credit'         => $credit_str,
                        'created_by'     => $created_by,
                        'created_at'     => date("y-m-d H:i:s"),
                    ]
                ];
                PettyCashDetailModel::insert($datas);
            }
            return response()->json([
                'status' => true,
                'message' => $data,
                201
            ]);
        }
    }
}