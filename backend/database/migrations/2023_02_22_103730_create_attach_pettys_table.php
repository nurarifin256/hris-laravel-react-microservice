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
        Schema::create('attach_pettys', function (Blueprint $table) {
            $table->id();
            $table->string('number_journal_attach', 25)->references('number_journal')->on('petty_cash_journal_details');
            $table->string('created_by', 125)->nullable();
            $table->string('updated_by', 125)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('attach_pettys');
    }
};
