<?php
echo "<h2>Starting Composer Install...</h2><pre>";

// Navigate from the public folder to the main root folder
chdir(__DIR__ . '/../');

// Set COMPOSER_HOME for shared hosting environments
putenv('COMPOSER_HOME=' . __DIR__ . '/../.composer');

// Run composer install and capture the output
$output = shell_exec('composer install --no-dev --optimize-autoloader 2>&1');

echo $output;

echo "</pre><h3>Starting NPM Build...</h3><pre>";

// Run npm install and build
$npm_install = shell_exec('npm install 2>&1');
echo "NPM Install Output:\n" . $npm_install . "\n\n";

$npm_build = shell_exec('npm run build 2>&1');
echo "NPM Build Output:\n" . $npm_build . "\n\n";

echo "</pre><h3>Done!</h3>";
?>
