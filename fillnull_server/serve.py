import uvicorn
import sys
import os


if __name__ == "__main__":
    src_dir = "./"
    sys.path.insert(0, src_dir)
    import fillnull_server
    uvicorn.run(
        "fillnull_server.app:app",
        host="0.0.0.0",
        port=8000,
        debug=True,
        log_level="debug",
        reload=True,
        reload_dirs=[src_dir],
    )
