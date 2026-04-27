<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reports = Report::with(['user', 'instansi', 'media', 'comments'])->latest()->paginate(15);
        return response()->json($reports);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:100',
            'deskripsi' => 'required|string',
            'kategori' => 'required|string',
            // other validation rules...
        ]);

        // Logic for creating report...
        
        return response()->json(['message' => 'Report created (placeholder)'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Report $report)
    {
        $report->load(['user', 'instansi', 'media', 'comments.user', 'upvotes']);
        return response()->json($report);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Report $report)
    {
        // Logic for updating report...
        return response()->json(['message' => 'Report updated (placeholder)']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Report $report)
    {
        // Logic for deleting report...
        return response()->json(['message' => 'Report deleted (placeholder)']);
    }
}
