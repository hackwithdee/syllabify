export interface RoadmapResource {
  title: string;
  url: string;
  type: 'primary' | 'alternative';
}

export interface RoadmapStep {
  title: string;
  description: string;
  howToLearn: string;
  outcome: string;
  resources: RoadmapResource[];
}

export interface RoadmapPhase {
  id: string;
  label: string;
  emoji: string;
  steps: RoadmapStep[];
}

export interface RoadmapTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  keywords: string[];
  phases: RoadmapPhase[];
}

export const roadmapTemplates: RoadmapTemplate[] = [
  {
    id: 'python',
    name: 'Python Developer',
    icon: '🐍',
    description: 'From basics to professional Python development',
    keywords: ['python', 'django', 'flask', 'scripting'],
    phases: [
      {
        id: 'foundation', label: 'Foundation', emoji: '🏗️',
        steps: [
          {
            title: 'Python Syntax & Data Types',
            description: 'Variables, strings, numbers, lists, tuples, dictionaries, and sets',
            howToLearn: 'Follow an interactive Python tutorial. Write small scripts to practice each data type. Complete coding challenges daily.',
            outcome: 'You can write basic Python scripts, manipulate data structures, and understand type conversions.',
            resources: [
              { title: 'Python Official Tutorial', url: 'https://docs.python.org/3/tutorial/', type: 'primary' },
              { title: 'W3Schools Python', url: 'https://www.w3schools.com/python/', type: 'alternative' },
              { title: 'Automate the Boring Stuff', url: 'https://automatetheboringstuff.com/', type: 'alternative' },
            ],
          },
          {
            title: 'Control Flow & Functions',
            description: 'If/else, loops, functions, scope, and error handling',
            howToLearn: 'Build small programs using conditionals and loops. Write reusable functions. Practice try/except error handling.',
            outcome: 'You can write structured programs with proper control flow, reusable functions, and robust error handling.',
            resources: [
              { title: 'Real Python - Functions', url: 'https://realpython.com/defining-your-own-python-function/', type: 'primary' },
              { title: 'Python Crash Course (book)', url: 'https://nostarch.com/python-crash-course-3rd-edition', type: 'alternative' },
            ],
          },
          {
            title: 'File I/O & Modules',
            description: 'Reading/writing files, importing modules, pip packages',
            howToLearn: 'Create scripts that read CSV/JSON files. Learn to use pip and virtual environments. Explore the standard library.',
            outcome: 'You can read/write files, manage dependencies, and use third-party packages.',
            resources: [
              { title: 'Real Python - File I/O', url: 'https://realpython.com/read-write-files-python/', type: 'primary' },
              { title: 'Python Packaging Guide', url: 'https://packaging.python.org/', type: 'alternative' },
            ],
          },
        ],
      },
      {
        id: 'core', label: 'Core Skills', emoji: '⚙️',
        steps: [
          {
            title: 'Object-Oriented Programming',
            description: 'Classes, inheritance, polymorphism, encapsulation',
            howToLearn: 'Build a small project using classes (e.g., a library system). Practice inheritance patterns. Implement magic methods.',
            outcome: 'You can design and build applications using OOP principles and design patterns.',
            resources: [
              { title: 'Real Python - OOP', url: 'https://realpython.com/python3-object-oriented-programming/', type: 'primary' },
              { title: 'Corey Schafer OOP Videos', url: 'https://www.youtube.com/watch?v=ZDa-Z5JzLYM', type: 'alternative' },
            ],
          },
          {
            title: 'Data Structures & Algorithms',
            description: 'Lists, stacks, queues, trees, sorting, searching',
            howToLearn: 'Implement common data structures from scratch. Solve algorithm problems on LeetCode or HackerRank daily.',
            outcome: 'You can implement and use common data structures, analyze time complexity, and solve algorithmic problems.',
            resources: [
              { title: 'LeetCode Python', url: 'https://leetcode.com/problemset/', type: 'primary' },
              { title: 'NeetCode Roadmap', url: 'https://neetcode.io/roadmap', type: 'alternative' },
            ],
          },
        ],
      },
      {
        id: 'intermediate', label: 'Intermediate', emoji: '📈',
        steps: [
          {
            title: 'Libraries: NumPy & Pandas',
            description: 'Data manipulation, analysis, and scientific computing',
            howToLearn: 'Work through the Pandas documentation examples. Analyze a real dataset (Kaggle). Build data cleaning pipelines.',
            outcome: 'You can load, clean, transform, and analyze datasets using NumPy and Pandas.',
            resources: [
              { title: 'Kaggle Pandas Course', url: 'https://www.kaggle.com/learn/pandas', type: 'primary' },
              { title: 'NumPy Documentation', url: 'https://numpy.org/doc/stable/user/quickstart.html', type: 'alternative' },
            ],
          },
          {
            title: 'Web Development with Flask/Django',
            description: 'Building web applications and REST APIs',
            howToLearn: 'Build a simple blog or TODO app with Flask. Then try Django for a more complex project. Deploy to a cloud platform.',
            outcome: 'You can build and deploy full-stack web applications with Python.',
            resources: [
              { title: 'Flask Mega Tutorial', url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world', type: 'primary' },
              { title: 'Django Official Tutorial', url: 'https://docs.djangoproject.com/en/stable/intro/tutorial01/', type: 'alternative' },
            ],
          },
        ],
      },
      {
        id: 'advanced', label: 'Advanced', emoji: '🚀',
        steps: [
          {
            title: 'Testing & Best Practices',
            description: 'Unit tests, CI/CD, code quality, linting',
            howToLearn: 'Write tests with pytest for an existing project. Set up GitHub Actions for CI. Use flake8 and black for code quality.',
            outcome: 'You can write comprehensive tests, maintain code quality, and set up automated CI/CD pipelines.',
            resources: [
              { title: 'Real Python - Pytest', url: 'https://realpython.com/pytest-python-testing/', type: 'primary' },
              { title: 'GitHub Actions Docs', url: 'https://docs.github.com/en/actions', type: 'alternative' },
            ],
          },
        ],
      },
      {
        id: 'certification', label: 'Career Prep', emoji: '🎓',
        steps: [
          {
            title: 'PCEP/PCAP Certification Prep',
            description: 'Official Python certification exam preparation',
            howToLearn: 'Review exam objectives. Take practice exams. Focus on weak areas. Study the official exam guide.',
            outcome: 'You are ready to take and pass the PCEP or PCAP certification exam.',
            resources: [
              { title: 'Python Institute PCEP', url: 'https://pythoninstitute.org/pcep', type: 'primary' },
              { title: 'PCAP Practice Tests', url: 'https://pythoninstitute.org/pcap', type: 'alternative' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend Developer',
    icon: '🌐',
    description: 'Master modern frontend web development',
    keywords: ['frontend', 'front-end', 'web', 'react', 'javascript', 'html', 'css'],
    phases: [
      {
        id: 'foundation', label: 'Foundation', emoji: '🏗️',
        steps: [
          {
            title: 'HTML & Semantic Markup',
            description: 'HTML5 elements, forms, accessibility, SEO basics',
            howToLearn: 'Build 5 different web pages focusing on semantic HTML. Use accessibility tools to audit your pages.',
            outcome: 'You can create well-structured, accessible, SEO-friendly HTML documents.',
            resources: [
              { title: 'MDN HTML Guide', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', type: 'primary' },
              { title: 'freeCodeCamp HTML', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', type: 'alternative' },
            ],
          },
          {
            title: 'CSS & Modern Layouts',
            description: 'Flexbox, Grid, responsive design, animations',
            howToLearn: 'Complete CSS challenges on Frontend Mentor. Build responsive layouts with Flexbox and Grid. Learn CSS variables.',
            outcome: 'You can create beautiful, responsive layouts that work across all device sizes.',
            resources: [
              { title: 'CSS Tricks - Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', type: 'primary' },
              { title: 'Frontend Mentor', url: 'https://www.frontendmentor.io/', type: 'alternative' },
            ],
          },
          {
            title: 'JavaScript Fundamentals',
            description: 'Variables, functions, DOM manipulation, async/await',
            howToLearn: 'Follow JavaScript.info tutorial. Build interactive components. Practice on Codewars.',
            outcome: 'You can write JavaScript to create interactive web pages and handle asynchronous operations.',
            resources: [
              { title: 'JavaScript.info', url: 'https://javascript.info/', type: 'primary' },
              { title: 'Eloquent JavaScript', url: 'https://eloquentjavascript.net/', type: 'alternative' },
            ],
          },
        ],
      },
      {
        id: 'core', label: 'Core Skills', emoji: '⚙️',
        steps: [
          {
            title: 'React Fundamentals',
            description: 'Components, props, state, hooks, lifecycle',
            howToLearn: 'Build a task manager app with React. Learn useState, useEffect, and custom hooks. Practice component composition.',
            outcome: 'You can build interactive single-page applications with React.',
            resources: [
              { title: 'React Official Docs', url: 'https://react.dev/learn', type: 'primary' },
              { title: 'Scrimba React Course', url: 'https://scrimba.com/learn/learnreact', type: 'alternative' },
            ],
          },
          {
            title: 'TypeScript',
            description: 'Types, interfaces, generics, utility types',
            howToLearn: 'Convert a JavaScript project to TypeScript. Practice typing components and hooks. Learn generics.',
            outcome: 'You can write type-safe code that catches errors at compile time.',
            resources: [
              { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/', type: 'primary' },
              { title: 'Total TypeScript', url: 'https://www.totaltypescript.com/', type: 'alternative' },
            ],
          },
        ],
      },
      {
        id: 'intermediate', label: 'Intermediate', emoji: '📈',
        steps: [
          {
            title: 'State Management & APIs',
            description: 'React Query, Zustand, REST APIs, data fetching',
            howToLearn: 'Build an app that fetches data from a public API. Implement caching with React Query. Add global state.',
            outcome: 'You can manage complex application state and integrate with backend APIs.',
            resources: [
              { title: 'TanStack Query Docs', url: 'https://tanstack.com/query/latest', type: 'primary' },
              { title: 'Zustand GitHub', url: 'https://github.com/pmndrs/zustand', type: 'alternative' },
            ],
          },
          {
            title: 'Testing & Performance',
            description: 'Vitest, React Testing Library, performance optimization',
            howToLearn: 'Write unit tests for components. Test user interactions. Profile and optimize rendering performance.',
            outcome: 'You can write reliable tests and optimize application performance.',
            resources: [
              { title: 'Testing Library Docs', url: 'https://testing-library.com/docs/react-testing-library/intro/', type: 'primary' },
              { title: 'Vitest Documentation', url: 'https://vitest.dev/', type: 'alternative' },
            ],
          },
        ],
      },
      {
        id: 'advanced', label: 'Advanced', emoji: '🚀',
        steps: [
          {
            title: 'Full-Stack & Deployment',
            description: 'Backend integration, CI/CD, deployment pipelines',
            howToLearn: 'Deploy a full-stack app to Vercel/Netlify. Set up CI/CD with GitHub Actions. Learn Docker basics.',
            outcome: 'You can deploy production-ready applications with automated pipelines.',
            resources: [
              { title: 'Vercel Docs', url: 'https://vercel.com/docs', type: 'primary' },
              { title: 'Docker Getting Started', url: 'https://docs.docker.com/get-started/', type: 'alternative' },
            ],
          },
        ],
      },
      {
        id: 'certification', label: 'Career Prep', emoji: '🎓',
        steps: [
          {
            title: 'Portfolio & Interview Prep',
            description: 'Build portfolio, practice coding interviews, system design',
            howToLearn: 'Create 3-5 portfolio projects. Practice frontend interview questions. Study system design for frontend.',
            outcome: 'You are ready to apply for frontend developer positions with a strong portfolio.',
            resources: [
              { title: 'Frontend Interview Handbook', url: 'https://www.frontendinterviewhandbook.com/', type: 'primary' },
              { title: 'GreatFrontEnd', url: 'https://www.greatfrontend.com/', type: 'alternative' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    icon: '📊',
    description: 'Learn data analysis from spreadsheets to Python',
    keywords: ['data', 'analyst', 'analytics', 'excel', 'sql', 'tableau', 'power bi'],
    phases: [
      {
        id: 'foundation', label: 'Foundation', emoji: '🏗️',
        steps: [
          {
            title: 'Excel & Spreadsheets',
            description: 'Formulas, pivot tables, charts, data cleaning',
            howToLearn: 'Complete Excel exercises with real datasets. Master VLOOKUP, pivot tables, and conditional formatting.',
            outcome: 'You can analyze and visualize data efficiently using spreadsheets.',
            resources: [
              { title: 'Excel Easy Tutorial', url: 'https://www.excel-easy.com/', type: 'primary' },
              { title: 'Google Sheets Training', url: 'https://support.google.com/a/users/answer/9282959', type: 'alternative' },
            ],
          },
          {
            title: 'SQL Fundamentals',
            description: 'SELECT, JOIN, GROUP BY, subqueries, window functions',
            howToLearn: 'Practice SQL on SQLBolt and LeetCode. Build queries against a sample database. Learn window functions.',
            outcome: 'You can write complex SQL queries to extract and analyze data from relational databases.',
            resources: [
              { title: 'SQLBolt', url: 'https://sqlbolt.com/', type: 'primary' },
              { title: 'Mode SQL Tutorial', url: 'https://mode.com/sql-tutorial/', type: 'alternative' },
            ],
          },
        ],
      },
      {
        id: 'core', label: 'Core Skills', emoji: '⚙️',
        steps: [
          {
            title: 'Python for Data Analysis',
            description: 'Pandas, NumPy, data cleaning, exploratory analysis',
            howToLearn: 'Analyze Kaggle datasets with Pandas. Practice data cleaning techniques. Build Jupyter notebooks.',
            outcome: 'You can load, clean, and analyze large datasets using Python.',
            resources: [
              { title: 'Kaggle Python Course', url: 'https://www.kaggle.com/learn/python', type: 'primary' },
              { title: 'Python for Data Analysis (book)', url: 'https://wesmckinney.com/book/', type: 'alternative' },
            ],
          },
          {
            title: 'Statistics & Probability',
            description: 'Descriptive stats, distributions, hypothesis testing',
            howToLearn: 'Study statistics through Khan Academy. Apply concepts to real data. Practice hypothesis testing.',
            outcome: 'You can apply statistical methods to draw insights and make data-driven decisions.',
            resources: [
              { title: 'Khan Academy Statistics', url: 'https://www.khanacademy.org/math/statistics-probability', type: 'primary' },
              { title: 'StatQuest YouTube', url: 'https://www.youtube.com/c/joshstarmer', type: 'alternative' },
            ],
          },
        ],
      },
      {
        id: 'intermediate', label: 'Intermediate', emoji: '📈',
        steps: [
          {
            title: 'Data Visualization',
            description: 'Matplotlib, Seaborn, Tableau, storytelling with data',
            howToLearn: 'Create visualizations for 3 different datasets. Build a Tableau dashboard. Learn color theory for charts.',
            outcome: 'You can create compelling data visualizations that tell a clear story.',
            resources: [
              { title: 'Tableau Public Training', url: 'https://public.tableau.com/app/learn', type: 'primary' },
              { title: 'Storytelling with Data', url: 'https://www.storytellingwithdata.com/', type: 'alternative' },
            ],
          },
        ],
      },
      {
        id: 'advanced', label: 'Advanced', emoji: '🚀',
        steps: [
          {
            title: 'Advanced Analytics & ML Basics',
            description: 'Regression, clustering, forecasting, A/B testing',
            howToLearn: 'Build predictive models with scikit-learn. Run A/B test analyses. Practice on real business datasets.',
            outcome: 'You can apply machine learning techniques and advanced analytics to solve business problems.',
            resources: [
              { title: 'Kaggle ML Course', url: 'https://www.kaggle.com/learn/intro-to-machine-learning', type: 'primary' },
              { title: 'Google Data Analytics Certificate', url: 'https://grow.google/certificates/data-analytics/', type: 'alternative' },
            ],
          },
        ],
      },
      {
        id: 'certification', label: 'Career Prep', emoji: '🎓',
        steps: [
          {
            title: 'Portfolio & Certification',
            description: 'Build portfolio projects and prepare for certifications',
            howToLearn: 'Complete 3 end-to-end data analysis projects. Get Google Data Analytics or IBM Data Analyst certification.',
            outcome: 'You are ready to apply for data analyst positions with a strong portfolio and certifications.',
            resources: [
              { title: 'Google Data Analytics Cert', url: 'https://grow.google/certificates/data-analytics/', type: 'primary' },
              { title: 'DataCamp', url: 'https://www.datacamp.com/', type: 'alternative' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cloud-engineer',
    name: 'Cloud Engineer',
    icon: '☁️',
    description: 'Master cloud computing and DevOps fundamentals',
    keywords: ['cloud', 'aws', 'azure', 'gcp', 'devops', 'infrastructure'],
    phases: [
      {
        id: 'foundation', label: 'Foundation', emoji: '🏗️',
        steps: [
          {
            title: 'Cloud Computing Concepts',
            description: 'IaaS, PaaS, SaaS, deployment models, virtualization',
            howToLearn: 'Study cloud computing models. Compare AWS, Azure, and GCP. Understand the shared responsibility model.',
            outcome: 'You understand cloud computing fundamentals and can explain different service and deployment models.',
            resources: [
              { title: 'AWS Cloud Practitioner Essentials', url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/', type: 'primary' },
              { title: 'Azure Fundamentals', url: 'https://learn.microsoft.com/en-us/certifications/azure-fundamentals/', type: 'alternative' },
            ],
          },
          {
            title: 'Linux & Networking Basics',
            description: 'Linux commands, networking protocols, SSH, DNS',
            howToLearn: 'Set up a Linux VM. Practice CLI commands daily. Learn TCP/IP, DNS, and HTTP protocols.',
            outcome: 'You can navigate Linux systems and understand networking fundamentals for cloud environments.',
            resources: [
              { title: 'Linux Journey', url: 'https://linuxjourney.com/', type: 'primary' },
              { title: 'Networking Fundamentals', url: 'https://www.youtube.com/playlist?list=PLDQaRcbiSnqF5U8ffMgZzS7fq1rHUI3Q8', type: 'alternative' },
            ],
          },
        ],
      },
      {
        id: 'core', label: 'Core Skills', emoji: '⚙️',
        steps: [
          {
            title: 'Core Cloud Services',
            description: 'Compute (EC2/VMs), storage (S3), databases (RDS), networking (VPC)',
            howToLearn: 'Create resources in AWS free tier. Build a web app architecture. Practice with hands-on labs.',
            outcome: 'You can provision and manage core cloud resources for web applications.',
            resources: [
              { title: 'AWS Free Tier', url: 'https://aws.amazon.com/free/', type: 'primary' },
              { title: 'A Cloud Guru', url: 'https://acloudguru.com/', type: 'alternative' },
            ],
          },
        ],
      },
      {
        id: 'intermediate', label: 'Intermediate', emoji: '📈',
        steps: [
          {
            title: 'Infrastructure as Code',
            description: 'Terraform, CloudFormation, automated provisioning',
            howToLearn: 'Define infrastructure using Terraform. Automate deployments. Learn state management and modules.',
            outcome: 'You can define and manage cloud infrastructure using code, enabling reproducible deployments.',
            resources: [
              { title: 'Terraform Tutorials', url: 'https://developer.hashicorp.com/terraform/tutorials', type: 'primary' },
              { title: 'AWS CloudFormation Docs', url: 'https://docs.aws.amazon.com/cloudformation/', type: 'alternative' },
            ],
          },
          {
            title: 'Containers & Orchestration',
            description: 'Docker, Kubernetes, container registries',
            howToLearn: 'Containerize an application with Docker. Deploy to Kubernetes. Learn Helm charts and service meshes.',
            outcome: 'You can containerize applications and orchestrate them at scale using Kubernetes.',
            resources: [
              { title: 'Docker Getting Started', url: 'https://docs.docker.com/get-started/', type: 'primary' },
              { title: 'Kubernetes Docs', url: 'https://kubernetes.io/docs/tutorials/', type: 'alternative' },
            ],
          },
        ],
      },
      {
        id: 'advanced', label: 'Advanced', emoji: '🚀',
        steps: [
          {
            title: 'CI/CD & Monitoring',
            description: 'Jenkins, GitHub Actions, CloudWatch, observability',
            howToLearn: 'Set up a CI/CD pipeline. Implement monitoring and alerting. Learn log aggregation and tracing.',
            outcome: 'You can build automated deployment pipelines and implement comprehensive monitoring solutions.',
            resources: [
              { title: 'GitHub Actions Docs', url: 'https://docs.github.com/en/actions', type: 'primary' },
              { title: 'Prometheus + Grafana', url: 'https://prometheus.io/docs/introduction/overview/', type: 'alternative' },
            ],
          },
        ],
      },
      {
        id: 'certification', label: 'Career Prep', emoji: '🎓',
        steps: [
          {
            title: 'AWS/Azure Certification',
            description: 'Cloud Practitioner, Solutions Architect, or AZ-900',
            howToLearn: 'Study exam guides. Take practice exams. Focus on weak areas. Join study groups.',
            outcome: 'You are certified and ready for cloud engineering roles.',
            resources: [
              { title: 'AWS Certification', url: 'https://aws.amazon.com/certification/', type: 'primary' },
              { title: 'Azure Certifications', url: 'https://learn.microsoft.com/en-us/certifications/', type: 'alternative' },
            ],
          },
        ],
      },
    ],
  },
];

export function findTemplateForGoal(goal: string): RoadmapTemplate | null {
  const g = goal.toLowerCase();
  for (const tmpl of roadmapTemplates) {
    if (tmpl.keywords.some(k => g.includes(k))) return tmpl;
  }
  return null;
}
