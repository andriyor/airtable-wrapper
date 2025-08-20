import { useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { useState } from "react";

import type { BasePublicWithTables, TablePublic } from "./client";
import { ComboboxDemo } from "./components/combobox";

export const Bases = () => {
  const [sourceBase, setSourceBase] = useState<BasePublicWithTables>();
  const [soruceTable, setSourceTable] = useState<TablePublic>();

  const { data: bases } = useQuery({
    queryKey: ["todos"],
    queryFn: () =>
      ofetch<BasePublicWithTables[]>("http://127.0.0.1:8000/bases"),
  });

  console.log("bases", bases);

  console.log("base", sourceBase);

  return (
    <div>
      <div>Select source base</div>
      <ComboboxDemo<BasePublicWithTables>
        term="base"
        onSelect={(base) => setSourceBase(base)}
        options={bases || []}
      />
      <div>Select source table</div>

      <ComboboxDemo<TablePublic>
        term="table"
        onSelect={(table) => setSourceTable(table)}
        options={sourceBase?.tables || []}
      />
    </div>
  );
};
