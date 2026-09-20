<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user and organization
     * POST /api/register
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'organization_name' => 'required|string|max:255',
            'currency' => 'nullable|string|max:10',
        ]);

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Create organization
        $organization = Organization::create([
            'name' => $request->organization_name,
            'slug' => Str::slug($request->organization_name),
            'owner_id' => $user->id,
            'currency' => $request->currency ?? 'USD',
        ]);

        // Attach user to organization as owner
        $organization->users()->attach($user->id, ['role' => 'owner']);

        // Generate API token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'data' => [
                'user' => $user,
                'organization' => $organization,
                'token' => $token,
            ],
        ], 201);
    }

    /**
     * Login user
     * POST /api/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Delete old tokens
        $user->tokens()->delete();

        // Generate new token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Get user's organizations
        $organizations = $user->organizations()->get();

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $user,
                'organizations' => $organizations,
                'token' => $token,
            ],
        ]);
    }

    /**
     * Logout user
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout successful',
        ]);
    }

    /**
     * Get authenticated user
     * GET /api/user
     */
    public function user(Request $request)
    {
        $user = $request->user();
        $organizations = $user->organizations()->get();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'organizations' => $organizations,
            ],
        ]);
    }
}
