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

const stubPluginDatas = [
  {
    index: 0,
    pluginName: "plugin_preset",
    pluginExec: "plugin1_exe --a $KEY1$ --b $KEY2$",
    pluginKeyValue: [
      {
        pluginKey: "KEY1",
        pluginValue: "defaultkey",
      },
      {
        pluginKey: "KEY2",
        pluginValue: "defaultkey2",
      },
    ],
  },
  {
    index: 1,
    pluginName: "plugin_preset2",
    pluginExec: "plugin2_exe --ab $KEY3$ --bb $KEY4$",
    pluginKeyValue: [
      {
        pluginKey: "KEY3",
        pluginValue: "defaultkey3",
      },
      {
        pluginKey: "KEY4",
        pluginValue: "defaultkey4",
      },
    ],
  },
];

//파일 불러오기
const fs = require('fs');

contextBridge.exposeInMainWorld("apiPluginData", {
  getPluginData: (channel, data) => {
    const pluginData = fs.readFileSync('C:\\data\\plugins.json', 'utf8')
    return JSON.parse(pluginData)
  },
});
