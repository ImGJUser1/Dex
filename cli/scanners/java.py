# cli/scanners/java.py
import subprocess
import xmltodict
import json
from pathlib import Path

def scan_java(project_path, tools_dir):
    pom_path = project_path / "pom.xml"
    if not pom_path.exists():
        return {"error": "No pom.xml found"}
    try:
        with open(pom_path, "r") as f:
            pom_data = xmltodict.parse(f.read())
        deps = pom_data.get("project", {}).get("dependencies", {}).get("dependency", [])
        if not isinstance(deps, list):
            deps = [deps] if deps else []
        tree = [{"groupId": d.get("groupId"), "artifactId": d.get("artifactId"), "version": d.get("version")} for d in deps]

        # Use bundled OWASP Dependency-Check
        dep_check_path = Path(tools_dir) / "dependency-check/bin/dependency-check.bat"
        report_path = project_path / "dependency-check-report.json"
        subprocess.run([dep_check_path, "--project", "Dex", "--scan", str(project_path), "--format", "JSON", "--out", str(project_path)], check=True)
        with open(report_path, "r") as f:
            vuln_data = json.load(f)
        vulnerabilities = vuln_data.get("dependencies", [])
        return {"tree": tree, "vulnerabilities": vulnerabilities}
    except Exception as e:
        return {"error": f"Java scan failed: {str(e)}"}