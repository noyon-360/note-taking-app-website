export type Role = "admin" | "user";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  interests: string[];
};

export type Note = {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
};

export type InterestGroup = {
  interest: string;
  userCount: number;
  users: Pick<User, "id" | "name">[];
};

export type UserPosts = {
  user: Pick<User, "id" | "name">;
  posts: Post[];
};

// Matches build_metadata() in the backend's app/core/response.py.
export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
