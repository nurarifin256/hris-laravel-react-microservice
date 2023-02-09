<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\CoaModel;
use Illuminate\Http\Request;

class CoaController extends Controller
{
    public function getCoa(Request $request)
    {
        $coas = CoaModel::where('trashed', 0)->select('id', 'account_number', 'account_name');
        $meta = [];

        if ($request->has('filter')) {
            $coas->where("account_number", "like", "%$request->filter%")
                ->orWhere("account_name", "like", "%$request->filter%");
        }

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
            'request' => $request->per_page
        ]);
    }
}
