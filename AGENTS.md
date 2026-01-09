# Sailwind Component Library - Agent Reference

This document provides essential guidance for AI agents working with the Sailwind React component library for Skills-First development.

## IMPORTANT: UI Bootstrap Skill

**PROACTIVE BEHAVIOR REQUIRED:**

Before starting any UI development work, check if the `ui/` directory exists:

- **If `ui/` does NOT exist**: Invoke the `ui-bootstrap` skill by running `npm run ui:init`
  - This will automatically set up the React UI with Sailwind components
  - Wait for it to complete before proceeding with UI development
  - Inform the user the UI has been initialized

- **If `ui/` EXISTS**: Proceed with UI development normally

**When to check**: Any time the user requests UI pages, forms, dashboards, or any web interface.

**DO NOT** ask the user to initialize the UI manually. The agent should handle this proactively.

## Critical Principles

### 1. SAIL-Exact Parameters (UPPERCASE Required)

Always use UPPERCASE for SAIL parameter values:

```tsx
// ✅ CORRECT
<TagField size="STANDARD" labelPosition="COLLAPSED" />

// ❌ WRONG
<TagField size="standard" labelPosition="collapsed" />
```

### 2. Import from Sailwind Package First

**PRIMARY SOURCE: Import components from the `@pglevy/sailwind` npm package.**

```tsx
// ✅ CORRECT - Import from npm package
import { HeadingField, CardLayout, ButtonWidget } from '@pglevy/sailwind'

// ❌ WRONG - Don't look in src/components first
import { HeadingField } from '../components'
```

**Component discovery order:**
1. **FIRST**: Check Sailwind npm package documentation/available components list
2. **SECOND**: Only if component doesn't exist in package, consider creating custom component in `src/components/`
3. **LAST**: Raw HTML/third-party libraries (only when absolutely necessary)

**Note:** `src/components/` is for project-specific custom components only. Most components come from the package.

### 3. Build Validation is MANDATORY Before Completion

**A page is NOT complete until `npm run build` passes successfully.**

```bash
# REQUIRED: Run this before declaring any page complete
cd ui && npm run build
```

**Rules:**
- Run build AFTER creating the page file
- Run build AFTER adding the page to routes in `ui/src/App.tsx`
- If build fails, FIX THE ERRORS before saying "it's ready"
- Common issues: incorrect imports, typos in component names, missing type annotations

**DO NOT tell the user the page is complete if the build has not been verified.**

### 4. UserImage is NOT a Component

**CRITICAL:** `UserImage` is a data structure, not a React component.

```tsx
// ❌ WRONG - UserImage is not a component
<UserImage name="John" imageUrl="/avatar.jpg" size="SMALL" />

// ✅ CORRECT - Use ImageField with style="AVATAR"
<ImageField
  images={[{
    imageType: 'user' as const,
    user: {
      name: "John Smith",
      photoUrl: "/avatar.jpg",
      initials: "JS"
    },
    altText: "John Smith"
  }]}
  style="AVATAR"
  size="SMALL"
  marginBelow="NONE"
/>
```

## Styling Reference

### Text Sizes
- `SMALL` → `text-xs` (12px)
- `STANDARD` → `text-base` (16px)
- `MEDIUM` → `text-lg` (18px)
- `LARGE` → `text-2xl` (24px)

### Spacing
- `NONE` → `p-0`, `m-0` (0)
- `EVEN_LESS` → `p-1`, `m-1` (4px)
- `LESS` → `p-2`, `m-2` (8px)
- `STANDARD` → `p-4`, `m-4` (16px)
- `MORE` → `p-6`, `m-6` (24px)
- `EVEN_MORE` → `p-8`, `m-8` (32px)

### Colors

**Use ONLY these Tailwind color steps: 50, 100, 200, 500, 700, 900**

- **Light backgrounds:** `50`, `100`, `200`
- **Primary elements:** `500`
- **Dark text/borders:** `700`, `900`

**Semantic color mappings:**
- `ACCENT` → `blue-500`
- `POSITIVE` → `green-700`
- `NEGATIVE` → `red-700`
- `SECONDARY` → `gray-700`
- `STANDARD` → `gray-900`

### Shape (Border Radius)
- `SQUARED` → `rounded-none` (0)
- `SEMI_ROUNDED` → `rounded-sm` (4px)
- `ROUNDED` → `rounded-md` (8px)

## Common SAIL Type Definitions

```typescript
type SAILSize = "SMALL" | "STANDARD" | "MEDIUM" | "LARGE"
type SAILSizeExtended = "SMALL" | "STANDARD" | "MEDIUM" | "MEDIUM_PLUS" | "LARGE" | "LARGE_PLUS" | "EXTRA_LARGE"
type SAILAlign = "START" | "CENTER" | "END"
type SAILLabelPosition = "ABOVE" | "ADJACENT" | "COLLAPSED" | "JUSTIFIED"
type SAILMarginSize = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"
type SAILPadding = "NONE" | "EVEN_LESS" | "LESS" | "STANDARD" | "MORE" | "EVEN_MORE"
type SAILShape = "SQUARED" | "SEMI_ROUNDED" | "ROUNDED"
type SAILSemanticColor = "ACCENT" | "POSITIVE" | "NEGATIVE" | "SECONDARY" | "STANDARD"
```

