import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { apiFetch } from "@/api";
import type {
  BasePublicWithTables,
  Change,
  TablePublic,
} from "../client/types.gen";
import { ComboboxDemo } from "../components/combobox";
import { Button } from "../components/ui/button";

export const Bases = () => {
  const [sourceBase, setSourceBase] = useState<BasePublicWithTables>();
  const [soruceTable, setSourceTable] = useState<TablePublic>();
  const [destionationBase, setDestionationBase] =
    useState<BasePublicWithTables>();

  const { data: bases } = useQuery({
    queryKey: ["bases"],
    queryFn: () => apiFetch<BasePublicWithTables[]>("/bases"),
  });

  const mutation = useMutation({
    mutationFn: (newTodo: Change) => {
      return apiFetch("/change", {
        method: "POST",
        body: newTodo,
      });
    },
  });

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
