#!/usr/bin/env bash

clean_next_cache() {
  local root_dir="$1"
  local web_dir="$root_dir/web"
  local next_dir="$web_dir/.next"

  if [ ! -e "$next_dir" ]; then
    return
  fi

  local web_abs
  local next_abs
  web_abs="$(cd "$web_dir" && pwd -P)"
  next_abs="$(cd "$next_dir" && pwd -P)"

  case "$next_abs" in
    "$web_abs/.next") rm -rf -- "$next_abs" ;;
    *) echo "Refusing to delete unexpected path: $next_abs" >&2; exit 1 ;;
  esac
}
