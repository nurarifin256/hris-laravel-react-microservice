<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Validator;

class AuthController extends Controller
{
    public function registerUser(Request $request)
    {
        if ($request->isMethod('post')) {
            $data = $request->input();

            $rules = [
                "name"     => "required",
                "email"    => "required|email|unique:users",
                "password" => "required",
            ];

            $customMesagges = [
                "name.required"     => "Name is required",
                "email.required"    => "Email is required",
                "email.email"       => "Email is not valid",
                "email.unique"      => "Email already exists",
                "password.required" => "Password is required",
            ];

            $validator = Validator::make($data, $rules, $customMesagges);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $user           = new User();
            $user->name     = $data['name'];
            $user->email    = $data['email'];
            $user->password = bcrypt($data['password']);
            $user->save();

            return response()->json([
                'status' => true,
                'message' => 'User register succesfully',
                201
            ]);
        }
    }

    public function loginUser(Request $request)
    {
        if ($request->isMethod('post')) {
            $data = $request->input();

            $rules = [
                "email"    => "required|email|",
                "password" => "required"
            ];

            $customMesagges = [
                'email.required' => "Email is required",
                'email.email' => "Email not valid",
                'password.required' => "Password is required",
            ];

            $validator = Validator::make($data, $rules, $customMesagges);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $getUser = User::where('email', $data['email'])->select('id', 'name', 'email', 'password')->first();
            if ($getUser != null) {
                if (password_verify($data['password'], $getUser->password)) {

                    return response()->json([
                        'user'    => $getUser,
                        'status'  => true,
                        'message' => "User login succesfully"
                    ], 201);
                } else {
                    return response()->json([
                        'status' => false,
                        'messagePassword' => "Password is incorrect"
                    ]);
                }
            } else {
                return response()->json([
                    'status' => false,
                    'messageEmail' => "Email not registered"
                ], 422);
            }
        }
    }
}
