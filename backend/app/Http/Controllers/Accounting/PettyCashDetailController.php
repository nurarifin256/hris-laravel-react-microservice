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
}
