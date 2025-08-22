from sqlmodel import Relationship, Field

from models.base_model import AppModel


class BaseBase(AppModel):
    name: str
    base_id: str = Field(unique=True)


class Base(BaseBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    tables: list["Table"] = Relationship(back_populates="base")


class TableBase(AppModel):
    name: str
    base_id: int | None = Field(default=None, foreign_key="base.id")
    table_id: str = Field(unique=True)


class Table(TableBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    base: Base | None = Relationship(back_populates="tables")


class TablePublic(TableBase):
    id: int


class TablePublicWithBase(TableBase):
    id: int
    base: BaseBase


class BasePublicWithTables(BaseBase):
    id: int
    tables: list[TablePublic]
