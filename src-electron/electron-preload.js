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

 contextBridge.exposeInMainWorld(
     "api", {  //이름은 api입니닷
         request : (channel, data) => {
             console.log(channel, data);//html에서 넘기는 값, channel로 구분하면 된다.
             data.calback({result:'Hello Relpy'});
         }
     }
 );