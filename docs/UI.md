# UI/UX Design Guidelines

## Design Philosophy
The Shell should feel like a **mobile home screen on a desktop**.
Clean, minimal, icon-driven. No menus, no toolbars, no clutter.
Everything the user needs is one click away.

---

## Home Screen — Plugin Grid

### Layout
- CSS Grid: `repeat(auto-fill, minmax(120px, 1fr))`
- Outer padding: `24px`
- Gap between cards: `20px`
- Background: `#1a1a2e` (deep navy)

### Plugin Icon Card (`plugin-icon` component)
- Size: `120px × 140px`
- Background: `#16213e`, `border-radius: 16px`
- Icon image: `64px × 64px`, centered
- Plugin name: `12px`, white, centered, max 2 lines, ellipsis overflow
- Hover: `box-shadow: 0 0 12px rgba(100, 180, 255, 0.4)`, transition `150ms`
- Click: `transform: scale(0.96)`, transition `100ms`

### Status Dot
- Position: bottom-right corner of card, `10px` diameter
- `#4caf50` green = loaded successfully
- `#f44336` red = failed to load
- `#9e9e9e` gray = unknown / pending

---

## Side Panel — Plugin Drawer (`side-panel` component)

### Container
- Fixed, right side, full height (`100vh`)
- Width: `360px`
- Background: `#0f3460`
- Opens: `transform: translateX(100%)` → `translateX(0)`, `250ms cubic-bezier(0.4, 0, 0.2, 1)`
- Closes: reverse, `200ms`
- Left shadow: `box-shadow: -4px 0 24px rgba(0,0,0,0.5)`
- Overlay behind panel: semi-transparent black `rgba(0,0,0,0.4)`, click to close

### Panel Header
- Plugin icon `32px` + name `18px bold` white, side by side
- Close (✕) button: top-right, `24px`, muted color, hover turns white
- Bottom border: `1px solid rgba(255,255,255,0.1)`
- Padding: `20px`

### Form Area
- Padding: `20px`
- Control spacing: `16px` between each
- Label style: `11px`, `#a0aec0`, uppercase, `letter-spacing: 0.08em`, `margin-bottom: 6px`
- Input base style: full width, `background: #1a1a2e`, `color: white`,
  `border: 1px solid rgba(255,255,255,0.15)`, `border-radius: 8px`, `padding: 10px 12px`
- Focus: border color → `#4299e1`

---

## Control Styles

### Text Control
- Standard text input, themed as above
- Placeholder: `#4a5568`

### Number Control
- `<input type="number">` styled same as text
- Min/max enforced via Angular form validators
- Invalid state: red border `#f44336` + inline error message below

### Boolean Control (Toggle)
- Full-width row: label on left, toggle switch on right
- Toggle: custom CSS, `44px × 24px`
- On state: `#4299e1` blue track, white thumb
- Off state: `#4a5568` gray track, white thumb
- Transition: `200ms`

### Range Control
- Custom styled `<input type="range">`
- Live value badge displayed to the right of the slider
- Min/max labels at each end in muted text `10px`
- Track: `#4a5568`, filled portion: `#4299e1`
- Thumb: white circle, `18px`

### File Control
- Row layout: Browse button (left) + filename label (right)
- Browse button: outlined style, `border: 1px solid #4299e1`, `color: #4299e1`,
  `border-radius: 6px`, `padding: 8px 16px`, hover: fills blue
- Filename label: muted gray, italic, truncated with ellipsis
- No file selected state: "No file chosen" in `#4a5568`
- File too large: red inline error below the row
- Accepted file types shown as hint: e.g. "Accepts: .csv, .txt" in `10px` muted text

---

## Panel Footer

- Fixed at the bottom of the panel
- Padding: `20px`
- Top border: `1px solid rgba(255,255,255,0.1)`
- Apply button: full width, `background: #4299e1`, white bold text, `border-radius: 8px`, `padding: 12px`
- Hover: `background: #3182ce`
- Disabled (form invalid): `opacity: 0.4`, `cursor: not-allowed`
- Success state: brief green flash (`#4caf50`) + "✓ Applied" text, 2s then resets
- Error state: red inline message above the button, does not close the panel

---

## Error & Loading States

### Loading (fetching params)
- Skeleton shimmer placeholders — 3–4 gray animated bars in the form area
- Shimmer: CSS animation `background: linear-gradient(90deg, #16213e, #1e2f4e, #16213e)`

### Plugin Unresponsive
```
      ⚠️  Plugin is not responding
      [        Retry        ]
```
- Centered vertically in form area
- Retry: outlined button, same style as Browse

### Plugin Load Error (on grid)
- Red status dot on icon card
- Tooltip on hover: shows error message

---

## Color Palette (SCSS Variables)

```scss
$bg-app:        #1a1a2e;   // App background
$bg-surface:    #16213e;   // Cards, icon backgrounds
$bg-panel:      #0f3460;   // Side panel
$accent:        #4299e1;   // Buttons, active states, focus borders
$accent-hover:  #3182ce;   // Hover on accent elements
$text-primary:  #ffffff;   // Headings, values
$text-muted:    #a0aec0;   // Labels, hints, secondary text
$text-disabled: #4a5568;   // Placeholders, off states
$success:       #4caf50;   // Apply confirmation
$error:         #f44336;   // Errors, validation failures
$border:        rgba(255, 255, 255, 0.1);  // Dividers, subtle borders
```

---

## Animation Summary

| Interaction | Animation |
|------------|-----------|
| Panel open | Slide in from right, 250ms ease |
| Panel close | Slide out to right, 200ms ease |
| Overlay | Fade in, 200ms |
| Icon hover | Glow shadow, 150ms |
| Icon click | Scale 0.96, 100ms |
| Toggle switch | Track color + thumb slide, 200ms |
| Apply success | Green flash, 300ms, resets after 2s |
| Skeleton | Shimmer sweep, infinite loop |
