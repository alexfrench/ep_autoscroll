'use strict';

/**
 * autoscroll plugin for Etherpad.
 * client-side JS file.
 * @author Alex French
 * @filesource index.js
 */

 exports.postAceInit = (hookName, args, cb) => {
	autoScroller.init();
	cb();
};

exports.acePostWriteDomLineHTML = (hook_name, args, cb) => { // context.node: the DOM node that just got written to the page
	autoScroller.autoscroll();
	cb();
};

exports.aceSelectionChanged = (hook_name, context) => {

	var rep = context.rep;
	//console.log (context);

	if (rep.selStart[0] === rep.selEnd[0] && rep.selEnd[1] === rep.selStart[1]) {	

		var lines = rep.lines; // each line is a paragraph

		console.log ("aceSelectionChanged:textength" + textLength);
		var caretLine = rep.selStart [0]; // the selected paragraph


		var i=0;
		var caret=0;
		var textLength = lines._totalWidth;

		console.log ('rep.selStart[0] ' + rep.selStart[0]); 
		while (i < caretLine) {
			caret += (lines.atIndex(i).width -1); 
			i++;
		}

		caret += rep.selStart [1]; // add the current character position

		console.log ("caret=" + caret + " textlength=" + textLength);

		if (textLength - caret < 50){
			// if we are close to the end of the document then scroll down
			console.log ("aceSelectionChanged:Scroll on");
			autoScroller.change (true); 
		} else {
			console.log ("aceSelectionChanged:Scroll off");
			autoScroller.change (false); 
		}
		
	}
 	

  };	
	
  var autoScroller = (function(){
	
	var active = false;
	var newY = 1000;

	return{
		init : function(){
			active = false;
		},
		change : function(nearEnd){
			
			active = nearEnd;

			if(active===true){
				console.info('enable autoscroll')
				this.scroll();
			}else{
				console.info('disable autoscroll')
			}
		},
		autoscroll : function(){
			if(active===true){
				this.scroll();
			}
		},
		scroll:function(){
			if(window.navigator.userAgent.toLowerCase().indexOf('edge')>-1){	//Edge, test 24.9.2018
				console.info('hello edge');
				var frame = document.getElementsByName("ace_outer")[0];
				var frameDoc = frame.contentDocument;
				var target = frameDoc.getElementById("outerdocbody");
				frameDoc.scrollingElement.scrollTop = target.parentNode.offsetHeight;
			}else{	//FF, Opera, MSIE, Chrome
				var outerdocHTML = $('iframe[name="ace_outer"]').contents().find('#outerdocbody').parent();
				var inner = $('iframe[name="ace_outer"]').contents().find('#outerdocbody').contents();	//the height varies with the content
				newY += inner.height();
				outerdocHTML.animate({scrollTop: newY}, 2000); // needed for FF
			}
		},
	};
})();