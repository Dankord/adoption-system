<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'https://adoption-system-4h8it9uqn-dankords-projects.vercel.app',
    ],

    'allowed_headers' => ['*'],

    'supports_credentials' => true,

];