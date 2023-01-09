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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_department')->references('id')->on('departmens');
            $table->string('name', 125);
            $table->string('mobile_phone_number', 13);
            $table->string('gender', 10);
            $table->string('address', 10);
            $table->string('identity_card', 25)->nullable();
            $table->string('family_card', 25)->nullable();
            $table->string('certificate', 25)->nullable();
            $table->tinyInteger('trashed')->default(0);
            $table->string('created_by', 125);
            $table->string('updated_by', 125)->nullable();
            $table->timestamps();

            $table->index(['id_department']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employees');
    }
};
