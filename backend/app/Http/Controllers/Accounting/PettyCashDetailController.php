<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\AttachPettyModel;
use App\Models\CoaModel;
use App\Models\DepartmentModel;
use App\Models\PettyCashDetailModel;
use App\Models\PettyCashModel;
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
            })->orderBy('number_journal', 'ASC')->orderBy('credit', 'ASC');

        $meta      = [];
        $perPage   = $request->per_page ?? 15;
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
            $data   = $request->input();
            $images = $request->file('attachPetty');

            $number_invoice = $data["numberInvoice"];
            $number_refill  = $data["number"];
            $created_by     = $data['created_by'];
            $data_debit     = $data['inputFields'];
            $data_credit    = $data['inputFieldsC'];

            $total_d = 0;
            foreach ($data_debit as $key => $value) {
                $debit_str = str_replace(',', '', $data_debit[$key]['debit']);
                $total_d += $debit_str;
            }

            $total_c = 0;
            foreach ($data_credit as $key => $value) {
                $credit_str = str_replace(',', '', $data_credit[$key]['credit']);
                $total_c += $credit_str;
            }

            $total_debit = $total_d;
            $total_credit = $total_c;

            if ($total_debit != $total_credit) {
                return response()->json([
                    'status'  => false,
                    'message' => "Debit and Credit must be Ballance",
                    422
                ]);
            }

            $year            = date("y");
            $set_number      = "JPD" . $year;
            $set_number_save = "JPD" . $year . date("m");
            $get_number      = PettyCashDetailModel::get_number($number_refill, $set_number);

            $get_value_refill = PettyCashModel::where('number', $number_refill)->select('debit')->first();

            if ($get_number) {
                $number_n     = $get_number->number_journal;
                $number_n2    = substr($number_n, -2);
                $number_n3    = $number_n2 + 01;
                $number_final = sprintf("%02d", $number_n3);
            } else {
                $number_final = sprintf("%02d", 01);
                $data = [
                    'number_refill'  => $number_refill,
                    'number_journal' => "-",
                    'id_department'  => 9,
                    'id_coa'         => 0,
                    'invoice_number' => "-",
                    'description'    => "Pembentukan Kas Kecil",
                    'balance'        => $get_value_refill->debit,
                    'created_by'     => $created_by,
                    'created_at'     => date("y-m-d H:i:s"),
                ];
                PettyCashDetailModel::insert($data);
            }

            foreach ($images as $image) {
                $attach    = $image->store('images/attach_petty', 'public');

                $attach_petty                        = new AttachPettyModel();
                $attach_petty->number_journal_attach = $set_number_save . $number_final;
                $attach_petty->file_attach           = $attach;
                $attach_petty->created_by            = $created_by;
                $attach_petty->save();
            }


            foreach ($data_debit as $key => $value) {
                $debit_str = str_replace(',', '', $data_debit[$key]['debit']);
                $get_balance = PettyCashDetailModel::get_ballance($number_refill, $set_number);

                if ($get_balance) {
                    $balance = $get_balance->balance - $debit_str;
                } else {
                    $balance = $get_value_refill->debit - $debit_str;
                }

                $data = [
                    'number_refill'  => $number_refill,
                    'number_journal' => $set_number_save . $number_final,
                    'id_department'  => $data_debit[$key]['idDepartment'],
                    'id_coa'         => $data_debit[$key]['idCoa'],
                    'invoice_number' => $number_invoice,
                    'description'    => $data_debit[$key]['description'],
                    'debit'          => $debit_str,
                    'balance'        => $balance,
                    'created_by'     => $created_by,
                    'created_at'     => date("y-m-d H:i:s"),
                ];
                PettyCashDetailModel::insert($data);
            }

            foreach ($data_credit as $key => $value) {
                $credit_str  = str_replace(',', '', $data_credit[$key]['credit']);
                $get_balance = PettyCashDetailModel::get_ballance($number_refill, $set_number);
                $balance = $get_balance->balance;
                $datas = [
                    [
                        'number_refill'  => $number_refill,
                        'number_journal' => $set_number_save . $number_final,
                        'id_department'  => $data_credit[$key]['idDepartmentC'],
                        'id_coa'         => $data_credit[$key]['idCoaC'],
                        'invoice_number' => $number_invoice,
                        'description'    => $data_credit[$key]['descriptionC'],
                        'credit'         => $credit_str,
                        'balance'        => $balance,
                        'created_by'     => $created_by,
                        'created_at'     => date("y-m-d H:i:s"),
                    ]
                ];
                PettyCashDetailModel::insert($datas);
            }

            return response()->json([
                'status'  => true,
                'message' => 'Save data petty cash success',
                201
            ]);
        }
    }

    public function deletePettyCashDetail(Request $request)
    {
        if ($request->isMethod('post')) {
            $data = $request->input();

            PettyCashDetailModel::where('number_journal', $data['numberJournal'])->update([
                'trashed'    => 1,
                'updated_by' => $data['updated_by'],
                'updated_at' => date("y-m-d H:i:s"),
            ]);

            // hapus attachment
            $attachment = AttachPettyModel::where("number_journal_attach", $data["numberJournal"])->get();
            foreach ($attachment as $a) {
                AttachPettyModel::where("id", $a->id)->delete();
                unlink(public_path('storage/' . $a->file_attach));
            }

            // ballance awal
            $firstBallance = $data['balanceL'];

            // get data terbaru
            $petty = PettyCashDetailModel::where([
                'number_refill' => $data['numberRefill'],
                'trashed' => 0
            ])->get();

            // update balance
            foreach ($petty as &$p) {
                $p->balance = $firstBallance;
                $firstBallance = ($firstBallance - $p->debit);

                $a = PettyCashDetailModel::find($p->id);
                $a->balance = $firstBallance;
                $a->save();
            }
            return response()->json([
                'status'  => true,
                'message' => "Delete petty cash success",
                201
            ]);
        }
    }

    public function editPettyCashDetail(Request $request, $number_refill, $number_journal)
    {
        if ($request->isMethod('get')) {

            $debit = PettyCashDetailModel::where(['trashed' => 0, 'number_refill' => $number_refill, 'number_journal' => $number_journal, 'credit' => 0.00])->select('id', 'id_coa', 'id_department', 'invoice_number', 'description', 'debit')->get();
            $credit = PettyCashDetailModel::where(['trashed' => 0, 'number_refill' => $number_refill, 'number_journal' => $number_journal, 'debit' => 0.00])->select('id', 'id_coa', 'id_department', 'description', 'credit')->get();
            return response()->json([
                'status' => true,
                'debit'  => $debit,
                'credit' => $credit,
                200
            ]);
        }
    }

    public function updatePettyCashDetail(Request $request)
    {
        if ($request->isMethod('patch')) {
            $data = $request->input();

            $data_debit     = $data['debitEdit'];
            $data_credit    = $data['creditEdit'];
            $updated_by     = $data['updated_by'];
            $number_refill  = $data['number'];
            $number_journal = $data['numberJpd'];
            $first_ballance = $data['firstBallance'];
            $invoice_number = $data_debit[0]['invoice_number'];

            $total_d = 0;
            foreach ($data_debit as $key => $value) {
                $debit_str = str_replace(',', '', $data_debit[$key]['debit']);
                $total_d += $debit_str;
            }

            $total_c = 0;
            foreach ($data_credit as $key => $value) {
                $credit_str = str_replace(',', '', $data_credit[$key]['credit']);
                $total_c += $credit_str;
            }

            if ($total_d != $total_c) {
                return response()->json([
                    'status'  => false,
                    'message' => "Debit and Credit must be Ballance",
                    422
                ]);
            }

            /* delete debit data */
            // maping data id from front end
            $ids = array_map(function ($data) {
                return $data['id'];
            }, $data_debit);

            // get data for delete
            $delete_data = PettyCashDetailModel::where(['trashed' => 0, 'number_refill' => $number_refill, 'number_journal' => $number_journal, 'credit' => 0.00])->whereNotIn('id', $ids)->select('id')->get();

            // delete data
            if ($delete_data) {
                foreach ($delete_data as $d) {
                    PettyCashDetailModel::where('id', $d->id)->update([
                        'trashed'    => 1,
                        'updated_by' => $updated_by,
                    ]);
                }
            }
            /* end hapus debit data*/

            /* delete credit data */
            // maping data id from front end
            $ids = array_map(function ($data) {
                return $data['id'];
            }, $data_credit);

            // get data for delete
            $delete_data_credit = PettyCashDetailModel::where(['trashed' => 0, 'number_refill' => $number_refill, 'number_journal' => $number_journal, 'debit' => 0.00])->whereNotIn('id', $ids)->select('id')->get();

            // delete data
            if ($delete_data_credit) {
                foreach ($delete_data_credit as $d) {
                    PettyCashDetailModel::where('id', $d->id)->update([
                        'trashed'    => 1,
                        'updated_by' => $updated_by,
                    ]);
                }
            }
            /* end hapus credit data*/

            // debit
            foreach ($data_debit as $key => $value) {
                $debit_str = str_replace(',', '', $data_debit[$key]['debit']);

                if ($data_debit[$key]['id'] != 0) {
                    $data_update = [
                        'id_department'  => $data_debit[$key]['id_department'],
                        'id_coa'         => $data_debit[$key]['id_coa'],
                        'invoice_number' => $data_debit[$key]['invoice_number'],
                        'description'    => $data_debit[$key]['description'],
                        'debit'          => $debit_str,
                        'updated_by'     => $updated_by,
                        'updated_at'     => date("y-m-d H:i:s"),
                    ];
                    PettyCashDetailModel::where('id', $data_debit[$key]['id'])->update($data_update);
                } else {
                    $data_new = [
                        'id_department'  => $data_debit[$key]['id_department'],
                        'id_coa'         => $data_debit[$key]['id_coa'],
                        'number_refill'  => $number_refill,
                        'number_journal' => $number_journal,
                        'invoice_number' => $invoice_number,
                        'description'    => $data_debit[$key]['description'],
                        'debit'          => $debit_str,
                        'created_by'     => $updated_by,
                        'created_at'     => date("y-m-d H:i:s"),
                    ];
                    PettyCashDetailModel::insert($data_new);
                }
            }

            // credit
            foreach ($data_credit as $key => $value) {
                $credit_str = str_replace(',', '', $data_credit[$key]['credit']);

                if ($data_credit[$key]['id'] != 0) {
                    $data_update = [
                        'id_department'  => $data_credit[$key]['id_department'],
                        'id_coa'         => $data_credit[$key]['id_coa'],
                        'invoice_number' => $invoice_number,
                        'description'    => $data_credit[$key]['description'],
                        'credit'         => $credit_str,
                        'updated_by'     => $updated_by,
                        'updated_at'     => date("y-m-d H:i:s"),
                    ];
                    PettyCashDetailModel::where('id', $data_credit[$key]['id'])->update($data_update);
                } else {
                    $data_new = [
                        'id_department'  => $data_credit[$key]['id_department'],
                        'id_coa'         => $data_credit[$key]['id_coa'],
                        'number_refill'  => $number_refill,
                        'number_journal' => $number_journal,
                        'invoice_number' => $invoice_number,
                        'description'    => $data_credit[$key]['description'],
                        'credit'         => $credit_str,
                        'created_by'     => $updated_by,
                        'created_at'     => date("y-m-d H:i:s"),
                    ];
                    PettyCashDetailModel::insert($data_new);
                }
            }

            // get data terbaru
            $petty = PettyCashDetailModel::where([
                'number_refill' => $number_refill,
                'trashed' => 0
            ])->orderBy('number_journal', 'ASC')->orderBy('credit', 'ASC')->get();

            // update balance
            foreach ($petty as &$p) {
                $p->balance = $first_ballance;
                $first_ballance = ($first_ballance - $p->debit);

                $a = PettyCashDetailModel::find($p->id);
                $a->balance = $first_ballance;
                $a->save();
            }

            return response()->json([
                'status' => true,
                'message' => "Update petty cash sukses",
                201
            ]);
        }
    }

    public function getAttachment(Request $request)
    {
        if ($request->isMethod('post')) {
            $data = $request->input();

            $attach = AttachPettyModel::where("number_journal_attach", $data)->select('id', 'file_attach')->get();
            return response()->json([
                'status'  => true,
                'data' => $attach,
                200
            ]);
        }
    }

    public function deleteAttachment(Request $request)
    {
        if ($request->isMethod('delete')) {
            $data = $request->input();

            AttachPettyModel::where("id", $data["id"])->delete();
            unlink(public_path('storage/' . $data["file_attach"]));

            return response()->json([
                'status'  => true,
                'message' => 'Delete attachment success',
                200
            ]);
        }
    }

    public function addAttachment(Request $request)
    {
        if ($request->isMethod('post')) {
            $data   = $request->input();
            $images = $request->file('attachPetty');

            foreach ($images as $image) {
                $attach    = $image->store('images/attach_petty', 'public');

                $attach_petty                        = new AttachPettyModel();
                $attach_petty->number_journal_attach = $data['number'];
                $attach_petty->file_attach           = $attach;
                $attach_petty->save();
            }

            return response()->json([
                'status'  => true,
                'message' => "Add attachment petty cash success",
                201
            ]);
        }
    }
}
