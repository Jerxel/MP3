import { Moon, Sun } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/hooks/use-theme"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground shadow-xs transition-colors hover:text-foreground"
      aria-label="Toggle dark mode"
    >
      <Sun className="size-4" />
      <Switch checked={isDark} className="pointer-events-none" />
      <Moon className="size-4" />
    </button>
  )
}
