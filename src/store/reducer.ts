import {
  Action,
  SET_MODE,
  ADD_USER,
  UPDATE_USER,
  DELETE_USER,
  ADD_USERS,
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
} from "./action";
import { NotificationCard, User } from "../types";

type State = {
  mode: string;
  users: User[];
  notifications: NotificationCard[]; // Add notifications to state
};

const initialState: State = {
  mode: localStorage.getItem("mode") || "dark",
  users: [],
  notifications: [], // Initialize the notifications array
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SET_MODE:
      return { ...state, mode: action.payload };

    case ADD_USER:
      return { ...state, users: [...state.users, action.payload] };

    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? { ...user, ...action.payload } : user
        ),
      };

    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      };

    case ADD_USERS:
      return { ...state, users: [...state.users, ...action.payload] };

    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default reducer;
