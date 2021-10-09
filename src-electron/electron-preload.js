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
const { contextBridge } = require("electron");

const fs = require("fs");
const path = require("path");

function getPluginSpacePath() {
  let debug = true;
  if (debug == true) {
    return path.join(".", "plugins");
  } else if (debug == false) {
    return path.join("C://", "data", "plugins");
  }
}

function readPluginSpace(pluginSpacePath) {
  let kvpPlugins = [];
  fs.readdirSync(pluginSpacePath).forEach((pluginFolderName) => {
    let pluginFolderPath = path.join(pluginSpacePath, pluginFolderName);
    let pluginInfoPath = path.join(pluginFolderPath, "plugin_info.json");
    let pluginSourcePath = path.join(pluginFolderPath, "plugin_source.txt");
    try {
      //info 읽기
      let pluginInfo = JSON.parse(fs.readFileSync(pluginInfoPath, "utf8"));

      //source 읽기
      let pluginSource = fs.readFileSync(pluginSourcePath, "utf8");

      //kvpPlugin = info + source
      let kvpPlugin = pluginInfoJson;
      kvpPlugin["source"] = pluginSource;

      //리스트 삽입
      kvpPlugins[kvpPlugins.length - 1] = kvpPlugin;
    } catch (e) {
      console.log("error load: " + pluginFolderName);
    }
  });
  return kvpPlugins;
}

contextBridge.exposeInMainWorld("apiPluginData", {
  getPluginData: (channel, data) => {
    let pluginSpacePath = getPluginSpacePath();
    let pluginSpace = readPluginSpace(pluginSpacePath);
    return pluginSpace;
  },
});
