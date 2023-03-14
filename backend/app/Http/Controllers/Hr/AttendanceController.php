<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\AttendanceModel;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function saveAttendance(Request $request)
    {
        if ($request->isMethod('post')) {
            $photo = $request->file('image');
            $data = $request->input();

            $latitude = $data['latitude'];
            $longitude = $data['longitude'];

            // koordinat
            // Latitude: -6.1840238, Longitude: 106.6981289

            // koordinat salah
            // -6.184580, 106.695877 atas
            // -6.185274, 106.695727 bawah

            // -6.185092, 106.695126 kiri
            // -6.184911, 106.696392 kanan

            // koordinat betul
            // -6.183876, 106.698125 atas
            // -6.184196, 106.698114 bawah

            // -6.184026, 106.697985 kiri
            // -6.184047, 106.698339 kanan

            if (-6.183876 < $latitude && -6.184196 > $latitude) {
                return response()->json([
                    'status'  => false,
                    'message' => "your location is outside the office area",
                    422
                ]);
            } else {
                if ($longitude < 106.6979857 && $longitude > 106.6983397) {
                    return response()->json([
                        'status'  => false,
                        'message' => "your location is outside the office area",
                        422
                    ]);
                } else {

                    $photo2 = $photo->store('images/absent', 'public');

                    $attendance              = new AttendanceModel();
                    $attendance->id_employee = $data['id_employee'];
                    $attendance->type        = $data['type'];
                    $attendance->latitude    = $latitude;
                    $attendance->longitude   = $longitude;
                    $attendance->photo       = $photo2;
                    $attendance->created_by  = $data['created_by'];
                    $attendance->save();

                    return response()->json([
                        'status' => true,
                        'message' => "Absent Success",
                        201
                    ]);
                }
            }
        }
    }

    public function getAttendance(Request $request, $id_employee)
    {
        if ($request->isMethod('get')) {
            $meta = [];
            $histories = AttendanceModel::where(['trashed' => 0, 'id_employee' => $id_employee])->where(function ($query) use ($request) {
                if ($request->has('filter')) {
                    $query->where("created_at", "like", "%$request->filter%");
                }
            });

            $perPage   = $request->per_page ?? 15;
            $histories = $histories->paginate($perPage);

            $meta = [
                'current_page' => $histories->currentPage(),
                'last_page'    => $histories->lastPage(),
                'per_page'     => $histories->perPage(),
                'total'        => $histories->total()
            ];

            return response()->json([
                'data'    => $histories->items(),
                'meta'    => $meta,
                'request' => $request->per_page,
            ]);
        }
    }

    public function getAttendances(Request $request, $start, $end)
    {
        if ($request->isMethod('get')) {
            $meta = [];
            $histories = AttendanceModel::with('employees')->where('trashed', 0)->whereBetween('created_at', [$start, $end])->where(function ($query) use ($request) {
                if ($request->has('filter')) {
                    $query->where("created_at", "like", "%$request->filter%");
                }
            });

            $perPage   = $request->per_page ?? 15;
            $histories = $histories->paginate($perPage);

            $meta = [
                'current_page' => $histories->currentPage(),
                'last_page'    => $histories->lastPage(),
                'per_page'     => $histories->perPage(),
                'total'        => $histories->total()
            ];

            return response()->json([
                'data'    => $histories->items(),
                'meta'    => $meta,
                'request' => $request->per_page,
                'tanggal' => $start
            ]);
        }
    }
}
