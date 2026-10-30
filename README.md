# Quanphi — Contractor & Project Management Platform

**One Platform. Every Project. Complete Control.**

Quanphi is a personal software project currently under active development, with the vision of building a comprehensive project and business management platform for contractors, construction businesses, and interior and exterior design professionals.

Managing multiple projects involves coordinating clients, vendors, workers, suppliers, materials, finances, documents, and countless daily activities.

Quanphi aims to bring all these operations together into one centralized platform, helping contractors manage their entire business more efficiently — from project planning and workforce coordination to financial tracking and client communication.

> 🚧 **Development Status: Work in Progress**
>
> The frontend application is actively under development. Backend development, database integration, complete API-driven workflows, and a dedicated mobile application are planned as upcoming phases.

---

## 🎯 The Vision Behind Quanphi

The idea behind Quanphi is simple: contractors should not need multiple disconnected tools to manage their business.

Whether managing residential interior projects, commercial construction, exterior development, renovation work, or multiple projects across different locations, Quanphi aims to provide a single workspace for everything.

The platform is envisioned to connect:

- Contractors and business owners
- Project managers and supervisors
- Clients and property owners
- Vendors and suppliers
- Workers and field teams
- Finance and administrative teams

The ultimate goal is to build a complete ecosystem where every stakeholder can access the information and tools relevant to their responsibilities.

---

## 📸 Application Preview

Below are selected screenshots from the current frontend implementation. They demonstrate the application's interface, design direction, and some of the workflows currently being developed.

### 1. Main Dashboard

A centralized dashboard providing an overview of business operations, including revenue, active projects, workforce, client ratings, pending quotations, payments, inventory, and equipment status.

![Quanphi Main Dashboard](ss/image%2820261030-095939%29.png)

### 2. Compact Dashboard & Navigation

A space-efficient navigation layout designed to provide quick access to different business modules while maximizing the workspace.

![Quanphi Compact Dashboard](ss/image%2820261030-095954%29.png)

### 3. Material Management

Record material purchases against individual projects with purchase dates, material names, categories, quantities, units, and pricing information.

![Quanphi Material Management](ss/image%2820261030-100102%29.png)

### 4. Custom Material Categories

Manage custom material categories to organize construction purchases and maintain structured material records.

![Quanphi Material Categories](ss/image%2820261030-100119%29.png)

### 5. Quantity, Pricing & Payment Details

Capture material quantities, unit pricing, automatically calculated purchase totals, payment methods, and invoice references.

![Quanphi Material Payment Details](ss/image%2820261030-100136%29.png)

*These are selected frontend previews, not an exhaustive representation of the application. Additional modules and workflows are also being developed.*

---

## ✨ Core Modules & Features

Quanphi is being developed as a modular platform covering different aspects of contractor and project operations.

### 🏗️ Project Management
- Manage multiple projects from a centralized dashboard.
- Organize project details, milestones, and timelines.
- Monitor project progress and completion.
- Manage project-specific tasks and activities.
- Maintain project documentation and records.

### 👥 Client Management
- Maintain centralized client profiles.
- Associate clients with their respective projects.
- Organize client information and communication records.
- Provide a dedicated client portal.
- Enable visibility into relevant project information.

### 👷 Workforce Management
- Maintain worker profiles and records.
- Generate worker identification cards.
- Organize workforce information.
- Manage attendance and daily workforce activities.
- Support QR-code-based attendance workflows.

### 🤝 Vendor & Supplier Management
- Organize vendor and supplier information.
- Maintain vendor records and associations.
- Manage supplier-related project activities.
- Organize procurement-related workflows.

### 📦 Materials & Inventory
- Manage construction materials and inventory categories.
- Record project-specific material purchases.
- Track quantities, units, and pricing.
- Maintain material purchase records.
- Improve visibility into project resources.

### 💰 Financial Management
- Manage project-related expenses.
- Organize expense reports.
- Create and manage quotations.
- Generate and manage invoices.
- Track payments and advances.
- Maintain payroll-related records.

### 📋 Tasks & Operations
- Organize tasks and responsibilities.
- Track operational activities.
- Manage notifications.
- Maintain activity and audit logs.
- Improve visibility across business operations.

