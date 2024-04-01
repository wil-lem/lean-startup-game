<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;

class GameController extends Controller
{
    public function post(Request $request)
    {
        $game = Game::create();
        return response()->json($game);
    }
}
