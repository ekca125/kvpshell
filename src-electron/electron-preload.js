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

const RESULT_FOLDER_PATH = path.join(".","results")
if (!fs.existsSync(RESULT_FOLDER_PATH)) {
  fs.mkdirSync(RESULT_FOLDER_PATH);
}

const PRESET_FOLDER_PATH = path.join(".","presets") 
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

class PresetLoader{
  constructor(){
    this.path = PRESET_FOLDER_PATH
  }
  readPresets(){
    return undefined
  }
}

class NormalPresetLoader{
  constructor(){
    this.path = PRESET_FOLDER_PATH
  }
  readPresets(){
    let presets = [];

  }
}



class PresetStorageExplorer extends StorageExplorer {
  constructor() {
    super();
    let debug = false;
    if (debug == true) {
      this.path = path.join("C://", "data", "presets");
    } else if (debug == false) {
      this.path = path.join(".", "presets");
    }
  }

  readNormalPresets() {
    let presets = [];
    // 폴더 확인
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }
    // 폴더 불러오기
    fs.readdirSync(this.path).forEach((folderName) => {
      // info 위치

      let infoPath = path.join(this.path, folderName, "preset_info.json");
      // source 위치

      let sourcePath = path.join(
        this.path,
        folderName,
        "preset_source.mustache"
      );

      // 파일들 불러오기
      try {
        //info 읽기
        if (!fs.existsSync(infoPath)) {
          return;
        }
        let info = JSON.parse(fs.readFileSync(infoPath, "utf8"));

        if (!fs.existsSync(sourcePath)) {
          return;
        }
        //source 읽기
        let source = fs.readFileSync(sourcePath, "utf8");

        //preset = info + source
        let preset = info;
        preset["presetSource"] = source;

        //리스트 삽입
        presets[presets.length] = preset;
      } catch (e) {}
    });
    return presets;
  }

  readPresets() {
    let presets = [];
    presets = presets.concat(this.readNormalPresets());
    console.log(presets);
    presets = presets.concat(this.readSimplePresets());
    console.log(presets);
    presets = presets.concat(this.readSourcePresets());
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
  }
}

class PluginResultRenderer {
  constructor(dataJson) {
    this.data = JSON.parse(dataJson);
  }

  render() {
    let source = this.data["presetSource"];
    let kv = {};
    for (let i = 0; i < this.data.presetKeyValue.length; i++) {
      let pkv = this.data.presetKeyValue[i];
      kv[pkv["presetKey"]] = pkv["presetValue"];
    }
    return ejs.render(source, kv);
  }
}

let presetStorageExplorer = new PresetStorageExplorer();
let resultStorageExplorer = new ResultStorageExplorer();

contextBridge.exposeInMainWorld("apiNode", {
  openPresetFolder: () => {
    presetStorageExplorer.openFolder();
  },

  readPresets: () => {
    return presetStorageExplorer.readPresets();
  },

  renderResult: (pluginJsonString) => {
    let renderer = new PluginResultRenderer(pluginJsonString);
    return renderer.render();
  },

  openChildWindow: (url) => {
    open(url);
  },

  //OpenFolder
  openResultFolder: () => {
    resultStorageExplorer.openFolder();
  },

  //File
  saveFile: (content) => {
    let currentResult = content["currentResult"];
    let resultFileName = content["resultFileName"];
    let resultDir = path.join(".", "result");
    if (!fs.existsSync(resultDir)) {
      fs.mkdirSync(resultDir);
    }
    let resultFilePath = path.join(resultDir, resultFileName);
    fs.writeFileSync(resultFilePath, currentResult, "utf8");
  },
});
