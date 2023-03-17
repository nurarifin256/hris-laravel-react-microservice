<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\AttendanceModel;
use App\Models\EmployeeModel;
use App\Models\PayrollModel;
use Date;
use Illuminate\Http\Request;
use Validator;

class PayrollController extends Controller
{
    public function getPayrolls(Request $request)
    {
        $employees = EmployeeModel::with('departmens.positions')->where('trashed', 0)->get();
        $payrolls  = PayrollModel::with('employees.departmens.positions')->where('trashed', 0)
            ->where(function ($query) use ($request) {
                if ($request->has('filter')) {
                    $query->where("basic_salary", "like", "%$request->filter%")

                        ->orWhereHas('employees', function ($q) use ($request) {
                            $q->where("name", "like", "%$request->filter%");
                        })

                        ->orWhereHas('employees.departmens', function ($q) use ($request) {
                            $q->where("name", "like", "%$request->filter%");
                        })

                        ->orWhereHas('employees.departmens.positions', function ($q) use ($request) {
                            $q->where("name", "like", "%$request->filter%");
                        });
                }
            });
        $meta     = [];
        $perPage  = $request->per_page ?? 15;
        $payrolls = $payrolls->paginate($perPage);

        $meta = [
            'current_page' => $payrolls->currentPage(),
            'last_page'    => $payrolls->lastPage(),
            'per_page'     => $payrolls->perPage(),
            'total'        => $payrolls->total()
        ];

        return response()->json([
            'data'         => $payrolls->items(),
            'employeeData' => $employees,
            'meta'         => $meta,
            'request'      => $request->per_page,
        ]);
    }

    public function savePayroll(Request $request)
    {
        if ($request->isMethod('post')) {
            $data = $request->input();

            $rules = [
                "idEmployee" => "required",
                "salary"     => "required",
                "transport"  => "required",
                "positional" => "required",
            ];

            $customMesagges = [
                "idEmployee.required" => "Employee is required",
                "salary.required"     => "Salary is required",
                "transport.required"  => "Transport allowance is required",
                "positional.required" => "Positional allowance is required",
            ];

            $validator = Validator::make($data, $rules, $customMesagges);
            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $salary     = str_replace(',', '', $data['salary']);
            $positional = str_replace(',', '', $data['positional']);
            $transport  = str_replace(',', '', $data['transport']);

            $bpjs_kes = (1 / 100) * $salary;
            $bpjs_ket = (3 / 100) * $salary;

            $payroll                           = new PayrollModel();
            $payroll->id_employee              = $data['idEmployee'];
            $payroll->basic_salary             = $salary;
            $payroll->transportation_allowance = $transport;
            $payroll->positional_allowance     = $positional;
            $payroll->health_bpjs              = $bpjs_kes;
            $payroll->employment_bpjs          = $bpjs_ket;
            $payroll->created_by               = $data['created_by'];
            $payroll->save();

            return response()->json([
                'status' => true,
                'message' => "Add payroll success",
                201
            ]);
        }
    }

    public function hariLibur()
    {
        $url = 'https://kalenderindonesia.com/api/YZ35u6a7sFWN/libur/masehi/' . date('Y/m');
        $kalender = file_get_contents($url);
        $kalender = json_decode($kalender, true);
        $hari_libur = $kalender['data']['holiday']['count'];

        return $hari_libur;
    }

    public function jumlahHari()
    {
        $kalenders = CAL_GREGORIAN;
        $bulan    = date('m');
        $tahun    = date('y');
        $hari     = cal_days_in_month($kalenders, $bulan, $tahun);

        return $hari;
    }

    public function generatePayroll(Request $request)
    {
        if ($request->isMethod('post')) {
            $id = $request->input();

            // get data payroll
            $dataPayroll = PayrollModel::find($id)->first();

            if ($dataPayroll) {
                $gaji = $dataPayroll->basic_salary;
                $id_employee = $dataPayroll->id_employee;

                // get jumlah hari perbulan
                $hari = $this->jumlahHari();

                // get hari libur
                $hari_libur = $this->hariLibur();

                // hari kerja
                $hari_kerja = $hari - $hari_libur;

                // hitung gaji perhari
                $daySalary = ceil($gaji / $hari_kerja);

                // get absen
                $countAttendance = AttendanceModel::where(['trashed' => 0, 'id_employee' => $id_employee, 'type' => 1])->where("time_in", "like", "%" . Date('Y-m') . "%")->whereNotNull('time_out')->count();

                // hitung gaji perbulan
                $payroll = $countAttendance * $daySalary;

                // potongan absen
                $potongan_absen = $gaji - $payroll;

                // get over time
                $countOverTime = AttendanceModel::where(['trashed' => 0, 'id_employee' => $id_employee, 'type' => 2])->where("time_in", "like", "%" . Date('Y-m') . "%")->whereNotNull('time_out')->get();

                $jam1 = 0;
                $jam2 = 0;
                foreach ($countOverTime as $ot) {
                    // hitung waktu lembur
                    $time_in = Date("H:i", strtotime($ot->time_in));
                    $time_out = Date("H:i", strtotime($ot->time_out));
                    $bobot = $time_out - $time_in;
                }

                $jam_masuk = "2023-03-15 15:15:05";
                $jam_keluar = "2023-03-15 18:15:05";

                $jam_i = Date("H:i", strtotime($jam_masuk));

                $datas = [
                    'data_payroll'   => $dataPayroll,
                    'potongan_absen' => $potongan_absen,
                ];

                return response()->json([
                    'status' => true,
                    // 'data'   => $datas,
                    'data'   => $bobot,
                    200
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    404
                ]);
            }
        }
    }
}
