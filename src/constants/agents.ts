export const agentRegistry = {
  claude: {
    label: 'Claude Code',
    promptFile: 'CLAUDE.md',
  },
  codex: {
    label: 'Codex',
    promptFile: 'AGENTS.md',
  },
  gemini: {
    label: 'Gemini',
    promptFile: 'GEMINI.md',
  },
} as const;

export type AgentRegistry = typeof agentRegistry;
export type AgentId = keyof AgentRegistry;
export type AgentConfig = AgentRegistry[AgentId];
export type AgentSelection = {
  agentId: AgentId;
  promptFile: AgentConfig['promptFile'];
  label: AgentConfig['label'];
};

export const DEFAULT_AGENT: AgentId = 'claude';

export const isAgentId = (value: string): value is AgentId =>
  Object.prototype.hasOwnProperty.call(agentRegistry, value);
