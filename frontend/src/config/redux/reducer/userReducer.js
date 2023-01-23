const initialState = {
  user: {},
};

const userReducer = (state = initialState, action) => {
  if (action.type === "GET_USER") {
    return {
      ...state,
      user: JSON.parse(localStorage.getItem("user")),
    };
  }
  return state;
};

export default userReducer;
