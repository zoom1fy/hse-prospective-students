from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import (
    auth,
    users,
    references,
    universities,
    faculties,
    programs,
    exams,
    materials,
    statements,
    recommendations,
    comparisons,
)

app = FastAPI(
    title="HSE Prospective Students API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(references.router, prefix="/api/references", tags=["References"])
app.include_router(universities.router, prefix="/api/universities", tags=["Universities"])
app.include_router(faculties.router, prefix="/api/faculties", tags=["Faculties"])
app.include_router(programs.router, prefix="/api/programs", tags=["Programs"])
app.include_router(exams.router, prefix="/api/exams", tags=["Exams"])
app.include_router(materials.router, prefix="/api/materials", tags=["Materials"])
app.include_router(statements.router, prefix="/api/statements", tags=["Statements"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(comparisons.router, prefix="/api/comparisons", tags=["Comparisons"])


@app.get("/")
async def root():
    return {"message": "HSE Prospective Students API"}


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
