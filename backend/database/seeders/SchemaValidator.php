<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class SchemaValidator
{
    /**
     * Validate that all required tables and columns exist before seeding
     */
    public static function validate(): array
    {
        $errors = [];
        $warnings = [];

        // Check Users table
        if (!Schema::hasTable('users')) {
            $errors[] = "Table 'users' does not exist";
        } else {
            $requiredColumns = ['id', 'name', 'email', 'password'];
            foreach ($requiredColumns as $column) {
                if (!Schema::hasColumn('users', $column)) {
                    $errors[] = "Column 'users.$column' does not exist";
                }
            }
        }

        // Check Transactions table
        if (!Schema::hasTable('transactions')) {
            $errors[] = "Table 'transactions' does not exist";
        } else {
            $requiredColumns = ['id', 'user_id', 'type', 'amount', 'date', 'client_name', 'description', 'status'];
            foreach ($requiredColumns as $column) {
                if (!Schema::hasColumn('transactions', $column)) {
                    $errors[] = "Column 'transactions.$column' does not exist";
                }
            }
        }

        // Check Invoices table
        if (!Schema::hasTable('invoices')) {
            $errors[] = "Table 'invoices' does not exist";
        } else {
            $requiredColumns = ['id', 'client_name', 'invoice_number', 'amount', 'due_date', 'status'];
            foreach ($requiredColumns as $column) {
                if (!Schema::hasColumn('invoices', $column)) {
                    $errors[] = "Column 'invoices.$column' does not exist";
                }
            }
        }

        // Check Bills table
        if (!Schema::hasTable('bills')) {
            $warnings[] = "Table 'bills' does not exist (optional)";
        }

        // Check DashboardMetric table
        if (!Schema::hasTable('dashboard_metrics')) {
            $errors[] = "Table 'dashboard_metrics' does not exist";
        } else {
            $requiredColumns = ['id', 'metric_key', 'value'];
            foreach ($requiredColumns as $column) {
                if (!Schema::hasColumn('dashboard_metrics', $column)) {
                    $errors[] = "Column 'dashboard_metrics.$column' does not exist";
                }
            }
        }

        // Check for existing users
        if (Schema::hasTable('users')) {
            $userCount = DB::table('users')->count();
            if ($userCount === 0) {
                $warnings[] = "No users exist in database - seeder will create demo user";
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'warnings' => $warnings,
        ];
    }

    /**
     * Display validation results
     */
    public static function displayResults(array $results): void
    {
        if ($results['valid']) {
            echo "✓ Schema validation passed\n";
            if (!empty($results['warnings'])) {
                echo "\nWarnings:\n";
                foreach ($results['warnings'] as $warning) {
                    echo "  ⚠ $warning\n";
                }
            }
            echo "\n";
        } else {
            echo "✗ Schema validation failed\n\n";
            echo "Errors:\n";
            foreach ($results['errors'] as $error) {
                echo "  ✗ $error\n";
            }
            if (!empty($results['warnings'])) {
                echo "\nWarnings:\n";
                foreach ($results['warnings'] as $warning) {
                    echo "  ⚠ $warning\n";
                }
            }
            echo "\n";
            throw new \Exception("Schema validation failed. Please run migrations first.");
        }
    }
}