### 📁 Document Management
- Centralize important project documents.
- Organize business and client-related files.
- Maintain accessible project documentation.

### 🔐 Access & Permissions
- Role-based access control architecture.
- Organize access according to user responsibilities.
- Support separate contractor, client, and operational workflows.

*Feature availability varies across modules. Some workflows currently use demonstration data or frontend scaffolding and require backend integration.*

---

## 🛠️ Technology Stack

The current frontend is built using a modern React and TypeScript ecosystem.

| Technology | Purpose |
|---|---|
| React 19 | Frontend application |
| TypeScript | Type safety |
| Vite 7 | Development and build tooling |
| Redux Toolkit | State management |
| React Router | Client-side routing |
| RTK Query | API data management |
| Axios | HTTP communication |
| Tailwind CSS | Styling |
| Headless UI | Accessible UI components |
| Recharts | Data visualization |
| Socket.IO Client | Real-time communication integration |
| dnd-kit | Drag-and-drop interactions |

---

## 🏛️ Planned Architecture

Quanphi is being developed with a modular architecture designed to support future expansion.

| Layer | Planned Technology | Status |
|---|---|---|
| Frontend | React + TypeScript | Under development |
| Backend | Node.js + Express.js | Planned |
| Database | MongoDB | Planned |
| API | RESTful APIs | Planned |
| Authentication | Secure authentication and authorization | Planned |
| Real-time communication | Socket.IO | Integration planned |
| Mobile application | React Native | Future phase |

The current repository focuses on frontend development, UI workflows, component architecture, and application structure.

Backend development and database integration will be started in the upcoming development phase.

---

## 🚀 Development Roadmap

### Phase 1 — Frontend Development
- [x] Initial application structure
- [x] Dashboard and navigation
- [x] Modular frontend architecture
- [x] Initial project management interfaces
- [x] Client management interfaces
- [x] Workforce management interfaces
- [x] Material management interfaces
- [ ] Complete and refine frontend workflows
- [ ] Improve application-wide validation and error handling

### Phase 2 — Backend Development
- [ ] Design backend architecture
- [ ] Develop RESTful APIs
- [ ] Design database schemas and relationships
- [ ] Implement authentication and authorization
- [ ] Integrate frontend modules with backend APIs
- [ ] Implement document and file management
- [ ] Implement real-time notifications

### Phase 3 — Testing & Optimization
- [ ] Unit testing
- [ ] Integration testing
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security improvements
- [ ] Production deployment

### Phase 4 — Mobile Application
- [ ] Develop a cross-platform mobile application
- [ ] Contractor and project manager workflows
- [ ] Worker attendance and field operations
- [ ] Client access and project updates
- [ ] Mobile notifications
- [ ] Synchronization with the web platform

*The roadmap is an evolving plan. Features and priorities may change as development progresses.*

---

## 💻 Getting Started

Currently, this repository contains the frontend application.

### Prerequisites

- Node.js (LTS recommended)
- npm
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/SatyaSire/quanphi.git
```

**2. Navigate to the project directory**

```bash
cd quanphi
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Build the application**

```bash
npm run build
```

**6. Run lint checks**

```bash
npm run lint
```

---

## 💡 Product Philosophy

Quanphi is being built around six core principles:

- **Centralization:** Bring essential business operations into one platform.
- **Scalability:** Build a modular foundation that can grow with business requirements.
- **Usability:** Make complex project workflows easier to manage.
- **Transparency:** Improve visibility across projects, finances, resources, and teams.
- **Collaboration:** Connect contractors, clients, vendors, and workers.
- **Practicality:** Solve real-world operational challenges faced by contractors and construction businesses.

---

## 📌 Current Project Status

Quanphi is an independently developed personal product initiative and an ongoing software development project.

The current focus is on establishing the frontend foundation and building the core modules required for a comprehensive contractor management platform.

The backend, database integration, complete business workflows, and mobile application are planned for future development.

The intention is to evolve Quanphi into a complete, reliable platform that contractors can genuinely use to manage their projects, people, resources, and business operations.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Built with a vision to simplify how contractors manage projects, people, and business operations.**

### Quanphi
*Manage Projects. Connect People. Build Better.*
