<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class BusinessController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Business/Index');
    }

    public function report()
    {
        return Inertia::render('Dashboard/Business/report/Index');
    }

    public function settings()
    {
        return Inertia::render('Dashboard/Business/settings/Index');
    }

    public function help()
    {
        return Inertia::render('Dashboard/Business/help/Index');
    }
}
