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
const temp = require("temp").track();

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
      } else if (pluginInfoJson["pluginMode"] === "bat") {
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

contextBridge.exposeInMainWorld("apiCommandCode", {
  run: (channel, data) => {
    var result = "";
    try {
      if (data["pluginMode"] === "exec") {
        //console.log("exec")
        result = execSync(data["commandCode"]).toString()
      } else if (data["pluginMode"] === "js") {
        //console.log("js")
        result = eval(data["commandCode"]);
      } else if (data["pluginMode"] === "bat") {
        //console.log("bat")
        let openFile = temp.openSync({ suffix: ".bat" });
        fs.writeSync(openFile.fd, data["commandCode"]);
        fs.closeSync(openFile.fd);
        result = execSync(openFile.path).toString();
        temp.cleanupSync();
      }
    } catch (e) {
      result = e.toString();
    }
    return result;
  },
});



