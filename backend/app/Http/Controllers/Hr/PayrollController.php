<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\AttendanceModel;
use App\Models\EmployeeModel;
use App\Models\HistoryPayrollModel;
use App\Models\PayrollModel;
use Carbon\Carbon;
use Date;
// use Date;
use DateTime;
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
        $url        = 'https://kalenderindonesia.com/api/YZ35u6a7sFWN/libur/masehi/' . date('Y');
        $kalender   = file_get_contents($url);
        $kalender   = json_decode($kalender, true);
        $tanggal_libur = $kalender['data']['holiday'];

        $tanggal_array = array();

        foreach ($tanggal_libur as $bulan) {
            if (is_array($bulan['data'])) {
                foreach ($bulan['data'] as $tanggal) {
                    array_push($tanggal_array, $tanggal['date']);
                }
            }
        }
        return $tanggal_array;
    }

    public function hariKerja()
    {
        $waktuawal  = strtotime(date('Y-m-16', strtotime('-1 month')));
        $waktuakhir = strtotime(date('Y-m-16'));

        $selisihDetik = $waktuakhir - $waktuawal;
        $selisihHari  = $selisihDetik / 86400;

        $libur = $this->hariLibur();

        $jumlahLibur = 0;
        for ($i = $waktuawal; $i <= $waktuakhir; $i += 86400) {
            $tanggal = date('Y-m-d', $i);
            if (in_array($tanggal, $libur)) {
                $jumlahLibur++;
            }
        }

        $hariKerja = $selisihHari - $jumlahLibur;
        return $hariKerja;
    }

    public function generatePayroll(Request $request)
    {
        if ($request->isMethod('post')) {
            $id = $request->input();

            // get data payroll
            $dataPayroll = PayrollModel::with('employees')->where('id', $id)->first();

            if ($dataPayroll) {
                $gaji        = $dataPayroll->basic_salary;
                $id_employee = $dataPayroll->id_employee;
                $transport   = $dataPayroll->transportation_allowance;
                $positional  = $dataPayroll->positional_allowance;
                $bps_ket     = $dataPayroll->employment_bpjs;
                $bps_kes     = $dataPayroll->health_bpjs;

                // get jumlah hari kerja dari tanggal 16 sampai 15
                $hariKerja = $this->hariKerja();

                // hitung gaji perhari
                $daySalary = ceil($gaji / $hariKerja);

                // get absen
                $awalBulan       = Date("Y-m-16", strtotime('-1 month'));
                $bulanSekarang   = Date("Y-m-15");
                $countAttendance = AttendanceModel::where(["trashed" => 0, "id_employee" => $id_employee, "type" => 1])->whereBetween("time_in", ["$awalBulan 00:00:00", "$bulanSekarang 23:59:00"])->whereNotNull("time_out")->count();

                // get over time
                $countOverTime = AttendanceModel::where(["trashed" => 0, "id_employee" => $id_employee, "type" => 2])->whereBetween("time_in", ["$awalBulan 00:00:00", "$bulanSekarang 23:59:00"])->whereNotNull("time_out")->get();

                // hitung gaji perbulan
                $payroll = $countAttendance * $daySalary;

                // potongan absen
                $potongan_absen = $gaji - $payroll;

                // hitung lembur
                $jam1 = 0;
                $jam2 = 0;
                if ($countOverTime) {
                    foreach ($countOverTime as $ot) {
                        // assign original times
                        $time_in  = $ot->time_in;
                        $time_out = $ot->time_out;

                        // create Carbon instances for original times
                        $time_in_rounded  = Carbon::parse($time_in);
                        $time_out_rounded = Carbon::parse($time_out);

                        // round up time in to the nearest 30 minutes
                        $minutes         = $time_in_rounded->format('i');
                        $rounded_minutes = ceil($minutes / 30) * 30;
                        $time_in_rounded->setTime($time_in_rounded->format('H'), $rounded_minutes, 0);
                        $time_in_rounded->format('Y-m-d H:i:s');

                        // round down time out to the nearest 30 minutes
                        $minutes_out         = $time_out_rounded->format('i');
                        $rounded_minutes_out = floor($minutes_out / 30) * 30;
                        $time_out_rounded->setTime($time_out_rounded->format('H'), $rounded_minutes_out, 0);
                        $time_out_rounded->format('Y-m-d H:i:s');

                        // output the result
                        $diff_in_minutes = $time_in_rounded->diffInMinutes($time_out_rounded);

                        // convert ke jam
                        $hours = $diff_in_minutes / 60;
                        $bobot1 = 1;
                        $bobot2 = $hours - $bobot1;

                        $jam1 += $bobot1;
                        $jam2 += $bobot2;
                    }
                }

                $dataLembur = [
                    'value1' => $jam1 * 23000,
                    'value2' => $jam2 * 30000,
                    'total'  => ($jam1 * 23000) + ($jam2 * 30000)
                ];

                $dataPayrollSettle = [
                    'potongan_absen' => $potongan_absen,
                    'total_potongan' => $potongan_absen + $bps_kes + $bps_ket,
                    'bruto_sallary'  => $gaji + $dataLembur['total'] + $transport + $positional,
                    'net_sallary'    => ($gaji + $dataLembur['total'] + $transport + $positional) - ($potongan_absen + $bps_kes + $bps_ket),
                ];

                $datas = [
                    'data_payroll'        => $dataPayroll,
                    'data_lembur'         => $dataLembur,
                    'data_payroll_settle' => $dataPayrollSettle,
                ];

                return response()->json([
                    'status'  => true,
                    'data'    => $datas,
                    'message' => "content",
                    200
                ]);
            } else {
                return response()->json([
                    'status'  => false,
                    'message' => "empty",
                    404
                ]);
            }
        }
    }

    public function saveGeneratePayroll(Request $request)
    {
        if ($request->isMethod('post')) {
            $data       = $request->input();
            $dataSettle = $data['dataSettle'];

            $historyPayroll                  = new HistoryPayrollModel();
            $historyPayroll->id_payroll      = $data['idPayroll'];
            $historyPayroll->weight_ot1      = $data['value1'];
            $historyPayroll->weight_ot2      = $data['value2'];
            $historyPayroll->total_ot        = $data['total'];
            $historyPayroll->periode         = $data['periode'];
            $historyPayroll->created_by      = $data['created_by'];
            $historyPayroll->absent          = $dataSettle['potongan_absen'];
            $historyPayroll->total_deduction = $dataSettle['total_potongan'];
            $historyPayroll->bruto_salary    = $dataSettle['bruto_sallary'];
            $historyPayroll->nett_salary     = $dataSettle['net_sallary'];
            $historyPayroll->save();

            return response()->json([
                'status' => true,
                'message' => "Generate payroll success",
                201
            ]);
        }
    }
}
