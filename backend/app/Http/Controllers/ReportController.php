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
        $reports = Report::with(['user', 'instansi', 'media', 'comments.user'])->latest()->paginate(15);
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
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'kelurahan' => 'nullable|string',
            'kecamatan' => 'nullable|string',
            'kota' => 'nullable|string',
            'provinsi' => 'nullable|string',
            'media' => 'nullable|array',
            'media.*' => 'image|max:5120', // Max 5MB per image
        ]);

        $report = Report::create([
            'user_id' => auth()->id(),
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'],
            'kategori' => $validated['kategori'],
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'kelurahan' => $validated['kelurahan'] ?? null,
            'kecamatan' => $validated['kecamatan'] ?? null,
            'kota' => $validated['kota'] ?? null,
            'provinsi' => $validated['provinsi'] ?? null,
            'status' => 'baru', // Default status
        ]);

        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $index => $file) {
                $path = $file->store('reports', 'public');
                $report->media()->create([
                    'type' => 'image',
                    'url' => $path,
                    'order' => $index,
                ]);
            }
        }

        $report->load(['user', 'media']);

        return response()->json([
            'message' => 'Report created successfully',
            'data' => $report
        ], 201);
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
