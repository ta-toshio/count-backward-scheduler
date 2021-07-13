<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

    protected static $unguarded = [
        'id',
        'created_at',
        'updated_At',
    ];

}
