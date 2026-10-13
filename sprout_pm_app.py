# -*- coding: utf-8 -*-
"""
輔英科技大學 - 高等教育深耕計畫 智慧管控與每月現況值追蹤平台
基於【建構規格書1012】、【115 主冊計畫指標大綱1012】與【單位教務處V2】架構
運行方式: python sprout_pm_app.py
訪問網址: http://localhost:8080 或 http://127.0.0.1:8080
"""

import http.server
import socketserver
import socket
import threading
import json
import urllib.parse
import os
import csv
import io
import sys
import openpyxl
from datetime import datetime

# Windows 終端編碼相容性處理
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

try:
    from auto_upload_github import check_git_status, push_to_github, load_config, save_config
except ImportError:
    def check_git_status(): return {"is_repo": False, "error": "auto_upload_github.py 未載入"}
    def push_to_github(**kwargs): return {"success": False, "message": "auto_upload_github.py 未載入"}
    def load_config(): return {}
    def save_config(cfg): pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "indicators_data.json")
SRC_DATA_FILE = os.path.join(BASE_DIR, "src", "indicators_data.json")
INDEX_HTML_PATH = os.path.join(BASE_DIR, "index.html")

# 全域指標資料庫
INDICATORS_DB = []
SETTINGS_DB = {
    "isQualitativeLocked": True,
    "reportingDeadline": "每月 10 日",
    "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
}

def load_indicators():
    global INDICATORS_DB
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                INDICATORS_DB = json.load(f)
            print(f"[INFO] 成功載入 {len(INDICATORS_DB)} 項指標主資料庫 (indicators_data.json)")
            return
        except Exception as e:
            print(f"[WARN] 讀取 indicators_data.json 失敗: {e}")
    INDICATORS_DB = []

