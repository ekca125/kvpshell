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

contextBridge.exposeInMainWorld("apiFile", {
  saveFile: (channel, content) => {
    currentResult = content["currentResult"]
    resultFileName = content["resultFileName"]

    resultDir = path.join(".","result")
    if(!fs.existsSync(resultDir)){
      fs.mkdirSync(resultDir)
    }
    resultFilePath = path.join(resultDir,resultFileName)
    fs.writeFileSync(resultFilePath,currentResult,'utf8');
    return true;
  },
});

contextBridge.exposeInMainWorld("apiKvpPlugin", {
  getKvpPlugins: (channel, data) => {
    let kvpPluginSpacePath = getKvpPluginSpacePath();
    let kvpPlugins = readKvpPluginSpace(kvpPluginSpacePath);
    console.log(kvpPlugins)
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
    let pluginInfoPath = path.join(kvpPluginSpacePath, pluginFolderName, "plugin_info.json");
    let pluginSourcePath = path.join(kvpPluginSpacePath, pluginFolderName, "plugin_source.txt");
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
