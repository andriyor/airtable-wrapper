import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";
import { Bases } from "./features/Bases";
import { Tables } from "./features/Tables";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tables />
      <Bases />
    </QueryClientProvider>
  );
}

export default App;
