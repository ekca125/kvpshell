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

const fs = require('fs');
const path = require("path");

contextBridge.exposeInMainWorld("apiPluginData", {
  getPluginData: (channel, data) => {
    // datas
    let pluginDatas = []
    let pluginIndex = 0
    //path
    let pluginSpacePathStub = path.join("C://","data","plugins")
    let pluginSpacePath = pluginSpacePathStub

    fs.readdirSync(pluginSpacePath).forEach(
      pluginFolderName =>{
        let pluginFolderPath = path.join(pluginSpacePath,pluginFolderName)
        let pluginInfoPath = path.join(pluginFolderPath,"info.json")
        //
        pluginInfo = fs.readFileSync(pluginInfoPath, 'utf8')
        pluginInfoJson = JSON.parse(pluginInfo)
        //if exec js
        if(pluginInfoJson["pluginMode"]==="js"){
          let pluginExecPath = path.join(pluginFolderPath,pluginInfoJson["pluginExec"])
          console.log(pluginExecPath)
          pluginInfoJson["pluginExec"] = fs.readFileSync(pluginExecPath, 'utf8')
          console.log(pluginInfoJson["pluginExec"])
        }
        pluginDatas[pluginIndex]=pluginInfoJson
        pluginIndex++;
      }
    )

    

    return pluginDatas
  },
});
