from pydantic import ConfigDict
from sqlmodel import SQLModel
from pydantic.alias_generators import to_camel


class AppModel(SQLModel):
    model_config = ConfigDict(
        alias_generator=to_camel,  # snake_case -> camelCase on export
        populate_by_name=True,  # allow using snake_case when creating models
        from_attributes=True,  # nice to have when validating from ORM objects
    )
