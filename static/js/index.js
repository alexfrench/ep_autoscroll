/**
 * autoscroll plugin for Etherpad.
 * client-side JS file.
 * @author Alex French
 * @filesource index.js
 */

var autoScroll = (function(){
	
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

exports.postAceInit = function(hook, context) {		//context.ace, context.pad
	autoScroll.init();
};
exports.acePostWriteDomLineHTML = function(hook, context) { // context.node: the DOM node that just got written to the page

	autoScroll.autoscroll();
};

  exports.aceSelectionChanged = function(hookName, context) {

	var rep = context.rep;

	if (rep.selStart[0] === rep.selEnd[0] && rep.selEnd[1] === rep.selStart[1]) {	

		const text = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find('#innerdocbody').text();
		var textLength = text.replace(/\s/g, '').length;

		var lines = rep.lines;

		console.log ("aceSelectionChanged:textength" + textLength);
		var caretLine = rep.selStart [0];

		var i=0;
		var caret=0;
		while (i <= caretLine) {
			console.log (lines.atIndex(i));
			caret += (lines.atIndex(i).width -1); 
			i++;
		}

		if (textLength - caret < 50){
			// if we are close to the end of the document then scroll down
			console.log ("aceSelectionChanged:Scroll on");
			autoScroll.change (true); 
		} else {
			console.log ("aceSelectionChanged:Scroll off");
			autoScroll.change (false); 
		}
		
	}

  };	
	
