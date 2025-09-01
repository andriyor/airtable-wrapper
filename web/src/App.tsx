import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({});

import "./App.css";
import { Bases } from "./features/Bases";
import { Tables } from "./features/Tables";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <div className="flex gap-10 p-10">
          <Tables />
          <Bases />
        </div>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
