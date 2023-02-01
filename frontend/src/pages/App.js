import { Provider } from "react-redux";
import { Routess, store } from "../config";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Routess />;
      </Provider>
      <ReactQueryDevtools
        initialIsOpen={false}
        position="bottom-right"
      ></ReactQueryDevtools>
    </QueryClientProvider>
  );
}

export default App;
