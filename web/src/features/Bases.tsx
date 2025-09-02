import { Button, Select } from "@mantine/core";
import { useState } from "react";

import { BASE_URL, useAPI } from "@/api";
import type { BasePublicWithTables, TablePublic } from "../client/types.gen";

export const Bases = () => {
  const [sourceBase, setSourceBase] = useState<BasePublicWithTables>();
  const [soruceTable, setSourceTable] = useState<TablePublic>();
  const [destionationBase, setDestionationBase] =
    useState<BasePublicWithTables>();

  const { data: bases } = useAPI<BasePublicWithTables[]>("/bases", []);

  const handleClick = () => {
    fetch(`${BASE_URL}/change`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        sourceBaseId: sourceBase!.baseId,
        sourceTableName: soruceTable!.name,
        destinationBaseId: destionationBase!.baseId,
      }),
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
        onChange={(value) => {
          console.log("value", value);
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
        onChange={(value) => {
          const table = sourceBase?.tables?.find((d) => String(d.id) === value);
          console.log("table", table);
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
        onChange={(value) => {
          console.log("value", value);
          const base = bases.find((d) => String(d.id) === value);
          setDestionationBase(base);
        }}
      />

      {sourceBase && soruceTable && destionationBase && (
        <div className="mt-3">
          <Button onClick={handleClick}>Move</Button>
        </div>
      )}
    </div>
  );
};
