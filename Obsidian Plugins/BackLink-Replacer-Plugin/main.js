const { Plugin, Modal, Notice } = require("obsidian");

class LinkUpdaterModal extends Modal {
  constructor(app, onSubmit) {
    super(app);
    this.onSubmit = onSubmit;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h3", { text: "Enter Target Name (e.g. Multiset):" });
    const input = contentEl.createEl("input", { type: "text" });
    input.style.width = "100%";
    input.focus();

    contentEl.createEl("h3", { text: "Paste JSON here:" });
    const textarea = contentEl.createEl("textarea");
    textarea.style.width = "100%";
    textarea.style.height = "150px";

    const submitBtn = contentEl.createEl("button", { text: "Update Links" });
    submitBtn.style.marginTop = "10px";
    submitBtn.onclick = () => {
      this.close();
      this.onSubmit(input.value.trim(), textarea.value.trim());
    };
  }
  onClose() {
    this.contentEl.empty();
  }
}

module.exports = class LinkUpdaterPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "update-links-in-json",
      name: "Update links in JSON clipboard data",
      callback: () => {
        new LinkUpdaterModal(this.app, async (targetName, jsonStr) => {
          try {
            const updatedJson = this.updateLinks(jsonStr, targetName);

            // ✅ Copy to clipboard using Obsidian clipboard API
            await navigator.clipboard.writeText(updatedJson);

            new Notice("Updated JSON copied to clipboard ✅");
          } catch (e) {
            new Notice("Invalid JSON or error occurred ❌");
            console.error(e);
          }
        }).open();
      },
    });
  }

  updateLinks(jsonStr, target) {
    const data = JSON.parse(jsonStr);
    data.elements.forEach((el) => {
      if (el.text) {
        let funcName = el.text;
        if (funcName.endsWith("()")) {
          funcName = funcName.slice(0, -2);
        }
        let anchor = funcName.replace(/_/g, "");
        el.link = `[${funcName}()](${target}#^${anchor})`;
      }
    });
    return JSON.stringify(data, null, 2);
  }
};
