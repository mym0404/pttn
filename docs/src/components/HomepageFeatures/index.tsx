import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { Brain, Zap, GitBranch, Library, ClipboardList, FileText, LucideIcon } from 'lucide-react';

type FeatureItem = {
  title: string;
  Icon: LucideIcon;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Smart Context Management',
    Icon: Brain,
    description: (
      <>
        Automatically organize and retrieve project context through intelligent
        .claude directory management. Keep your Claude Code sessions aware of
        previous conversations and decisions.
      </>
    ),
  },
  {
    title: 'Seamless Claude Code Integration',
    Icon: Zap,
    description: (
      <>
        Built specifically for Claude Code with slash commands that feel native.
        Extract sessions, reference specs, and apply patterns without leaving
        your workflow.
      </>
    ),
  },
  {
    title: 'Self-Referring Architecture',
    Icon: GitBranch,
    description: (
      <>
        Implements a self-referring model where Claude Code can access its own
        context history, enabling more intelligent and contextually aware
        responses across sessions.
      </>
    ),
  },
  {
    title: 'Pattern Library',
    Icon: Library,
    description: (
      <>
        Store and reuse successful code patterns, architectural decisions, and
        implementation strategies. Build your own library of proven solutions.
      </>
    ),
  },
  {
    title: 'Strategic Planning',
    Icon: ClipboardList,
    description: (
      <>
        Create, track, and execute strategic plans with built-in checklist
        management. Keep complex projects organized and on track.
      </>
    ),
  },
  {
    title: 'Specification Repository',
    Icon: FileText,
    description: (
      <>
        Maintain comprehensive project specifications that combine business,
        technical, and operational requirements in a searchable format.
      </>
    ),
  },
];

function Feature({title, Icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="feature-card text--center padding--lg">
        <div className={styles.featureIcon}>
          <Icon size={48} className={styles.icon} />
        </div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}