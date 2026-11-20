"""Copy Airtable tables between bases: schema, records, attachments, formulas."""

import re
from collections import defaultdict

from pyairtable import Api
from pyairtable.api.table import Table

# Airtable computes these; they can't be created with a table or written to.
COMPUTED = {
    "formula", "rollup", "multipleLookupValues", "count", "autoNumber",
    "createdTime", "lastModifiedTime", "createdBy", "lastModifiedBy",
    "button", "externalSyncSource", "aiText", "manualSort",
}


def field_spec(field) -> dict:
    """Schema field -> create_table field definition."""
    spec = field.model_dump(by_alias=True, exclude_none=True, exclude={"id"})
    options = spec.get("options", {})
    if "choices" in options:
        # empty-name choices are rejected; choice ids belong to the source base
        options["choices"] = [
            {k: v for k, v in c.items() if k != "id"} for c in options["choices"] if c["name"]
        ]
    if spec["type"] == "multipleAttachments":
        spec.pop("options", None)
    return spec


def link_targets(api: Api, base_id: str) -> dict[str, set[str]]:
    """table name -> names of tables it links to (both directions)."""
    tables = api.base(base_id).schema().tables
    names = {t.id: t.name for t in tables}
    links = defaultdict(set)
    for t in tables:
        for f in t.fields:
            if f.type == "multipleRecordLinks":
                other = names.get(f.options.linked_table_id, f.options.linked_table_id)
                links[t.name].add(other)
                links[other].add(t.name)
    return links


def record_fields(fields: dict, writable: set[str]) -> dict:
    out = {}
    for name, value in fields.items():
        if name not in writable or value in ("", [], None):
            continue
        if isinstance(value, list) and value and isinstance(value[0], dict) and "url" in value[0]:
            # attachment ids belong to the source base; Airtable re-downloads by url
            value = [{"url": a["url"], "filename": a.get("filename")} for a in value]
        elif isinstance(value, list):
            value = [v for v in value if v != ""] or None
            if value is None:
                continue
        out[name] = value
    return out


def copy_table(api: Api, source_base_id: str, table_name: str, dest_base_id: str,
               workspace_id: str | None = None, new_base_name: str | None = None) -> Table:
    """Copy one table into dest_base_id, or into a new base when new_base_name is given.

    Refuses tables with link fields: links can't cross bases, so linked tables
    must move together (or stay). Returns the created table.
    """
    source = api.table(source_base_id, table_name)
    schema = source.schema()
    links = [f.name for f in schema.fields if f.type == "multipleRecordLinks"]
    if links:
        raise ValueError(f"{table_name}: has link fields {links}; links can't cross bases")
    primary = next(f for f in schema.fields if f.id == schema.primary_field_id)
    if primary.type in COMPUTED:
        raise ValueError(f"{table_name}: primary field '{primary.name}' is {primary.type}")

    # primary first: Airtable makes the first field the primary one
    plain = sorted((f for f in schema.fields if f.type not in COMPUTED), key=lambda f: f.id != primary.id)
    specs = [field_spec(f) for f in plain]
    table_def = {"name": schema.name, "fields": specs,
                 **({"description": schema.description} if schema.description else {})}
    if new_base_name:
        base = api.create_base(workspace_id, new_base_name, [table_def])
        dest = base.table(base.schema().tables[0].id)  # field endpoints need the id, not the name
    else:
        dest = api.base(dest_base_id).create_table(schema.name, specs, schema.description)

    names = {f.id: f.name for f in schema.fields}
    skipped = []
    for f in schema.fields:
        if f.type == "formula":
            formula = re.sub(r"\{(fld\w+)\}", lambda m: "{" + names.get(m[1], m[1]) + "}", f.options.formula)
            dest.create_field(f.name, "formula", options={"formula": formula})
        elif f.type in COMPUTED:
            skipped.append(f"{f.name} ({f.type})")
    if skipped:
        print(f"  {table_name}: not copied, recreate by hand: {', '.join(skipped)}")

    writable = {f.name for f in plain}
    records = sorted(source.all(), key=lambda r: r["createdTime"])
    dest.batch_create([record_fields(r["fields"], writable) for r in records], typecast=True)
    return dest


def verify(source: Table, dest: Table) -> list[str]:
    """Compare record contents (attachments by filename). Empty list = identical."""
    writable = {f.name for f in dest.schema().fields if f.type not in COMPUTED}

    def norm(fields):
        out = {}
        for k, v in record_fields(fields, writable).items():
            if isinstance(v, list) and v and isinstance(v[0], dict):
                v = sorted(a["filename"] or "" for a in v)
            elif isinstance(v, list):
                v = sorted(v)
            out[k] = v
        return repr(sorted(out.items()))

    a = sorted(norm(r["fields"]) for r in source.all())
    b = sorted(norm(r["fields"]) for r in dest.all())
    problems = []
    if len(a) != len(b):
        problems.append(f"record count {len(a)} -> {len(b)}")
    if a != b:
        problems.append(f"{len(set(a) ^ set(b))} records differ")
    return problems
