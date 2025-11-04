import { createTheme, MantineProvider } from "@mantine/core";

import "@mantine/core/styles/baseline.css";
import "@mantine/core/styles/default-css-variables.css";
import "@mantine/core/styles/global.css";

// https://mantine.dev/styles/css-files-list/
import "@mantine/core/styles/ScrollArea.css";
import "@mantine/core/styles/UnstyledButton.css";
import "@mantine/core/styles/VisuallyHidden.css";
import "@mantine/core/styles/Paper.css";
import "@mantine/core/styles/Popover.css";
import "@mantine/core/styles/CloseButton.css";
import "@mantine/core/styles/Group.css";
import "@mantine/core/styles/Loader.css";
import "@mantine/core/styles/Overlay.css";
import "@mantine/core/styles/ModalBase.css";
import "@mantine/core/styles/Input.css";
import "@mantine/core/styles/InlineInput.css";
import "@mantine/core/styles/Flex.css";
import "@mantine/core/styles/FloatingIndicator.css";
import "@mantine/core/styles/ActionIcon.css";

import "@mantine/core/styles/Button.css";
import "@mantine/core/styles/Card.css";
import "@mantine/core/styles/List.css";
import "@mantine/core/styles/Combobox.css";

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
