<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInitialMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('start_date');
            $table->unsignedInteger('sprint')->default(1);
            $table->decimal('hour_of_day', 8, 2)->default(8);
            $table->decimal('point_of_day', 8, 2)->default(8);
            $table->unsignedInteger('project_of_day')->default(1);
            $table->string('holidays')->default('');
            $table->timestamps();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('slug')->default('');
            $table->string('title')->default('');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->decimal('ratio', 5, 2)->default(0);
            $table->string('color')->default('');
            $table->timestamps();
        });

        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('title')->default('');
            $table->decimal('point', 9, 3);
            $table->unsignedInteger('volume')->default(0);
            $table->string('days')->default('');
            $table->timestamps();
        });

        Schema::create('scheduled_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('task_id')->constrained('tasks')->cascadeOnDelete();
            $table->date('the_date');
            $table->decimal('point', 9, 3);
            $table->decimal('volume', 8, 2)->default(0);
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
        Schema::dropIfExists('configs');
        Schema::dropIfExists('scheduled_tasks');
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('projects');
    }
}
