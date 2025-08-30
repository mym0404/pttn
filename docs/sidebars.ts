import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: [
        'intro/index',
        'intro/self-referring-model',
        'intro/architecture',
      ],
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/setup',
        'getting-started/first-steps',
        'getting-started/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Commands',
      items: [
        'commands/overview',
        {
          type: 'category',
          label: 'Page Commands',
          items: [
            'commands/page-save',
            'commands/page-refer',
          ],
        },
        {
          type: 'category',
          label: 'Plan Commands',
          items: [
            'commands/plan-create',
            'commands/plan-edit',
            'commands/plan-resolve',
          ],
        },
        {
          type: 'category',
          label: 'Pattern Commands',
          items: [
            'commands/pattern-create',
            'commands/pattern-use',
          ],
        },
        {
          type: 'category',
          label: 'Spec Commands',
          items: [
            'commands/spec',
            'commands/spec-refer',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/best-practices',
        'guides/workflow-optimization',
        'guides/team-collaboration',
        'guides/ide-integration',
      ],
    },
    {
      type: 'category',
      label: 'Tips & Tricks',
      items: [
        'tips/performance',
        'tips/common-patterns',
        'tips/troubleshooting',
      ],
    },
  ],
};

export default sidebars;
