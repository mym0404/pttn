import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/cc-self-refer/docs',
    component: ComponentCreator('/cc-self-refer/docs', '672'),
    routes: [
      {
        path: '/cc-self-refer/docs',
        component: ComponentCreator('/cc-self-refer/docs', '94b'),
        routes: [
          {
            path: '/cc-self-refer/docs',
            component: ComponentCreator('/cc-self-refer/docs', '082'),
            routes: [
              {
                path: '/cc-self-refer/docs/commands/overview',
                component: ComponentCreator('/cc-self-refer/docs/commands/overview', 'db3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/commands/page-refer',
                component: ComponentCreator('/cc-self-refer/docs/commands/page-refer', '7b9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/commands/page-save',
                component: ComponentCreator('/cc-self-refer/docs/commands/page-save', '36a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/commands/pattern-create',
                component: ComponentCreator('/cc-self-refer/docs/commands/pattern-create', '84b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/commands/pattern-use',
                component: ComponentCreator('/cc-self-refer/docs/commands/pattern-use', '7e4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/commands/plan-create',
                component: ComponentCreator('/cc-self-refer/docs/commands/plan-create', '76a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/commands/plan-edit',
                component: ComponentCreator('/cc-self-refer/docs/commands/plan-edit', '898'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/commands/plan-resolve',
                component: ComponentCreator('/cc-self-refer/docs/commands/plan-resolve', 'ff3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/commands/spec',
                component: ComponentCreator('/cc-self-refer/docs/commands/spec', '293'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/commands/spec-refer',
                component: ComponentCreator('/cc-self-refer/docs/commands/spec-refer', '6ed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/getting-started/first-steps',
                component: ComponentCreator('/cc-self-refer/docs/getting-started/first-steps', 'be8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/getting-started/installation',
                component: ComponentCreator('/cc-self-refer/docs/getting-started/installation', '085'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/getting-started/setup',
                component: ComponentCreator('/cc-self-refer/docs/getting-started/setup', '7a0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/getting-started/troubleshooting',
                component: ComponentCreator('/cc-self-refer/docs/getting-started/troubleshooting', 'a42'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/guides/best-practices',
                component: ComponentCreator('/cc-self-refer/docs/guides/best-practices', '5a2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/guides/ide-integration',
                component: ComponentCreator('/cc-self-refer/docs/guides/ide-integration', '313'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/guides/team-collaboration',
                component: ComponentCreator('/cc-self-refer/docs/guides/team-collaboration', 'd21'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/guides/workflow-optimization',
                component: ComponentCreator('/cc-self-refer/docs/guides/workflow-optimization', '314'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/intro',
                component: ComponentCreator('/cc-self-refer/docs/intro', 'f43'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/intro/architecture',
                component: ComponentCreator('/cc-self-refer/docs/intro/architecture', '6f4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/intro/self-referring-model',
                component: ComponentCreator('/cc-self-refer/docs/intro/self-referring-model', '902'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/tips/common-patterns',
                component: ComponentCreator('/cc-self-refer/docs/tips/common-patterns', '50c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/tips/performance',
                component: ComponentCreator('/cc-self-refer/docs/tips/performance', '3a5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/cc-self-refer/docs/tips/troubleshooting',
                component: ComponentCreator('/cc-self-refer/docs/tips/troubleshooting', '154'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/cc-self-refer/',
    component: ComponentCreator('/cc-self-refer/', '42a'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
