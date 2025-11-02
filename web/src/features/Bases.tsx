import { Button, Select } from "@mantine/core";
import { useState } from "react";

import { BASE_URL, useAPI } from "@/api";
import type { BasePublicWithTables, TablePublic } from "@/client";

export const Bases = () => {
  const [sourceBase, setSourceBase] = useState<BasePublicWithTables>();
  const [sourceTable, setSourceTable] = useState<TablePublic>();
  const [destinationBase, setDestinationBase] = useState<BasePublicWithTables>();

  const { data: bases, refetch } = useAPI<BasePublicWithTables[]>("/bases", []);

  const clearForm = () => {
    setSourceBase(undefined);
    setSourceTable(undefined);
    setDestinationBase(undefined);
  };

  const handleClick = () => {
    fetch(`${BASE_URL}/change`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        sourceBaseAirtableId: sourceBase!.baseId,
        sourceTableId: sourceTable!.id,
        sourceTableName: sourceTable!.name,
        destinationBaseId: destinationBase!.id,
        destinationBaseAirtableId: destinationBase!.baseId,
      }),
    }).then(() => {
      refetch().then();
      clearForm();
    });
  };

  return (
    <div>
      <Select
        searchable
        label="Select source base"
        placeholder="Search base..."
        data={bases.map((item) => ({
          value: String(item.id),
          label: item.name,
        }))}
        value={sourceBase?.id ? String(sourceBase.id) : null}
        onChange={(value) => {
          const base = bases.find((d) => String(d.id) === value);
          setSourceBase(base);
        }}
      />

      <Select
        searchable
        label="Select source table"
        placeholder="Search source table..."
        data={(sourceBase?.tables || []).map((item) => ({
          value: String(item.id),
          label: item.name,
        }))}
        value={sourceTable?.id ? String(sourceTable.id) : null}
        onChange={(value) => {
          const table = sourceBase?.tables?.find((d) => String(d.id) === value);
          setSourceTable(table);
        }}
      />

      <Select
        searchable
        label="Select destanation base"
        placeholder="Search destanation base..."
        data={bases.map((item) => ({
          value: String(item.id),
          label: item.name,
        }))}
        value={destinationBase?.id ? String(destinationBase.id) : null}
        onChange={(value) => {
          const base = bases.find((d) => String(d.id) === value);
          setDestinationBase(base);
        }}
      />

      {sourceBase && sourceTable && destinationBase && (
        <div className="mt-3">
          <Button onClick={handleClick}>Move</Button>
        </div>
      )}
    </div>
  );
};