**Note:** `SAILSizeExtended` is used by some components like `HeadingField` that support additional size options.

## Quick Reference Patterns

### Card with Content
```tsx
<CardLayout padding="STANDARD" showShadow={true}>
  <HeadingField text="Title" size="MEDIUM" marginBelow="STANDARD" />
  <RichTextDisplayField value={["Content here"]} />
</CardLayout>
```

### User Avatar
```tsx
<ImageField
  images={[{
    imageType: 'user' as const,
    user: {
      name: user.name,
      photoUrl: user.imageUrl,
      initials: user.name?.split(' ').map(n => n[0]).join('').toUpperCase()
    },
    altText: user.name
  }]}
  style="AVATAR"
  size="SMALL"
  marginBelow="NONE"
/>
```

### Tags
```tsx
<TagField
  tags={[{
    text: "Status",
    backgroundColor: "ACCENT"
  }]}
  size="SMALL"
  marginBelow="NONE"
/>
```

### Buttons
```tsx
<ButtonArrayLayout
  buttons={[
    { label: "Save", style: "SOLID", color: "ACCENT" },
    { label: "Cancel", style: "OUTLINE", color: "SECONDARY" }
  ]}
  align="END"
/>
```

## Development Workflow

### Page Development (Default Location: `ui/src/pages/`)

**CRITICAL: This is a starter template. Components come from the npm package.**

1. **Import from `@pglevy/sailwind` package** - All standard components are available here
2. **Use EXACT component names** from the Available Components list below (case-sensitive!)
3. **ONLY create custom components** in `ui/src/components/` if truly needed for project-specific needs
4. **Add page to routes** in `ui/src/App.tsx`
5. **REQUIRED: Run `npm run build` and fix all errors before declaring completion**
   - This is a MANDATORY gate - the page is NOT ready if build fails
   - Address all TypeScript errors before proceeding
   - Verify the build output shows no errors

### Standard Page Structure
```tsx
import { HeadingField, CardLayout } from '@pglevy/sailwind'

export default function PageName() {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        <HeadingField
          text="Page Title"
          size="LARGE"
          headingTag="H1"
          marginBelow="MORE"
        />
        <CardLayout padding="MORE" showShadow={true}>
          {/* Compose existing Sailwind components here */}
        </CardLayout>
      </div>
    </div>
  )
}
```

### Available Sailwind Components (from npm package)

**CRITICAL: Use EXACT component names below. They are case-sensitive!**

**Import these from `@pglevy/sailwind`:**

**Form/Input Fields:**
- `TextField`, `DropdownField`, `MultipleDropdownField`, `CheckboxField`
- `RadioButtonField`, `SliderField`, `SwitchField`

**Display Components:**
- `HeadingField`, `RichTextDisplayField`, `TextItem`, `MessageBanner`
- `CardLayout`, `ImageField`, `TagField`, `TagItem`, `StampField`, `ProgressBar`
- `MilestoneField`, `Icon`

**Interactive Components:**
- `ButtonWidget`, `ButtonArrayLayout`
- `DialogField`, `TabsField`, `ToggleField`

**Utility Components:**
- `TableOfContents`, `FieldLabel`, `FieldWrapper`, `CollapsibleSection`

**Common Component Name Mistakes:**
- ❌ `TextFieldInput` → ✅ `TextField`
- ❌ `TextInput` → ✅ `TextField`
- ❌ `Button` → ✅ `ButtonWidget`
- ❌ `Card` → ✅ `CardLayout`
- ❌ `Text` → ✅ `TextItem` or `RichTextDisplayField`
- ❌ `Heading` → ✅ `HeadingField`
- ❌ `Tabs` → ✅ `TabsField`
- ❌ `Tag` → ✅ `TagField`

**For complete API details, see:** https://github.com/pglevy/sailwind

### Error Resolution Pattern

When encountering "Module has no exported member" errors:

1. **FIRST: Check component name** - Compare against exact names in Available Components list above
2. Verify you're importing from `@pglevy/sailwind` (not `../components`)
3. Check the component name spelling and capitalization (case-sensitive!)
4. Check if it's a data structure (like `UserImage`) vs a component
5. Use alternative components (like `ImageField` for avatars)
6. Consult TypeScript definitions in `node_modules/@pglevy/sailwind/dist/components/`

## Common Mistakes to Avoid

