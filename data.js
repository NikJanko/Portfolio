// ============================================
// PROJECT DATA - MODULAR & EASILY EDITABLE
// ============================================

const projects = [
    // PAST PROJECTS
    {
        id: 1,
        type: 'past',
        title: 'E-Commerce Platform',
        image: 'https://via.placeholder.com/250x180?text=E-Commerce',
        summary: 'A full-stack e-commerce solution built with React and Node.js. Implemented product listing, shopping cart, and secure checkout system with Stripe integration.',
        challenges: 'Handled real-time inventory management, optimized database queries for performance, implemented secure user authentication and payment handling.',
        tools: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Redux']
    },
    {
        id: 2,
        type: 'past',
        title: 'Social Media Analytics Dashboard',
        image: 'https://via.placeholder.com/250x180?text=Analytics',
        summary: 'Built a real-time analytics dashboard that aggregates data from multiple social media platforms. Features interactive charts and customizable reports.',
        challenges: 'Managed complex data aggregation from multiple APIs, optimized rendering of large datasets, implemented WebSocket connections for real-time updates.',
        tools: ['React', 'D3.js', 'Python', 'Flask', 'PostgreSQL', 'WebSockets']
    },
    {
        id: 3,
        type: 'past',
        title: 'Mobile Travel App',
        image: 'https://via.placeholder.com/250x180?text=Travel+App',
        summary: 'Native mobile application for travel planning. Includes maps integration, flight/hotel booking, itinerary management, and offline functionality.',
        challenges: 'Optimized for performance on low-end devices, managed offline-first synchronization, handled complex geolocation features.',
        tools: ['React Native', 'Firebase', 'Google Maps API', 'Redux', 'SQLite']
    },
    {
        id: 4,
        type: 'past',
        title: 'Content Management System',
        image: 'https://via.placeholder.com/250x180?text=CMS',
        summary: 'Developed a headless CMS with a powerful editor interface. Supports multiple content types, versioning, and role-based access control.',
        challenges: 'Built custom WYSIWYG editor, implemented efficient content versioning system, managed complex permission hierarchies.',
        tools: ['Vue.js', 'GraphQL', 'Node.js', 'PostgreSQL', 'Redis']
    },

    // CURRENT PROJECTS
    {
        id: 5,
        type: 'current',
        title: 'AI-Powered Code Assistant',
        image: 'https://via.placeholder.com/250x180?text=AI+Assistant',
        summary: 'An AI code completion and refactoring tool integrated with popular IDEs. Uses machine learning to provide context-aware suggestions and automated code improvements.',
        challenges: 'Training and optimizing ML models, managing API rate limits, ensuring security and privacy of user code.',
        tools: ['TypeScript', 'Python', 'TensorFlow', 'VS Code API', 'REST API']
    },
    {
        id: 6,
        type: 'current',
        title: 'Collaborative Design Platform',
        image: 'https://via.placeholder.com/250x180?text=Design+Tool',
        summary: 'Real-time collaborative design tool similar to Figma. Multiple users can edit simultaneously with live updates and version history.',
        challenges: 'Implemented WebSocket-based real-time synchronization, built efficient collision detection for concurrent edits, optimized rendering performance.',
        tools: ['Canvas API', 'WebSockets', 'Node.js', 'MongoDB', 'React']
    },
    {
        id: 7,
        type: 'current',
        title: 'DevOps Pipeline Automation',
        image: 'https://via.placeholder.com/250x180?text=DevOps',
        summary: 'Automated CI/CD pipeline tool that streamlines deployment processes. Integrates with GitHub, Docker, and Kubernetes for seamless deployment.',
        challenges: 'Managed container orchestration, implemented secure credential handling, optimized build times.',
        tools: ['Docker', 'Kubernetes', 'GitHub Actions', 'Python', 'Jenkins']
    },
    {
        id: 8,
        type: 'current',
        title: 'Financial Dashboard',
        image: 'https://via.placeholder.com/250x180?text=Finance',
        summary: 'Interactive financial analytics dashboard for tracking investments and market trends. Real-time data updates with predictive analytics.',
        challenges: 'Handled high-frequency data updates, implemented complex financial calculations, ensured data consistency.',
        tools: ['Vue.js', 'Chart.js', 'Node.js', 'WebSockets', 'PostgreSQL']
    },

    // FUTURE PROJECTS
    {
        id: 9,
        type: 'future',
        title: 'Blockchain-Based Supply Chain',
        image: 'https://via.placeholder.com/250x180?text=Blockchain',
        summary: 'A decentralized supply chain tracking system using blockchain. Enables transparent and immutable tracking of goods from manufacturer to consumer.',
        challenges: 'Learning blockchain architecture, implementing smart contracts, designing scalable consensus mechanisms.',
        tools: ['Solidity', 'Ethereum', 'Web3.js', 'React', 'IPFS']
    },
    {
        id: 10,
        type: 'future',
        title: 'AR Shopping Experience',
        image: 'https://via.placeholder.com/250x180?text=AR',
        summary: 'Augmented reality shopping app allowing customers to visualize products in their space before purchase. Integration with e-commerce platforms.',
        challenges: 'Learning AR development, optimizing 3D model rendering, ensuring smooth AR tracking.',
        tools: ['ARCore', 'Three.js', 'React Native', 'WebGL', 'Node.js']
    },
    {
        id: 11,
        type: 'future',
        title: 'Quantum Algorithm Simulator',
        image: 'https://via.placeholder.com/250x180?text=Quantum',
        summary: 'Educational quantum computing simulator. Visualizes quantum circuits and executes quantum algorithms with detailed step-by-step explanations.',
        challenges: 'Learning quantum mechanics, implementing quantum circuit logic, creating effective visualizations.',
        tools: ['Qiskit', 'Python', 'Numpy', 'Matplotlib', 'React']
    },
    {
        id: 12,
        type: 'future',
        title: 'IoT Smart Home Hub',
        image: 'https://via.placeholder.com/250x180?text=IoT',
        summary: 'Central hub for controlling smart home devices. Unified interface for lighting, temperature, security, and energy management systems.',
        challenges: 'Managing multiple device protocols, ensuring reliability, implementing predictive automation.',
        tools: ['Python', 'MQTT', 'Node-RED', 'PostgreSQL', 'React']
    }
];

// EXPORT for use in projects.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = projects;
}
