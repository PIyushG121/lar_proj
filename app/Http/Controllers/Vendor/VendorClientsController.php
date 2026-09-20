<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorClientsController extends Controller
{
    public function index(Request $request)
    {
        $vendorId = auth()->id();
        
        $clients = Client::where('vendor_id', $vendorId)
            ->with(['services'])
            ->withCount('invoices')
            ->withSum('invoices as total_revenue', 'amount')
            ->orderBy('name')
            ->paginate(10)
            ->through(fn($c) => [
                'id' => $c->id,
                'user_id' => $c->user_id,
                'name' => $c->name,
                'email' => $c->email,
                'phone' => $c->phone,
                'invoice_count' => $c->invoices_count,
                'total_revenue' => '₹' . number_format($c->total_revenue ?? 0, 2),
                'status' => 'Active',
                'services' => $c->services->map(fn($s) => $s->name),
            ]);

        $allServices = \App\Models\Service::where('vendor_id', $vendorId)->get();

        return Inertia::render('Vendor/Clients', [
            'clients' => $clients,
            'allServices' => $allServices
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'tax_id' => 'nullable|string',
            'service_ids' => 'nullable|array',
        ]);

        // Check if there's a user with this email to link
        $linkedUser = \App\Models\User::where('email', $validated['email'])
            ->where('role', 'client')
            ->first();

        $client = Client::create([
            'vendor_id' => auth()->id(),
            'user_id' => $linkedUser?->id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'tax_id' => $validated['tax_id'],
        ]);

        if (!empty($validated['service_ids'])) {
            $client->services()->attach($validated['service_ids']);
        }

        return redirect()->back()->with('success', 'Client added successfully.');
    }
}
