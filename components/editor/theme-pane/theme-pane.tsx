import { Notice } from "@/components/common/notice";
import { useTheme } from "@/components/editor/theme/use-theme";
import { switchTheme } from "@/lib/resume/switch-theme";
import { setThemeOption, themeOptionsOf } from "@/lib/resume/theme-options";
import { ACCENT_IDS, DENSITY_IDS, TYPEFACE_IDS, type Resume, type ResumeEdit } from "@/lib/resume/types";
import { ACCENTS, DENSITIES, TYPEFACES } from "@/lib/theme/theme-option-choices";
import { themeName } from "@/lib/theme/theme-name";
import { ThemeOptionRow } from "./theme-option-row";
import { ThemePicker } from "./theme-picker";

/**
 * The Theme tab: the Theme cards (#107), then the Resume's Theme Options
 * (#89), accent, typeface and density, saved in its Theme Settings so the
 * preview and Export follow them. Each shows the Theme's default until
 * another is picked.
 *
 * The cards don't wait for the Theme to load, so they stay put, and keep
 * focus, while a newly picked Theme loads.
 */
export function ThemePane({ resume, onEdit }: { resume: Resume; onEdit: (edit: ResumeEdit) => void }) {
  const { themeId } = resume.themeSettings;
  const theme = useTheme(themeId);
  const options = theme && themeOptionsOf(resume, theme.defaultOptions);

  return (
    <div className="flex grow flex-col gap-6 overflow-auto px-6 pt-5 pb-6">
      <ThemePicker
        themeId={themeId}
        sectionTitleColour={options ? ACCENTS[options.accent].hex : "var(--color-line-input)"}
        onPick={(picked) => onEdit((current) => switchTheme(current, picked))}
      />
      <div className="flex flex-col gap-1">
        <h2 className="flex items-baseline gap-2 border-b border-line-soft pb-2">
          <span className="text-[14px] font-semibold">Customize {themeName(themeId)}</span>
          <span className="text-[12.5px] font-normal text-ink-meta">for this resume only</span>
        </h2>
        {options ? (
          <>
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
          </>
        ) : (
          <div className="pt-16">
            <Notice title="Loading theme…" />
          </div>
        )}
      </div>
    </div>
  );
}
