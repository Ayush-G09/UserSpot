import { Mode, NotificationCard, User } from "../types";

// Action types
export const SET_MODE = "SET_MODE";
export const ADD_USER = "ADD_USER";
export const UPDATE_USER = "UPDATE_USER";
export const DELETE_USER = "DELETE_USER";

// Action types for user management
type AddUserAction = {
  type: typeof ADD_USER;
  payload: User;
};

type UpdateUserAction = {
  type: typeof UPDATE_USER;
  payload: User; // Full user object with updated fields
};

type DeleteUserAction = {
  type: typeof DELETE_USER;
  payload: number; // ID of the user to delete
};

// Action creators
export const setMode = (mode: Mode) => ({
  type: SET_MODE,
  payload: mode,
});

export const addUser = (user: User): AddUserAction => ({
  type: ADD_USER,
  payload: user,
});

export const updateUser = (user: User): UpdateUserAction => ({
  type: UPDATE_USER,
  payload: user,
});

export const deleteUser = (id: number): DeleteUserAction => ({
  type: DELETE_USER,
  payload: id,
});

export const ADD_USERS = "ADD_USERS";

type AddUsersAction = {
  type: typeof ADD_USERS;
  payload: User[];
};

export const addUsers = (users: User[]): AddUsersAction => ({
  type: ADD_USERS,
  payload: users,
});

// Action types for notifications
export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";

// Action types for user management
type AddNotificationAction = {
  type: typeof ADD_NOTIFICATION;
  payload: NotificationCard;
};

type RemoveNotificationAction = {
  type: typeof REMOVE_NOTIFICATION;
  payload: string; // notification ID
};

// Action creators for notifications
export const addNotification = (notification: NotificationCard): AddNotificationAction => ({
  type: ADD_NOTIFICATION,
  payload: notification,
});

export const removeNotification = (id: string): RemoveNotificationAction => ({
  type: REMOVE_NOTIFICATION,
  payload: id,
});

export type Action =
  | { type: typeof SET_MODE; payload: Mode }
  | AddUserAction
  | UpdateUserAction
  | DeleteUserAction
  | AddUsersAction
  | AddNotificationAction
  | RemoveNotificationAction
  ;
