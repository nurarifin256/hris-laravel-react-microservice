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
        Schema::create('payroll_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_payroll')->references('id')->on('payrolls');
            $table->decimal('weight_ot1', 18, 2);
            $table->decimal('weight_ot2', 18, 2);
            $table->decimal('total_ot', 18, 2);
            $table->decimal('absent', 18, 2);
            $table->decimal('total_deduction', 18, 2);
            $table->decimal('nett_salary', 18, 2);
            $table->string('created_by', 125);
            $table->string('updated_by', 125)->nullable();
            $table->timestamps();

            $table->index('id_payroll');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payroll_histories');
    }
};
