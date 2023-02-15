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
        $procedure = "CREATE PROCEDURE post_refill(
            IN id_dep_refill BIGINT(20),
            IN id_coa_refill BIGINT(20),
            IN number_refill VARCHAR(25),
            IN desc_refill TEXT(225),
            IN credit_refill DECIMAL(18,2),
            IN debit_refill DECIMAL(18,2),
            IN created_by_reffil VARCHAR(125))
        BEGIN
            INSERT INTO petty_cash_journals(id_department, id_coa, number, description, credit, debit, created_by) VALUES (id_dep_refill, id_coa_refill, number_refill, desc_refill, credit_refill, debit_refill, created_by_reffil);
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
