from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..schemas import EntryCreate, EntryUpdate, EntryOut
from ..services import entries as svc

router = APIRouter(prefix="/entries", tags=["entries"])

@router.get("", response_model=list[EntryOut])
async def list_entries(category: str | None = None, q: str | None = None,
                       db: AsyncSession = Depends(get_db)):
    rows = await svc.list_entries(db, category, q)
    return [EntryOut.from_orm_entry(e) for e in rows]

@router.get("/{entry_id}", response_model=EntryOut)
async def get_entry(entry_id: int, db: AsyncSession = Depends(get_db)):
    e = await svc.get_entry(db, entry_id)
    if not e:
        raise HTTPException(404, "Entry not found")
    return EntryOut.from_orm_entry(e)

@router.post("", response_model=EntryOut, status_code=201)
async def create_entry(data: EntryCreate, db: AsyncSession = Depends(get_db)):
    e = await svc.create_entry(db, data)
    return EntryOut.from_orm_entry(e)

@router.patch("/{entry_id}", response_model=EntryOut)
async def update_entry(entry_id: int, data: EntryUpdate,
                       db: AsyncSession = Depends(get_db)):
    e = await svc.get_entry(db, entry_id)
    if not e:
        raise HTTPException(404, "Entry not found")
    e = await svc.update_entry(db, e, data)
    return EntryOut.from_orm_entry(e)

@router.delete("/{entry_id}", status_code=204)
async def delete_entry(entry_id: int, db: AsyncSession = Depends(get_db)):
    e = await svc.get_entry(db, entry_id)
    if not e:
        raise HTTPException(404, "Entry not found")
    await svc.delete_entry(db, e)
