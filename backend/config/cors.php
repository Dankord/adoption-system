<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://adoption-system-production.vercel.app',
        'https://adoption-system-*.vercel.app',
    ],

    'allowed_origins_patterns' => [
        '/^https:\/\/.*\.vercel\.app$/',
        '/^https:\/\/.*\.vercel\.com$/',
    ],

    'allowed_headers' => ['*'],

    'supports_credentials' => true,

];