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
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_employee')->references('id')->on('employees');
            $table->decimal('basic_salary', 18, 2);
            $table->decimal('transportation_allowance', 18, 2);
            $table->decimal('positional_allowance', 18, 2);
            $table->decimal('health_bpjs', 18, 2);
            $table->decimal('employment_bpjs', 18, 2);
            $table->tinyInteger('trashed')->default(0);
            $table->string('created_by', 125);
            $table->string('updated_by', 125)->nullable();
            $table->timestamps();

            $table->index('id_employee');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payrolls');
    }
};
