/**
 * autoscroll plugin for Etherpad.
 * server-side file.
 * @author Alex French
 * @filesource index.js
 */
 var eejs = require("ep_etherpad-lite/node/eejs");
 var settings = require('ep_etherpad-lite/node/utils/Settings');
 exports.eejsBlock_scripts = (hook_name, args, cb) => {
	 args.content += eejs.require('ep_autoscroll/scripts.js', {}, module);
   return cb();
 };