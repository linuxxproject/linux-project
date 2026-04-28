<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$user = User::where('email', 'test@example.com')->first();
if ($user) {
    $user->password = 'password'; // This will be hashed by the model cast
    $user->save();
    echo "SUCCESS: Password for test@example.com updated to 'password'\n";
} else {
    echo "ERROR: User test@example.com not found\n";
}
