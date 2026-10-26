import bcrypt from "bcryptjs";
import { db } from "@/db";
import {
  profiles,
  categories,
  projects,
  projectImages,
  skills,
  certifications,
  services,
  posts,
  contactMessages,
  mediaAssets,
  siteSettings,
  activityLogs,
} from "@/db/schema";
import { count } from "drizzle-orm";

let seedPromise: Promise<void> | null = null;

export async function ensureSeeded(): Promise<void> {
  if (seedPromise) {
    return seedPromise;
  }
  seedPromise = runSeed().catch((err) => {
    seedPromise = null;
    console.error("Database seed check error:", err);
  });
  return seedPromise;
}

async function runSeed(): Promise<void> {
  // Administrator accounts are always ensured (not just on first seed).
  // `onConflictDoNothing` means an existing password is never overwritten,
  // so changing your password in the console is permanent.
  {
    const adminHash = await bcrypt.hash("IykomoAdmin2026!", 10);
    const opsHash = await bcrypt.hash("IykomoOps2026!", 10);

    await db
      .insert(profiles)
      .values([
        {
          email: "admin@iykomotech.com",
          passwordHash: adminHash,
          fullName: "Ikechukwu Egbo",
          role: "super_admin",
          title: "Founder, Full-Stack Engineer & IT Infrastructure Architect",
          avatarUrl: "/images/logo-mark.svg",
          active: true,
        },
        {
          email: "ops@iykomotech.com",
          passwordHash: opsHash,
          fullName: "IYKOMO-TECH COMMUNICATION Operations Desk",
          role: "admin",
          title: "Enterprise Support & Systems Administrator",
          avatarUrl: "/images/logo-mark.svg",
          active: true,
        },
      ])
      .onConflictDoNothing();
  }

  const existingCategories = await db
    .select({ value: count() })
    .from(categories);
  if ((existingCategories[0]?.value ?? 0) === 0) {
    await db
      .insert(categories)
      .values([
        {
          name: "Software Project",
          slug: "software-project",
          type: "project",
          description:
            "Full-stack software projects and cloud applications such as iykbook and iykschool",
        },
        {
          name: "IT Infrastructure",
          slug: "it-infrastructure",
          type: "project",
          description:
            "Enterprise networking, server administration, CCTV, and hardware rollouts",
        },
        {
          name: "DevOps & Cloud",
          slug: "devops-cloud",
          type: "project",
          description: "CI/CD automation, GitHub workflows, hosting, and DNS",
        },
        {
          name: "Engineering & Architecture",
          slug: "engineering-architecture",
          type: "post",
          description: "Full-stack system design with Next.js, TypeScript, and PostgreSQL",
        },
        {
          name: "IT Troubleshooting & Networking",
          slug: "it-troubleshooting",
          type: "post",
          description: "Field guides for network diagnostics, servers, and enterprise support",
        },
      ])
      .onConflictDoNothing();
  }

  const existingProjects = await db.select({ value: count() }).from(projects);
  if ((existingProjects[0]?.value ?? 0) === 0) {
    const insertedProjects = await db
      .insert(projects)
      .values([
        {
          title: "iykbook — Accounting, Inventory & Business Management Software",
          slug: "iykbook",
          tagline:
            "All-in-one cloud platform for sales & invoicing, inventory, accounting, customers, suppliers, staff, and multi-branch reporting.",
          description:
            "iykbook is a flagship software project by IYKOMO-TECH COMMUNICATION, engineered the same way as iykschool — a complete, production-grade web application built from database schema to cloud deployment. It is powerful, easy-to-use software that helps businesses manage finances, track inventory, handle sales, and streamline daily operations from one simple dashboard.\n\n### Core Modules\n- **Sales & Invoicing** — create invoices, receipts, and track payments with your own logo.\n- **Inventory Management** — add products, manage stock, set low-stock alerts, and avoid stockouts.\n- **Accounting & Finance** — track income, expenses, and profit & loss (P&L) in real time.\n- **Customer & Debtor Records** — manage customers, credit limits, and follow-ups.\n- **Supplier Management & Purchase Orders** — restock with ease and keep purchase history.\n- **Multi-Branch Support** — run multiple branches or shops from one dashboard.\n- **Staff & Roles** — control access and manage your team securely.\n- **Reports & Analytics + AI Insights** — real-time business insights and smart suggestions that boost sales and profit.\n- **Backup & Security** — cloud access anywhere with your data always safe.\n\nBuilt for small, medium, and large businesses, iykbook is engineered with Next.js, TypeScript, and PostgreSQL with strict server-side validation, role-isolated workspaces, thermal receipt printing support, and sub-second dashboard reporting on desktop and mobile.",
          category: "Software Project",
          technologies: [
            "Next.js",
            "TypeScript",
            "PostgreSQL",
            "Supabase",
            "Tailwind CSS",
            "Thermal Receipt Printing",
            "Multi-Branch Architecture",
            "AI Insights",
          ],
          liveUrl: "https://iykbook.iykomotech.com",
          githubUrl: "https://github.com/ikechukwuegbo/ikechukwuegbo.github.io",
          coverImage: "/images/iykbook-flyer.jpg",
          status: "published",
          featured: true,
          sortOrder: 1,
          metrics: {
            architecture: "Next.js App Router + PostgreSQL RLS Multi-Branch SaaS",
            deployment: "iykbook.iykomotech.com",
            highlight:
              "Accounting • Inventory • Business Management — smarter tools for stronger businesses",
          },
        },
        {
          title: "iykschool — Complete Education Management Platform",
          slug: "iykschool",
          tagline:
            "Smart school management for a brighter future — admissions, academics, fees & finance, LMS, results, transport, and communication.",
          description:
            "iykschool is the complete education management platform by IYKOMO-TECH COMMUNICATION, built around the promise **Learn • Grow • Succeed**. It replaces spreadsheets and paper result processing with one secure cloud ecosystem for the whole school.\n\n### Platform Capabilities\n- **Students & Teachers** — full digital records, class rosters, and staff profiles with ID card generation.\n- **Admissions** — online application forms, applicant tracking, and enrollment pipelines.\n- **Academics & Attendance** — timetables, continuous assessment computation, and daily attendance registers.\n- **Results & Report Cards** — automated grading engine and printable terminal report cards.\n- **Fees & Finance** — school fee invoicing, part-payments, debtor follow-ups, and receipts.\n- **Learning Management System (LMS)** — assignments, learning materials, and submissions.\n- **Library, Transport, Hostel & Clinic** — supporting modules for full campus operations.\n- **HR & Payroll, Inventory, Exams & Communication** — administration, SMS/email announcements, and reporting.\n\nStyled on the iykschool brand identity (Education Navy #0B2D66, Smart Blue #0878F9, Achievement Gold #F5B82E, Cloud White #F3F7FC) with Plus Jakarta Sans and Inter typography, the platform enforces granular role-based access so principals, class teachers, bursars, and guardians only ever reach authorized academic records.",
          category: "Software Project",
          technologies: [
            "Next.js",
            "React",
            "TypeScript",
            "PostgreSQL",
            "Supabase Auth",
            "Tailwind CSS",
            "LMS Modules",
            "Automated Grading Engine",
          ],
          liveUrl: "https://iykschool.iykomotech.com",
          githubUrl: "https://github.com/ikechukwuegbo/ikechukwuegbo.github.io",
          coverImage: "/images/iykschool-brandboard.jpg",
          status: "published",
          featured: true,
          sortOrder: 2,
          metrics: {
            architecture: "Multi-Portal Role-Based SaaS Architecture",
            deployment: "iykschool.iykomotech.com",
            highlight: "Learn • Grow • Succeed — quality education for a brighter tomorrow",
          },
        },
        {
          title: "ikechukwuegbo.github.io — Open-Source Engineering Portal",
          slug: "ikechukwuegbo-github-io",
          tagline:
            "Developer showcase, open-source documentation repository, and automated GitHub Pages CI/CD pipeline.",
          description:
            "Serving as the open-source foundation for Ikechukwu Egbo's engineering profile, this GitHub repository and live deployment demonstrate clean semantic frontend engineering, responsive grid systems, custom domain DNS configuration, and automated GitHub Pages continuous delivery.\n\nIt pairs directly with the IYKOMO-TECH full-stack ecosystem to share public code samples, technical milestones, and verifiable software engineering progression.",
          category: "DevOps & Cloud",
          technologies: [
            "GitHub Pages",
            "GitHub Actions",
            "HTML5 & CSS3",
            "JavaScript",
            "DNS & SSL",
            "Git Workflow",
          ],
          liveUrl: "https://ikechukwuegbo.github.io",
          githubUrl: "https://github.com/ikechukwuegbo/ikechukwuegbo.github.io",
          coverImage: "/images/project-portfolio-infra.jpg",
          status: "published",
          featured: true,
          sortOrder: 3,
          metrics: {
            architecture: "Git-Driven Static Edge Delivery",
            deployment: "github.com/ikechukwuegbo/ikechukwuegbo.github.io",
            highlight: "Zero-downtime Git commits to live edge deployment",
          },
        },
        {
          title: "Enterprise Office Network, Active Directory & IP CCTV Rollout",
          slug: "enterprise-office-network-cctv",
          tagline:
            "Complete structured cabling, segmented VLAN architecture, Windows Server domain controller, and PoE surveillance deployment.",
          description:
            "Designed and commissioned a resilient corporate IT environment for a multi-department facility. The engagement covered Cat6 structured cabling termination, patch panel organization, VLAN segmentation separating corporate workstations, guest Wi-Fi, networked multifunction printers, and 24/7 PoE IP CCTV NVR appliances.\n\nImplemented centralized user authentication via Active Directory Group Policy, automated encrypted NAS backups, and remote VPN administration with 99.95% operational uptime.",
          category: "IT Infrastructure",
          technologies: [
            "Windows Server AD",
            "VLAN & Managed Switches",
            "Structured Cabling",
            "PoE IP CCTV NVR",
            "Network Printers",
            "Firewall & VPN",
          ],
          liveUrl: "https://iykbook.iykomotech.com",
          githubUrl: "https://github.com/ikechukwuegbo/ikechukwuegbo.github.io",
          coverImage: "/images/service-infrastructure.jpg",
          status: "published",
          featured: true,
          sortOrder: 4,
          metrics: {
            architecture: "Segmented 4-VLAN Enterprise Topology",
            deployment: "On-Premise + Hybrid Cloud Backup",
            highlight: "Zero unplanned downtime & centralized security governance",
          },
        },
      ])
      .onConflictDoNothing()
      .returning();

    if (insertedProjects.length > 1) {
      await db.insert(projectImages).values([
        {
          projectId: insertedProjects[0].id,
          imageUrl: "/images/iykbook-flyer.jpg",
          caption:
            "iykbook official product flyer — Accounting, Inventory & Business Management",
          sortOrder: 1,
        },
        {
          projectId: insertedProjects[0].id,
          imageUrl: "/images/logo-iykbook.png",
          caption: "iykbook product identity mark",
          sortOrder: 2,
        },
        {
          projectId: insertedProjects[0].id,
          imageUrl: "/images/project-iykbook.jpg",
          caption:
            "iykbook sales, inventory & accounting dashboard on desktop and mobile",
          sortOrder: 3,
        },
        {
          projectId: insertedProjects[1].id,
          imageUrl: "/images/iykschool-brandboard.jpg",
          caption:
            "iykschool brand identity system — logo, colours, typography, web & mobile",
          sortOrder: 1,
        },
        {
          projectId: insertedProjects[1].id,
          imageUrl: "/images/logo-iykschool.png",
          caption: "iykschool logo mark — Learn • Grow • Succeed",
          sortOrder: 2,
        },
        {
          projectId: insertedProjects[1].id,
          imageUrl: "/images/project-iykschool.jpg",
          caption:
            "iykschool admin, teacher, student & parent portals in action",
          sortOrder: 3,
        },
      ]);
    }
  }

  const existingServices = await db.select({ value: count() }).from(services);
  if ((existingServices[0]?.value ?? 0) === 0) {
    await db
      .insert(services)
      .values([
        {
          title: "Custom Full-Stack Software & Web Applications",
          slug: "full-stack-software-development",
          summary:
            "Bespoke web platforms, business portals, SaaS products, and internal tools built with Next.js, TypeScript, and PostgreSQL.",
          description:
            "From business management suites like iykbook and iykschool to custom client portals, IYKOMO-TECH designs, builds, secures, and deploys modern responsive web software tailored to your exact operational workflow.",
          iconName: "Code2",
          coverImage: "/images/project-iykbook.jpg",
          features: [
            "Next.js App Router, React 19 & TypeScript architecture",
            "PostgreSQL & Supabase database modeling with Row-Level Security",
            "Custom admin dashboards, role permissions & analytics",
            "Domain setup, SSL certificates, CI/CD & cloud hosting",
          ],
          pricingNote: "Project Milestone or Monthly Retainer",
          featured: true,
          published: true,
          sortOrder: 1,
        },
        {
          title: "IT Support, Helpdesk & Endpoint Troubleshooting",
          slug: "it-support-troubleshooting",
          summary:
            "Fast, reliable remote and on-site technical support for workstations, operating systems, business software, and user productivity.",
          description:
            "Prevent costly downtime with structured IT support. We diagnose hardware faults, resolve Windows/macOS/Linux errors, configure Microsoft 365 & Google Workspace, remove malware, and maintain peak workstation performance.",
          iconName: "Wrench",
          coverImage: "/images/service-infrastructure.jpg",
          features: [
            "Rapid remote & on-site L1/L2/L3 desktop and laptop diagnostics",
            "Windows 11, macOS & Linux installation, patching, and optimization",
            "Microsoft 365, business email DNS (SPF/DKIM/DMARC) & user onboarding",
            "Preventative maintenance schedules and asset inventory tracking",
          ],
          pricingNote: "On-Demand SLA or Managed Seat Plan",
          featured: true,
          published: true,
          sortOrder: 2,
        },
        {
          title: "Network Installation, Structured Cabling & Wi-Fi",
          slug: "network-installation-infrastructure",
          summary:
            "Enterprise LAN/WAN design, Cat6 patch panels, router/switch configuration, VLAN segmentation, and seamless office Wi-Fi.",
          description:
            "Build a rock-solid connectivity backbone for your office, school, hotel, or commercial facility. Every cable drop, switch port, and wireless access point is engineered for speed, security, and clean rack maintainability.",
          iconName: "Network",
          coverImage: "/images/service-infrastructure.jpg",
          features: [
            "Structured Cat6/Cat6a cabling, rack dressing & patch panel labeling",
            "Router, firewall, managed PoE switch & VLAN segmentation setup",
            "High-density enterprise Wi-Fi roaming & guest portal isolation",
            "ISP failover load balancing and secure remote VPN access",
          ],
          pricingNote: "Site Survey & Turnkey Implementation",
          featured: true,
          published: true,
          sortOrder: 3,
        },
        {
          title: "IP CCTV Surveillance & Physical Security Systems",
          slug: "cctv-surveillance-security",
          summary:
            "High-definition PoE IP camera installation, NVR storage configuration, night-vision perimeter coverage, and encrypted mobile viewing.",
          description:
            "Protect your premises with crystal-clear 24/7 digital surveillance. We design camera placement free of blind spots, isolate CCTV traffic on dedicated security VLANs, and configure instant mobile alerts for authorized managers.",
          iconName: "ShieldCheck",
          coverImage: "/images/service-infrastructure.jpg",
          features: [
            "4K / HD PoE indoor & weatherproof outdoor IP camera installation",
            "Multi-bay NVR storage sizing for 30–90+ days continuous retention",
            "Encrypted smartphone & desktop live monitoring configuration",
            "UPS battery backup protection for uninterrupted recording",
          ],
          pricingNote: "Hardware + Installation Package",
          featured: true,
          published: true,
          sortOrder: 4,
        },
        {
          title: "Server Administration, Cloud Backup & Cybersecurity",
          slug: "server-administration-cybersecurity",
          summary:
            "Windows & Linux server management, Active Directory permissions, automated disaster recovery backups, and security hardening.",
          description:
            "Safeguard business continuity with disciplined systems administration. We configure domain controllers, file shares, PostgreSQL backups, endpoint protection policies, and least-privilege access controls.",
          iconName: "Server",
          coverImage: "/images/project-portfolio-infra.jpg",
          features: [
            "Windows Server Active Directory, DNS, DHCP & Group Policy",
            "Linux server provisioning, SSH hardening & container deployment",
            "3-2-1 automated encrypted local NAS + cloud backup verification",
            "Access control audits, MFA rollout & security posture reviews",
          ],
          pricingNote: "Managed Infrastructure Retainer",
          featured: true,
          published: true,
          sortOrder: 5,
        },
        {
          title: "Enterprise Printer Fleet & Office Hardware Support",
          slug: "printer-support-hardware",
          summary:
            "Network multifunction printer deployment, scan-to-email/folder setup, print server queues, and hardware repair.",
          description:
            "Eliminate office printing bottlenecks. We configure static IP print servers, department accounting codes, automated scan-to-network-folder workflows, driver standardization, and component servicing.",
          iconName: "Printer",
          coverImage: "/images/service-infrastructure.jpg",
          features: [
            "Networked multifunction printer (MFP) static IP & driver deployment",
            "Scan-to-Email (SMTP TLS) and Scan-to-SMB shared folder setup",
            "Spooler troubleshooting, fuser/roller maintenance & toner planning",
            "Workstation SSD/RAM upgrades and custom business PC builds",
          ],
          pricingNote: "Per-Incident or Fleet Maintenance",
          featured: true,
          published: true,
          sortOrder: 6,
        },
      ])
      .onConflictDoNothing();
  }

  const existingSkills = await db.select({ value: count() }).from(skills);
  if ((existingSkills[0]?.value ?? 0) === 0) {
    await db.insert(skills).values([
      {
        name: "Next.js (App Router) & React 19",
        category: "Full-Stack Engineering",
        proficiency: 95,
        iconName: "Code2",
        featured: true,
        sortOrder: 1,
      },
      {
        name: "TypeScript & Node.js APIs",
        category: "Full-Stack Engineering",
        proficiency: 93,
        iconName: "Terminal",
        featured: true,
        sortOrder: 2,
      },
      {
        name: "PostgreSQL, Drizzle ORM & Supabase",
        category: "Full-Stack Engineering",
        proficiency: 94,
        iconName: "Database",
        featured: true,
        sortOrder: 3,
      },
      {
        name: "Tailwind CSS & Responsive UI Architecture",
        category: "Full-Stack Engineering",
        proficiency: 95,
        iconName: "Layout",
        featured: true,
        sortOrder: 4,
      },
      {
        name: "Windows Server, Active Directory & Linux Admin",
        category: "IT Infrastructure & Support",
        proficiency: 92,
        iconName: "Server",
        featured: true,
        sortOrder: 5,
      },
      {
        name: "L1–L3 Helpdesk Diagnostics & Endpoint Management",
        category: "IT Infrastructure & Support",
        proficiency: 96,
        iconName: "Wrench",
        featured: true,
        sortOrder: 6,
      },
      {
        name: "TCP/IP Networking, VLANs, Routing & Wi-Fi",
        category: "Networking & Hardware",
        proficiency: 93,
        iconName: "Network",
        featured: true,
        sortOrder: 7,
      },
      {
        name: "PoE IP CCTV NVR & Enterprise Printer Fleets",
        category: "Networking & Hardware",
        proficiency: 94,
        iconName: "Printer",
        featured: true,
        sortOrder: 8,
      },
      {
        name: "Application Security, JWT/RLS & Access Governance",
        category: "Cloud, DevOps & Security",
        proficiency: 90,
        iconName: "ShieldCheck",
        featured: true,
        sortOrder: 9,
      },
      {
        name: "Git, GitHub Actions CI/CD, Vercel & Cloud DNS",
        category: "Cloud, DevOps & Security",
        proficiency: 91,
        iconName: "Cloud",
        featured: true,
        sortOrder: 10,
      },
    ]);
  }

  // Real, verifiable industry certifications (Cisco Networking Academy + ITIL).
  const existingCerts = await db
    .select({ value: count() })
    .from(certifications);
  if ((existingCerts[0]?.value ?? 0) === 0) {
    await db.insert(certifications).values([
      {
        title: "CCNA: Introduction to Networks",
        issuer: "Cisco Networking Academy",
        issueDate: "2025-04-07",
        credentialId: "CCNA-ITN-2025",
        certificateFile: "/certificates/CCNAITNUpdated20250407-27-lghnu4.pdf",
        skillsCovered: [
          "Network Fundamentals",
          "Network Access",
          "IP Connectivity",
          "IP Services",
          "Security Fundamentals",
          "Automation & Programmability",
        ],
        sortOrder: 1,
      },
      {
        title: "Ethical Hacker",
        issuer: "Cisco Networking Academy",
        issueDate: "2025-01-22",
        credentialId: "CISCO-EH-2025",
        certificateFile: "/certificates/EthicalHackerUpdate20250122-28-ggf99h.pdf",
        skillsCovered: [
          "Ethical Hacking Methodology",
          "Vulnerability Assessment",
          "Penetration Testing",
          "Network & Web Attacks",
          "Reporting & Remediation",
        ],
        sortOrder: 2,
      },
      {
        title: "Endpoint Security",
        issuer: "Cisco Networking Academy",
        issueDate: "2025-01-22",
        credentialId: "CISCO-EPS-2025",
        certificateFile: "/certificates/EndpointSecurityUpdate20250122-27-pyha1a.pdf",
        skillsCovered: [
          "Endpoint Protection Platforms",
          "Antimalware & EDR",
          "Host Intrusion Prevention",
          "Disk & File Encryption",
          "Data Loss Prevention",
        ],
        sortOrder: 3,
      },
      {
        title: "Network Support and Security",
        issuer: "Cisco Networking Academy",
        issueDate: "2025-01-16",
        credentialId: "CISCO-NSS-2025",
        certificateFile: "/certificates/Network_Support_and_Security_Badge20250116-27-3n175o.pdf",
        skillsCovered: [
          "Network Troubleshooting",
          "Helpdesk & Customer Support",
          "Network Hardening",
          "Access Control Lists",
          "Device Maintenance",
        ],
        sortOrder: 4,
      },
      {
        title: "Network Technician Career Path",
        issuer: "Cisco Networking Academy",
        issueDate: "2025-01-16",
        credentialId: "CISCO-NTCP-2025",
        certificateFile: "/certificates/Network_Technician_Career_Path_Badge20250112-26-vokfi0.pdf",
        skillsCovered: [
          "Network Installation",
          "Device Configuration",
          "Structured Cabling",
          "Preventative Maintenance",
          "Documentation",
        ],
        sortOrder: 5,
      },
      {
        title: "Networking Devices and Initial Configuration",
        issuer: "Cisco Networking Academy",
        issueDate: "2025-01-16",
        credentialId: "CISCO-NDIC-2025",
        certificateFile: "/certificates/Networking_Devices_and_Initial_Configuration_Badge20250116-27-abic46.pdf",
        skillsCovered: [
          "Router & Switch Configuration",
          "Cisco IOS CLI",
          "VLANs & Trunking",
          "Static & Dynamic Addressing",
          "SSH & Device Hardening",
        ],
        sortOrder: 6,
      },
      {
        title: "Networking Basics",
        issuer: "Cisco Networking Academy",
        issueDate: "2025-01-16",
        credentialId: "CISCO-NB-2025",
        certificateFile: "/certificates/Networking_Basics_Badge20250112-26-plir6h.pdf",
        skillsCovered: [
          "OSI & TCP/IP Models",
          "IP Addressing & Subnetting",
          "Ethernet & Switching",
          "Wireless Fundamentals",
          "Cabling & Connectors",
        ],
        sortOrder: 7,
      },
      {
        title: "Introduction to Cybersecurity",
        issuer: "Cisco Networking Academy",
        issueDate: "2025-01-12",
        credentialId: "CISCO-ICS-2025",
        certificateFile: "/certificates/Introduction_to_Cybersecurity_certificate_frankegbo12-gmail-com_b729973d-51b8-4616-985b-3d349b289c8a.pdf",
        skillsCovered: [
          "Cybersecurity Fundamentals",
          "Threat Landscape",
          "Data Protection & Privacy",
          "Attack Types & Vectors",
          "Security Careers",
        ],
        sortOrder: 8,
      },
      {
        title: "Computer Hardware Basics",
        issuer: "Cisco Networking Academy",
        issueDate: "2025-01-16",
        credentialId: "CISCO-CHB-2025",
        certificateFile: "/certificates/Computer_Hardware_Basics_Badge20250116-27-axp0zj.pdf",
        skillsCovered: [
          "PC Assembly & Components",
          "Motherboards & CPUs",
          "Memory & Storage",
          "Hardware Diagnostics",
          "Peripherals & Printers",
        ],
        sortOrder: 9,
      },
      {
        title: "Operating Systems Basics",
        issuer: "Cisco Networking Academy",
        issueDate: "2025-01-16",
        credentialId: "CISCO-OSB-2025",
        certificateFile: "/certificates/Operating_Systems_Basics_Badge20250116-27-pzv43n.pdf",
        skillsCovered: [
          "Windows Administration",
          "Linux Fundamentals",
          "Command-Line Interface",
          "File Systems & Permissions",
          "Installation & Updates",
        ],
        sortOrder: 10,
      },
      {
        title: "ITIL 4 Foundation — IT Service Management",
        issuer: "AXELOS / PeopleCert",
        issueDate: "2025",
        credentialId: "ITIL4-F-2025",
        certificateFile: "/certificates/Alison_Advanced_Certificate-7588-27443858 (1).pdf",
        skillsCovered: [
          "ITIL Service Value System",
          "Incident Management",
          "Problem Management",
          "Change Enablement",
          "Service Desk Practice",
          "Continual Improvement",
        ],
        sortOrder: 11,
      },
    ]);
  }

  const existingPosts = await db.select({ value: count() }).from(posts);
  if ((existingPosts[0]?.value ?? 0) === 0) {
    await db
      .insert(posts)
      .values([
        {
          title:
            "How We Built iykbook & iykschool: Multi-Tenant Architecture with Next.js and PostgreSQL",
          slug: "building-iykbook-iykschool-nextjs-postgresql",
          excerpt:
            "Lessons from designing real-world business accounting and school administration platforms that stay fast, secure, and maintainable as organizations scale.",
          content: `Building production software for schools and growing businesses demands clarity, strict data boundaries, and resilient server validation.\n\nWhen architecting iykbook (iykbook.iykomotech.com) and iykschool (iykschool.iykomotech.com), our primary requirement was ensuring every organization's records remain strictly isolated while keeping page loads instantaneous.\n\n### 1. Server-Enforced Authorization First\nNever rely on hidden buttons in the browser for security. Every route handler verifies session tokens on the server before executing database queries, paired with PostgreSQL constraints and role checks.\n\n### 2. Structured Relational Schemas Over Loose JSON\nFinancial ledgers and student academic transcripts require referential integrity. Foreign keys with explicit cascade rules guarantee clean audit trails across terms and fiscal periods.\n\n### 3. Designing UI for Daily Operational Speed\nBursars, teachers, and business owners use these dashboards hours every day. High-contrast daylight typography, keyboard-friendly forms, and immediate visual confirmation eliminate friction.`,
          category: "Engineering & Architecture",
          tags: ["Next.js", "PostgreSQL", "SaaS", "iykbook", "iykschool"],
          coverImage: "/images/project-iykbook.jpg",
          readingTime: "6 min read",
          status: "published",
          authorName: "Ikechukwu Egbo",
        },
        {
          title:
            "Field Guide: Isolating Office Networks with VLANs for Workstations, Printers, and IP CCTV",
          slug: "office-network-vlan-segmentation-cctv-printers",
          excerpt:
            "Why flat office networks create security risks and broadcast storms—and how cleanly segmented VLANs transform stability and security.",
          content: `In many small and mid-sized organizations, staff laptops, guest smartphones, multifunction printers, and IP security cameras all share a single flat 192.168.1.0/24 subnet. As soon as device count grows, intermittent dropouts and security exposure follow.\n\n### Recommended 4-Zone Office Topology\n- **VLAN 10 (Corporate Staff):** Workstations with authenticated access to internal file/print servers.\n- **VLAN 20 (Infrastructure & Printers):** Static IPs for MFPs, NAS storage, and domain services with controlled firewall rules.\n- **VLAN 30 (IP CCTV Surveillance):** PoE cameras talking strictly to the NVR appliance—zero unauthorized internet exposure.\n- **VLAN 40 (Guest Wi-Fi):** Client-isolated internet access with bandwidth fairness enabled.\n\nCombining clean physical patch panel labeling with disciplined VLAN routing cuts troubleshooting time by over 70%.`,
          category: "IT Troubleshooting & Networking",
          tags: ["Networking", "VLAN", "IP CCTV", "Printers", "Security"],
          coverImage: "/images/service-infrastructure.jpg",
          readingTime: "5 min read",
          status: "published",
          authorName: "Ikechukwu Egbo",
        },
      ])
      .onConflictDoNothing();
  }
}