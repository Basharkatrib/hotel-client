<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            if (!Schema::hasColumn('rooms', 'rating')) {
                $table->decimal('rating', 3, 2)->default(0)->after('description');
            }
            if (!Schema::hasColumn('rooms', 'reviews_count')) {
                $table->integer('reviews_count')->default(0)->after('rating');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            if (Schema::hasColumn('rooms', 'rating')) {
                $table->dropColumn('rating');
            }
            if (Schema::hasColumn('rooms', 'reviews_count')) {
                $table->dropColumn('reviews_count');
            }
        });
    }
};
