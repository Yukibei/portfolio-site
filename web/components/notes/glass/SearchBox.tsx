"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "./controls/icons";
import chrome from "./shell/chrome.module.css";

export default function SearchBox() {
  const router = useRouter();
  const [value, setValue] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    router.push(query ? `/notes?query=${encodeURIComponent(query)}` : "/notes");
  }
  return <form className={chrome.search} onSubmit={submit}><SearchIcon size={14} /><input aria-label="搜索笔记" placeholder="Search notes" value={value} onChange={(event) => setValue(event.target.value)} /></form>;
}
