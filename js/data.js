// ============================================
// PORTFOLIO DATA - MODULAR & EASILY EDITABLE
// ============================================

// PERSONAL INTRO DATA
const intro = {
    name: 'Nikola Jankovic',
    title: 'Full-Stack Developer & Creator',
    profileImage: 'https://via.placeholder.com/300x300?text=Your+Face',
    description: 'Hello! I\'m a passionate developer and creator. This is a brief introduction about myself, my interests, and what I\'m currently working on. I specialize in web development, software engineering, and bringing ideas to life through code.'
};

// EDUCATION DATA
const education = [
    {
        id: 1,
        title: 'Bachelor of Science (BSc)',
        subject: 'Computer Science',
        institution: 'University Name',
        duration: '2020 - 2023',
        image: 'https://via.placeholder.com/150x150?text=University',
        coursework: ['Data Structures', 'Algorithms', 'Web Development', 'Databases']
    },
    {
        id: 2,
        title: 'Master of Science (MSc)',
        subject: 'Software Engineering',
        institution: 'University Name',
        duration: '2023 - Present',
        image: 'https://via.placeholder.com/150x150?text=University',
        focus: ['Full-stack development', 'Cloud computing', 'Advanced algorithms']
    }
];

// AWARDS DATA
const awards = [
    {
        id: 1,
        title: 'Best Developer Award',
        issuer: 'Tech Conference 2023',
        image: 'https://via.placeholder.com/60x60?text=Award'
    },
    {
        id: 2,
        title: 'Dean\'s List Honor',
        issuer: 'University Name 2022',
        image: 'https://via.placeholder.com/60x60?text=Award'
    },
    {
        id: 3,
        title: 'Scholarship Excellence',
        issuer: 'Education Board 2020',
        image: 'https://via.placeholder.com/60x60?text=Award'
    }
];

// SOCIAL MEDIA & CONTACT LINKS
const socialLinks = [
    {
        id: 1,
        platform: 'LinkedIn',
        url: 'https://linkedin.com',
        image: 'https://via.placeholder.com/80x80?text=LinkedIn'
    },
    {
        id: 2,
        platform: 'GitHub',
        url: 'https://github.com',
        image: 'https://via.placeholder.com/80x80?text=GitHub'
    },
    {
        id: 3,
        platform: 'WakaTime',
        url: 'https://wakatime.com',
        image: 'https://via.placeholder.com/80x80?text=WakaTime'
    }
];

