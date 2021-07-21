<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\ScheduledTask
 *
 * @property int $id
 * @property int $user_id
 * @property int $project_id
 * @property int $task_id
 * @property string $the_date
 * @property string $point
 * @property string $volume
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Project $project
 * @property-read \App\Models\Task $task
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledTask newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledTask newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledTask query()
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledTask whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledTask whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledTask wherePoint($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledTask whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledTask whereTaskId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledTask whereTheDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledTask whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledTask whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledTask whereVolume($value)
 * @mixin \Eloquent
 */
class ScheduledTask extends AppModel
{
    use HasFactory;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

}
