# Builds the React frontend, copies it into Spring Boot's static resources,
# then builds the Spring Boot jar. Run from the project root:  .\build.ps1
#
# Note: we intentionally do NOT set $ErrorActionPreference = "Stop", because npm
# and node print harmless warnings to stderr, which "Stop" would treat as fatal.
# Real failures are caught via explicit $LASTEXITCODE checks below.
$root = $PSScriptRoot

# This machine's toolchain (Java 8, and a local Maven we downloaded). The
# Windows-ROOT trust type lets Maven trust the corporate SSL certificate.
$env:JAVA_HOME  = "C:\Program Files\Java\jdk1.8.0_192"
$env:MAVEN_OPTS = "-Djavax.net.ssl.trustStoreType=Windows-ROOT"
$mvn = "$env:USERPROFILE\.maven-dist\apache-maven-3.9.6\bin\mvn.cmd"

Write-Host "==> Building React frontend..." -ForegroundColor Cyan
Set-Location "$root\frontend"
$env:CI = "false"   # don't fail the build on lint warnings
npm run build
if ($LASTEXITCODE -ne 0) { throw "React build failed" }

Write-Host "==> Copying frontend build into Spring Boot static resources..." -ForegroundColor Cyan
$static = "$root\src\main\resources\static"
if (Test-Path $static) { Remove-Item $static -Recurse -Force }
New-Item -ItemType Directory -Force -Path $static | Out-Null
Copy-Item "$root\frontend\build\*" -Destination $static -Recurse -Force

Write-Host "==> Building Spring Boot jar..." -ForegroundColor Cyan
Set-Location $root
& $mvn -B clean package -DskipTests
if ($LASTEXITCODE -ne 0) { throw "Maven build failed" }

Write-Host ""
Write-Host "Build complete. Run it with:" -ForegroundColor Green
Write-Host "    java -jar target\loginapp-0.0.1-SNAPSHOT.jar"
