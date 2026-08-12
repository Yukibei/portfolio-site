"use client";

import { X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "./controls/icons";
import chrome from "./shell/chrome.module.css";

export default function SearchBox({ initialValue = "" }: { initialValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  useEffect(() => setValue(initialValue), [initialValue]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    router.push(query ? `/notes?query=${encodeURIComponent(query)}` : "/notes");
  }

  function clear() {
    setValue("");
    router.push("/notes");
  }

  return (
    <form className={chrome.search} onSubmit={submit} role="search">
      <button className={chrome.searchButton} type="submit" aria-label="搜索笔记">
        <SearchIcon size={14} />
      </button>
      <input
        aria-label="搜索笔记"
        placeholder="Search notes"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {value ? (
        <button className={chrome.searchButton} type="button" onClick={clear} aria-label="清除搜索">
          <X aria-hidden size={13} />
        </button>
      ) : null}
    </form>
  );
}
