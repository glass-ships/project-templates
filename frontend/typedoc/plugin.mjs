// @ts-check
// TypeDoc plugin: use the names people know for default exports and pages, and write the
// index page and the sidebar (SUMMARY.md, read by Zensical's literate-nav) grouped by folder
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { Converter, ParameterReflection, ReflectionKind, Renderer } from "typedoc";

// source folder (relative to src/) -> section title, in sidebar order
const SECTIONS = {
  components: "Components",
  "components/ui": "UI components",
  hooks: "Hooks",
  utils: "Utilities",
};

/**
 * One line for the index: the file's main export's summary (`AppButton` in AppButton.tsx), else
 * the names of what it exports.
 * @param {import("typedoc").DeclarationReflection} module
 */
function summary(module) {
  const main = /** @type {import("typedoc").DeclarationReflection | undefined} */ (module.getChildByName(module.name));
  const comment = module.comment ?? main?.comment ?? main?.signatures?.[0]?.comment;
  if (!comment) return (module.children ?? []).map((child) => `\`${child.name}\``).join(", ");
  const text = comment.summary.map((part) => (part.kind === "inline-tag" ? `\`${part.text}\`` : part.text)).join("");
  return text
    .split(/\n\s*\n/)[0]
    .replace(/\s*\n\s*/g, " ")
    .replaceAll("|", "\\|");
}

/** @param {import("typedoc").Application} app */
export function load(app) {
  // TypeDoc calls every default export "default"; use its own name instead:
  // `export default function useFetch` -> "useFetch", `export default AppBackToTopButton` -> "AppBackToTopButton"
  app.converter.on(Converter.EVENT_CREATE_DECLARATION, (context, reflection) => {
    if (reflection.name !== "default") return;
    const declaration = context.getSymbolFromReflection(reflection)?.declarations?.[0];
    if (!declaration) return;
    const node = "expression" in declaration ? declaration.expression : declaration;
    const name = node && "name" in node && node.name ? node.name.getText() : node?.getText?.();
    if (name && /^[A-Za-z_$][\w$]*$/.test(name)) reflection.name = name;
  });

  // TypeDoc calls a destructured parameter "__namedParameters". Call it "props" for a component
  // (a capitalized function), else after its type (`{ x, y, z }: Point3d` -> "point3d"), else "options".
  // Done once conversion is over, when the parameters' types are known.
  app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context) => {
    for (const parameter of context.project.getReflectionsByKind(ReflectionKind.Parameter)) {
      if (parameter.name !== "__namedParameters" || !(parameter instanceof ParameterReflection)) continue;
      const fn = parameter.parent?.parent;
      const type = parameter.type?.type === "reference" ? parameter.type.name : "";
      if (fn && /^[A-Z]/.test(fn.name)) parameter.name = "props";
      else if (type) parameter.name = type[0].toLowerCase() + type.slice(1);
      else parameter.name = "options";
    }
  });

  // "components/ui/AppButton" -> "AppButton" in titles and links. Done after the pages are given
  // their paths, so the files keep their folders (components/ui/AppButton.md), which group the sidebar.
  app.renderer.on(Renderer.EVENT_BEGIN, (event) => {
    for (const module of event.project.getReflectionsByKind(ReflectionKind.Module)) {
      module.name = module.name.split("/").at(-1) ?? module.name;
    }
  });

  // replace the generated index (one flat list of every file) with a table per section, and write
  // the same grouping as the sidebar
  app.renderer.on(Renderer.EVENT_END, (event) => {
    /** @type {Map<string, { name: string, url: string, summary: string }[]>} */
    const sections = new Map(Object.values(SECTIONS).map((title) => [title, []]));
    for (const module of event.project.getReflectionsByKind(ReflectionKind.Module)) {
      const url = app.renderer.router?.getFullUrl(module) ?? "";
      const title = SECTIONS[/** @type {keyof typeof SECTIONS} */ (dirname(url))] ?? dirname(url);
      if (!sections.has(title)) sections.set(title, []);
      sections.get(title)?.push({ name: module.name, url, summary: summary(/** @type {any} */ (module)) });
    }

    let index = `# ${event.project.name}\n\nGenerated from the doc comments in \`frontend/src/\` by \`bun run docs\`.\n`;
    let nav = `- [Overview](index.md)\n`;
    for (const [title, modules] of sections) {
      if (!modules.length) continue;
      modules.sort((a, b) => a.name.localeCompare(b.name));
      index += `\n## ${title}\n\n| Name | Description |\n| --- | --- |\n`;
      index += modules.map((m) => `| [${m.name}](${m.url}) | ${m.summary} |\n`).join("");
      nav += `- ${title}\n${modules.map((m) => `    - [${m.name}](${m.url})\n`).join("")}`;
    }
    writeFileSync(join(event.outputDirectory, "index.md"), index);
    writeFileSync(join(event.outputDirectory, "SUMMARY.md"), nav);
  });
}