def save_indicators():
    global INDICATORS_DB
    try:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(INDICATORS_DB, f, ensure_ascii=False, indent=2)
        if os.path.exists(os.path.dirname(SRC_DATA_FILE)):
            with open(SRC_DATA_FILE, "w", encoding="utf-8") as f:
                json.dump(INDICATORS_DB, f, ensure_ascii=False, indent=2)
        SETTINGS_DB["lastUpdated"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return True
    except Exception as e:
        print(f"[ERROR] 儲存 indicators_data.json 失敗: {e}")
        return False

# 初始化載入資料
load_indicators()

class ReusableHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    allow_reuse_address = True
    daemon_threads = True

class SproutWebServer(http.server.BaseHTTPRequestHandler):

    def send_json(self, data, code=200):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path in ["/", "/index.html"]:
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            if os.path.exists(INDEX_HTML_PATH):
                with open(INDEX_HTML_PATH, "r", encoding="utf-8") as f:
                    self.wfile.write(f.read().encode('utf-8'))
            else:
                self.wfile.write(b"<h1>index.html Not Found</h1>")

        elif path in ["/api/indicators", "/api/v5/indicators"]:
            self.send_json({
                "indicators": INDICATORS_DB,
                "count": len(INDICATORS_DB),
                "settings": SETTINGS_DB
            })

        elif path == "/api/settings":
            self.send_json(SETTINGS_DB)

        elif path == "/api/lan_info":
            self.send_json({
                "lan_ip": get_lan_ip(),
                "hostname": socket.gethostname(),
                "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })

        elif path == "/api/github/status":
            self.send_json(check_git_status())

        elif path == "/api/github/config":
            self.send_json(load_config())

        elif path == "/api/export_csv":
            csv_buf = io.StringIO()
            csv_buf.write("\uFEFF")
            writer = csv.writer(csv_buf)
            writer.writerow(["指標編號", "面向", "指標項目", "指標類型", "衡量方式", "週期類型", "計量單位", "權責單位", "目標值", "實績值", "達成率", "狀態燈號", "備註說明", "微亮點", "質化成果描述"])
            for ind in INDICATORS_DB:
                target = ind.get("target_val", 0)
                actual = ind.get("actual_val", 0)
                rate = ind.get("rate", 0)
                writer.writerow([
                    ind.get("id", ""),
                    ind.get("dim", ""),
                    ind.get("group", ""),
                    ind.get("cat", ""),
                    ind.get("name", ""),
                    ind.get("cycle", ""),
                    ind.get("unit", ""),
                    ind.get("dept_raw", ""),
                    target,
                    actual,
                    f"{rate}%",
                    ind.get("status_text", ""),
                    ind.get("note", ""),
                    ind.get("highlight", ""),
                    ind.get("qualitative_desc", "")
                ])
            csv_bytes = csv_buf.getvalue().encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'text/csv; charset=utf-8')
            self.send_header('Content-Disposition', f'attachment; filename="sprout_indicators_{datetime.now().strftime("%Y%m%d_%H%M")}.csv"')
            self.end_headers()
            self.wfile.write(csv_bytes)

        else:
            # 支援靜態檔案提供 (如 js, css, png)
            clean_path = path.lstrip('/')
            file_path = os.path.join(BASE_DIR, clean_path)
            if os.path.exists(file_path) and os.path.isfile(file_path):
                self.send_response(200)
                if file_path.endswith('.css'):
                    self.send_header('Content-Type', 'text/css; charset=utf-8')
                elif file_path.endswith('.js'):
                    self.send_header('Content-Type', 'application/javascript; charset=utf-8')
                elif file_path.endswith('.json'):
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                elif file_path.endswith('.png'):
                    self.send_header('Content-Type', 'image/png')
                elif file_path.endswith('.jpg') or file_path.endswith('.jpeg'):
                    self.send_header('Content-Type', 'image/jpeg')
                else:
                    self.send_header('Content-Type', 'application/octet-stream')
                self.end_headers()
                with open(file_path, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b"Not Found")

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_length)

        if parsed.path == "/api/indicators/batch_save":
            try:
                data = json.loads(body_bytes.decode('utf-8'))
                store_data = data.get("storeData", {})
                if "isQualitativeLocked" in data:
                    SETTINGS_DB["isQualitativeLocked"] = data["isQualitativeLocked"]

                updated_count = 0
                for ind in INDICATORS_DB:
                    ind_id = ind["id"]
                    if ind_id in store_data:
                        saved = store_data[ind_id]
                        if "target" in saved and saved["target"] is not None:
                            ind["target_val"] = float(saved["target"])
                        if "actual" in saved and saved["actual"] is not None:
                            ind["actual_val"] = float(saved["actual"])
                        if "note" in saved:
                            ind["note"] = saved["note"]
                        if "highlight" in saved:
                            ind["highlight"] = saved["highlight"]
                        if "qualitative_desc" in saved:
                            ind["qualitative_desc"] = saved["qualitative_desc"]
                        if "attachment" in saved:
                            ind["attachment"] = saved["attachment"]
                        if "joint_breakdown" in saved:
                            ind["joint_breakdown"] = saved["joint_breakdown"]
                            ind["actual_val"] = sum(float(v or 0) for v in saved["joint_breakdown"].values())

                        # 重算達成率與燈號
                        target = ind.get("target_val", 100)
                        actual = ind.get("actual_val", 0)
                        rate = 100.0 if target == 0 else round((actual / target) * 100, 1)
                        ind["rate"] = rate
                        if rate >= 100.0:
                            ind["status"] = "SUCCESS"
                            ind["status_text"] = "達標"
                            ind["status_color"] = "#10B981"
                        elif rate >= 80.0:
                            ind["status"] = "WARNING"
                            ind["status_text"] = "接近達標"
                            ind["status_color"] = "#F59E0B"
                        else:
                            ind["status"] = "CRITICAL"
                            ind["status_text"] = "未達標"
                            ind["status_color"] = "#EF4444"

                        updated_count += 1

                save_indicators()
                self.send_json({"success": True, "updated_count": updated_count, "message": "批次儲存成功"})
            except Exception as e:
                self.send_json({"success": False, "error": str(e)}, 500)

        elif parsed.path == "/api/indicators/update":
            try:
                data = json.loads(body_bytes.decode('utf-8'))
                ind_id = data.get("id")
                found = None
                for ind in INDICATORS_DB:
                    if ind["id"] == ind_id:
                        found = ind
                        if "actual_val" in data: ind["actual_val"] = float(data["actual_val"])
                        if "target_val" in data: ind["target_val"] = float(data["target_val"])
                        if "note" in data: ind["note"] = data["note"]
                        if "highlight" in data: ind["highlight"] = data["highlight"]
                        if "qualitative_desc" in data: ind["qualitative_desc"] = data["qualitative_desc"]
                        if "attachment" in data: ind["attachment"] = data["attachment"]

                        target = ind.get("target_val", 100)
                        actual = ind.get("actual_val", 0)
                        rate = 100.0 if target == 0 else round((actual / target) * 100, 1)
                        ind["rate"] = rate
                        if rate >= 100.0:
                            ind["status"] = "SUCCESS"
                            ind["status_text"] = "達標"
                            ind["status_color"] = "#10B981"
                        elif rate >= 80.0:
                            ind["status"] = "WARNING"
                            ind["status_text"] = "接近達標"
                            ind["status_color"] = "#F59E0B"
                        else:
                            ind["status"] = "CRITICAL"
                            ind["status_text"] = "未達標"
                            ind["status_color"] = "#EF4444"
                        break

                if found:
                    save_indicators()
                    self.send_json({"success": True, "indicator": found})
                else:
                    self.send_json({"success": False, "error": "Indicator not found"}, 404)
            except Exception as e:
                self.send_json({"success": False, "error": str(e)}, 500)

        elif parsed.path == "/api/targets/update":
            try:
                data = json.loads(body_bytes.decode('utf-8'))
                targets = data.get("targets", {})
                updated_count = 0
                for ind in INDICATORS_DB:
                    if ind["id"] in targets:
                        ind["target_val"] = float(targets[ind["id"]])
                        target = ind["target_val"]
                        actual = ind.get("actual_val", 0)
                        rate = 100.0 if target == 0 else round((actual / target) * 100, 1)
                        ind["rate"] = rate
                        if rate >= 100.0:
                            ind["status"] = "SUCCESS"
                            ind["status_text"] = "達標"
                            ind["status_color"] = "#10B981"
                        elif rate >= 80.0:
                            ind["status"] = "WARNING"
                            ind["status_text"] = "接近達標"
                            ind["status_color"] = "#F59E0B"
                        else:
                            ind["status"] = "CRITICAL"
                            ind["status_text"] = "未達標"
                            ind["status_color"] = "#EF4444"
                        updated_count += 1

                save_indicators()
                self.send_json({"success": True, "updated_count": updated_count})
            except Exception as e:
                self.send_json({"success": False, "error": str(e)}, 500)

        elif parsed.path == "/api/settings":
            try:
                data = json.loads(body_bytes.decode('utf-8'))
                SETTINGS_DB.update(data)
                self.send_json({"success": True, "settings": SETTINGS_DB})
            except Exception as e:
                self.send_json({"success": False, "error": str(e)}, 500)

        elif parsed.path == "/api/github/push":
            try:
                data = json.loads(body_bytes.decode('utf-8')) if body_bytes else {}
                commit_msg = data.get("message", f"高教深耕數據更新 - {datetime.now().strftime('%Y-%m-%d %H:%M')}")
                save_indicators()
                res = push_to_github(commit_message=commit_msg)
                self.send_json(res)
            except Exception as e:
                self.send_json({"success": False, "error": str(e)}, 500)

        elif parsed.path == "/api/github/config":
            try:
                data = json.loads(body_bytes.decode('utf-8'))
                save_config(data)
                self.send_json({"success": True})
            except Exception as e:
                self.send_json({"success": False, "error": str(e)}, 500)

        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found")

def get_lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '127.0.0.1'

def run_server(port=8080, open_browser=True):
    host = '0.0.0.0'
    lan_ip = get_lan_ip()
    for p in [port, 8081, 8085, 8090]:
        try:
            httpd = ReusableHTTPServer((host, p), SproutWebServer)
            print("============================================================")
            print("  輔英科技大學 - 高教深耕智慧管控與每月現況值追蹤平台")
            print("  已成功啟動！(基於 1012 規格書與 76 項全校指標體系)")
            print("------------------------------------------------------------")
            print(f"  [本機訪問 (Local Host)]   : http://localhost:{p}")
            print(f"  [本機訪問 (Local IP)]     : http://127.0.0.1:{p}")
            print(f"  [跨電腦/手機訪問 (LAN)]   : http://{lan_ip}:{p}")
            print("============================================================")

            if open_browser:
                def _pop_browser():
                    import time, webbrowser
                    time.sleep(0.8)
                    try:
                        webbrowser.open(f"http://localhost:{p}")
                    except Exception:
                        pass
                threading.Thread(target=_pop_browser, daemon=True).start()

            httpd.serve_forever()
            break
        except OSError:
            print(f"[WARN] 通訊埠 {p} 被佔用，嘗試切換至備用 Port...")
            continue

if __name__ == "__main__":
    run_server(8080)
