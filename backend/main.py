"""
AI减重系统 - 主入口
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from loguru import logger
import uvicorn
import os

from api.routes import user, metabolism, diet, exercise, analytics, recommendations
from database import init_db

app = FastAPI(
    title="AI减重系统",
    description="基于AI的个性化减重管理系统",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载静态文件
if os.path.exists("../frontend"):
    app.mount("/", StaticFiles(directory="../frontend", html=True), name="frontend")

# 注册路由
app.include_router(user.router, prefix="/api/users", tags=["用户管理"])
app.include_router(metabolism.router, prefix="/api/metabolism", tags=["代谢建模"])
app.include_router(diet.router, prefix="/api/diet", tags=["饮食管理"])
app.include_router(exercise.router, prefix="/api/exercise", tags=["运动管理"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["数据分析"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["智能推荐"])

@app.on_event("startup")
async def startup_event():
    """应用启动时初始化"""
    logger.info("正在启动AI减重系统...")
    
    # 初始化数据库
    try:
        init_db()
        logger.info("数据库初始化成功")
    except Exception as e:
        logger.error(f"数据库初始化失败: {e}")
    
    logger.info("系统启动完成！")

@app.get("/")
async def root():
    return {
        "message": "欢迎使用AI减重系统",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
