export type DateTime = Date;

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: Role;
  avatar?: string | null;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface Event {
  id: string;
  host: string;
  eventName: string;
  url: string;
  properties: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface AuthPayload {
  accessToken: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role?: Role | null;
  avatar?: string | null;
}

export interface UpdateUserInput {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  email?: string | null;
  password?: string | null;
  role?: Role | null;
  avatar?: string | null;
}

export interface CreateEventInput {
  host: string;
  eventName: string;
  url: string;
  properties?: string | null;
}

export interface UpdateEventInput {
  host?: string | null;
  eventName?: string | null;
  url?: string | null;
  properties?: string | null;
}

export interface EventFilterInput {
  host?: string | null;
  eventName?: string | null;
}

export interface Query {
  me?: User | null;
  users: User[];
  user?: User | null;
  events: Event[];
  event?: Event | null;
}

export interface Mutation {
  login: AuthPayload;
  createUser: User;
  updateUser: User;
  deleteUser: boolean;
  createEvent: Event;
  updateEvent: Event;
  deleteEvent: boolean;
}
