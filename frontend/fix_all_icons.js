/**
 * Comprehensive fix script for all remaining TS errors
 * Handles:
 * 1. Duplicate imports in lucide-react (Zap as ZapIcon causes duplicates)
 * 2. Missing icon substitutions (using valid lucide-react alternatives)
 * 3. Various type errors in specific files
 */
const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, 'src/components');

// Map of missing/invalid icons -> replacement icons (from lucide-react)
const ICON_REPLACEMENTS = {
  'Facebook': 'Globe2',
  'Twitter': 'MessageCircle',
  'Instagram': 'ImagePlus',
  'Linkedin': 'Link2',
  'Spotify': 'Headphones',
  'Vr': 'Glasses',
  'ExitVR': 'LogOut',
  'Android': 'TabletSmartphone',
  'Sync': 'RefreshCw',
  'Story': 'ScrollText',
  'Wave': 'Waves',
  'Waveform': 'BarChart2',
  'CopyRight': 'Copyright',
  'Mystery': 'HelpCircle',
  'UserSwitch': 'UserCog',
  'FaceMask': 'Smile',
  'FaceSmile': 'Smile',
  'HeartBroken': 'HeartCrack',
  'Icons': 'LayoutGrid',
  'Notion': 'BookMarked',
  'Certificate': 'BadgeCheck',
  'Duplicate': 'Files',
  'Translate': 'Languages',
  'Night': 'Sunset',
  'BirthdayCake': 'PartyPopper',
  'Shake': 'Zap',
  'Star': 'Star',       // Star exists in lucide-react, must be import issue
  'Trophy': 'Trophy',   // Trophy exists in lucide-react, must be import issue
  'Sparkles': 'Sparkles', // Sparkles exists, must be import issue
  'BellOff': 'BellOff',   // BellOff exists
  'Clock': 'Clock',       // Clock exists
  'Edit': 'Pencil',
  'Card': 'CreditCard',
  'Save': 'Save',         // Save exists
  'Type': 'Type',         // Type exists
  'Stop': 'StopCircle',
  'StopCircle': 'OctagonX',
};

// Fixes for files with duplicate lucide-react imports (Zap as ZapIcon causes dup)
function fixDuplicateImports(content, filename) {
  // Extract the lucide-react import line(s)
  const importRegex = /^import \{([^}]+)\} from 'lucide-react';$/m;
  const matches = content.match(/^import \{([^}]+)\} from 'lucide-react';$/mg);
  
  if (!matches || matches.length === 0) return content;
  
  // Collect ALL imports from ALL lucide-react import lines
  const allImports = new Set();
  const aliasImports = new Map(); // name -> alias
  
  matches.forEach(importLine => {
    const inner = importLine.match(/^import \{([^}]+)\} from 'lucide-react';$/)?.[1] || '';
    inner.split(',').forEach(part => {
      const trimmed = part.trim();
      if (!trimmed) return;
      
      const aliasMatch = trimmed.match(/^(\w+)\s+as\s+(\w+)$/);
      if (aliasMatch) {
        const [_, original, alias] = aliasMatch;
        // Only add if alias != original (real alias), else just add original
        if (original !== alias) {
          aliasImports.set(alias, original);
        }
        allImports.add(original);
      } else {
        allImports.add(trimmed);
      }
    });
  });
  
  // Build consolidated import
  const parts = [];
  allImports.forEach(name => {
    const aliases = [...aliasImports.entries()]
      .filter(([alias, orig]) => orig === name)
      .map(([alias]) => alias);
    
    if (aliases.length > 0 && aliases[0] !== name) {
      parts.push(`${name}, ${name} as ${aliases[0]}`);
    } else {
      parts.push(name);
    }
  });
  
  // Deduplicate parts
  const seen = new Set();
  const uniqueParts = [];
  parts.forEach(p => {
    if (!seen.has(p)) {
      seen.add(p);
      uniqueParts.push(p);
    }
  });
  
  const consolidated = `import { ${uniqueParts.sort().join(', ')} } from 'lucide-react';`;
  
  // Remove all existing lucide-react imports and replace with consolidated
  let result = content;
  matches.forEach(importLine => {
    result = result.replace(importLine, '');
  });
  
  // Remove multiple blank lines
  result = result.replace(/\n{3,}/g, '\n\n');
  
  // Add consolidated import after first line (use client) or after other imports
  const useClientMatch = result.match(/^'use client';\n/);
  if (useClientMatch) {
    result = `'use client';\n\n${consolidated}\n` + result.slice(useClientMatch[0].length).trimStart();
  } else {
    // Add at beginning
    result = consolidated + '\n' + result;
  }
  
  return result;
}

