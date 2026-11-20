"""Split an Airtable base from the command line.

uv run python cli.py inspect appSOURCE
uv run python cli.py copy appSOURCE appDEST "table a" "table b"
uv run python cli.py copy appSOURCE --new-base "name" --workspace wspXXX "table a" "table b"
"""

import argparse
import os

from dotenv import load_dotenv
from pyairtable import Api

from move import copy_table, link_targets, verify

load_dotenv()
api = Api(os.environ["AIRTABLE_API"])


def inspect(base_id: str):
    links = link_targets(api, base_id)
    total = 0
    for table in api.base(base_id).tables():
        count = len(table.all(fields=[table.schema().primary_field_id]))
        total += count
        linked = ", ".join(sorted(links.get(table.name, ()))) or "-"
        print(f"{count:6}  {table.name}  [links: {linked}]")
    print(f"{total:6}  total")


def copy(source: str, dest: str | None, tables: list[str], new_base: str | None, workspace: str | None):
    for name in tables:
        created = copy_table(api, source, name, dest, workspace, new_base)
        dest, new_base = created.base.id, None  # later tables go into the base just created
        problems = verify(api.table(source, name), created)
        print(f"{name} -> {dest}: {'OK' if not problems else '; '.join(problems)}")


parser = argparse.ArgumentParser()
sub = parser.add_subparsers(dest="cmd", required=True)
p = sub.add_parser("inspect", help="record counts and link groups per table")
p.add_argument("base")
p = sub.add_parser("copy", help="copy tables into another base and verify")
p.add_argument("source")
p.add_argument("dest", nargs="?", help="existing base id (omit with --new-base)")
p.add_argument("tables", nargs="+")
p.add_argument("--new-base")
p.add_argument("--workspace")
args = parser.parse_args()

if args.cmd == "inspect":
    inspect(args.base)
else:
    if args.new_base and not args.workspace:
        parser.error("--new-base needs --workspace")
    if args.new_base and args.dest:  # no dest base: the first positional is a table
        args.tables.insert(0, args.dest)
        args.dest = None
    if not args.new_base and not (args.dest or "").startswith("app"):
        parser.error("give a destination base id or --new-base")
    copy(args.source, args.dest, args.tables, args.new_base, args.workspace)
