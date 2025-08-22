import { useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";

import type { TablePublic } from "@/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Tables = () => {
  const { data: tables } = useQuery({
    queryKey: ["tables"],
    queryFn: () => ofetch<TablePublic[]>("http://127.0.0.1:8000/tables"),
  });

  const [query, setQuery] = useState("");

  const filtered = tables?.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <Input onChange={(event) => setQuery(event.target.value)} />
      <div style={{ height: "40vh", overflowY: "scroll" }}>
        {filtered?.map((table) => (
          <Card key={table.id}>{table.name}</Card>
        ))}
      </div>
    </div>
  );
};
