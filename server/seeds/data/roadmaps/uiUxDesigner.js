import { resource } from './resource.js';

export default {
  role: 'ui-ux-designer',
  stages: [
    {
      title: 'Foundation',
      description: 'Learn visual design basics and the UX process.',
      steps: [
        {
          title: 'Visual Design Fundamentals',
          description: 'Apply layout, typography, and colour to create clear, attractive interfaces.',
          topics: ['Gestalt principles', 'Visual hierarchy', 'Grids & spacing', 'Type scales & pairing', 'Colour theory & contrast'],
          skills: ['Design Principles', 'Typography', 'Color Theory'],
          resources: [
            resource('Material Design 3 – Foundations', 'https://m3.material.io/foundations', 'Docs'),
            resource('Practical Typography', 'https://practicaltypography.com/', 'Book'),
          ],
          projects: ['Redesign the visual hierarchy of an existing app screen'],
          estimatedHours: 30,
          certifications: [],
        },
        {
          title: 'UX Process & Design Thinking',
          description: 'Understand how designers move from problem to validated solution.',
          topics: ['Design thinking stages', 'Problem statements', 'User personas', 'Journey maps'],
          skills: ['Design Thinking'],
          resources: [
            resource('IxDF – What is Design Thinking?', 'https://www.interaction-design.org/literature/topics/design-thinking', 'Article'),
            resource('Google UX Design Certificate', 'https://www.coursera.org/professional-certificates/google-ux-design', 'Course', false),
          ],
          projects: ['Persona and journey map for a campus app'],
          estimatedHours: 20,
          certifications: ['google-ux'],
        },
      ],
    },
    {
      title: 'Intermediate',
      description: 'Master the tools and core research and structuring methods.',
      steps: [
        {
          title: 'Figma',
          description: 'Design efficiently in Figma with components, auto layout, and variables.',
          topics: ['Frames & auto layout', 'Components & variants', 'Styles & variables', 'Collaboration & handoff'],
          skills: ['Figma'],
          resources: [
            resource('Figma Help Center', 'https://help.figma.com/hc/en-us', 'Docs'),
          ],
          projects: ['Recreate a popular app screen pixel-perfectly in Figma'],
          estimatedHours: 30,
          certifications: [],
        },
        {
          title: 'User Research',
          description: 'Plan and run research to understand users\' needs and behaviours.',
          topics: ['Research planning', 'User interviews', 'Surveys', 'Affinity mapping', 'Synthesising insights'],
          skills: ['User Research'],
          resources: [
            resource('Nielsen Norman Group – Articles', 'https://www.nngroup.com/articles/', 'Article'),
          ],
          projects: ['Interview 5 users and present synthesised insights'],
          estimatedHours: 25,
          certifications: ['nng-ux'],
        },
        {
          title: 'Information Architecture & Wireframing',
          description: 'Organise content and sketch structure before visual design.',
          topics: ['Site maps', 'Card sorting', 'User flows', 'Low-fidelity wireframes'],
          skills: ['Information Architecture', 'Wireframing'],
          resources: [
            resource('NN/g – Information Architecture topic', 'https://www.nngroup.com/topic/information-architecture/', 'Article'),
          ],
          projects: ['Site map, user flows, and wireframes for a food-ordering app'],
          estimatedHours: 25,
          certifications: [],
        },
      ],
    },
    {
      title: 'Advanced',
      description: 'Bring designs to life, test them, and make them inclusive.',
      steps: [
        {
          title: 'Prototyping & Interaction Design',
          description: 'Build interactive prototypes and design meaningful micro-interactions.',
          topics: ['Clickable prototypes', 'Smart animate & transitions', 'Micro-interactions', 'Interaction patterns'],
          skills: ['Prototyping', 'Interaction Design'],
          resources: [
            resource('Interaction Design Foundation courses', 'https://www.interaction-design.org/courses', 'Course', false),
          ],
          projects: ['High-fidelity interactive prototype of your food-ordering app'],
          estimatedHours: 30,
          certifications: ['ixdf'],
        },
        {
          title: 'Usability Testing',
          description: 'Test designs with real users and turn findings into improvements.',
          topics: ['Test planning & tasks', 'Moderated vs unmoderated tests', 'Think-aloud protocol', 'Severity rating', 'Iteration'],
          skills: ['Usability Testing'],
          resources: [
            resource('NN/g – Usability Testing 101', 'https://www.nngroup.com/articles/usability-testing-101/', 'Article'),
          ],
          projects: ['Run 5 usability tests and publish a findings report'],
          estimatedHours: 20,
          certifications: [],
        },
        {
          title: 'Accessibility',
          description: 'Design products everyone can use, following WCAG.',
          topics: ['WCAG principles (POUR)', 'Colour contrast', 'Keyboard & screen-reader support', 'Accessible forms'],
          skills: ['Accessibility'],
          resources: [
            resource('W3C WAI – Accessibility Fundamentals', 'https://www.w3.org/WAI/fundamentals/', 'Docs'),
            resource('WCAG 2.2 Quick Reference', 'https://www.w3.org/WAI/WCAG22/quickref/', 'Docs'),
          ],
          projects: ['Accessibility audit and fixes for your prototype'],
          estimatedHours: 20,
          certifications: ['iaap-cpacc'],
        },
      ],
    },
    {
      title: 'Job-Ready',
      description: 'Systematise your work and build a portfolio that gets interviews.',
      steps: [
        {
          title: 'Design Systems',
          description: 'Create reusable foundations and components that scale across products.',
          topics: ['Design tokens', 'Component libraries', 'Documentation', 'Working with developers'],
          skills: ['Design Systems'],
          resources: [
            resource('Material Design 3', 'https://m3.material.io/', 'Docs'),
            resource('Design Systems Repo', 'https://designsystemsrepo.com/', 'Article'),
          ],
          projects: ['Mini design system (tokens + 10 components) in Figma'],
          estimatedHours: 25,
          certifications: [],
        },
        {
          title: 'Portfolio Case Studies & Interview Prep',
          description: 'Present 2–3 strong case studies that show your process and impact.',
          topics: ['Case-study structure', 'Showing process & outcomes', 'Portfolio review', 'Design challenge interviews'],
          skills: [],
          resources: [
            resource('roadmap.sh – UX Design', 'https://roadmap.sh/ux-design', 'Article'),
          ],
          projects: ['Portfolio website with 3 end-to-end case studies'],
          estimatedHours: 50,
          certifications: [],
        },
      ],
    },
  ],
};
