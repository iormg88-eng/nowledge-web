const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function apiFetch(path: string, token: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export type Post = {
  id: string;
  curiosity: string;
  trial: string;
  findings: string | null;
  status: "draft" | "published";
  tags: string[];
  agris_count: number;
  comments_count: number;
  author: { id: string; name: string };
  created_at: string;
  updated_at: string;
};

export const postsApi = {
  list: (token: string, q?: string) =>
    apiFetch(`/api/v1/posts${q ? `?q=${encodeURIComponent(q)}` : ""}`, token),
  mine: (token: string, q?: string) =>
    apiFetch(`/api/v1/posts/mine${q ? `?q=${encodeURIComponent(q)}` : ""}`, token),
  show: (token: string, id: string) => apiFetch(`/api/v1/posts/${id}`, token),
  create: (token: string, data: object) =>
    apiFetch("/api/v1/posts", token, { method: "POST", body: JSON.stringify({ post: data }) }),
  update: (token: string, id: string, data: object) =>
    apiFetch(`/api/v1/posts/${id}`, token, { method: "PATCH", body: JSON.stringify({ post: data }) }),
  destroy: (token: string, id: string) =>
    apiFetch(`/api/v1/posts/${id}`, token, { method: "DELETE" }),
};
