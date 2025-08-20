import { useMutation, useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { useState } from "react";

import type {
  BasePublicWithTables,
  Change,
  TablePublic,
} from "./client/types.gen";
import { ComboboxDemo } from "./components/combobox";
import { Button } from "./components/ui/button";

export const Bases = () => {
  const [sourceBase, setSourceBase] = useState<BasePublicWithTables>();
  const [soruceTable, setSourceTable] = useState<TablePublic>();
  const [destionationBase, setDestionationBase] =
    useState<BasePublicWithTables>();

  const { data: bases } = useQuery({
    queryKey: ["todos"],
    queryFn: () =>
      ofetch<BasePublicWithTables[]>("http://127.0.0.1:8000/bases"),
  });

  const mutation = useMutation({
    mutationFn: (newTodo: Change) => {
      return ofetch("http://127.0.0.1:8000/change", {
        method: "POST",
        body: newTodo,
      });
    },
  });

  console.log("bases", bases);

  console.log("base", sourceBase);

  const handleClick = () => {
    mutation.mutate({
      sourceBaseId: sourceBase!.baseId,
      sourceTableName: soruceTable!.name,
      destinationBaseId: destionationBase!.baseId,
    });
  };

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

      <div>Select destanation base</div>
      <ComboboxDemo<BasePublicWithTables>
        term="base"
        onSelect={(base) => setDestionationBase(base)}
        options={bases || []}
      />
      {sourceBase && soruceTable && destionationBase && (
        <div className="mt-3">
          <Button onClick={handleClick}>Move</Button>
        </div>
      )}
    </div>
  );
};
