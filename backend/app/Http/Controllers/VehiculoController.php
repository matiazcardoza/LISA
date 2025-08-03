<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Http\Request;

class VehiculoController extends Controller
{
    function index(){
        $inspectores = Vehiculo::all();
        return ($inspectores);
    }

    function store(Request $request){
        $inspector = Vehiculo::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $inspector = Vehiculo::find($id);
        $inspector->update($request->all());
    }

    public function destroy($id)
    {
        $inspector = Vehiculo::find($id);
        $inspector->delete();
    }
}
