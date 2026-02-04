
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export interface CreateEventInput {
    eventName: string;
    host: string;
    properties?: Nullable<string>;
    url: string;
    userUuid: string;
}

export interface CreateUserInput {
    avatar?: Nullable<string>;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role?: Nullable<Role>;
    username: string;
}

export interface EventFilterInput {
    eventName?: Nullable<string>;
    host?: Nullable<string>;
    userUuid?: Nullable<string>;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface UpdateEventInput {
    eventName?: Nullable<string>;
    host?: Nullable<string>;
    properties?: Nullable<string>;
    url?: Nullable<string>;
    userUuid?: Nullable<string>;
}

export interface UpdateUserInput {
    avatar?: Nullable<string>;
    email?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    password?: Nullable<string>;
    role?: Nullable<Role>;
    username?: Nullable<string>;
}

export interface AuthPayload {
    accessToken: string;
    user: User;
}

export interface Event {
    createdAt: DateTime;
    eventName: string;
    host: string;
    id: string;
    properties: string;
    updatedAt: DateTime;
    url: string;
    userUuid: string;
}

export interface IMutation {
    createEvent(input: CreateEventInput): Event | Promise<Event>;
    createUser(input: CreateUserInput): User | Promise<User>;
    deleteEvent(id: string): boolean | Promise<boolean>;
    deleteUser(id: string): boolean | Promise<boolean>;
    login(input: LoginInput): AuthPayload | Promise<AuthPayload>;
    updateEvent(id: string, input: UpdateEventInput): Event | Promise<Event>;
    updateUser(id: string, input: UpdateUserInput): User | Promise<User>;
}

export interface IQuery {
    event(id: string): Nullable<Event> | Promise<Nullable<Event>>;
    events(filter?: Nullable<EventFilterInput>): Event[] | Promise<Event[]>;
    me(): Nullable<User> | Promise<Nullable<User>>;
    user(id: string): Nullable<User> | Promise<Nullable<User>>;
    users(): User[] | Promise<User[]>;
}

export interface User {
    avatar?: Nullable<string>;
    createdAt: DateTime;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    role: Role;
    updatedAt: DateTime;
    username: string;
}

export type DateTime = any;
type Nullable<T> = T | null;
