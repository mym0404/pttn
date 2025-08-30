#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Sync translations for Docusaurus documentation
 */
const syncTranslations = async () => {
  console.log('📚 Syncing translations...');
  
  const docsDir = path.join(projectRoot, 'docs/docs');
  const i18nDir = path.join(projectRoot, 'docs/i18n/ko/docusaurus-plugin-content-docs/current');
  
  // Ensure i18n directory exists
  await fs.ensureDir(i18nDir);
  
  // Find all English documentation files
  const englishFiles = await glob('**/*.md', { cwd: docsDir });
  console.log(`Found ${englishFiles.length} English documentation files`);
  
  // Track missing translations
  const missingTranslations = [];
  
  for (const file of englishFiles) {
    const englishPath = path.join(docsDir, file);
    const koreanPath = path.join(i18nDir, file);
    
    // Check if Korean translation exists
    if (!await fs.pathExists(koreanPath)) {
      missingTranslations.push(file);
      
      // Create placeholder Korean file
      const englishContent = await fs.readFile(englishPath, 'utf-8');
      const placeholderContent = createPlaceholderTranslation(englishContent, file);
      
      await fs.ensureDir(path.dirname(koreanPath));
      await fs.writeFile(koreanPath, placeholderContent);
      console.log(`✅ Created placeholder for: ${file}`);
    }
  }
  
  // Report summary
  console.log(`\n📊 Translation Summary:`);
  console.log(`Total files: ${englishFiles.length}`);
  console.log(`Missing translations: ${missingTranslations.length}`);
  
  if (missingTranslations.length > 0) {
    console.log(`\n⚠️  Files needing translation:`);
    missingTranslations.forEach(file => console.log(`  - ${file}`));
  } else {
    console.log(`\n✨ All files have translations!`);
  }
  
  // Create UI translations file
  await createUITranslations();
};

/**
 * Create placeholder Korean translation
 */
const createPlaceholderTranslation = (englishContent, filename) => {
  const lines = englishContent.split('\n');
  const translatedLines = [];
  
  for (const line of lines) {
    // Keep frontmatter and code blocks unchanged
    if (line.startsWith('---') || line.startsWith('```')) {
      translatedLines.push(line);
      continue;
    }
    
    // Translate headers
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)[0];
      const text = line.replace(/^#+\s*/, '');
      translatedLines.push(`${level} ${text} (번역 필요)`);
      continue;
    }
    
    // Add translation note for content
    if (line.trim() && !line.startsWith(':::')) {
      translatedLines.push(`${line} *(이 내용은 번역이 필요합니다)*`);
    } else {
      translatedLines.push(line);
    }
  }
  
  // Add translation header
  const header = [
    ':::warning 번역 필요',
    `이 문서는 아직 한국어로 번역되지 않았습니다.`,
    `원본 파일: ${filename}`,
    ':::',
    '',
  ];
  
  return [...header, ...translatedLines].join('\n');
};

/**
 * Create UI translations
 */
const createUITranslations = async () => {
  const uiTranslationsPath = path.join(
    projectRoot,
    'docs/i18n/ko/code.json'
  );
  
  const translations = {
    "theme.ErrorPageContent.title": {
      "message": "페이지에 오류가 발생했습니다",
      "description": "The title of the fallback page when the page crashed"
    },
    "theme.NotFound.title": {
      "message": "페이지를 찾을 수 없습니다",
      "description": "The title of the 404 page"
    },
    "theme.NotFound.p1": {
      "message": "원하시는 페이지를 찾을 수 없습니다.",
      "description": "The first paragraph of the 404 page"
    },
    "theme.NotFound.p2": {
      "message": "사이트 관리자에게 링크가 깨진 것을 알려주세요.",
      "description": "The 2nd paragraph of the 404 page"
    },
    "theme.docs.sidebar.collapseButtonTitle": {
      "message": "사이드바 접기",
      "description": "The title attribute for collapse button of doc sidebar"
    },
    "theme.docs.sidebar.collapseButtonAriaLabel": {
      "message": "사이드바 접기",
      "description": "The title attribute for collapse button of doc sidebar"
    },
    "theme.docs.paginator.navAriaLabel": {
      "message": "문서 페이지 탐색",
      "description": "The ARIA label for the docs pagination"
    },
    "theme.docs.paginator.previous": {
      "message": "이전",
      "description": "The label used to navigate to the previous doc"
    },
    "theme.docs.paginator.next": {
      "message": "다음",
      "description": "The label used to navigate to the next doc"
    },
    "theme.docs.tagDocListPageTitle.nDocsTagged": {
      "message": "{count}개 문서",
      "description": "Pluralized label for \"{count} docs tagged\". Use as much plural forms (separated by \"|\") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)"
    },
    "theme.docs.tagDocListPageTitle": {
      "message": "{nDocsTagged} \"{tagName}\" 태그",
      "description": "The title of the page for a docs tag"
    },
    "theme.docs.versionBadge.label": {
      "message": "버전: {versionLabel}"
    },
    "theme.common.editThisPage": {
      "message": "이 페이지 편집",
      "description": "The link label to edit the current page"
    },
    "theme.common.headingLinkTitle": {
      "message": "{heading}에 대한 직접 링크",
      "description": "Title for link to heading"
    },
    "theme.lastUpdated.atDate": {
      "message": " {date}에",
      "description": "The words used to describe on which date a page has been last updated"
    },
    "theme.lastUpdated.byUser": {
      "message": " {user}가",
      "description": "The words used to describe by who the page has been last updated"
    },
    "theme.lastUpdated.lastUpdatedAtBy": {
      "message": "최종 수정: {atDate}{byUser}",
      "description": "The sentence used to display when a page has been last updated, and by who"
    },
    "theme.navbar.mobileVersionsDropdown.label": {
      "message": "버전",
      "description": "The label for the navbar versions dropdown on mobile view"
    },
    "theme.tags.tagsListLabel": {
      "message": "태그:",
      "description": "The label alongside a tag list"
    },
    "theme.tags.tagsPageTitle": {
      "message": "태그",
      "description": "The title of the tag list page"
    },
    "theme.admonition.note": {
      "message": "노트",
      "description": "The default label used for the Note admonition (:::note)"
    },
    "theme.admonition.tip": {
      "message": "팁",
      "description": "The default label used for the Tip admonition (:::tip)"
    },
    "theme.admonition.danger": {
      "message": "위험",
      "description": "The default label used for the Danger admonition (:::danger)"
    },
    "theme.admonition.info": {
      "message": "정보",
      "description": "The default label used for the Info admonition (:::info)"
    },
    "theme.admonition.warning": {
      "message": "주의",
      "description": "The default label used for the Warning admonition (:::warning)"
    },
    "theme.admonition.caution": {
      "message": "경고",
      "description": "The default label used for the Caution admonition (:::caution)"
    },
    "theme.navbar.mobileLanguageDropdown.label": {
      "message": "언어",
      "description": "The label for the mobile language switcher dropdown"
    },
    "theme.TOCCollapsible.toggleButtonLabel": {
      "message": "이 페이지에서",
      "description": "The label used by the button on the collapsible TOC component"
    }
  };
  
  await fs.ensureDir(path.dirname(uiTranslationsPath));
  await fs.writeJson(uiTranslationsPath, translations, { spaces: 2 });
  console.log(`✅ Created UI translations at: ${uiTranslationsPath}`);
};

// Run the script
syncTranslations().catch(console.error);