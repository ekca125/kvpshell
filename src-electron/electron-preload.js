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

import Mustache from "mustache";

class StorageExplorer {
  constructor() {
    this.path = ".";
  }

  openFolder() {
    open(this.path);
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

  readNormalPresets(){
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
        let info = JSON.parse(fs.readFileSync(infoPath, "utf8"));

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

  readSimplePresets(){
    let presets = [];
    // 폴더 확인
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }
    // 폴더 불러오기
    fs.readdirSync(this.path).forEach((folderName) => {
      // info 위치
      let infoPath = path.join(this.path, folderName, "simple_preset_info.json");
      // source 위치
      let sourcePath = path.join(
        this.path,
        folderName,
        "simple_preset_source.mustache"
      );

      // 파일들 불러오기
      try {
        //info 읽기
        let info = JSON.parse(fs.readFileSync(infoPath, "utf8"));

        //source 읽기
        let source = fs.readFileSync(sourcePath, "utf8");

        //preset = info + source
        let preset = {};
        preset["presetName"] = info["name"]
        preset["presetDesc"] = info["name"]
        preset["presetResultFileName"] = info["result"]
        preset["presetKeyValue"] = []
        for(let property in info["kvs"]){
          let kv = {
            presetKey:property,
            presetKeyDesc:property,
            presetValue:info["kvs"][property]
          }
          preset["presetKeyValue"].push(kv)
        }
        preset["presetSource"] = source;

        //리스트 삽입
        presets[presets.length] = preset;
      } catch (e) {
      }
    });
    return presets;
  }

  readSimplePresets(){
    let presets = [];
    // 폴더 확인
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }
    // 폴더 불러오기
    fs.readdirSync(this.path).forEach((folderName) => {
      // source 위치
      let sourcePath = path.join(
        this.path,
        folderName,
        "source.mustache"
      );

      // 파일들 불러오기
      try {
        //source 읽기
        let source = fs.readFileSync(sourcePath, "utf8");

        //preset = info + source
        let preset = {};
        preset["presetName"] = folderName
        preset["presetDesc"] = folderName
        preset["presetResultFileName"] = folderName+".txt"
        preset["presetKeyValue"] = []
        preset["presetSource"] = source;

        // key-value
        keys_data = source.matchAll("[{{].*[}}]")

        for(let property in keys_data){
          let kv = {
            presetKey:property,
            presetKeyDesc:property,
            presetValue:""
          }
          preset["presetKeyValue"].push(kv)
        }
        
        //리스트 삽입
        presets[presets.length] = preset;
      } catch (e) {
      }
    });
    return presets;
  }

  readPresets() {
    let presets = []
    presets = presets.concat(this.readNormalPresets());
    console.log(presets)
    presets = presets.concat(this.readSimplePresets());
    console.log(presets)
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

class ResultStorageExplorer extends StorageExplorer {
  constructor() {
    super();
    this.path = path.join(".", "result");
  }
  openFolder() {
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }
    open(this.path);
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
    return Mustache.render(source, kv);
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
