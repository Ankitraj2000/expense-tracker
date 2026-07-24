# ============================================================
# Expense Tracker — One-Click Startup Script
# ============================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Expense Tracker - Starting Up...   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill anything on port 8080 (backend)
$port8080 = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
if ($port8080) {
    Write-Host ">> Killing old backend on port 8080..." -ForegroundColor Yellow
    $port8080 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
    Start-Sleep -Seconds 2
    Write-Host "   Done." -ForegroundColor Green
} else {
    Write-Host ">> Port 8080 is free." -ForegroundColor Green
}

# Step 2: Kill anything on port 5173 (frontend)
$port5173 = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
if ($port5173) {
    Write-Host ">> Killing old frontend on port 5173..." -ForegroundColor Yellow
    $port5173 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
    Start-Sleep -Seconds 1
    Write-Host "   Done." -ForegroundColor Green
} else {
    Write-Host ">> Port 5173 is free." -ForegroundColor Green
}

Write-Host ""

# Step 3: Start Backend in a new terminal window
Write-Host ">> Starting Backend (Spring Boot)..." -ForegroundColor Cyan
$backendPath = "$PSScriptRoot\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'BACKEND STARTING...' -ForegroundColor Green; mvn spring-boot:run"

Write-Host "   Backend window opened." -ForegroundColor Green

Start-Sleep -Seconds 3

# Step 4: Start Frontend in a new terminal window
Write-Host ">> Starting Frontend (Vite)..." -ForegroundColor Cyan
$frontendPath = "$PSScriptRoot\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'FRONTEND STARTING...' -ForegroundColor Green; npm run dev"

Write-Host "   Frontend window opened." -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Both servers are starting up!        " -ForegroundColor Cyan
Write-Host "                                        " -ForegroundColor Cyan
Write-Host "  Backend  -> http://localhost:8080     " -ForegroundColor White
Write-Host "  Frontend -> http://localhost:5173     " -ForegroundColor White
Write-Host "                                        " -ForegroundColor Cyan
Write-Host "  Open your app: http://localhost:5173  " -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 5: Auto-open browser after 10 seconds
Write-Host ">> Opening browser in 10 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 10
Start-Process "http://localhost:5173"
