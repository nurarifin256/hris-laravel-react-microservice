<?php

namespace App\Http\Controllers\Employees;

use App\Http\Controllers\Controller;
use App\Models\PositionModel;
use Illuminate\Http\Request;
use Validator;

class PositionController extends Controller
{
    public function getPosition(Request $request)
    {
        $positions = PositionModel::where('trashed', 0)->select(['name', 'id']);
        $meta = [];

        if ($request->has('filter')) {
            $positions->where("name", "like", "$request->filter%");
        }

        // if ($request->has('sort_by')) {
        //     $positions->orderBy($request->sort_by, $request->sort_dir ?? "asc");
        // }

        $perPage = $request->per_page ?? 10;
        $positions = $positions->paginate($perPage);

        $meta = [
            'current_page' => $positions->currentPage(),
            'last_page'    => $positions->lastPage(),
            'per_page'     => $positions->perPage(),
            'total'        => $positions->total()
        ];

        return response()->json([
            'data' => $positions->items(),
            'meta' => $meta,
            'request' => $request->per_page
        ]);
    }

    public function savePosition(Request $request)
    {
        if ($request->isMethod('post')) {
            $data = $request->input();

            $rules = [
                "name"    => "required|unique:positions",
            ];

            $customMesagges = [
                'name.required' => "Name is required",
                'name.unique' => "Name already exists",
            ];

            $validator = Validator::make($data, $rules, $customMesagges);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }
            $positions             = new PositionModel();
            $positions->name       = $data['name'];
            $positions->created_by = $data['created_by'];
            $positions->save();

            return response()->json([
                'status' => true,
                'message' => 'Save data position success',
                201
            ]);
        }
    }
}
