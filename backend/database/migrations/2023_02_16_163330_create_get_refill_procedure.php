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

        $procedure = "CREATE PROCEDURE get_refill(
            IN number_refill VARCHAR(25) COLLATE utf8mb4_unicode_ci
          )
          BEGIN
            SELECT * FROM petty_cash_journals WHERE petty_cash_journals.number=number_refill;
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
