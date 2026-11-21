from datetime import datetime
from pydantic import BaseModel

class EntryBase(BaseModel):
    title:    str
    excerpt:  str
    content:  str = ""
    source:   str = ""
    category: str
    tags:     list[str] = []

class EntryCreate(EntryBase):
    pass

class EntryUpdate(BaseModel):
    title:    str | None = None
    excerpt:  str | None = None
    content:  str | None = None
    source:   str | None = None
    category: str | None = None
    tags:     list[str] | None = None

class EntryOut(EntryBase):
    id:         int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_entry(cls, e):
        return cls(
            id=e.id,
            title=e.title,
            excerpt=e.excerpt,
            content=e.content,
            source=e.source,
            category=e.category,
            tags=[t.strip() for t in e.tags.split(",") if t.strip()],
            created_at=e.created_at,
            updated_at=e.updated_at,
        )

class AskRequest(BaseModel):
    question: str

class AskResponse(BaseModel):
    answer: str
    sources: list[int] = []   # entry ids referenced
