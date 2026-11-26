// @ts-check
// TypeDoc plugin: use the names people know for default exports and pages
import { Converter, ParameterReflection, ReflectionKind, Renderer } from "typedoc";

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
}
