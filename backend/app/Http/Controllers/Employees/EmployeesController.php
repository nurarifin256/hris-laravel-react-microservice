<?php

namespace App\Http\Controllers\Employees;

use App\Http\Controllers\Controller;
use App\Models\DepartmentModel;
use App\Models\EmployeeModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Validator;

class EmployeesController extends Controller
{
    public function getEmployees(Request $request)
    {
        $departmentData = DepartmentModel::with('positions')->where('trashed', 0)->get();
        $employees = EmployeeModel::with('departmens.positions')->where('trashed', 0)
            ->where(function ($query) use ($request) {
                if ($request->has('filter')) {
                    $query->where("name", "like", "$request->filter%")
                        ->orWhere("mobile_phone_number", "like", "$request->filter%")
                        ->orWhere("gender", "like", "$request->filter%")
                        ->orWhere("address", "like", "$request->filter%")
                        ->orWhereHas('departmens', function ($q) use ($request) {
                            $q->where('name', 'like', '%' . $request->filter . '%');
                        })
                        ->orWhereHas('departmens.positions', function ($q) use ($request) {
                            $q->where('name', 'like', '%' . $request->filter . '%');
                        });
                }
            });
        $meta      = [];
        $perPage   = $request->per_page ?? 10;
        $employees = $employees->paginate($perPage);

        $meta = [
            'current_page' => $employees->currentPage(),
            'last_page'    => $employees->lastPage(),
            'per_page'     => $employees->perPage(),
            'total'        => $employees->total()
        ];

        return response()->json([
            'data'           => $employees->items(),
            'departmentData' => $departmentData,
            'meta'           => $meta,
            'request'        => $request->per_page
        ]);
    }

    public function saveEmployees(Request $request)
    {
        if ($request->isMethod('post')) {
            $data = $request->input();

            $rules = [
                "name"         => "required",
                "idDepartment" => "required",
                "number"       => "required|between:12,13",
                "gender"       => "required",
                "address"      => "required",
                // "image"        => "image|mimes:jpg, png, jpeg, gif",
                // "imageF"       => "image", 
                // "imageC"       => "image",
            ];

            $customMesagges = [
                'name.required'         => "Name is required",
                'idDepartment.required' => "Department is required",
                'number.required'       => "Number phone is required",
                'number.between'        => "Number phone min 12 digits and max 13 digits",
                'gender.required'       => "Gender is required",
                'address.required'      => "Address is required",
                // 'image.image' => "Attachment must be image",
                // 'image.mimes' => "Image format must be jpg, png, jpeg, gif",
                // 'imageF.image' => "Attachment must be image",
                // 'imageC.image' => "Attachment must be image",
            ];

            $validator = Validator::make($data, $rules, $customMesagges);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }
            $identity    = $request->file('image')->store('images/identity', 'public');
            $family      = $request->file('imageF')->store('images/family', 'public');
            $certificate = $request->file('imageC')->store('images/certificate', 'public');

            $employees                      = new EmployeeModel();
            $employees->name                = $data['name'];
            $employees->id_department       = $data['idDepartment'];
            $employees->mobile_phone_number = $data['number'];
            $employees->gender              = $data['gender'];
            $employees->address             = $data['address'];
            $employees->identity_card       = $identity;
            $employees->family_card         = $family;
            $employees->certificate         = $certificate;
            $employees->created_by          = $data['created_by'];
            $employees->save();

            return response()->json([
                'status' => true,
                'message' => 'Save data employee success',
                201
            ]);
        }
    }

    public function deleteEmployees(Request $request)
    {
        if ($request->isMethod('post')) {
            $data = $request->input();

            $departmens = EmployeeModel::find($data['id']);
            $departmens->trashed = 1;
            $departmens->updated_by = $data['updated_by'];
            $departmens->save();

            return response()->json([
                'status' => true,
                'message' => 'Delete data employee success',
                201
            ]);
        }
    }

    public function editEmployees(Request $request)
    {
        if ($request->isMethod('post')) {
            $data = $request->input();
            $id   = $data['id'];

            $employee = EmployeeModel::where(['trashed' => 0, 'id' => $id])->first();

            return response()->json([
                'employee' => $employee,
                'message'    => 'success',
                200
            ]);
        }
    }

    public function updateEmployees(Request $request)
    {
        if ($request->isMethod('post')) {
            $data  = $request->input();

            $rules = [
                "nameEdit"         => "required",
                "idDepartmentEdit" => "required",
                "numberEdit"       => "required|between:12,13",
                "genderEdit"       => "required",
                "addressEdit"      => "required",
                // "image"        => "image|mimes:jpg, png, jpeg, gif",
                // "imageF"       => "image", 
                // "imageC"       => "image",
            ];

            $customMesagges = [
                'nameEdit.required'         => "Name is required",
                'idDepartmentEdit.required' => "Department is required",
                'numberEdit.required'       => "Number phone is required",
                'numberEdit.between'        => "Number phone min 12 digits and max 13 digits",
                'genderEdit.required'       => "Gender is required",
                'addressEdit.required'      => "Address is required",
                // 'image.image' => "Attachment must be image",
                // 'image.mimes' => "Image format must be jpg, png, jpeg, gif",
                // 'imageF.image' => "Attachment must be image",
                // 'imageC.image' => "Attachment must be image",
            ];

            $validator = Validator::make($data, $rules, $customMesagges);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }
            $id = $data['id'];
            $old_data = EmployeeModel::where(['trashed' => 0, 'id' => $id])->first();

            if ($request->file('imageEdit')) {
                unlink(public_path('storage/' . $old_data->identity_card));
                $identity    = $request->file('imageEdit')->store('images/identity', 'public');
            } else {
                $identity = $data['imageEdit'];
            }

            if ($request->file('imageFEdit')) {
                unlink(public_path('storage/' . $old_data->family_card));
                $family    = $request->file('imageFEdit')->store('images/family', 'public');
            } else {
                $family = $data['imageFEdit'];
            }

            if ($request->file('imageCEdit')) {
                unlink(public_path('storage/' . $old_data->certificate));
                $certificate = $request->file('imageCEdit')->store('images/certificate', 'public');
            } else {
                $certificate = $data['imageFEdit'];
            }

            $old_data->name                = $data['nameEdit'];
            $old_data->id_department       = $data['idDepartmentEdit'];
            $old_data->mobile_phone_number = $data['numberEdit'];
            $old_data->gender              = $data['genderEdit'];
            $old_data->address             = $data['addressEdit'];
            $old_data->identity_card       = $identity;
            $old_data->family_card         = $family;
            $old_data->certificate         = $certificate;
            $old_data->updated_by          = $data['updated_by'];
            $old_data->save();

            return response()->json([
                'status' => true,
                'message' => "Update data employee success",
                201
            ]);
        }
    }
}
