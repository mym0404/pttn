import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

interface CommandDemoProps {
  command: string;
  examples?: Array<{
    input: string;
    output: string;
  }>;
}

export default function CommandDemo({ command, examples }: CommandDemoProps): JSX.Element {
  const [activeExample, setActiveExample] = useState(0);
  
  const defaultExamples = [
    {
      input: `/${command}`,
      output: `Executing cc-self-refer ${command.replace('-', ' ')}...`,
    },
  ];
  
  const demoExamples = examples || defaultExamples;
  
  return (
    <div className={styles.commandDemo}>
      <div className={styles.header}>
        <span className={styles.prompt}>Claude Code</span>
        <span className={styles.commandBadge}>/{command}</span>
      </div>
      
      {demoExamples.length > 1 && (
        <div className={styles.tabs}>
          {demoExamples.map((_, index) => (
            <button
              key={index}
              className={clsx(styles.tab, activeExample === index && styles.activeTab)}
              onClick={() => setActiveExample(index)}
            >
              Example {index + 1}
            </button>
          ))}
        </div>
      )}
      
      <div className={styles.content}>
        <div className={styles.input}>
          <span className={styles.inputPrompt}>$</span>
          <code>{demoExamples[activeExample].input}</code>
        </div>
        
        <div className={styles.output}>
          <pre>{demoExamples[activeExample].output}</pre>
        </div>
      </div>
    </div>
  );
}