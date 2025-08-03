<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inspector extends Model
{
    protected $table = 'inspectores';
    protected $primaryKey = 'id';
    protected $fillable = [
        'nombres',
        'apellidos',
        'numero_celular'
    ];
}
