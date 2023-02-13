<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\CoaModel;
use App\Models\DepartmentModel;
use App\Models\PettyCashModel;
use Illuminate\Http\Request;

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
}
