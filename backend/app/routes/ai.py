from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..schemas import AskRequest, AskResponse
from ..services import ai as svc

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/ask", response_model=AskResponse)
async def ask(req: AskRequest, db: AsyncSession = Depends(get_db)):
    result = await svc.ask(db, req.question)
    return result
