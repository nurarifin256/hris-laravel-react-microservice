<?php

namespace App\Http\Controllers\Employees;

use App\Http\Controllers\Controller;
use App\Models\DepartmentModel;
use App\Models\PositionModel;
use Illuminate\Http\Request;
use Validator;

class DepartementController extends Controller
{
    public function getDepartment(Request $request)
    {
        $positions = PositionModel::where('trashed', 0)->select(['name', 'id'])->get();
        $departmens =  DepartmentModel::with('positions')->where('trashed', 0)
            ->where(function ($query) use ($request) {
                if ($request->has('filter')) {
                    $query->where("name", "like", "$request->filter%")
                        ->orWhereHas('positions', function ($q) use ($request) {
                            $q->where('name', 'like', '%' . $request->filter . '%');
                        });
                }
            });

        $meta = [];
        $perPage = $request->per_page ?? 10;
        $departmens = $departmens->paginate($perPage);

        $meta = [
            'current_page' => $departmens->currentPage(),
            'last_page'    => $departmens->lastPage(),
            'per_page'     => $departmens->perPage(),
            'total'        => $departmens->total()
        ];

        return response()->json([
            'data'          => $departmens->items(),
            'dataPositions' => $positions,
            'meta'          => $meta,
            'request'       => $request->per_page
        ]);
    }

    public function saveDepartment(Request $request)
    {
        if ($request->isMethod('post')) {
            $data = $request->input();

            $rules = [
                "name"    => "required",
                "id_position"    => "required",
            ];

            $customMesagges = [
                'name.required' => "Name is required",
                'id_position.required' => "Position is required",
            ];

            $validator = Validator::make($data, $rules, $customMesagges);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $positions              = new DepartmentModel();
            $positions->name        = $data['name'];
            $positions->id_position = $data['id_position'];
            $positions->created_by  = $data['created_by'];
            $positions->save();

            return response()->json([
                'status' => true,
                'message' => 'Save data department success',
                201
            ]);
        }
    }

    public function deleteDepartment(Request $request)
    {
        if ($request->isMethod('post')) {
            $data = $request->input();

            $departmens = DepartmentModel::find($data['id']);
            $departmens->trashed = 1;
            $departmens->updated_by = $data['updated_by'];
            $departmens->save();

            return response()->json([
                'status' => true,
                'message' => 'Delete data department success',
                201
            ]);
        }
    }

    public function editDepartment(Request $request)
    {
        if ($request->isMethod('post')) {
            $data      = $request->input();
            $id        = $data['id'];
            $departmen = DepartmentModel::where(['trashed' => 0, 'id' => $id])->first();

            return response()->json([
                'department' => $departmen,
                'message' => 'success',
                200
            ]);
        }
    }
}
