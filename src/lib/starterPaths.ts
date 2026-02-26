export interface StarterResource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'tutorial';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface StarterPath {
  id: string;
  name: string;
  description: string;
  icon: string;
  resources: StarterResource[];
}

export const starterPaths: StarterPath[] = [
  {
    id: 'web-dev',
    name: 'Web Development',
    description: 'HTML, CSS, JavaScript and modern frameworks',
    icon: '🌐',
    resources: [
      { title: 'MDN Web Docs — HTML Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', type: 'article', difficulty: 'Beginner' },
      { title: 'CSS Tricks — Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', type: 'article', difficulty: 'Beginner' },
      { title: 'JavaScript.info — The Modern Tutorial', url: 'https://javascript.info/', type: 'tutorial', difficulty: 'Beginner' },
      { title: 'React Official Tutorial', url: 'https://react.dev/learn', type: 'tutorial', difficulty: 'Intermediate' },
      { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', type: 'article', difficulty: 'Intermediate' },
      { title: 'Full Stack Open Course', url: 'https://fullstackopen.com/en/', type: 'course', difficulty: 'Advanced' },
    ],
  },
  {
    id: 'data-science',
    name: 'Data Science',
    description: 'Python, statistics, ML and data analysis',
    icon: '📊',
    resources: [
      { title: 'Python for Everybody', url: 'https://www.py4e.com/', type: 'course', difficulty: 'Beginner' },
      { title: 'Khan Academy — Statistics & Probability', url: 'https://www.khanacademy.org/math/statistics-probability', type: 'course', difficulty: 'Beginner' },
      { title: 'Kaggle Learn — Pandas', url: 'https://www.kaggle.com/learn/pandas', type: 'tutorial', difficulty: 'Intermediate' },
      { title: 'Scikit-Learn Documentation', url: 'https://scikit-learn.org/stable/tutorial/', type: 'tutorial', difficulty: 'Intermediate' },
      { title: 'Fast.ai — Practical Deep Learning', url: 'https://course.fast.ai/', type: 'course', difficulty: 'Advanced' },
    ],
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Design',
    description: 'Design principles, Figma, and user research',
    icon: '🎨',
    resources: [
      { title: 'Google UX Design Certificate', url: 'https://grow.google/certificates/ux-design/', type: 'course', difficulty: 'Beginner' },
      { title: 'Laws of UX', url: 'https://lawsofux.com/', type: 'article', difficulty: 'Beginner' },
      { title: 'Figma Tutorial for Beginners', url: 'https://help.figma.com/hc/en-us/categories/360002051613', type: 'tutorial', difficulty: 'Intermediate' },
      { title: 'Refactoring UI (Book)', url: 'https://www.refactoringui.com/', type: 'course', difficulty: 'Advanced' },
    ],
  },
  {
    id: 'mobile-dev',
    name: 'Mobile Development',
    description: 'React Native, Flutter, and mobile patterns',
    icon: '📱',
    resources: [
      { title: 'React Native Official Docs', url: 'https://reactnative.dev/docs/getting-started', type: 'tutorial', difficulty: 'Beginner' },
      { title: 'Flutter Codelabs', url: 'https://docs.flutter.dev/codelabs', type: 'tutorial', difficulty: 'Beginner' },
      { title: 'Expo Tutorial', url: 'https://docs.expo.dev/tutorial/introduction/', type: 'tutorial', difficulty: 'Intermediate' },
      { title: 'Advanced React Native Patterns', url: 'https://reactnative.dev/docs/performance', type: 'article', difficulty: 'Advanced' },
    ],
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    description: 'Docker, CI/CD, AWS, and infrastructure',
    icon: '☁️',
    resources: [
      { title: 'Docker Getting Started', url: 'https://docs.docker.com/get-started/', type: 'tutorial', difficulty: 'Beginner' },
      { title: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions', type: 'article', difficulty: 'Beginner' },
      { title: 'AWS Cloud Practitioner Essentials', url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/', type: 'course', difficulty: 'Intermediate' },
      { title: 'Kubernetes Official Tutorial', url: 'https://kubernetes.io/docs/tutorials/', type: 'tutorial', difficulty: 'Advanced' },
    ],
  },
];
