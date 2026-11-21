import anthropic
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models import Entry
from ..config import settings

async def ask(db: AsyncSession, question: str) -> dict:
    result = await db.execute(select(Entry).order_by(Entry.created_at.desc()).limit(60))
    entries = result.scalars().all()

    if not entries:
        return {"answer": "知识库还没有条目，先添加一些内容吧。", "sources": []}

    context_parts = []
    for e in entries:
        tags = e.tags or ""
        context_parts.append(
            f"[ID:{e.id}] [{e.category}] {e.title}\n"
            f"来源: {e.source}\n"
            f"摘要: {e.excerpt}\n"
            f"标签: {tags}\n"
            f"正文: {e.content[:500] if e.content else ''}"
        )
    context = "\n\n---\n\n".join(context_parts)

    system = (
        "你是用户的个人知识库助手。以下是知识库中的所有条目。\n"
        "回答问题时，优先从这些条目中提炼关键观点，并在回答末尾列出引用的条目ID（格式：[来源: ID:x, ID:y]）。\n"
        "如果知识库内容不足以回答，直接说明，不要编造。用中文回答。\n\n"
        f"=== 知识库内容 ===\n{context}"
    )

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    message = client.messages.create(
        model="claude-opus-5-5",
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": question}],
    )

    answer_text = message.content[0].text

    # Extract referenced IDs from the answer
    import re
    ids = [int(x) for x in re.findall(r"ID:(\d+)", answer_text)]
    ids = list(dict.fromkeys(ids))  # deduplicate, preserve order

    return {"answer": answer_text, "sources": ids}
