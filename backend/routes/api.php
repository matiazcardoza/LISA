<?php

use App\Http\Controllers\InspectorController;
use App\Http\Controllers\VehiculoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

require __DIR__.'/auth.php';

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/inspectores', [InspectorController::class, 'index']);
    Route::post('/inspectores', [InspectorController::class, 'store']);
    Route::put('/inspectores/{id}', [InspectorController::class, 'update']);
    Route::delete('/inspectores/{id}', [InspectorController::class, 'destroy']);

    Route::get('/vehiculos', [VehiculoController::class, 'index']);
    Route::post('/vehiculos', [VehiculoController::class, 'store']);
    Route::put('/vehiculos/{id}', [VehiculoController::class, 'update']);
    Route::delete('/vehiculos/{id}', [VehiculoController::class, 'destroy']);
});
