# cli/scanners/go.py
import subprocess
from pathlib import Path

def scan_go(project_path):
    go_mod_path = project_path / "go.mod"
    if not go_mod_path.exists():
        return {"error": "No go.mod found"}
    try:
        tree_output = subprocess.check_output(["go", "list", "-m", "all"], cwd=project_path).decode()
        tree = [{"module": line.strip()} for line in tree_output.splitlines() if line.strip()]
        # Placeholder for vuln scanning (e.g., govulncheck)
        return {"tree": tree[1:], "vulnerabilities": []}  # Skip first line (root module)
    except Exception as e:
        return {"error": f"Go scan failed: {str(e)}"}