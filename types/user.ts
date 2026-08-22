export interface User {
  _id: string;
  name: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSearchResult {
  _id: string;
  name: string;
  phone: string;
}
