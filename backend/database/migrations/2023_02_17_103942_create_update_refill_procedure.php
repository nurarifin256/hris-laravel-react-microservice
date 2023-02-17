<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $procedure = "CREATE PROCEDURE update_refill(
            IN id_refill BIGINT(20),
            IN id_department_refill BIGINT(20),
            IN id_coa_refill BIGINT(20),
            IN description_refill TEXT(255) COLLATE utf8mb4_unicode_ci,
            IN credit_refill DECIMAL(18,2),
            IN debit_refill DECIMAL(18,2),
            IN updated_by_refill VARCHAR(125) COLLATE utf8mb4_unicode_ci
          )
          BEGIN
            UPDATE petty_cash_journals SET id_department=id_department_refill, id_coa=id_coa_refill, description=description_refill, credit=credit_refill, debit=debit_refill, updated_by=updated_by_refill WHERE petty_cash_journals.id=id_refill;
          END";

        \DB::unprepared($procedure);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
};
