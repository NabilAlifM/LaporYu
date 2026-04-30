<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Upvote;
use App\Models\Downvote;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    public function toggleUpvote(Request $request, Report $report)
    {
        $user = $request->user();
        
        // Remove downvote if exists
        Downvote::where('user_id', $user->id)->where('report_id', $report->id)->delete();

        $upvote = Upvote::where('user_id', $user->id)
                        ->where('report_id', $report->id)
                        ->first();

        if ($upvote) {
            $upvote->delete();
            $report->decrement('upvotes_count');
            $status = 'un-upvoted';
        } else {
            Upvote::create([
                'user_id' => $user->id,
                'report_id' => $report->id
            ]);
            $report->increment('upvotes_count');
            $status = 'upvoted';
        }

        return response()->json([
            'status' => $status,
            'upvotes_count' => $report->upvotes_count,
            'is_upvoted' => $status === 'upvoted',
            'is_downvoted' => false
        ]);
    }

    public function toggleDownvote(Request $request, Report $report)
    {
        $user = $request->user();

        // Remove upvote if exists
        $upvote = Upvote::where('user_id', $user->id)->where('report_id', $report->id)->first();
        if ($upvote) {
            $upvote->delete();
            $report->decrement('upvotes_count');
        }

        $downvote = Downvote::where('user_id', $user->id)
                          ->where('report_id', $report->id)
                          ->first();

        if ($downvote) {
            $downvote->delete();
            $status = 'un-downvoted';
        } else {
            Downvote::create([
                'user_id' => $user->id,
                'report_id' => $report->id
            ]);
            $status = 'downvoted';
        }

        return response()->json([
            'status' => $status,
            'upvotes_count' => $report->upvotes_count,
            'is_upvoted' => false,
            'is_downvoted' => $status === 'downvoted'
        ]);
    }
}
