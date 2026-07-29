export type AccentColor = 'emerald' | 'violet' | 'pink' | 'amber'
export type ThemeMode = 'dark' | 'light'

const ACCENT_COLORS: Record<AccentColor, { hex: string; glow: string; subtle: string }> = {
  emerald: { hex: '#10b981', glow: 'rgba(16, 185, 129, 0.25)', subtle: 'rgba(16, 185, 129, 0.12)' },
  violet: { hex: '#a855f7', glow: 'rgba(168, 85, 247, 0.25)', subtle: 'rgba(168, 85, 247, 0.12)' },
  pink: { hex: '#ec4899', glow: 'rgba(236, 72, 153, 0.25)', subtle: 'rgba(236, 72, 153, 0.12)' },
  amber: { hex: '#f59e0b', glow: 'rgba(245, 158, 11, 0.25)', subtle: 'rgba(245, 158, 11, 0.12)' },
}

export const applyThemeMode = (mode: ThemeMode) => {
  const root = document.documentElement
  if (mode === 'light') {
    root.classList.remove('dark')
    root.classList.add('light')
  } else {
    root.classList.remove('light')
    root.classList.add('dark')
  }
  localStorage.setItem('lifeos_theme_mode', mode)
}

export const applyAccentColor = (accent: AccentColor) => {
  const selectedAccent = ACCENT_COLORS[accent] ? accent : 'emerald'
  const config = ACCENT_COLORS[selectedAccent]

  let styleTag = document.getElementById('dynamic-theme-style')
  if (!styleTag) {
    styleTag = document.createElement('style')
    styleTag.id = 'dynamic-theme-style'
    document.head.appendChild(styleTag)
  }

  styleTag.innerHTML = `
    :root, .dark, .light, html {
      --primary: ${config.hex} !important;
      --primary-foreground: #ffffff !important;
      --ring: ${config.hex} !important;
    }
    
    .bg-primary, .theme-accent-bg {
      background-color: ${config.hex} !important;
      color: #ffffff !important;
    }

    .bg-primary\\/10, .bg-primary\\/20,
    .bg-rose-500\\/10, .bg-pink-500\\/10, .bg-rose-500\\/20, .bg-pink-500\\/20,
    .bg-violet-500\\/10, .bg-emerald-500\\/10, .bg-amber-500\\/10 {
      background-color: ${config.subtle} !important;
    }

    .text-primary, .theme-accent-text,
    .text-rose-400, .text-rose-500, .text-pink-400, .text-pink-500 {
      color: ${config.hex} !important;
    }

    .border-primary, .border-rose-500, .border-pink-500 {
      border-color: ${config.hex} !important;
    }

    input[type="range"] {
      accent-color: ${config.hex} !important;
    }
    input[type="range"]::-webkit-slider-thumb {
      background-color: ${config.hex} !important;
      border-color: ${config.hex} !important;
    }
    input[type="range"]::-moz-range-thumb {
      background-color: ${config.hex} !important;
      border-color: ${config.hex} !important;
    }
  `

  localStorage.setItem('lifeos_accent_color', selectedAccent)
}