---
id: ide-integration
title: IDE Integration
sidebar_label: IDE Integration
---

# IDE Integration Guide

Enhance your development experience by integrating cc-self-refer with your favorite IDE.

## VS Code Integration

### Task Configuration

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Create Spec",
      "type": "shell",
      "command": "cc-self-refer",
      "args": ["spec", "create", "${input:specTitle}", "${input:specContent}"],
      "problemMatcher": []
    },
    {
      "label": "Search Specs",
      "type": "shell",
      "command": "cc-self-refer",
      "args": ["spec", "search", "${input:searchTerm}"],
      "problemMatcher": []
    },
    {
      "label": "View Active Plans",
      "type": "shell",
      "command": "cc-self-refer",
      "args": ["plan", "list", "--active"],
      "problemMatcher": []
    }
  ],
  "inputs": [
    {
      "id": "specTitle",
      "type": "promptString",
      "description": "Spec title"
    },
    {
      "id": "specContent",
      "type": "promptString",
      "description": "Spec content"
    },
    {
      "id": "searchTerm",
      "type": "promptString",
      "description": "Search term"
    }
  ]
}
```

### Keyboard Shortcuts

Add to `.vscode/keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+s",
    "command": "workbench.action.tasks.runTask",
    "args": "Create Spec"
  },
  {
    "key": "ctrl+shift+f",
    "command": "workbench.action.tasks.runTask",
    "args": "Search Specs"
  },
  {
    "key": "ctrl+shift+p",
    "command": "workbench.action.tasks.runTask",
    "args": "View Active Plans"
  }
]
```

### Extensions

:::tip
Install the **Markdown All in One** extension for better markdown editing experience with `.claude/` files.
:::

### Workspace Settings

`.vscode/settings.json`:

```json
{
  "files.associations": {
    ".claude/**/*.md": "markdown"
  },
  "search.exclude": {
    ".claude/pages/": true
  },
  "files.watcherExclude": {
    ".claude/**": false
  }
}
```

## JetBrains IDEs (IntelliJ, WebStorm, etc.)

### External Tools

1. Open **Settings → Tools → External Tools**
2. Add new tool:
   - Name: `Create Spec`
   - Program: `cc-self-refer`
   - Arguments: `spec create "$Prompt$" "$Prompt$"`
   - Working directory: `$ProjectFileDir$`

### Live Templates

Create snippets for common patterns:

```xml
<template name="ccspec" value="cc-self-refer spec create &quot;$TITLE$&quot; &quot;$CONTENT$&quot;" description="Create new spec" toReformat="false" toShortenFQNames="true">
  <variable name="TITLE" expression="" defaultValue="" alwaysStopAt="true" />
  <variable name="CONTENT" expression="" defaultValue="" alwaysStopAt="true" />
  <context>
    <option name="SHELL_SCRIPT" value="true" />
  </context>
</template>
```

### File Watchers

Monitor `.claude/` directory changes:

1. **Settings → Tools → File Watchers**
2. Add watcher for `*.md` files in `.claude/`
3. Run custom scripts on changes

## Vim/Neovim Integration

### Commands

Add to `.vimrc` or `init.vim`:

```vim
" cc-self-refer commands
command! -nargs=+ CCSpec !cc-self-refer spec create <args>
command! -nargs=1 CCSearch !cc-self-refer spec search <args>
command! CCPlans !cc-self-refer plan list
command! -nargs=+ CCPattern !cc-self-refer pattern create <args>

" Keybindings
nnoremap <leader>cs :CCSpec 
nnoremap <leader>cf :CCSearch 
nnoremap <leader>cp :CCPlans<CR>
nnoremap <leader>ct :CCPattern 
```

### Telescope Integration (Neovim)

```lua
-- Add to telescope config
local telescope = require('telescope')
local actions = require('telescope.actions')
local pickers = require('telescope.pickers')
local finders = require('telescope.finders')
local conf = require('telescope.config').values

