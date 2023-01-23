import { Provider } from "react-redux";
import { Routess, store } from "../config";

function App() {
  return (
    <Provider store={store}>
      <Routess />;
    </Provider>
  );
}

export default App;
