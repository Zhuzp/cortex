from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from ..models import Entry
from ..schemas import EntryCreate, EntryUpdate

async def list_entries(db: AsyncSession, category: str | None, q: str | None) -> list[Entry]:
    stmt = select(Entry).order_by(Entry.created_at.desc())
    if category:
        stmt = stmt.where(Entry.category == category)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            or_(Entry.title.ilike(like), Entry.excerpt.ilike(like),
                Entry.tags.ilike(like), Entry.source.ilike(like))
        )
    result = await db.execute(stmt)
    return result.scalars().all()

async def get_entry(db: AsyncSession, entry_id: int) -> Entry | None:
    return await db.get(Entry, entry_id)

async def create_entry(db: AsyncSession, data: EntryCreate) -> Entry:
    entry = Entry(
        title=data.title, excerpt=data.excerpt, content=data.content,
        source=data.source, category=data.category,
        tags=",".join(data.tags),
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry

async def update_entry(db: AsyncSession, entry: Entry, data: EntryUpdate) -> Entry:
    for field, val in data.model_dump(exclude_none=True).items():
        if field == "tags":
            setattr(entry, "tags", ",".join(val))
        else:
            setattr(entry, field, val)
    await db.commit()
    await db.refresh(entry)
    return entry

async def delete_entry(db: AsyncSession, entry: Entry) -> None:
    await db.delete(entry)
    await db.commit()
