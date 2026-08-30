"""
SoleSight Single-Command Launcher.
Starts both the FastAPI backend and Vite frontend, waits for readiness,
and automatically opens the dashboard in your default browser.
Usage:
    python run.py
"""
import os
import sys
import time
import subprocess
import webbrowser
import urllib.request
import signal
import socket
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"


def get_lan_ips() -> list[str]:
    """Retrieve non-loopback IPv4 addresses for local network access."""
    ips = []
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        primary = s.getsockname()[0]
        s.close()
        if primary and not primary.startswith("127."):
            ips.append(primary)
    except Exception:
        pass
    try:
        hostname = socket.gethostname()
        for ip in socket.gethostbyname_ex(hostname)[2]:
            if not ip.startswith("127.") and ip not in ips:
                ips.append(ip)
    except Exception:
        pass
    return ips


def is_server_ready(url: str, timeout: float = 1.0) -> bool:
    try:
        req = urllib.request.urlopen(url, timeout=timeout)
        return req.getcode() in [200, 404]
    except Exception:
        return False


def main():
    print("=" * 60)
    print("🚀  Starting SoleSight Intelligence-to-Action Engine...")
    print("=" * 60)

    # Determine npm executable based on platform
    npm_cmd = "npm.cmd" if sys.platform.startswith("win") else "npm"

    # Set PYTHONPATH for backend
    env = os.environ.copy()
    env["PYTHONPATH"] = str(BACKEND_DIR)

    processes = []

    try:
        # 1. Start Backend FastAPI Server (listen on all network interfaces)
        print("▶️  Starting Backend (FastAPI + DuckDB) on http://0.0.0.0:8000 ...")
        backend_proc = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"],
            cwd=str(BACKEND_DIR),
            env=env
        )
        processes.append(backend_proc)

        # 2. Start Frontend Vite Dev Server
        print("▶️  Starting Frontend (Vite + React) on http://0.0.0.0:5173 ...")
        frontend_proc = subprocess.Popen(
            [npm_cmd, "run", "dev"],
            cwd=str(FRONTEND_DIR),
            env=env
        )
        processes.append(frontend_proc)

        # 3. Wait for readiness
        print("⏳ Waiting for backend and frontend servers to be ready...")
        backend_ready = False
        frontend_ready = False
        max_attempts = 40

        for _ in range(max_attempts):
            if not backend_ready and is_server_ready("http://127.0.0.1:8000/"):
                backend_ready = True
                print("✅  Backend ready at http://localhost:8000 (API docs: /docs)")

            if not frontend_ready and is_server_ready("http://127.0.0.1:5173/"):
                frontend_ready = True
                print("✅  Frontend ready at http://localhost:5173")

            if backend_ready and frontend_ready:
                break

            time.sleep(0.5)

        lan_ips = get_lan_ips()
        primary_ip = lan_ips[0] if lan_ips else "YOUR_COMPUTER_IP"

        # 4. Open dashboard in default browser
        print("🌐 Opening SoleSight Dashboard in your browser...")
        webbrowser.open("http://localhost:5173")

        print("\n" + "=" * 60)
        print("✨ SoleSight is live and running!")
        print(f"   • Local (This Device):  http://localhost:5173")
        print(f"   • Wi-Fi Network Access: http://{primary_ip}:5173")
        for extra_ip in lan_ips[1:]:
            print(f"     (Alternative IP):     http://{extra_ip}:5173")
        print(f"   • Backend API & Docs:   http://{primary_ip}:8000/docs")
        print("   • Press Ctrl+C at any time to cleanly stop all services.")
        print("=" * 60 + "\n")

        # Keep parent process alive
        while True:
            for p in processes:
                if p.poll() is not None:
                    print(f"⚠️ Process {p.pid} terminated unexpectedly.")
                    return
            time.sleep(1)

    except KeyboardInterrupt:
        print("\n🛑 Shutting down SoleSight services...")
    finally:
        for p in processes:
            try:
                if sys.platform.startswith("win"):
                    p.kill()
                else:
                    p.terminate()
            except Exception:
                pass
        print("✅ All SoleSight services stopped cleanly.")


if __name__ == "__main__":
    main()
