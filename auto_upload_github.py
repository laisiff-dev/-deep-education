# -*- coding: utf-8 -*-
"""
高教深耕智慧專案管理與指標管考系統 - 自動上傳資料至 GitHub 工具 (auto_upload_github.py)
功能：
1. 自動檢測 Git 本地儲存庫與遠端配置 (origin)
2. 自動執行 git add / git commit (帶時間戳與變更摘要)
3. 自動執行 git push 上傳至 GitHub 遠端儲存庫
4. 可單獨命令列執行、被 sprout_pm_app.py 呼叫、或設為定時任務
"""

import os
import sys
import subprocess
import json
import argparse
from datetime import datetime

# Windows 主機環境 console 輸出與 UTF-8 編碼確保
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

CONFIG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "github_config.json")

def load_config():
    """載入 GitHub 遠端設定檔 (github_config.json)"""
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"[WARN] 讀取 github_config.json 失敗: {e}")
    return {}

def save_config(config_data):
    """儲存 GitHub 遠端設定檔 (github_config.json)"""
    try:
        current = load_config()
        current.update(config_data)
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(current, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"[ERROR] 儲存 github_config.json 失敗: {e}")
        return False

def run_git_cmd(args, cwd=None):
    """執行 git 指令並回傳 (returncode, stdout, stderr)"""
    if cwd is None:
        cwd = os.path.dirname(os.path.abspath(__file__))
    try:
        res = subprocess.run(
            ["git"] + args,
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',
            errors='replace'
        )
        return res.returncode, res.stdout.strip(), res.stderr.strip()
    except Exception as e:
        return -1, "", str(e)

def check_git_status():
    """檢查 Git 儲存庫狀態、目前分支與遠端連結"""
    cwd = os.path.dirname(os.path.abspath(__file__))
    
    # 檢查是否為 Git repo
    code, out, err = run_git_cmd(["rev-parse", "--is-inside-work-tree"], cwd)
    if code != 0:
        return {
            "is_repo": False,
            "error": "目前目錄非 Git 儲存庫",
            "branch": "",
            "has_remote": False,
            "remote_url": ""
        }
    
    # 取得目前分支
    _, current_branch, _ = run_git_cmd(["branch", "--show-current"], cwd)
    if not current_branch:
        current_branch = "main"

    # 檢查遠端 origin
    _, remote_url, _ = run_git_cmd(["remote", "get-url", "origin"], cwd)
    has_remote = bool(remote_url)

    # 檢查未 commit 的變更
    _, status_out, _ = run_git_cmd(["status", "--porcelain"], cwd)
    has_changes = bool(status_out.strip())

    return {
        "is_repo": True,
        "branch": current_branch,
        "has_remote": has_remote,
        "remote_url": remote_url,
        "has_changes": has_changes,
        "uncommitted_files": [line.strip() for line in status_out.splitlines() if line.strip()]
    }

def push_to_github(remote_url=None, commit_msg=None, token=None):
    """
    主要功能：自動加總、Commit 並 Push 資料至 GitHub
    """
    cwd = os.path.dirname(os.path.abspath(__file__))
    status = check_git_status()

    # 1. 自動初始化 Git repo (若尚未建立)
    if not status["is_repo"]:
        print("[INFO] 初始化 Git 本地儲存庫...")
        code, _, err = run_git_cmd(["init"], cwd)
        if code != 0:
            return {"success": False, "message": f"Git 初始化失敗: {err}"}
        run_git_cmd(["branch", "-M", "main"], cwd)
        status = check_git_status()

    # 2. 設定或更新遠端 origin
    cfg = load_config()
    target_remote = remote_url or cfg.get("remote_url")
    user_token = token or cfg.get("token")

    if target_remote:
        # 若有 Token 且是 HTTPS 網址，將 Token 帶入 URL
        final_remote_url = target_remote
        if user_token and target_remote.startswith("https://") and "@github.com" not in target_remote:
            # e.g., https://TOKEN@github.com/user/repo.git
            final_remote_url = target_remote.replace("https://", f"https://{user_token}@")

        if status["has_remote"]:
            run_git_cmd(["remote", "set-url", "origin", final_remote_url], cwd)
        else:
            run_git_cmd(["remote", "add", "origin", final_remote_url], cwd)
        
        # 儲存遠端 URL 至本地設定 (不含明文 Token)
        save_config({"remote_url": target_remote})
        status["has_remote"] = True
        status["remote_url"] = target_remote

    # 3. 執行 git add .
    code, _, err = run_git_cmd(["add", "."], cwd)
    if code != 0:
        return {"success": False, "message": f"git add 失敗: {err}"}

    # 4. 執行 git commit
    _, status_porcelain, _ = run_git_cmd(["status", "--porcelain"], cwd)
    committed = False
    
    if status_porcelain.strip():
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        msg = commit_msg or f"自動同步指標與管考資料 [{now_str}]"
        code, commit_out, err = run_git_cmd(["commit", "-m", msg], cwd)
        if code != 0:
            return {"success": False, "message": f"git commit 失敗: {err}"}
        committed = True
        print(f"[SUCCESS] 成功 commit 變更: {msg}")
    else:
        print("[INFO] 無新的變更檔案需要 commit。")

    # 5. 執行 git push
    pushed = False
    status = check_git_status()
    if not status["has_remote"]:
        return {
            "success": True,
            "committed": committed,
            "pushed": False,
            "message": "已完成本地 Commit，但未設定 GitHub 遠端儲存庫 URL (origin)。請於介面設定 GitHub Repo URL 以完成自動上傳！"
        }

    branch = status["branch"] or "main"
    print(f"[INFO] 正推送到 GitHub 遠端 (branch: {branch})...")
    code, push_out, err = run_git_cmd(["push", "-u", "origin", branch], cwd)

    if code == 0:
        pushed = True
        print("[SUCCESS] 成功上傳至 GitHub！")
        return {
            "success": True,
            "committed": committed,
            "pushed": True,
            "branch": branch,
            "message": f"已成功上傳最新資料至 GitHub (分支: {branch})！"
        }
    else:
        # 如果失敗，嘗試普通 push
        code2, push_out2, err2 = run_git_cmd(["push", "origin", branch], cwd)
        if code2 == 0:
            pushed = True
            return {
                "success": True,
                "committed": committed,
                "pushed": True,
                "branch": branch,
                "message": f"已成功上傳最新資料至 GitHub (分支: {branch})！"
            }
        else:
            return {
                "success": False,
                "committed": committed,
                "pushed": False,
                "message": f"推送至 GitHub 失敗，錯誤訊息: {err or err2}\n提示：請檢查 GitHub 遠端網址與存取權限 (PAT Token / SSH 金鑰)。"
            }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="自動上傳資料至 GitHub 工具")
    parser.add_argument("--remote", help="GitHub 遠端儲存庫網址 (e.g. https://github.com/user/repo.git)")
    parser.add_argument("--token", help="GitHub Personal Access Token (PAT)")
    parser.add_argument("--msg", help="Commit 自訂說明")
    parser.add_argument("--status", action="store_true", help="僅檢查 Git 狀態")

    args = parser.parse_args()

    if args.status:
        st = check_git_status()
        print(json.dumps(st, ensure_ascii=False, indent=2))
    else:
        res = push_to_github(remote_url=args.remote, commit_msg=args.msg, token=args.token)
        print("\n" + json.dumps(res, ensure_ascii=False, indent=2))
