import { Card, ScrollArea, TextInput } from "@mantine/core";
import { matchSorter } from "match-sorter";
import { useState } from "react";

import { useAPI } from "@/api";
import type { TablePublicWithBase } from "@/client";

export const Tables = () => {
  const { data: tables } = useAPI<TablePublicWithBase[]>("/tables", []);

  const [query, setQuery] = useState("");

  const filtered = matchSorter(tables, query, { keys: ["name"] });

  return (
    <div>
      <div className="mb-4">
        <TextInput
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search table"
        />
      </div>
      <ScrollArea h={450}>
        {filtered?.map((table) => (
          <div className="mb-2">
            <Card
              key={table.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
            >
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
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
