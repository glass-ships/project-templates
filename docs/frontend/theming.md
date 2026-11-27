# Theming

Colors, fonts, sizes and breakpoints are Sass variables in `src/global/_variables.scss`. Use them in a component's styles with:

```scss
@use "@/global/variables" as v;

.panel {
  background: v.$bg;
  color: v.$text;
  border-radius: v.$rounded;

  @media (max-width: v.$phone) {
    padding: 10px;
  }
}
```

## Light and dark

Theme colors are written with CSS [`light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark), the light value first:

```scss
$text: light-dark(oklch(0.15 0 0), oklch(0.96 0 0));
```

The browser picks the value that matches the page's color scheme. [`ThemeToggle`](api/components/ui/ThemeToggle.md), in the navbar, sets that scheme: it puts a `light` or `dark` class on `<html>`, and `styles.scss` turns the class into `color-scheme`. Until the user picks a theme, it follows their system setting, and it saves their choice in `localStorage`.

So a component never needs its own dark-mode styles: use the theme variables, and both themes work.

## Theme colors

| Variable                                                          | Use                                                                        |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `$primary`, `$secondary`, `$tertiary`                             | Brand colors, e.g. [`AppButton`](api/components/ui/AppButton.md)'s `color` |
| `$primary-dark`, `$primary-light` (and the same for `$secondary`) | Darker and lighter shades                                                  |
| `$bg-dark`, `$bg`, `$bg-light`                                    | The page, cards, and raised elements, from back to front                   |
| `$text`, `$text-muted`                                            | Headings, and body text                                                    |
| `$success`, `$error`                                              | Status colors                                                              |
| `$white` ... `$black`                                             | Neutrals, the same in both themes                                          |

The shades are worked out from their base color with relative OKLCH colors, so changing `$primary` updates `$primary-dark` and `$primary-light` too:

```scss
$primary: light-dark(oklch(0.5 0.2 280), oklch(0.6 0.2 280));
$primary-dark: oklch(from $primary calc(l - 0.1) c h); // 0.1 darker
$primary-light: oklch(from $primary calc(l + 0.1) c h); // 0.1 lighter
```

Colors use [OKLCH](https://oklch.com/): lightness (0 to 1), chroma (how colorful), and hue (an angle). Equal changes in lightness look equally different, which makes shades and contrast easier to predict than with RGB or HSL.

Check contrast after changing colors: the [accessibility tests](testing.md#accessibility-tests) run axe on every page in both themes.

## Fonts

`$sans` (Roboto) and `$mono` (Courier Prime) are loaded from Google Fonts by the `<link>` in `index.html`. To change a font, update both the link and the variable. The Geist fonts in `src/assets/fonts/` are there if you'd rather host them yourself.

## Other variables

| Variable                              | Value                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------- |
| `$fs-tiny` ... `$fs-3xl`              | Font sizes, 0.8rem to 8rem                                                            |
| `$light`, `$normal`, `$bold`          | Font weights: 100, 300, 500                                                           |
| `$section`, `$section-big`            | Content widths: 900px and 1400px. See [`AppSection`](api/components/ui/AppSection.md) |
| `$tablet`, `$phone`                   | Breakpoints: 900px and 600px                                                          |
| `$rounded`                            | Corner radius                                                                         |
| `$shadow-s`, `$shadow-m`, `$shadow-l` | Shadows, from flattest to most raised                                                 |
| `$fast`, `$slow`                      | Transitions: 0.35s and 1s                                                             |
