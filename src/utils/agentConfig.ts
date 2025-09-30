import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import {
  AgentId,
  agentRegistry,
  AgentSelection,
  DEFAULT_AGENT,
  isAgentId,
} from '../constants/agents.js';
import { ensureDir } from './fileSystem.js';

const CONFIG_FILENAME = 'self-refer.json';

type RawConfig = Record<string, unknown> & {
  agent?: unknown;
};

const readRawConfig = async (configPath: string): Promise<RawConfig> => {
  if (!existsSync(configPath)) {
    return {};
  }

  try {
    const content = await readFile(configPath, 'utf-8');
    const parsed = JSON.parse(content);

    if (parsed && typeof parsed === 'object') {
      return parsed as RawConfig;
    }
  } catch (error) {
    // Ignore malformed JSON and fall back to defaults
  }

  return {};
};

const extractAgentId = (rawConfig: RawConfig): AgentId | null => {
  if (typeof rawConfig.agent !== 'string') {
    return null;
  }

  return isAgentId(rawConfig.agent) ? rawConfig.agent : null;
};

const buildAgentSelection = (agentId: AgentId): AgentSelection => ({
  agentId,
  promptFile: agentRegistry[agentId].promptFile,
  label: agentRegistry[agentId].label,
});

export const resolveAgentSelection = async ({
  contentDir,
}: {
  contentDir: string;
}): Promise<AgentSelection> => {
  const configPath = join(contentDir, CONFIG_FILENAME);
  const rawConfig = await readRawConfig(configPath);
  const agentId = extractAgentId(rawConfig) ?? DEFAULT_AGENT;

  return buildAgentSelection(agentId);
};

export const writeAgentSelection = async ({
  contentDir,
  agentId,
}: {
  contentDir: string;
  agentId: AgentId;
}): Promise<{
  agentId: AgentId;
  previousAgent: AgentId | null;
  promptFile: string;
  configPath: string;
}> => {
  const configPath = join(contentDir, CONFIG_FILENAME);
  const rawConfig = await readRawConfig(configPath);
  const previousAgent = extractAgentId(rawConfig);

  await ensureDir(contentDir);

  const nextConfig: RawConfig = {
    ...rawConfig,
    agent: agentId,
  };

  await writeFile(
    configPath,
    `${JSON.stringify(nextConfig, null, 2)}
`
  );

  const selection = buildAgentSelection(agentId);

  return {
    ...selection,
    configPath,
    previousAgent,
  };
};
