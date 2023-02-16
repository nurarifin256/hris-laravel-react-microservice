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
        $procedure = "CREATE PROCEDURE delete_refill(
            IN updated_by_refill VARCHAR(125) COLLATE utf8mb4_unicode_ci,
            IN number_refill VARCHAR(25) COLLATE utf8mb4_unicode_ci
          )
          BEGIN
            UPDATE petty_cash_journals SET trashed=1, updated_by=updated_by_refill WHERE petty_cash_journals.number=number_refill;
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
