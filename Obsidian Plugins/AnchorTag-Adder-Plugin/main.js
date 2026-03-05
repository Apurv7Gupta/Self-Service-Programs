const { Plugin } = require("obsidian");

module.exports = class FunctionAnchorSmasherPlugin extends Plugin {
  onload() {
    this.addCommand({
      id: "smash-function-names-into-anchors",
      name: "Smash function name into anchor",
      editorCallback: (editor) => {
        const lineCount = editor.lineCount();

        for (let i = 0; i < lineCount; i++) {
          const line = editor.getLine(i);

          // Match function line with backticks and optional trailing anchor
          const match = line.match(
            /^`([a-zA-Z0-9_]+)\(\)`(?!.*\^([a-zA-Z0-9]+))/
          );
          if (!match) continue;

          const rawFunc = match[1];
          const smashed = rawFunc.toLowerCase().replace(/_/g, "");

          if (line.includes(`^${smashed}`)) continue; // already has anchor

          const updatedLine = line + ` ^${smashed}`;
          editor.setLine(i, updatedLine);
        }
      },
    });
  }
};
