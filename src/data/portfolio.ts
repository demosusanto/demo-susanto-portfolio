// src/data/portfolio.ts

export const personalInfo = {
    name: "Demo Susanto.",
    logoLetter: "D",
    tagline: "I build things for the web & mobile.",
    shortBio:
        "I’m a Frontend Developer and UI/UX Designer with 8 years of IT experience specializing in building (and occasionally designing) exceptional digital experiences. Currently, I’m focused on building accessible, responsive, and user-centered web products using React.js and Tailwind CSS.",
    email: "ssdemo099@gmail.com",
    phone: "+6289667628681",
    whatsappUrl: "https://wa.me/6289667628681?text=Hello%20Demo%20Susanto%2C%20I%20am%20interested%20in%20discussing%20job%20opportunities%20or%20a%20project.",
    location: "Meruyung, Depok City - West Java",
    linkedin: "https://www.linkedin.com/in/demo-susanto/",
    github: "https://github.com/demosusanto",
    instagram: "https://www.instagram.com/dsusanto_/",
    cvUrl: "#",
    avatar: "/images/demosusanto.JPEG",
    recentSkills: [
        "JavaScript (ES6+)",
        "React.js & Next.js",
        "Tailwind CSS",
        "React Native",
        "Figma & Design System",
        "PHP (Phalcon)",
    ],
};

export const experiences = [
    {
        companyTab: "Indocyber (BNI)",
        companyFull: "PT Indocyber Global Teknologi",
        role: "Data Engineer",
        period: "September 2025 - February 2026",
        url: "https://www.linkedin.com/in/demo-susanto/",
        duties: [
            "Placed in PT. Bank Negara Indonesia (Persero) Tbk.'s Data Management & Analytics (DMA) Division to manage enterprise banking data pipelines.",
            "Converted complex Teradata queries into Oracle SQL queries and executed query optimization to enhance system execution speed.",
            "Performed end-to-end data migration, data validation, and fixed content data stored procedures.",
            "Created comprehensive System Integration Testing (SIT) documentation utilizing DBeaver, SQL Developer, and Oracle.",
        ],
    },
    {
        companyTab: "Movus",
        companyFull: "Movus Technologies",
        role: "UI/UX Designer & Frontend Developer",
        period: "May 2024 - September 2025",
        url: "https://mo-vus.com",
        duties: [
            "Conducted in-depth design explorations for a comprehensive revamp and implemented key frontend updates to the Movus website and landing page.",
            "Collaborated extensively with marketing teams, product managers, and researchers to align UI/UX designs with business requirements.",
            "Designed across multiple platforms including desktop, Android, iOS, mobile web, and large screens, supported by usability testing and focus group discussions (FGD).",
            "Contributed to the company's Design System using Figma, Studio Design, Adobe Illustrator, Photoshop, JavaScript, PHP, and React Native.",
        ],
    },
    {
        companyTab: "Berani Digital",
        companyFull: "Berani Digital ID",
        role: "UI/UX Designer",
        period: "July 2023 - December 2023",
        url: "https://www.linkedin.com/in/demo-susanto/",
        duties: [
            "Designed the end-to-end E-Commerce Module and integrated payment features for the UMKM Super App.",
            "Created high-fidelity UI mockups and interactive prototypes for a CMS Dashboard Detection Water App.",
            "Worked closely with Product Managers, UI/UX teams, and Web Developers using Figma, Balsamiq, Photoshop, and Illustrator.",
        ],
    },
    {
        companyTab: "Telkomsigma",
        companyFull: "PT Sigma Cipta Caraka (Telkomsel)",
        role: "Frontend Developer",
        period: "October 2018 - July 2023",
        url: "https://www.linkedin.com/in/demo-susanto/",
        duties: [
            "Collaborated with project teams under Telkomsel to design and implement user-friendly, responsive web interfaces adapted from wireframes and mockups.",
            "Developed and maintained mission-critical software solutions under Telkomsel including Hirest (hotel reservations), Pegadaian CRM, BroFIST, NSAM Tools, and Iriis (Integrated RAN Automatic Planning Tools).",
            "Engineered and maintained the M-Bike CMS Admin system, identifying and resolving bugs to ensure high performance across platforms using React.js, Tailwind CSS, and React Bootstrap.",
        ],
    },
];

