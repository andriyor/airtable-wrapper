import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

const theme = createTheme({});

import "./App.css";
import { Bases } from "./features/Bases";
import { Tables } from "./features/Tables";
import { Refetch } from "@/features/Refetch.tsx";

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <div className="flex gap-10 p-10">
        <Tables />
        <Bases />
        <Refetch />
      </div>
    </MantineProvider>
  );
}

export default App;
