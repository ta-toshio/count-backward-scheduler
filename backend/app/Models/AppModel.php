<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\UnauthorizedException;

/**
 * App\Models\AppModel
 *
 * @method static \Illuminate\Database\Eloquent\Builder|AppModel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AppModel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AppModel query()
 * @mixin \Eloquent
 */
class AppModel extends Model
{
    use ScopeTrait;

    protected static $unguarded = [
        'id',
        'created_at',
        'updated_At',
    ];

    public function scopeMy(Builder $query, array $args): Builder
    {
        $userId = $args['user_id'] ?? null;
        if (!$userId) {
            throw new UnauthorizedException();
        }
        return $query->where('user_id', $userId);
    }

}