export const featuredProjects = [
    {
        title: "Catat Uang — Keuangan & Budget",
        overline: "Featured Project",
        description:
            "A smart personal finance and daily budget management mobile app published on Google Play and the Apple App Store, paired with a product landing page featuring AI Input Chat, Voice Input, Receipt Scanning, and automated financial insights.",
        image: "/images/projects/catat-uang.png",
        tech: ["React.js", "Tailwind CSS", "Figma", "Google Play", "App Store"],
        github: "",
        external: "https://play.google.com/store/apps/details?id=com.catatuang.android",
    },
    {
        title: "Movus Website & Landing Page",
        overline: "Featured Project",
        description:
            "A comprehensive UI/UX revamp and frontend implementation for Movus Technologies (mo-vus.com), a car rental-to-ownership platform for online drivers. Features an interactive registration workflow, benefit highlights, FAQ, and driver stories.",
        image: "/images/projects/movus.png",
        tech: ["JavaScript", "PHP", "Figma", "Design System", "Responsive Web"],
        github: "",
        external: "https://mo-vus.com",
    },
    {
        title: "IRIIS — Telkomsel RAN Planning",
        overline: "Featured Project",
        description:
            "An enterprise telecommunication dashboard built under Telkomsel for monitoring Network Elements, Physical Sites, and Coverage Population across regions, complete with interactive maps and City Cap & PRB Utilization stacked bar charts.",
        image: "/images/projects/iriis.png",
        tech: ["React.js", "REST API", "Data Visualization", "Interactive Map", "Bootstrap"],
        github: "",
        external: "",
    },
    {
        title: "Tempat Makanku — Food Ordering UI",
        overline: "Featured Project",
        description:
            "A mobile dine-in food ordering UI/UX experience designed to simplify restaurant ordering. Includes menu discovery, customizable toppings, QR code table registration, and an intuitive split-bill checkout flow.",
        image: "/images/projects/tempat-makanku.png",
        tech: ["Figma", "UI/UX Design", "Interactive Prototype", "Mobile App"],
        github: "",
        external: "",
    },
];

export interface OtherProject {
    title: string;
    description: string;
    tech: string[];
    github: string;
    external: string;
    modalTitle: string;
    modalSubtitle: string;
    image: string;
    images: string[];
}

