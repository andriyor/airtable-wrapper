import { useState } from "react";

import { ActionIcon, Loader } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";

import { BASE_URL } from "@/api";

export const Refetch = () => {
  const [isLoading, setLoading] = useState(false);

  const refetch = () => {
    setLoading(true);
    fetch(`${BASE_URL}/refetch`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then(() => {
      setLoading(false);
    });
  };

  return (
    <>
      <ActionIcon variant="filled" aria-label="Refetch" onClick={refetch}>
        <IconRefresh style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>
      {isLoading && <Loader color="blue" type="bars" />}
    </>
  );
};
