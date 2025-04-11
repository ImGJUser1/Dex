# cli/scanners/rust.py
import subprocess
import toml
import json
from pathlib import Path

def scan_rust(project_path, tools_dir):
    cargo_path = project_path / "Cargo.toml"
    if not cargo_path.exists():
        return {"error": "No Cargo.toml found"}
    try:
        with open(cargo_path, "r") as f:
            cargo_data = toml.load(f)
        deps = cargo_data.get("dependencies", {})
        tree = [{"name": k, "version": v} for k, v in deps.items()]

        # Use bundled cargo-audit
        cargo_audit_path = Path(tools_dir) / "cargo-audit.exe"
        rust_path = Path(tools_dir) / "rust-1.77.2-x86_64-pc-windows-msvc/bin"
        env = {"PATH": f"{rust_path};{os.environ['PATH']}", "RUSTUP_HOME": str(Path(tools_dir) / "rust-1.77.2-x86_64-pc-windows-msvc")}
        vuln_output = subprocess.check_output([cargo_audit_path, "--json"], cwd=project_path, env=env).decode()
        vuln_data = json.loads(vuln_output)
        vulnerabilities = vuln_data.get("vulnerabilities", {}).get("list", [])
        return {"tree": tree, "vulnerabilities": vulnerabilities}
    except Exception as e:
        return {"error": f"Rust scan failed: {str(e)}"}