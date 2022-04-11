/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */

const { contextBridge, ipcMain } = require("electron");

const fs = require("fs");
const path = require("path");
const open = require("open");
const ejs = require("ejs");

const RESULT_FOLDER_PATH = path.join(".", "results");
if (!fs.existsSync(RESULT_FOLDER_PATH)) {
  fs.mkdirSync(RESULT_FOLDER_PATH);
}

const PRESET_FOLDER_PATH = path.join(".", "presets");
if (!fs.existsSync(PRESET_FOLDER_PATH)) {
  fs.mkdirSync(PRESET_FOLDER_PATH);
}

class FolderOpener {
  constructor(path) {
    this.path = path;
  }
  openFolder() {
    open(this.path);
  }
}

class ResultFolderOpener extends FolderOpener {
  constructor() {
    super(RESULT_FOLDER_PATH);
  }
}

class PresetFolderOpener extends FolderOpener {
  constructor() {
    super(PRESET_FOLDER_PATH);
  }
}

class PresetLoader {
  constructor() {
    this.path = PRESET_FOLDER_PATH;
  }
  readPresets() {
    return undefined;
  }
}

class NormalPresetLoader {
  constructor() {
    this.path = PRESET_FOLDER_PATH;
    this.presetInfoFileName = "preset_info.json";
    this.presetSourceFileName = "preset_source.ejs";
  }
  readPresets() {
    let presets = [];
    let presetFolderPath = this.path;
    let presetInfoFileName = this.presetInfoFileName;
    let presetSourceFileName = this.presetSourceFileName;
    fs.readdirSync(presetFolderPath).forEach((folderName) => {
      let infoPath = path.join(
        presetFolderPath,
        folderName,
        presetInfoFileName
      );
      if (!fs.existsSync(infoPath)) {
        console.log("InfoFile NotFound");
        return;
      }

      let sourcePath = path.join(
        presetFolderPath,
        folderName,
        presetSourceFileName
      );
      if (!fs.existsSync(sourcePath)) {
        console.log("SourceFile NotFound");
        return;
      }
      try {
        let presetInfoText = fs.readFileSync(infoPath, "utf8");
        let presetInfo = JSON.parse(presetInfoText);
        let presetSourceText = fs.readFileSync(sourcePath, "utf8");

        let preset = presetInfo;
        preset["presetSource"] = presetSourceText;
        presets[presets.length] = preset;
      } catch (e) {
        console.log(e);
      }
    });
    return presets;
  }
}
class ResultRenderer {
  render(jsonText) {
    let dataDict = JSON.parse(jsonText);
    let source = dataDict["presetSource"];
    let kv = {};
    for (let i = 0; i < dataDict.presetKeyValue.length; i++) {
      let pkv = dataDict.presetKeyValue[i];
      kv[pkv["presetKey"]] = pkv["presetValue"];
    }
    return ejs.render(source, kv);
  }
}

contextBridge.exposeInMainWorld("apiNode", {
  openPresetFolder: () => {
    let PresetFolderOpener = new PresetFolderOpener();
    PresetFolderOpener.openFolder();
  },

  readPresets: () => {
    let normalPresetLoader = new NormalPresetLoader();
    let presets = normalPresetLoader.readPresets();
    console.log(presets);
    if (presets.length == 0) {
      return [
        {
          presetName: "No Plugin",
          presetDesc: "",
          presetResultFileName: "",
          presetKeyValue: [],
        },
      ];
    } else {
      return presets;
    }
  },

  renderResult: (pluginJsonString) => {
    let renderer = new ResultRenderer();
    return renderer.render(pluginJsonString);
  },

  openChildWindow: (url) => {
    open(url);
  },

  //OpenFolder
  openResultFolder: () => {
    let resultFolderOpener = new ResultFolderOpener();
    resultFolderOpener.openFolder();
  },

  //File
  saveFile: (content) => {
    let currentResult = content["currentResult"];
    let resultFileName = content["resultFileName"];
    let resultFilePath = path.join(RESULT_FOLDER_PATH, resultFileName);
    fs.writeFileSync(resultFilePath, currentResult, "utf8");
  },
});
