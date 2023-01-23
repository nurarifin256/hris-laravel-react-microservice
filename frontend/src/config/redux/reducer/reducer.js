import { combineReducers } from "redux";
import createDepartmentReducer from "./createDepartmentReducer";
import userReducer from "./userReducer";

const reducer = combineReducers({
  userReducer,
  createDepartmentReducer,
});

export default reducer;
