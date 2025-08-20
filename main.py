import os

from dotenv import load_dotenv
from pyairtable import Api

load_dotenv()

api = Api(os.getenv("AIRTABLE_API"))

from pydantic import ConfigDict
from sqlalchemy import ClauseElement
from sqlmodel import Field, Relationship, SQLModel, create_engine, Session, select
from sqlalchemy.orm import selectinload
from pydantic.alias_generators import to_camel


class AppModel(SQLModel):
    model_config = ConfigDict(
        alias_generator=to_camel,  # snake_case -> camelCase on export
        populate_by_name=True,  # allow using snake_case when creating models
        from_attributes=True,  # nice to have when validating from ORM objects
    )


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


class BasePublicWithTables(BaseBase):
    id: int
    tables: list[TablePublic]


engine = create_engine("sqlite:///database.db")

SQLModel.metadata.create_all(engine)


# https://stackoverflow.com/questions/2546207/does-sqlalchemy-have-an-equivalent-of-djangos-get-or-create
def get_or_create(session, model, defaults=None, **kwargs):
    statement = select(model).filter_by(**kwargs)
    instance = session.exec(statement).one_or_none()
    if instance:
        return instance, False
    else:
        params = {k: v for k, v in kwargs.items() if not isinstance(v, ClauseElement)}
        params.update(defaults or {})
        instance = model(**params)
        try:
            session.add(instance)
            session.commit()
        except (
            Exception
        ):  # The actual exception depends on the specific database so we catch all exceptions. This is similar to the official documentation: https://docs.sqlalchemy.org/en/latest/orm/session_transaction.html
            session.rollback()
            statement = select(model).filter_by(**kwargs)
            instance = session.exec(statement).one_or_none()
            return instance, False
        else:
            return instance, True


def model_dump():
    with Session(engine) as session:
        statement = select(Base).options(selectinload(Base.tables))
        results = session.exec(statement).all()
        resp = []
        for base in results:
            json_base = base.model_dump(by_alias=True)
            json_base["tables"] = [
                table.model_dump(by_alias=True) for table in base.tables
            ]
            resp.append(json_base)

        return resp


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/bases", response_model=list[BasePublicWithTables])
async def read_bases():
    return model_dump()
