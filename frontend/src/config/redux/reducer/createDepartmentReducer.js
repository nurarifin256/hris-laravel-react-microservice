const initialState = {
  form: {
    name: "",
    id_position: "",
    created_by: "",
  },
};

const createDepartmentReducer = (state = initialState, action) => {
  if (action.type === "SET_FORM_DATA") {
    return {
      ...state,
      form: {
        ...state.form,
        [action.formType]: action.formValue,
      },
    };
  }
  return state;
};
export default createDepartmentReducer;