function fixIconUsagesInFile(content, filename) {
  let result = content;
  
  for (const [oldName, newName] of Object.entries(ICON_REPLACEMENTS)) {
    if (oldName === newName) continue; // Skip self-replacements (where icon exists but import broken)
    
    // Replace in JSX: <OldName ... />  or <OldName ...>
    result = result.replace(new RegExp(`<${oldName}(\\s|/>|>)`, 'g'), `<${newName}$1`);
    result = result.replace(new RegExp(`</${oldName}>`, 'g'), `</${newName}>`);
    
    // Replace in import strings: OldName (as a word boundary)
    result = result.replace(
      new RegExp(`\\b${oldName}\\b(?=\\s*(?:as\\s+\\w+\\s*)?[,}]|\\s+from)`, 'g'),
      newName
    );
  }
  
  return result;
}

function processFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  const original = content;
  
  // 1. Fix icon usages (JSX)
  content = fixIconUsagesInFile(content, filepath);
  
  // 2. Fix duplicate lucide-react imports
  content = fixDuplicateImports(content, filepath);
  
  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    return true;
  }
  return false;
}

// Process specific files with known issues
const targetFiles = [
  'Accelerometer.tsx',
  'AddMusicToVideo.tsx',
  'AndroidIntentSupport.tsx',
  'AnnualDiscount.tsx',
  'AppleCalendarSync.tsx',
  'ARFaceFilters.tsx',
  'BiometricAuthEnhanced.tsx',
  'BrowserPushNotifications.tsx',
  'CodeSamplesRepository.tsx',
  'CustomPostcardPrint.tsx',
  'DyslexiaFriendlyFont.tsx',
  'EnterprisePlan.tsx',
  'FaceRecognition.tsx',
  'FamilyHistoryDocumentation.tsx',
  'FamilyPlan.tsx',
  'GoogleCalendarSync.tsx',
  'GratitudeJournalIntegration.tsx',
  'HiddenAchievements.tsx',
  'IconPacks.tsx',
  'ImpersonateUser.tsx',
  'ImportFromApplePhotos.tsx',
  'ImportFromDayOne.tsx',
  'ImportFromEvernote.tsx',
  'ImportFromFacebook.tsx',
  'ImportFromGooglePhotos.tsx',
  'ImportFromInstagram.tsx',
  'ImportFromNotion.tsx',
  'LocationBasedNotifications.tsx',
  'LocationTriggeredAutoCapture.tsx',
  'MemoryCertificate.tsx',
  'MicrophoneAccess.tsx',
  'MoodComparison.tsx',
  'MoodTrackingGraph.tsx',
  'MoodTrendsAnalysis.tsx',
  'MultilingualVoiceSupport.tsx',
  'NoiseCancellation.tsx',
  'OfflineMode.tsx',
  'OrderPhotoBook.tsx',
  'OutlookCalendarSync.tsx',
  'Photo360Support.tsx',
  'PhotoOrganization.tsx',
  'PrintMapPoster.tsx',
  'PrintMemoryCards.tsx',
  'PrintTimelinePoster.tsx',
  'PushNotificationsDeepLinks.tsx',
  'QRCodeMemoryCards.tsx',
  'ReferralRewards.tsx',
  'RemoveRestoreContent.tsx',
  'ShareMemory.tsx',
  'SharedCalendars.tsx',
  'SocialMediaAutoPost.tsx',
  'SpotifySongTagging.tsx',
  'StorySharing.tsx',
  'StudentDiscount.tsx',
  'TimeDistribution.tsx',
  'Video360Memories.tsx',
  'VideoStabilization.tsx',
  'VoiceNavigation.tsx',
  'VoiceSearch.tsx',
  'WearOSSupport.tsx',
  'WebXRIntegration.tsx',
];

let fixed = 0;
for (const fname of targetFiles) {
  const fp = path.join(COMPONENTS_DIR, fname);
  if (fs.existsSync(fp)) {
    if (processFile(fp)) {
      console.log(`Fixed: ${fname}`);
      fixed++;
    }
  } else {
    console.log(`Not found: ${fname}`);
  }
}
console.log(`\nTotal fixed: ${fixed}`);