// PROJECT DATA
const projects = [
    // PAST PROJECTS
    {
        id: 1,
        type: 'past',
        title: 'E-Commerce Platform',
        image: 'https://via.placeholder.com/250x180?text=E-Commerce',
        summary: 'A full-stack e-commerce solution built with React and Node.js. Implemented product listing, shopping cart, and secure checkout system with Stripe integration.',
        cardSummary: 'Full-stack online store with cart, checkout, and secure payments.',
        challenges: 'Handled real-time inventory management, optimized database queries for performance, implemented secure user authentication and payment handling.',
        tools: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Redux'],
        link: 'https://example.com/ecommerce-platform'
    },
    {
        id: 2,
        type: 'past',
        title: 'Social Media Analytics Dashboard',
        image: 'https://via.placeholder.com/250x180?text=Analytics',
        summary: 'Built a real-time analytics dashboard that aggregates data from multiple social media platforms. Features interactive charts and customizable reports.',
        cardSummary: 'Real-time social analytics dashboard with interactive reporting.',
        challenges: 'Managed complex data aggregation from multiple APIs, optimized rendering of large datasets, implemented WebSocket connections for real-time updates.',
        tools: ['React', 'D3.js', 'Python', 'Flask', 'PostgreSQL', 'WebSockets'],
        link: 'https://example.com/analytics-dashboard'
    },
    {
        id: 3,
        type: 'past',
        title: 'Mobile Travel App',
        image: 'https://via.placeholder.com/250x180?text=Travel+App',
        summary: 'Native mobile application for travel planning. Includes maps integration, flight/hotel booking, itinerary management, and offline functionality.',
        cardSummary: 'Travel planner app with bookings, maps, and offline itineraries.',
        challenges: 'Optimized for performance on low-end devices, managed offline-first synchronization, handled complex geolocation features.',
        tools: ['React Native', 'Firebase', 'Google Maps API', 'Redux', 'SQLite'],
        link: 'https://example.com/travel-app'
    },
    {
        id: 4,
        type: 'past',
        title: 'Content Management System',
        image: 'https://via.placeholder.com/250x180?text=CMS',
        summary: 'Developed a headless CMS with a powerful editor interface. Supports multiple content types, versioning, and role-based access control.',
        cardSummary: 'Headless CMS with versioning and role-based content control.',
        challenges: 'Built custom WYSIWYG editor, implemented efficient content versioning system, managed complex permission hierarchies.',
        tools: ['Vue.js', 'GraphQL', 'Node.js', 'PostgreSQL', 'Redis'],
        link: 'https://example.com/cms-platform'
    },

    // PRESENT PROJECTS
    {
        id: 5,
        type: 'present',
        title: 'AI-Powered Code Assistant',
        image: 'https://via.placeholder.com/250x180?text=AI+Assistant',
        summary: 'An AI code completion and refactoring tool integrated with popular IDEs. Uses machine learning to provide context-aware suggestions and automated code improvements.',
        cardSummary: 'AI coding assistant for smart completion and refactoring in IDEs.',
        challenges: 'Training and optimizing ML models, managing API rate limits, ensuring security and privacy of user code.',
        tools: ['TypeScript', 'Python', 'TensorFlow', 'VS Code API', 'REST API'],
        link: 'https://example.com/ai-code-assistant'
    },
    {
        id: 6,
        type: 'present',
        title: 'Collaborative Design Platform',
        image: 'https://via.placeholder.com/250x180?text=Design+Tool',
        summary: 'Real-time collaborative design tool similar to Figma. Multiple users can edit simultaneously with live updates and version history.',
        cardSummary: 'Collaborative design workspace with live multi-user editing.',
        challenges: 'Implemented WebSocket-based real-time synchronization, built efficient collision detection for concurrent edits, optimized rendering performance.',
        tools: ['Canvas API', 'WebSockets', 'Node.js', 'MongoDB', 'React'],
        link: 'https://example.com/design-platform'
    },
    {
        id: 7,
        type: 'present',
        title: 'DevOps Pipeline Automation',
        image: 'https://via.placeholder.com/250x180?text=DevOps',
        summary: 'Automated CI/CD pipeline tool that streamlines deployment processes. Integrates with GitHub, Docker, and Kubernetes for seamless deployment.',
        cardSummary: 'CI/CD automation platform for faster and safer deployments.',
        challenges: 'Managed container orchestration, implemented secure credential handling, optimized build times.',
        tools: ['Docker', 'Kubernetes', 'GitHub Actions', 'Python', 'Jenkins'],
        link: 'https://example.com/devops-automation'
    },
    {
        id: 8,
        type: 'present',
        title: 'Financial Dashboard',
        image: 'https://via.placeholder.com/250x180?text=Finance',
        summary: 'Interactive financial analytics dashboard for tracking investments and market trends. Real-time data updates with predictive analytics.',
        cardSummary: 'Financial insights dashboard with live market updates.',
        challenges: 'Handled high-frequency data updates, implemented complex financial calculations, ensured data consistency.',
        tools: ['Vue.js', 'Chart.js', 'Node.js', 'WebSockets', 'PostgreSQL'],
        link: 'https://example.com/financial-dashboard'
    },

    // FUTURE PROJECTS
    {
        id: 9,
        type: 'future',
        title: 'Blockchain-Based Supply Chain',
        image: 'https://via.placeholder.com/250x180?text=Blockchain',
        summary: 'A decentralized supply chain tracking system using blockchain. Enables transparent and immutable tracking of goods from manufacturer to consumer.',
        cardSummary: 'Blockchain traceability system for end-to-end supply chains.',
        challenges: 'Learning blockchain architecture, implementing smart contracts, designing scalable consensus mechanisms.',
        tools: ['Solidity', 'Ethereum', 'Web3.js', 'React', 'IPFS'],
        link: 'https://example.com/blockchain-supply-chain'
    },
    {
        id: 10,
        type: 'future',
        title: 'AR Shopping Experience',
        image: 'https://via.placeholder.com/250x180?text=AR',
        summary: 'Augmented reality shopping app allowing customers to visualize products in their space before purchase. Integration with e-commerce platforms.',
        cardSummary: 'AR commerce app to preview products in real-world spaces.',
        challenges: 'Learning AR development, optimizing 3D model rendering, ensuring smooth AR tracking.',
        tools: ['ARCore', 'Three.js', 'React Native', 'WebGL', 'Node.js'],
        link: 'https://example.com/ar-shopping'
    },
    {
        id: 11,
        type: 'future',
        title: 'Quantum Algorithm Simulator',
        image: 'https://via.placeholder.com/250x180?text=Quantum',
        summary: 'Educational quantum computing simulator. Visualizes quantum circuits and executes quantum algorithms with detailed step-by-step explanations.',
        cardSummary: 'Quantum circuit simulator for learning and experimentation.',
        challenges: 'Learning quantum mechanics, implementing quantum circuit logic, creating effective visualizations.',
        tools: ['Qiskit', 'Python', 'Numpy', 'Matplotlib', 'React'],
        link: 'https://example.com/quantum-simulator'
    },
    {
        id: 12,
        type: 'future',
        title: 'IoT Smart Home Hub',
        image: 'https://via.placeholder.com/250x180?text=IoT',
        summary: 'Central hub for controlling smart home devices. Unified interface for lighting, temperature, security, and energy management systems.',
        cardSummary: 'Unified dashboard for smart home automation and monitoring.',
        challenges: 'Managing multiple device protocols, ensuring reliability, implementing predictive automation.',
        tools: ['Python', 'MQTT', 'Node-RED', 'PostgreSQL', 'React'],
        link: 'https://example.com/iot-smart-home'
    }
];

// EXPORT for use in projects.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = projects;
}
