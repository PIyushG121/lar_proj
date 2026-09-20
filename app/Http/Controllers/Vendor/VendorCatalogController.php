<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Service;

class VendorCatalogController extends Controller
{
    public function index()
    {
        $services = Service::where('vendor_id', auth()->id())->get();
        return Inertia::render('Vendor/Catalog', [
            'services' => $services
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'unit' => 'required|string|max:50',
            'description' => 'nullable|string',
            'color_start' => 'nullable|string',
            'color_end' => 'nullable|string',
        ]);

        Service::create([
            ...$validated,
            'vendor_id' => auth()->id(),
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Service added to catalog.');
    }
}
