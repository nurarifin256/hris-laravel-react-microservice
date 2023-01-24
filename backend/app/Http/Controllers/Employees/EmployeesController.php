<?php

namespace App\Http\Controllers\Employees;

use App\Http\Controllers\Controller;
use App\Models\EmployeeModel;
use Illuminate\Http\Request;

class EmployeesController extends Controller
{
    public function getEmployees(Request $request)
    {
        $employees = EmployeeModel::with('departmens.positions')->where('trashed', 0)->first();

        dd($employees->name . ' nama departement ' . $employees->departmens->name . ' nama posisi ' . $employees->departmens->positions->name);
    }
}
