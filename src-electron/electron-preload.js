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
const execSync = require("child_process").execSync;

contextBridge.exposeInMainWorld("apiPluginData", {
  getPluginData: (channel, data) => {
    // datas
    let pluginDatas = [];
    let pluginIndex = 0;
    //path
    let debug = true;
    let pluginSpacePath = path.join(".", "plugins");
    if (debug == true) {
      let pluginSpacePathStub = path.join("C://", "data", "plugins");
      pluginSpacePath = pluginSpacePathStub;
    }
    fs.readdirSync(pluginSpacePath).forEach((pluginFolderName) => {
      let pluginFolderPath = path.join(pluginSpacePath, pluginFolderName);
      let pluginInfoPath = path.join(pluginFolderPath, "info.json");
      //
      pluginInfo = fs.readFileSync(pluginInfoPath, "utf8");
      pluginInfoJson = JSON.parse(pluginInfo);
      //if exec js
      if (pluginInfoJson["pluginMode"] === "js") {
        let pluginExecPath = path.join(
          pluginFolderPath,
          pluginInfoJson["pluginExec"]
        );
        pluginInfoJson["pluginExec"] = fs.readFileSync(pluginExecPath, "utf8");
      } else if (pluginInfoJson["pluginMode"] === "external_exec") {
        let pluginExecPath = path.join(
          pluginFolderPath,
          pluginInfoJson["pluginExec"]
        );
        pluginInfoJson["pluginExec"] = fs.readFileSync(pluginExecPath, "utf8");
      }
      pluginDatas[pluginIndex] = pluginInfoJson;
      pluginIndex++;
    });
    return pluginDatas;
  },
});

contextBridge.exposeInMainWorld("apiEval", {
  runEval: (channel, data) => {
    var result = "";
    try {
      result = eval(data["script"]);
    } catch (e) {
      result = e.toString();
    }
    return result;
  },
});

const temp = require("temp").track();

contextBridge.exposeInMainWorld("apiChildProcess", {
  runChildProcess: (channel, data) => {
    var cmd = data["script"];
    try {
      var result = execSync(cmd).toString();
    } catch (e) {
      result = e.toString();
    }
    return result;
  },

  runChildProcessBatch: (channel, data) => {
    var cmd = data["script"];
    let openFile = temp.openSync({suffix: '.bat'})
    fs.writeSync(openFile.fd, cmd);
    fs.closeSync(openFile.fd);
    var result = "";
    try{
      result = execSync(openFile.path).toString();
    }
    catch(e){
      result = e.toString();
    }
    temp.cleanupSync();
    return result;
  },
});