export const otherProjects: OtherProject[] = [
    {
        title: "BroFIST & NSAM Tools — Telkomsel",
        modalTitle: "BroFIST & NSAM Tools",
        modalSubtitle: "Developed with ReactJS & Chart.js for Telkomsel internal network traffic & fraud monitoring dashboard.",
        image: "/projects/brofist-nsam.svg",
        images: [
            "/projects/brofist-nsam.svg",
            "/projects/brofist-msisdn.svg",
        ],
        description:
            "Internal application access portal and real-time monitoring dashboard for MSISDN usage, Trend DPI Fraud Traffic charts, modem quotas, and penetration testing status tracking.",
        tech: ["React.js", "JavaScript", "Chart.js", "HTML/CSS"],
        github: "",
        external: "",
    },
    {
        title: "M-Bike CMS Admin — Telkomsel (AHM)",
        modalTitle: "M-Bike CMS Admin",
        modalSubtitle: "Developed with ReactJS & Google Maps API for Astra Honda Motor real-time fleet GPS tracking.",
        image: "/projects/mbike-cms.svg",
        images: [
            "/projects/mbike-cms.svg",
            "/projects/mbike-analytics.svg",
        ],
        description:
            "Fleet management admin dashboard for PT Astra Honda Motor featuring real-time GPS fleet mapping, active/inactive bike summaries, geofence & speed alerts, and daily/weekly utilization charts.",
        tech: ["React.js", "Maps API", "CMS Dashboard", "Tailwind"],
        github: "",
        external: "",
    },
    {
        title: "Pegadaian CRM & Customer Portal",
        modalTitle: "Pegadaian CRM & Customer Portal",
        modalSubtitle: "Developed with ReactJS & Tailwind CSS as Customer Relationship Management & Gold Portal.",
        image: "/projects/pegadaian-crm.svg",
        images: [
            "/projects/pegadaian-crm.svg",
            "/projects/pegadaian-portal.svg",
        ],
        description:
            "Agent CRM dashboard to manage incoming customer inquiries and visualize product proportions (KCA, Rahn, Mulia), alongside a customer portal for gold transactions and live chat.",
        tech: ["React.js", "Tailwind CSS", "REST API", "CRM"],
        github: "",
        external: "",
    },
    {
        title: "HIREST — Hotel Room Reservation",
        modalTitle: "Hirest CMS",
        modalSubtitle: "Developed with ReactJS as Front End for CMS Hotel.",
        image: "/projects/hirest-cms.svg",
        images: [
            "/projects/hirest-cms.svg",
            "/projects/hirest-booking.svg",
        ],
        description:
            "End-to-end hotel reservation and room management system (e.g., Bumi Ubud Hotel) featuring visual floor room status boards, guest billing management, and website template customization.",
        tech: ["React.js", "React Bootstrap", "PHP Phalcon"],
        github: "",
        external: "",
    },
    {
        title: "UMKM Super App — E-Commerce Module",
        modalTitle: "UMKM Super App",
        modalSubtitle: "Designed with Figma & Design System for Berani Digital ID local merchant digital marketplace.",
        image: "/projects/umkm-superapp.svg",
        images: [
            "/projects/umkm-superapp.svg",
            "/projects/umkm-seller.svg",
        ],
        description:
            "Designed a comprehensive E-Commerce module and seamless digital payment experience tailored for local micro, small, and medium enterprises (UMKM) at Berani Digital ID.",
        tech: ["Figma", "Balsamiq", "UI/UX", "Design System"],
        github: "",
        external: "",
    },
    {
        title: "Detection Water App — CMS Dashboard",
        modalTitle: "Detection Water App CMS",
        modalSubtitle: "Designed with Figma & Adobe Creative Suite for smart water monitoring telemetry dashboard.",
        image: "/projects/water-detection.svg",
        images: [
            "/projects/water-detection.svg",
            "/projects/water-map.svg",
        ],
        description:
            "Designed an intuitive Content Management System (CMS) and monitoring dashboard interface for a smart water detection application, focusing on clear data hierarchy.",
        tech: ["Figma", "Adobe Illustrator", "Photoshop", "Dashboard UI"],
        github: "",
        external: "",
    },
    {
        title: "BNI DMA — Teradata to Oracle Migration",
        modalTitle: "BNI DMA Migration Workbench",
        modalSubtitle: "Engineered with Oracle SQL & DBeaver for enterprise banking analytics pipeline migration.",
        image: "/projects/bni-dma.svg",
        images: [
            "/projects/bni-dma.svg",
            "/projects/bni-pipeline.svg",
        ],
        description:
            "Enterprise data migration, query conversion, and SIT documentation project within PT Bank Negara Indonesia's Data Management & Analytics division.",
        tech: ["Oracle SQL", "Teradata", "DBeaver", "SQL Developer"],
        github: "",
        external: "",
    },
];

export interface Certificate {
    id: string;
    title: string;
    issuer: string;
    date: string;
    image: string;
    description: string;
}

export const certificates: Certificate[] = [
    {
        id: "cert-komit",
        title: "Sertifikat Magang — KOMIT & Telkomsel",
        issuer: "Komunitas Masyarakat Informatika (KOMIT)",
        date: "1 April 2017",
        image: "/certificates/cert-komit-telkomsel.svg",
        description:
            "Telah menyelesaikan magang dengan sangat baik, membangun aplikasi Telkomsel Integrated Compliance Management System menggunakan PHP dan MySQL.",
    },
    {
        id: "cert-telkomsigma",
        title: "Certificate of Appreciation — Telkomsigma",
        issuer: "PT Sigma Cipta Caraka (Telkom Group)",
        date: "Juli 2023",
        image: "/certificates/cert-telkomsigma.svg",
        description:
            "Penghargaan atas dedikasi dan kontribusi pengembangan solusi enterprise: Hirest CMS, BroFIST & NSAM Tools, dan Pegadaian CRM Portal.",
    },
    {
        id: "cert-bni",
        title: "Certificate of Achievement — Bank BNI DMA",
        issuer: "PT Bank Negara Indonesia (Persero) Tbk.",
        date: "Februari 2026",
        image: "/certificates/cert-bni.svg",
        description:
            "Migrasi enterprise data pipeline, konversi query Teradata ke Oracle SQL, validasi SIT, dan optimasi performa sistem di divisi DMA BNI.",
    },
    {
        id: "cert-movus",
        title: "Product Design & Frontend Excellence — Movus",
        issuer: "Movus Technologies",
        date: "September 2025",
        image: "/certificates/cert-movus.svg",
        description:
            "Apresiasi inovasi Design System dan implementasi Frontend responsif multi-platform web & mobile app untuk ekosistem Mo-Vus.",
    },
];
