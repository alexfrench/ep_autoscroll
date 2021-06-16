/**
 * autoscroll plugin for Etherpad.
 * server-side file.
 * @author Benoit Lathiere
 * @filesource index.js
 * test test
 */
var eejs = require("ep_etherpad-lite/node/eejs");
var settings = require('ep_etherpad-lite/node/utils/Settings');
exports.eejsBlock_scripts = function(hook_name, args, cb){
	args.content += "<script type='text/javascript' src='../static/plugins/ep_autoscroll/static/js/jquery-3.3.1.min.js'></script>";
	args.content += "<script>$.noConflict();</script>";	//required to avoid bug..
	args.content += "<script type='text/javascript' src='../static/plugins/ep_autoscroll/static/js/index.js'></script>";
	return cb();
};