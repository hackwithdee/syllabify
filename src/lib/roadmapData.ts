export interface CertificationPath {
  id: string;
  name: string;
  icon: string;
  description: string;
  stages: { title: string; description: string; phase: 'foundation' | 'intermediate' | 'advanced' | 'certification' }[];
}

export const certificationPaths: CertificationPath[] = [
  {
    id: 'python',
    name: 'Python Developer',
    icon: '🐍',
    description: 'From basics to professional Python development',
    stages: [
      { title: 'Python Syntax & Data Types', description: 'Variables, strings, lists, dictionaries, loops', phase: 'foundation' },
      { title: 'Functions & Modules', description: 'Writing reusable code, importing modules', phase: 'foundation' },
      { title: 'File I/O & Error Handling', description: 'Reading/writing files, try/except', phase: 'foundation' },
      { title: 'OOP in Python', description: 'Classes, inheritance, polymorphism', phase: 'intermediate' },
      { title: 'Libraries: NumPy, Pandas', description: 'Data manipulation and analysis', phase: 'intermediate' },
      { title: 'Web Development with Flask/Django', description: 'Building web applications', phase: 'advanced' },
      { title: 'Testing & Best Practices', description: 'Unit tests, code quality, CI/CD', phase: 'advanced' },
      { title: 'PCEP/PCAP Certification Prep', description: 'Official Python certification exam prep', phase: 'certification' },
    ],
  },
  {
    id: 'aws-cloud',
    name: 'AWS Cloud Practitioner',
    icon: '☁️',
    description: 'Cloud fundamentals and AWS certification',
    stages: [
      { title: 'Cloud Computing Concepts', description: 'IaaS, PaaS, SaaS, deployment models', phase: 'foundation' },
      { title: 'AWS Global Infrastructure', description: 'Regions, AZs, Edge Locations', phase: 'foundation' },
      { title: 'Core AWS Services', description: 'EC2, S3, RDS, VPC, IAM', phase: 'intermediate' },
      { title: 'Security & Compliance', description: 'Shared responsibility, encryption, compliance', phase: 'intermediate' },
      { title: 'Billing & Pricing', description: 'Cost management, pricing models, budgets', phase: 'advanced' },
      { title: 'Architecture Best Practices', description: 'Well-Architected Framework pillars', phase: 'advanced' },
      { title: 'AWS Cloud Practitioner Exam', description: 'CLF-C02 certification preparation', phase: 'certification' },
    ],
  },
  {
    id: 'comptia-security',
    name: 'CompTIA Security+',
    icon: '🔒',
    description: 'Cybersecurity fundamentals and certification',
    stages: [
      { title: 'Security Fundamentals', description: 'CIA triad, threat landscape, security controls', phase: 'foundation' },
      { title: 'Network Security', description: 'Firewalls, IDS/IPS, VPN, protocols', phase: 'foundation' },
      { title: 'Identity & Access Management', description: 'Authentication, authorization, MFA', phase: 'intermediate' },
      { title: 'Cryptography', description: 'Encryption, hashing, PKI, certificates', phase: 'intermediate' },
      { title: 'Threat Detection & Response', description: 'SIEM, incident response, forensics', phase: 'advanced' },
      { title: 'Risk Management & Compliance', description: 'Frameworks, policies, governance', phase: 'advanced' },
      { title: 'Security+ SY0-701 Exam Prep', description: 'Official CompTIA certification preparation', phase: 'certification' },
    ],
  },
];
