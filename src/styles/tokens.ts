/** Design tokens (F16). Historical pigments; vermilion is reserved for misbeliefs. Mirrored in tokens.css. */
export const LIGHT = {
  paper: '#f2e9d8', 'paper-shade': '#ece1cb', 'paper-deep': '#e2d4b8', ink: '#2a2017', 'ink-soft': '#5c4a38', ghost: '#bba987',
  madder: '#9e2b3a', rose: '#b9605f', indigo: '#2c4777', orpiment: '#b9851c', verdigris: '#2f7563', ochre: '#a26a22', bone: '#cdbb95', umber: '#7a5a3c',
  vermilion: '#cf3a1c', gold: '#a87b22', white: '#ffffff',
} as const;
export const DARK = {
  paper: '#1b1510', 'paper-shade': '#241c15', 'paper-deep': '#2d2319', ink: '#e6cf98', 'ink-soft': '#b59c70', ghost: '#5a4a36',
  madder: '#d0606b', rose: '#d08a84', indigo: '#7f9bd0', orpiment: '#e2b04a', verdigris: '#62b39d', ochre: '#d39a50', bone: '#cdbb95', umber: '#b08a64',
  vermilion: '#ff6a45', gold: '#e2b04a', white: '#ffffff',
} as const;
export const tokenString = (t: Record<string, string>) => Object.entries(t).map(([k, v]) => `--${k}:${v}`).join(';');
