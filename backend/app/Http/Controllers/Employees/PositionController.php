<?php

namespace App\Http\Controllers\Employees;

use App\Http\Controllers\Controller;
use App\Models\PositionModel;
use Illuminate\Http\Request;

class PositionController extends Controller
{
    public function getPosition()
    {
        $data = PositionModel::getPositions();
        return response()->json([
            'status' => true,
            'data' => $data,
            200
        ]);
    }
}
