<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Player;
use App\Models\Game;

class PlayerController extends Controller
{
    public function post(Request $request)
    {
        $request->validate([
            'game_id' => 'required|exists:games,id',
            'uid' => 'required|string'
        ]);

        $game = Game::find($request->game_id);
        if($game->uid !== $request->uid) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $player = Player::create([
            'game_id' => $request->game_id
        ]);

        return response()->json($player);
    }
}
