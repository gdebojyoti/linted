import { Notice } from "@/components/common/notice";
import { useTheme } from "@/components/editor/theme/use-theme";
import { setThemeOption, themeOptionsOf } from "@/lib/resume/theme-options";
import { ACCENT_IDS, DENSITY_IDS, TYPEFACE_IDS, type Resume, type ResumeEdit } from "@/lib/resume/types";
import { ACCENTS, DENSITIES, TYPEFACES } from "@/lib/theme/theme-option-choices";
import { themeName } from "@/lib/theme/theme-name";
import { ThemeOptionRow } from "./theme-option-row";

/**
 * The Theme tab: the Resume's Theme Options (#89), accent, typeface and
 * density, saved in its Theme Settings so the preview and Export follow
 * them. Each shows the Theme's default until another is picked.
 *
 * There's only Ledger, so there are no Theme cards yet (docs/design/NOTES.md).
 */
export function ThemePane({ resume, onEdit }: { resume: Resume; onEdit: (edit: ResumeEdit) => void }) {
  const theme = useTheme(resume.themeSettings.themeId);

  if (!theme) {
    return (
      <div className="px-6 pt-32">
        <Notice title="Loading theme…" />
      </div>
    );
  }

  const options = themeOptionsOf(resume, theme.defaultOptions);

  return (
    <div className="flex grow flex-col gap-1 overflow-auto px-6 pt-5 pb-6">
      <h2 className="flex items-baseline gap-2 border-b border-line-soft pb-2">
        <span className="text-[14px] font-semibold">Customize {themeName(theme.id)}</span>
        <span className="text-[12.5px] font-normal text-ink-meta">for this resume only</span>
      </h2>
      <ThemeOptionRow
        label="Accent"
        choices={ACCENT_IDS.map((id) => ({ value: id, label: ACCENTS[id].label, swatch: ACCENTS[id].hex }))}
        value={options.accent}
        onChange={(accent) => onEdit((current) => setThemeOption(current, "accent", accent))}
      />
      <ThemeOptionRow
        label="Typeface"
        choices={TYPEFACE_IDS.map((id) => ({ value: id, label: TYPEFACES[id].label }))}
        value={options.typeface}
        onChange={(typeface) => onEdit((current) => setThemeOption(current, "typeface", typeface))}
      />
      <ThemeOptionRow
        label="Density"
        choices={DENSITY_IDS.map((id) => ({ value: id, label: DENSITIES[id].label }))}
        value={options.density}
        onChange={(density) => onEdit((current) => setThemeOption(current, "density", density))}
      />
    </div>
  );
}
