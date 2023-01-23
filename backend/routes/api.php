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
});
