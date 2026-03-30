"use client";

import { useState, useRef, KeyboardEvent } from "react";

type Props = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

export default function TagInput({ tags, onChange }: Props) {
  const [input, setInput] = useState("");
  const composing = useRef(false);

  const addTag = (value: string) => {
    const tag = value.trim().replace(/^#/, "");
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // IME変換中は何もしない
    if (composing.current) return;

    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === " ") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs tracking-widest" style={{ color: "#6B5E4E" }}>
        ハッシュタグ
        <span className="ml-1 text-[10px]" style={{ color: "#B0A48E" }}>（任意・スペースまたはEnterで追加）</span>
      </label>
      <div
        className="flex flex-wrap gap-2 px-3 py-2 min-h-[44px]"
        style={{ backgroundColor: "#EDE8DC", border: "1px solid #C8BFA8" }}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-0.5 text-xs tracking-wide"
            style={{ backgroundColor: "#D4EAD8", color: "#1B4332" }}
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-[10px] leading-none"
              style={{ color: "#52B788" }}
            >
              ✕
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => { composing.current = true; }}
          onCompositionEnd={() => { composing.current = false; }}
          onBlur={() => { if (input.trim() && !composing.current) addTag(input); }}
          placeholder={tags.length === 0 ? "トマト / 防除 / 施肥" : ""}
          className="flex-1 text-sm outline-none min-w-[120px] bg-transparent"
          style={{ color: "#1B4332" }}
        />
      </div>
      <p className="text-[10px]" style={{ color: "#B0A48E" }}>
        変換確定後にスペースまたはEnterで追加
      </p>
    </div>
  );
}
