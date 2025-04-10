# Dex – Visual Dependency Auditor

**Dex** is a lightning-fast tool designed to scan and visualize project dependencies across Node.js and Python projects, with plans to expand to more languages. It will flag outdated or vulnerable packages and show how they’re used—visually, clearly, and with precision.

## Key Features
- ✅ One-click dependency scanning  
- 🎯 Highlights outdated, deprecated, or vulnerable packages  
- 🌐 Best-in-class interactive graph view (React + D3)—clickable fixes included  
- 📄 Exportable audit reports (PDF/CSV)  
- 💬 GitHub Actions & Slack alerts  

## Tech Stack
- **Frontend:** React, Tailwind, D3.js  
- **Backend:** FastAPI (Python)  
- **CLI:** Python (pip-audit, pipdeptree), Node.js (ncu, npm audit)  
- **Export:** pdfkit / jsPDF  
- **Hosting:** Railway (backend), Vercel (frontend)  

## Who Is It For?
- Freelancers who want cleaner, safer projects  
- Small dev teams & SaaS startups  
- Agencies managing multiple clients  
- Enterprise teams (Java/Go/Rust support planned)  

## Trust Us With Your Deps
- Open-source CLI scanner: Planned at [github.com/dex-audit/cli](https://example.com) (link placeholder).  
- Transparent benchmarks: Targeting 95% vuln detection rate (report to follow).  

> Build secure. Fix fast. Sleep well.
