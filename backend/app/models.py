from datetime import datetime
from sqlalchemy import String, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base

class Entry(Base):
    __tablename__ = "entries"

    id:         Mapped[int]      = mapped_column(primary_key=True, index=True)
    title:      Mapped[str]      = mapped_column(String(300))
    excerpt:    Mapped[str]      = mapped_column(Text)
    content:    Mapped[str]      = mapped_column(Text, default="")
    source:     Mapped[str]      = mapped_column(String(200), default="")
    category:   Mapped[str]      = mapped_column(String(50))   # "trade" | "en" | custom
    tags:       Mapped[str]      = mapped_column(Text, default="")  # comma-separated
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
