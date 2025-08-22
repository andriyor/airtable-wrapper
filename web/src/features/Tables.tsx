import { useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { useState } from "react";

import type { TablePublicWithBase } from "@/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Tables = () => {
  const { data: tables } = useQuery({
    queryKey: ["tables"],
    queryFn: () =>
      ofetch<TablePublicWithBase[]>("http://127.0.0.1:8000/tables"),
  });

  const [query, setQuery] = useState("");

  const filtered = tables?.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <Input
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search table"
        />
      </div>
      <div style={{ height: "40vh", overflowY: "scroll" }}>
        {filtered?.map((table) => (
          <Card key={table.id}>
            <div className="flex justify-between px-4">
              <div>
                <div className="mb-1">Table: {table.name}</div>
                <div>Base: {table.base.name}</div>
              </div>

              <div>
                <a
                  href={`https://airtable.com/${table.base.baseId}/${table.tableId}`}
                  target="_blank"
                >
                  Open
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
