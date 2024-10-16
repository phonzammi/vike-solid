import { defineConfig } from "tsup";
import {
  generatePackageExports,
  generateTsupOptions,
  parsePresetOptions,
  writePackageJson,
  type PresetOptions,
} from "tsup-preset-solid";
import path from "path";

const preset_options: PresetOptions = {
  entries: [
    {
      // name: "src",
      entry: "./src/index.ts",
      server_entry: true,
    },
    {
      name: "integration/+config",
      entry: "./integration/+config.ts",
    },
    {
      name: "integration/Wrapper",
      entry: "./integration/Wrapper.tsx",
      // server_entry: true,
    },
  ],
};

export default defineConfig((config) => {
  // const watching = !!config.watch;

  const parsed_data = parsePresetOptions(preset_options);
  parsed_data.entries.forEach((entry) => {
    const filename = path.normalize(entry.options.entry).split(".")[0]!;
    entry.exports = {
      main: filename,
      dev: entry.exports.dev.replace(entry.filename, filename),
      server: entry.exports.server.replace(entry.filename, filename),
    };
    entry.paths = {
      main: normalizeFilepath(path.join(parsed_data.out_dir, entry.exports.main)),
      dev: normalizeFilepath(path.join(parsed_data.out_dir, entry.exports.dev)),
      server: normalizeFilepath(path.join(parsed_data.out_dir, entry.exports.server)),
    };
  });
  //   if (!watching) {
  // const package_fields = generatePackageExports(parsed_data);

  // console.log(`\npackage.json: \n${JSON.stringify(package_fields, null, 2)}\n\n`);

  /*
    will update ./package.json with the export fields
    */
  // writePackageJson(package_fields);
  //   }

  const tsup_options = generateTsupOptions(parsed_data);

  return tsup_options;
});

function normalizeFilepath(filepath: string) {
  filepath = filepath.replace(/\\/g, "/");
  if (!filepath.startsWith("./")) filepath = "./" + filepath;
  return filepath;
}