1. ❌ Looking in `ui/src/components/` for Sailwind components (they're in the npm package!)
2. ❌ Importing from `../components` instead of `@pglevy/sailwind`
3. ❌ Using wrong component names (e.g., `TextField` instead of `TextFieldInput`)
4. ❌ Importing `UserImage` as a component (it's a data structure)
5. ❌ Using lowercase SAIL parameter values
6. ❌ Using raw HTML when Sailwind component exists in the package
7. ❌ Using color steps other than 50, 100, 200, 500, 700, 900
8. ❌ Declaring a page "ready" or "complete" without running `npm run build`
9. ❌ Ignoring TypeScript errors in the build output

## Testing and Validation

### MANDATORY Build Validation

**CRITICAL:** Before declaring ANY page complete, you MUST:

1. Run the build command:
   ```bash
   cd ui && npm run build
   ```

2. Verify it completes with no errors (exit code 0)

3. If build fails:
   - Read the error messages carefully
   - **Check component names against Available Components list** (most common error!)
   - Verify you're importing from `@pglevy/sailwind` (not `../components`)
   - Check for typos in component imports (case-sensitive!)
   - Ensure SAIL parameter values are typed correctly (UPPERCASE)
   - Fix all errors before proceeding

4. Only after successful build, inform the user the page is ready

**Example successful output:**
```
✓ built in XXXms
```

**If you see TypeScript errors, the page is NOT complete.**

## Component vs Page Development

### Default Workflow: Page Development (Pragmatic Prototyping)
**This is the PRIMARY use case for this starter template.**

- Import components from `@pglevy/sailwind` npm package
- Compose interfaces from existing Sailwind components
- Create pages in `ui/src/pages/`
- Add routes to `ui/src/App.tsx`
- Run `npm run build` before declaring complete

### Advanced Workflow: Custom Component Development (Only When Needed)
**ONLY create custom components when Sailwind package doesn't have what you need.**

- Create in `ui/src/components/` directory (you may need to create this directory)
- MUST use exact SAIL parameter names (UPPERCASE)
- Export from `ui/src/components/index.ts`
- Import in pages as needed
- Document why custom component was necessary
- Include SAIL translation examples if applicable

## Skills-First Backend Integration

### Understanding the Architecture

The UI connects to your Skills-First backend, where business logic lives in skills (not in React components).

```
UI (Sailwind) → API Client (api.ts) → Backend → Skill Executor → Database
```

### API Integration Pattern

**Location:** `ui/src/api.ts`

This file defines typed functions that call your backend endpoints. Each endpoint typically invokes a skill.

**Example:**
```typescript
// Define your domain type (matches backend schema)
export type Ticket = {
  id: string;
  subject: string;
  description: string;
  skill_data: Record<string, any>;  // Flexible overflow
}

// Call backend, which executes a skill
export async function createTicket(data: {
  customerName: string;
  description: string;
}): Promise<Ticket> {
  const res = await fetch('/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}
```

### Using API Functions in Pages

```tsx
import { useState } from 'react'
import { TextField, ButtonWidget } from '@pglevy/sailwind'
import { createTicket } from '../api'

export default function TicketForm() {
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // This calls the backend, which executes the skill
    await createTicket({ customerName: 'User', description })
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Description"
        value={description}
        onChange={setDescription}
        labelPosition="ABOVE"
        marginBelow="STANDARD"
      />
      <ButtonWidget label="Submit" style="SOLID" color="ACCENT" submit={true} />
    </form>
  )
}
```

### Key Principles

1. **Keep UI thin**: Business logic stays in skills, not React components
2. **Type safety**: Define types in `api.ts` that match your backend schema
3. **API proxy**: Vite proxies `/api/*` to `localhost:3000` in development
4. **Skill outputs**: Backend returns skill execution results to the UI
5. **Flexible data**: Use `skill_data` field for evolving/experimental fields

### Workflow

1. **Create/update skill** in `.claude/skills/`
2. **Update types** in `ui/src/api.ts` if schema changes
3. **Create UI page** using Sailwind components
4. **Call API functions** to invoke skills
5. **Test end-to-end** with backend running

## Resources

- **Sailwind Package:** `@pglevy/sailwind` (imported in this project)
- **Sailwind Repo:** https://github.com/pglevy/sailwind
- **SAIL Official Docs:** https://docs.appian.com/suite/help/25.3/
- **Tailwind CSS:** https://tailwindcss.com/

## Success Criteria

- ✅ Components imported from `@pglevy/sailwind` package
- ✅ Components use exact SAIL parameter names and values (UPPERCASE)
- ✅ Existing Sailwind components used wherever available from the package
- ✅ **`npm run build` completes successfully WITHOUT ERRORS (MANDATORY)**
- ✅ Pages added to routes in `ui/src/App.tsx`
- ✅ API calls properly integrated with backend skills
- ✅ Visual testing passes without errors
- ✅ Consistent Aurora color palette usage

## Before Declaring Page Complete

Use this checklist for EVERY page you create:

- [ ] Page file created in `ui/src/pages/`
- [ ] All imports are from `@pglevy/sailwind` package
- [ ] **Component names verified against Available Components list**
- [ ] All SAIL parameters use UPPERCASE values
- [ ] Page added to routes in `ui/src/App.tsx`
- [ ] API integration implemented (if needed)
- [ ] Types updated in `ui/src/api.ts` (if needed)
- [ ] **`npm run build` executed and passed with NO ERRORS**
- [ ] Dev server shows page loading without console errors

**DO NOT skip the build step. A page that doesn't build is not complete.**
