import React from 'react';
import Mermaid from '@theme/Mermaid';
import styles from './styles.module.css';

export default function SelfReferDiagram(): JSX.Element {
  const diagram = `
    graph TB
      subgraph "User Interaction"
        User[User]
      end
      
      subgraph "Claude Code Environment"
        CC[Claude Code]
        Commands[Slash Commands]
      end
      
      subgraph "cc-self-refer CLI"
        CLI[CLI Tool]
        Manager[Content Managers]
      end
      
      subgraph ".claude Directory"
        Pages[pages/]
        Plans[plans/]
        Patterns[patterns/]
        Specs[specs/]
      end
      
      User -->|Types command| CC
      CC -->|Executes| Commands
      Commands -->|Calls| CLI
      CLI -->|Manages| Manager
      Manager -->|Writes to| Pages
      Manager -->|Writes to| Plans
      Manager -->|Writes to| Patterns
      Manager -->|Writes to| Specs
      
      Pages -->|Context retrieval| CC
      Plans -->|Context retrieval| CC
      Patterns -->|Context retrieval| CC
      Specs -->|Context retrieval| CC
      
      style User fill:#ff6b35,stroke:#fff,stroke-width:2px,color:#fff
      style CC fill:#ff8659,stroke:#fff,stroke-width:2px,color:#fff
      style Commands fill:#ff936b,stroke:#fff,stroke-width:2px,color:#fff
      style CLI fill:#ffa07d,stroke:#333,stroke-width:2px
      style Manager fill:#ffad8f,stroke:#333,stroke-width:2px
      style Pages fill:#ffeedd,stroke:#333,stroke-width:2px
      style Plans fill:#ffeedd,stroke:#333,stroke-width:2px
      style Patterns fill:#ffeedd,stroke:#333,stroke-width:2px
      style Specs fill:#ffeedd,stroke:#333,stroke-width:2px
  `;

  return (
    <div className={styles.diagramContainer}>
      <h3 className={styles.title}>Self-Referring Architecture</h3>
      <div className={styles.description}>
        The Self-Referring Model creates a continuous feedback loop where Claude Code
        can access its own context history, enabling intelligent context-aware development.
      </div>
      <div className={styles.mermaidWrapper}>
        <Mermaid value={diagram} />
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#ff6b35' }}></span>
          <span>User Interaction</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#ff8659' }}></span>
          <span>Claude Code Layer</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#ffa07d' }}></span>
          <span>CLI Processing</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: '#ffeedd' }}></span>
          <span>Context Storage</span>
        </div>
      </div>
    </div>
  );
}