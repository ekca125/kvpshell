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
const spawn = require("child_process").spawn;
const open = require("open");

import { platform } from "process";
import Mustache from "mustache";

contextBridge.exposeInMainWorld("apiNode", {
  renderPluginResult: (pluginJsonString) => {
    let pluginJson = JSON.parse(pluginJsonString);
    let pluginSource = pluginJson["pluginSource"];
    let pluginKeyValue = {};
    for (let i = 0; i < pluginJson.pluginKeyValue.length; i++) {
      let pkv = pluginJson.pluginKeyValue[i];
      pluginKeyValue[pkv["pluginKey"]] = pkv["pluginValue"];
    }
    return Mustache.render(pluginSource, pluginKeyValue);
  },

  openChildWindow: (url) => {
    open(url);
  },

  //OpenFolder
  openResultFolder: () => {
    let resultDir = path.join(".", "result");
    if (!fs.existsSync(resultDir)) {
      fs.mkdirSync(resultDir);
    }
    open(resultDir);
  },

  openPluginFolder: () => {
    let kvpPluginSpacePath = getKvpPluginSpacePath();
    open(kvpPluginSpacePath);
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

  getPlugins: () => {
    let kvpPluginSpacePath = getKvpPluginSpacePath();
    let kvpPlugins = readKvpPluginSpace(kvpPluginSpacePath);
    if (kvpPlugins.length == 0) {
      kvpPlugins[0] = {
        pluginName: "No Plugin",
        pluginDesc: "",
        pluginResultFileName: "",
        pluginKeyValue: [],
      };
    }
    return kvpPlugins;
  },
});

function getKvpPluginSpacePath() {
  let debug = false;
  if (debug == true) {
    return path.join("C://", "data", "plugins");
  } else if (debug == false) {
    return path.join(".", "plugins");
  }
}

function readKvpPluginSpace(kvpPluginSpacePath) {
  let kvpPlugins = [];
  if (!fs.existsSync(kvpPluginSpacePath)) {
    fs.mkdirSync(kvpPluginSpacePath);
  }
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
