<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    protected $table = 'vehiculos_intervenidos';
    protected $primaryKey = 'id';
    protected $fillable = [
        'placa'
    ];
}
