<?php

function request($method, $url, $data = null, $token = null) {
    $headers = ['Content-Type: application/json'];
    if ($token) $headers[] = "Authorization: Bearer $token";
    
    $opts = ['http' => [
        'method' => $method,
        'header' => implode("\r\n", $headers),
        'ignore_errors' => true
    ]];
    if ($data) $opts['http']['content'] = json_encode($data);
    
    $ctx = stream_context_create($opts);
    $res = file_get_contents($url, false, $ctx);
    return $res;
}

echo "--- Test 1: GET / ---\n";
echo request('GET', 'http://localhost:8000/') . "\n";

echo "--- Test 2: POST /api/register ---\n";
echo request('POST', 'http://localhost:8000/api/register', [
    'name' => 'Test User', 'email' => 'test@example.com', 'password' => 'password', 'role' => 'client'
]) . "\n";

echo "--- Test 3: POST /api/login ---\n";
$login = request('POST', 'http://localhost:8000/api/login', [
    'email' => 'test@example.com', 'password' => 'password'
]);
echo $login . "\n";
$data = json_decode($login, true);
$token = $data['token'] ?? '';

echo "--- Test 4: GET /api/missions (no token) ---\n";
echo request('GET', 'http://localhost:8000/api/missions') . "\n";

echo "--- Test 5: GET /api/missions (with token) ---\n";
echo request('GET', 'http://localhost:8000/api/missions', null, $token) . "\n";

echo "--- Test 6: GET /api/stats (with token, not admin) ---\n";
echo request('GET', 'http://localhost:8000/api/stats', null, $token) . "\n";
