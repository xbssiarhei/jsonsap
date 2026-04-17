# Documentation Update Process

This document describes the automated process for updating project documentation files when new features are added.

## Files to Update

When adding new features to the jsonsap library, the following documentation files must be updated:

1. **CLAUDE.md** - Project instructions for Claude Code
2. **LIB_README.md** - Library documentation for users
3. **README.md** - Project overview (if exists)
4. **src/pages/home/index.tsx** - Feature cards on home page

## Update Checklist

### 1. Identify the Feature Type

Determine which category the new feature falls into:

- **Core Functionality**: JSON configuration, component registry, renderer
- **State Management**: Store, actions, computed properties, @store.* syntax
- **UI Features**: Modifiers, Repeater, event handlers
- **Plugins**: New plugins (AutoBind, Logger, Wrapper, etc.)
- **Developer Tools**: Config editor, debugging tools
- **Integration**: API support, async actions

### 2. Update CLAUDE.md

**Location**: `/CLAUDE.md`

**Sections to update**:

- **Core Concept** (lines 10-31): Add feature to bullet list with brief description
- **Code Patterns** (lines 112-224): Add detailed explanation with code examples
  - Include JSON configuration examples
  - Show TypeScript usage if applicable
  - Explain how it integrates with existing features

**Format**:
```markdown
**Feature Name:**
- Brief description
- Key capabilities
- Integration points
- Example:
```json
{
  "example": "config"
}
```
```

### 3. Update LIB_README.md

**Location**: `/LIB_README.md`

**Sections to update**:

- **Features** (lines 8-16): Add one-line feature description
- **Main Content**: Add dedicated section with:
  - Overview paragraph
  - Usage instructions
  - Configuration examples
  - API reference
  - Common patterns

**Format**:
```markdown
## Feature Name

Brief description of what it does and why it's useful.

### Usage

```typescript
// Code example
```

### Configuration

```json
{
  "example": "config"
}
```

### Features

- Feature point 1
- Feature point 2
```

### 4. Update Home Page

**Location**: `/src/pages/home/index.tsx`

**Section**: Features array (lines 11-84)

**Add new feature object to the array**:
```typescript
const features = [
  // ... existing features
  {
    title: "Feature Name",
    description: "One-line description",
    content: "Detailed description explaining the feature's value and use case.",
  },
];
```

**Guidelines**:
- Keep title concise (2-4 words)
- Description should be 5-10 words
- Content should be 2-3 sentences
- Focus on user benefits, not implementation details
- Add to the end of the array to maintain order
- The feature will automatically render via `features.map()`
- No need to manually add Card components - they're generated from the array

### 5. Update README.md (if exists)

**Location**: `/README.md`

**Sections to update**:
- Features list
- Quick start examples (if feature affects basic usage)
- Installation instructions (if new dependencies added)

## Automation Command

To trigger documentation updates, run:

```bash
npm run docs:update
```

Or manually invoke:

```bash
# Review current features
npm run docs:review

# Generate documentation updates
npm run docs:generate

# Validate documentation
npm run docs:validate
```

## Documentation Standards

### Code Examples

- Use JSON for configuration examples
- Use TypeScript for API/usage examples
- Include comments for complex logic
- Show both simple and advanced usage

### Descriptions

- Start with action verbs (Enable, Support, Provide, etc.)
- Be specific about capabilities
- Mention integration points
- Include limitations if any

### Consistency

- Use same terminology across all docs
- Keep examples aligned (same feature shown similarly everywhere)
- Maintain consistent formatting
- Update all related sections together

## Validation Checklist

Before committing documentation updates:

- [ ] All three main docs updated (CLAUDE.md, LIB_README.md, home page)
- [ ] Code examples are valid and tested
- [ ] Feature appears in correct category
- [ ] Cross-references are accurate
- [ ] No broken links or references
- [ ] Formatting is consistent
- [ ] Examples use current API
- [ ] TypeScript types are correct

## Example: Adding a New Feature

**Scenario**: Adding a new "Validation Plugin"

1. **CLAUDE.md**:
   - Add to Core Concept → Plugin System bullet
   - Add "Validation Plugin" section under Code Patterns
   - Include configuration example

2. **LIB_README.md**:
   - Add "Validation Plugin" to Features list
   - Create new "## Validation Plugin" section
   - Document usage, configuration, and API

3. **Home Page**:
   - Add new Card in feature grid
   - Title: "Validation Plugin"
   - Description: "Automatic form validation"
   - Content: Explain validation rules and error handling

4. **Verify**:
   - Test examples work
   - Check all cross-references
   - Ensure consistent terminology

## Notes

- Documentation should be updated in the same PR as the feature
- Breaking changes require updating all examples
- Deprecated features should be marked clearly
- Keep examples minimal but complete
- Focus on common use cases first
