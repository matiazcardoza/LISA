<?php

namespace App\Http\Controllers;

use App\Models\Inspector;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InspectorController extends Controller
{
    function index(){
        $inspectores = Inspector::all();
        return ($inspectores);
    }

    function store(Request $request){
        $inspector = Inspector::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $inspector = Inspector::find($id);
        $inspector->update($request->all());
    }

    public function destroy($id)
    {
        $inspector = Inspector::find($id);
        $inspector->delete();
    }
}
