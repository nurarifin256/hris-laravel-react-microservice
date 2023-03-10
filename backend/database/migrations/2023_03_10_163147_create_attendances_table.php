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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_employee')->references('id')->on('employees');
            $table->string('latitude', 125);
            $table->string('longitude', 125);
            $table->string('photo', 125);
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
        Schema::dropIfExists('attendances');
    }
};
