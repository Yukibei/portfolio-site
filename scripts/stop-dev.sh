#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.omx/run"
PID_FILE="$RUN_DIR/portfolio-site-dev.pid"
PORT_FILE="$RUN_DIR/portfolio-site-dev.port"
QUIET=0

if [ "${1:-}" = "--quiet" ]; then
  QUIET=1
fi

say() {
  if [ "$QUIET" != "1" ]; then
    echo "$@"
  fi
}

to_windows_path() {
  local path="$1"
  if command -v wslpath >/dev/null 2>&1; then
    wslpath -w "$path"
    return
  fi
  if command -v cygpath >/dev/null 2>&1; then
    cygpath -w "$path"
    return
  fi
  printf '%s' "$path"
}

PID=""
if [ -f "$PID_FILE" ]; then
  PID="$(cat "$PID_FILE")"
fi

if command -v powershell.exe >/dev/null 2>&1; then
  PROJECT_WIN="$(to_windows_path "$ROOT_DIR")"
  CODEX_PROJECT_WIN="$PROJECT_WIN" CODEX_PID="$PID" CODEX_QUIET="$QUIET" \
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command '
      $ErrorActionPreference = "SilentlyContinue"
      $project = $env:CODEX_PROJECT_WIN
      $pidText = $env:CODEX_PID
      $quiet = $env:CODEX_QUIET -eq "1"
      $all = @(Get-CimInstance Win32_Process)
      $targets = @()

      if ($pidText -match "^\d+$") {
        $tracked = $all | Where-Object { $_.ProcessId -eq [int]$pidText }
        if ($tracked) { $targets += $tracked }
      }

      $targets += $all | Where-Object {
        $_.CommandLine -and
        $_.ProcessId -ne $PID -and
        $_.CommandLine -like "*$project*" -and
        $_.CommandLine -like "*next*" -and
        $_.CommandLine -like "*dev*"
      }

      $ids = @($targets | Select-Object -ExpandProperty ProcessId -Unique)

      function Stop-ProcessTree([int]$id) {
        $children = @(Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $id })
        foreach ($child in $children) {
          Stop-ProcessTree -id $child.ProcessId
        }
        Stop-Process -Id $id -Force -ErrorAction SilentlyContinue
      }

      foreach ($id in $ids) {
        Stop-ProcessTree -id $id
        if (-not $quiet) {
          Write-Output "Stopped dev process tree $id"
        }
      }
    ' | tr -d '\r'
else
  if [ -n "$PID" ] && kill -0 "$PID" >/dev/null 2>&1; then
    kill "$PID"
    say "Stopped dev server PID $PID"
  elif [ -n "$PID" ]; then
    say "PID $PID is not running."
  else
    say "No dev server PID file found."
  fi
fi

rm -f "$PID_FILE" "$PORT_FILE"
