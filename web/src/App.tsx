import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import { ComboboxDemo } from "./components/combobox";
import viteLogo from "/vite.svg";

// import { client } from "./client/sdk.gen";

// client.setConfig({
//   baseUrl: "http://localhost:8000",
// });

const queryClient = new QueryClient();

function App() {
  const [count, setCount] = useState(0);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
        <ComboboxDemo />
      </p>
    </QueryClientProvider>
  );
}

export default App;
