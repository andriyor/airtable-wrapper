---
name: split-airtable-base
description: Split an Airtable base that is near its record limit into several bases, or move tables between bases, without breaking linked records. Use when the user says a base is full, near the limit, too big, or asks to split, move or reorganize Airtable tables across bases.
---

# Split an Airtable base

Airtable links (`multipleRecordLinks`) only work inside one base. Tables that link to each other must
end up in the same base. Do the copying with `cli.py` in this repo, never by retyping records through
chat: it copies text exactly and checks every table afterwards.

Requires `AIRTABLE_API` in `.env` (a token with `schema.bases:read/write` and `data.records:read/write`).
Run commands from the repo root with `uv run python cli.py ...`.

## Steps

1. **Inspect.** `uv run python cli.py inspect appXXX` prints record counts per table, the total, and
   which tables link to which. Tables linked to each other, directly or through a chain, form one group.
2. **Propose a grouping** and confirm it with the user before creating anything:
   - Leave every linked group in the original base. Its links are then never touched.
   - Move only unlinked tables, grouped by meaning (e.g. logs vs reference data).
   - Keep each base well under the plan's limit (free plan: 1,000 records per base), leaving room
     for the tables that grow fastest.
   - If the user already has bases with the same tables, ask whether to merge into them or ignore them.
3. **Workspace id.** Needed for new bases. Get it from the Airtable MCP `list_workspaces` tool, or from
   the user (`airtable.com/workspaces/wsp...`).
4. **Copy.** One command per target base:
   ```sh
   uv run python cli.py copy appSOURCE --new-base "name" --workspace wspXXX "table a" "table b"
   uv run python cli.py copy appSOURCE appEXISTING "table c"   # into an existing base
   ```
   Each table prints `OK` once its record count and field contents match the source. Anything else is
   a failure: stop and report it. Tables with link fields are refused; move their whole group together
   instead, or leave it in place.
5. **Report** to the user: new base links, record counts per base, and what was not carried over:
   - views, record comments, and the original created dates;
   - computed fields other than formulas (the copy prints them; recreate them by hand);
   - attachments are re-uploaded from their URLs, so copy soon after reading the source.
6. **Delete the moved tables from the source base only after the user has checked the new bases and
   said yes.** The token can't delete tables. Use the Airtable MCP `delete_table` tool (it returns an
   `actionId` for `revert_action`), or ask the user to delete them in the UI. Until then, new records
   added to the old tables won't reach the copies.

## Gotchas `move.py` already handles

- Field options must be in camelCase (`timeZone`), so the schema is dumped `by_alias=True`. Date
  timezones stay `client`/`utc` as in the source; plain `UTC` is rejected.
- Select choices with an empty name are rejected, so they are dropped.
- Formula fields are created after the table, with field ids rewritten to field names.
- Attachment and select ids belong to the source base: attachments are sent as `{url, filename}`,
  and records are written with `typecast`.
- The source primary field is created first, so it stays the primary field.
