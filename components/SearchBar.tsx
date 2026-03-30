"use client";

import { useState } from "react";

type Props = {
  onSearch: (q: string) => void;
  placeholder?: string;
};

export default function SearchBar({ onSearch, placeholder = "キーワードで検索" }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 text-sm outline-none"
          style={{
            backgroundColor: "#EDE8DC",
            border: "1px solid #C8BFA8",
            color: "#1B4332",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#52B788")}
          onBlur={(e) => (e.target.style.borderColor = "#C8BFA8")}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
            style={{ color: "#9C8F7A" }}
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2 text-xs tracking-widest"
        style={{ backgroundColor: "#1B4332", color: "#F5F0E8" }}
      >
        検索
      </button>
    </form>
  );
}
