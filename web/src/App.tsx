import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";
import { Bases } from "./Bases";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Bases />
    </QueryClientProvider>
  );
}

export default App;
