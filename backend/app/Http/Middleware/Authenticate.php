<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Khi user chưa auth, trả về JSON 401 thay vì redirect route login.
     */
    protected function redirectTo($request): ?string
    {
        if (! $request->expectsJson()) {
            return null; // Không redirect, chỉ trả về lỗi JSON
        }

        return null;
    }
}
