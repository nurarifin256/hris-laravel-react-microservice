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
        Schema::create('petty_cash_journals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_department')->references('id')->on('departmens');
            $table->foreignId('id_coa')->references('id')->on('coas');
            $table->text('description')->nullable();
            $table->decimal('credit', 18, 2)->default(0);
            $table->decimal('debit', 18, 2)->default(0);
            $table->tinyInteger('status')->default(0);
            $table->tinyInteger('trashed')->default(0);
            $table->string('created_by', 125)->nullable();
            $table->string('updated_by', 125)->nullable();
            $table->timestamps();

            $table->index(['id_coa', 'id_department']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('petty_cash_journals');
    }
};
