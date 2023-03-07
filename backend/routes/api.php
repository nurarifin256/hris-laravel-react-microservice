<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// route user
Route::post('register-user', 'App\Http\Controllers\AuthController@registerUser');
Route::post('login-user', 'App\Http\Controllers\AuthController@loginUser');

Route::namespace('App\Http\Controllers\Employees')->group(function () {

    // route position
    Route::get('get-position', 'PositionController@getPosition');
    Route::post('save-position', 'PositionController@savePosition');
    Route::post('delete-position', 'PositionController@deletePosition');
    Route::post('edit-position', 'PositionController@editPosition');
    Route::post('update-position', 'PositionController@updatePosition');

    // route department
    Route::get('get-department', 'DepartementController@getDepartment');
    Route::post('save-department', 'DepartementController@saveDepartment');
    Route::post('delete-department', 'DepartementController@deleteDepartment');
    Route::post('edit-department', 'DepartementController@editDepartment');
    Route::post('update-department', 'DepartementController@updateDepartment');

    // route employees
    Route::get('get-employees', 'EmployeesController@getEmployees');
    Route::post('save-employees', 'EmployeesController@saveEmployees');
    Route::post('delete-employee', 'EmployeesController@deleteEmployees');
    Route::post('edit-employee', 'EmployeesController@editEmployees');
    Route::post('update-employee', 'EmployeesController@updateEmployees');
});

Route::namespace('App\Http\Controllers\Accounting')->group(function () {

    // route coa
    Route::get('get-coas', 'CoaController@getCoa');
    Route::post('save-coa', 'CoaController@saveCoa');
    Route::post('delete-coa', 'CoaController@deleteCoa');
    Route::get('edit-coa/{id}', 'CoaController@editCoa');
    Route::patch('update-coa', 'CoaController@updateCoa');

    // route refill petty cash
    Route::get('get-refill', 'PettyCashController@getPettyCash');
    Route::post('save-refill', 'PettyCashController@savePettyCash');
    Route::patch('delete-refill', 'PettyCashController@deletePettyCash');
    Route::get('edit-refill/{number}', 'PettyCashController@editPettyCash');
    Route::patch('update-refill', 'PettyCashController@updatePettyCash');

    // route petty cash
    Route::post('get-attachment-petty', 'PettyCashDetailController@getAttachment');
    Route::post('add-attachment-petty', 'PettyCashDetailController@addAttachment');
    Route::delete('delete-attachment-petty', 'PettyCashDetailController@deleteAttachment');
    Route::get('get-petty-cash/{number}', 'PettyCashDetailController@getPettyCashDetail');
    Route::post('save-petty-cash', 'PettyCashDetailController@savePettyCashDetail');
    Route::post('delete-petty-cash', 'PettyCashDetailController@deletePettyCashDetail');
    Route::get('edit-petty-cash/{number_refill}/{number_journal}', 'PettyCashDetailController@editPettyCashDetail');
    Route::patch('update-petty-cash', 'PettyCashDetailController@updatePettyCashDetail');
});

Route::namespace('App\Http\Controllers\Hr')->group(function () {
    Route::get('get-payrolls', 'PayrollController@getPayrolls');
});

Route::get('images/identity/{images}', function ($image) {
    $path = storage_path('app/public/images/identity/' . $image);

    if (!File::exists($path)) {
        abort(404);
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response;
});

Route::get('images/family/{images}', function ($image) {
    $path = storage_path('app/public/images/family/' . $image);

    if (!File::exists($path)) {
        abort(404);
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response;
});

Route::get('images/certificate/{images}', function ($image) {
    $path = storage_path('app/public/images/certificate/' . $image);

    if (!File::exists($path)) {
        abort(404);
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response;
});

Route::get('images/attach_petty/{images}', function ($image) {
    $path = storage_path('app/public/images/attach_petty/' . $image);

    if (!File::exists($path)) {
        abort(404);
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response;
});