local function cc_self_refer_specs()
  local handle = io.popen('cc-self-refer spec list --format json')
  local result = handle:read("*a")
  handle:close()
  
  local specs = vim.fn.json_decode(result)
  
  pickers.new({}, {
    prompt_title = "CC Self Refer Specs",
    finder = finders.new_table {
      results = specs,
      entry_maker = function(entry)
        return {
          value = entry,
          display = entry.title,
          ordinal = entry.title,
        }
      end
    },
    sorter = conf.generic_sorter({}),
    attach_mappings = function(prompt_bufnr, map)
      actions.select_default:replace(function()
        actions.close(prompt_bufnr)
        local selection = action_state.get_selected_entry()
        vim.cmd('!cc-self-refer spec view ' .. selection.value.id)
      end)
      return true
    end,
  }):find()
end

vim.keymap.set('n', '<leader>fs', cc_self_refer_specs)
```

## Sublime Text Integration

### Build System

Create `cc-self-refer.sublime-build`:

```json
{
  "shell_cmd": "cc-self-refer spec create \"$file_name\" \"$file_content\"",
  "working_dir": "${project_path}",
  "variants": [
    {
      "name": "Search Spec",
      "shell_cmd": "cc-self-refer spec search \"$selection\""
    },
    {
      "name": "List Plans",
      "shell_cmd": "cc-self-refer plan list"
    }
  ]
}
```

### Snippets

Create `cc-self-refer.sublime-snippet`:

```xml
<snippet>
  <content><![CDATA[
cc-self-refer ${1:spec} ${2:create} "${3:title}" "${4:content}"
]]></content>
  <tabTrigger>ccsr</tabTrigger>
  <scope>text.plain, source.shell</scope>
</snippet>
```

## Terminal Integration

### Zsh/Bash Functions

Add to `.zshrc` or `.bashrc`:

```bash
# Quick spec creation
ccspec() {
  cc-self-refer spec create "$1" "$2"
}

# Search with preview
ccsearch() {
  cc-self-refer spec search "$1" | fzf --preview 'cc-self-refer spec view {1}'
}

# Interactive plan viewer
ccplan() {
  local plan=$(cc-self-refer plan list | fzf)
  if [ -n "$plan" ]; then
    cc-self-refer plan view $(echo $plan | cut -d: -f1)
  fi
}
```

### Fish Shell

```fish
# ~/.config/fish/functions/ccspec.fish
function ccspec
  cc-self-refer spec create $argv
end

# ~/.config/fish/functions/ccsearch.fish
function ccsearch
  cc-self-refer spec search $argv | fzf
end
```

## Git Integration

### Pre-commit Hook

`.git/hooks/pre-commit`:

```bash
#!/bin/sh
# Update specs before commit
if [ -d ".claude/specs" ]; then
  echo "Checking specs..."
  cc-self-refer spec validate
fi
```

### Commit Message Template

`.gitmessage`:

```
# Type: feat/fix/docs/style/refactor/test/chore
# Scope: spec/plan/pattern/page

[type]([scope]): 

# Related specs:
# cc-self-refer spec: 

# Related plans:
# cc-self-refer plan: 
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Validate Context
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install cc-self-refer
        run: npm install -g cc-self-refer
      
      - name: Validate Specs
        run: cc-self-refer spec validate
      
      - name: Check Patterns
        run: cc-self-refer pattern lint
```

## Tips for Effective Integration

:::info
Always ensure cc-self-refer is in your system PATH for IDE integrations to work properly.
:::

:::warning
Some IDEs may require restart after configuration changes.
:::

:::tip
Use workspace-specific configurations to avoid conflicts between projects.
:::

## Troubleshooting

### Command Not Found

- Verify cc-self-refer installation: `which cc-self-refer`
- Add to PATH if needed: `export PATH=$PATH:$(npm bin -g)`

### Permission Issues

- Check file permissions: `ls -la .claude/`
- Fix if needed: `chmod -R u+rw .claude/`

### IDE Not Recognizing Commands

- Restart IDE after configuration
- Check IDE console for error messages
- Verify working directory is project root