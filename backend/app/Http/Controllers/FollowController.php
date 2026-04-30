<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    public function store(Request $request, $userId)
    {
        $userToFollow = User::findOrFail($userId);
        $authUser = auth()->user();

        if ($authUser->id === $userToFollow->id) {
            return response()->json(['message' => 'You cannot follow yourself'], 400);
        }

        if (!$authUser->followings()->where('following_id', $userId)->exists()) {
            $authUser->followings()->attach($userId);
        }

        return response()->json(['message' => 'Successfully followed user']);
    }

    public function destroy($userId)
    {
        $userToUnfollow = User::findOrFail($userId);
        $authUser = auth()->user();

        $authUser->followings()->detach($userId);

        return response()->json(['message' => 'Successfully unfollowed user']);
    }

    public function following()
    {
        $followings = auth()->user()->followings()->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar ?? 'https://i.pravatar.cc/150?u='.$user->id,
                'role' => $user->role,
                'is_following' => true,
            ];
        });

        return response()->json($followings);
    }
}
