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
var spawn = require("child_process").spawn;
import { platform } from "process";
import * as Mustache from 'mustache';


contextBridge.exposeInMainWorld("apiMustache", {
  getResult: (channel, content) => {
    console.log(content)
    return Mustache.render(content["pluginSource"],content["pluginKeyValue"]);
  },
});

contextBridge.exposeInMainWorld("apiOpenFolder", {
  openResultFolder: (channel, content) => {
    let resultDir = path.join(".", "result");
    if (!fs.existsSync(resultDir)) {
      fs.mkdirSync(resultDir);
    }
    if (platform === "win32") {
      spawn("explorer", [resultDir]);
    } else if (platform === "linux") {
      spawn("nautilus", [resultDir]);
    }
  },

  openPluginFolder: (channel, content) => {
    let kvpPluginSpacePath = getKvpPluginSpacePath();
    if (platform === "win32") {
      spawn("explorer", [kvpPluginSpacePath]);
    } else if (platform === "linux") {
      spawn("nautilus", [kvpPluginSpacePath]);
    }
  },
});

contextBridge.exposeInMainWorld("apiFile", {
  saveFile: (channel, content) => {
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

contextBridge.exposeInMainWorld("apiKvpPlugin", {
  getKvpPlugins: (channel, data) => {
    let kvpPluginSpacePath = getKvpPluginSpacePath();
    let kvpPlugins = readKvpPluginSpace(kvpPluginSpacePath);
    return kvpPlugins;
  },
});

function getKvpPluginSpacePath() {
  let debug = true;
  if (debug == true) {
    return path.join("C://", "data", "plugins");
  } else if (debug == false) {
    return path.join(".", "plugins");
  }
}

function readKvpPluginSpace(kvpPluginSpacePath) {
  let kvpPlugins = [];
  fs.readdirSync(kvpPluginSpacePath).forEach((pluginFolderName) => {
    let pluginInfoPath = path.join(
      kvpPluginSpacePath,
      pluginFolderName,
      "plugin_info.json"
    );
    let pluginSourcePath = path.join(
      kvpPluginSpacePath,
      pluginFolderName,
      "plugin_source.mustache"
    );
    try {
      //info 읽기
      let pluginInfo = JSON.parse(fs.readFileSync(pluginInfoPath, "utf8"));

      //source 읽기
      let pluginSource = fs.readFileSync(pluginSourcePath, "utf8");

      //kvpPlugin = info + source
      let kvpPlugin = pluginInfo;
      kvpPlugin["pluginSource"] = pluginSource;

      //리스트 삽입
      kvpPlugins[kvpPlugins.length] = kvpPlugin;
    } catch (e) {
      console.log("error load: " + pluginFolderName);
    }
  });
  return kvpPlugins;
}
