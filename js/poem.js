$(document).ready(function () {
	// prevent page-load on <a href='#'>Something</a>
	/*
	$(document).on("click", "a", function(e) {
		var theHref = $(this).attr("href");
		var theTarget = $(this).attr("target");
		if (theHref === "#" || theHref === "") {
			e.preventDefault();
		} else if (("standalone" in window.navigator) && window.navigator.standalone) {
			if ( theHref.indexOf("#") !== 0 && theHref.toLowerCase().indexOf("http") !== 0 && 
				($P.nullOrEmpty(theTarget) || theTarget === "_self")) {
				e.preventDefault();
				location.href = theHref;
			}
		}
	}); */

	if (("standalone" in window.navigator) && window.navigator.standalone) {
		$(document).on("click", "a", function(e) {
			var theHref = $(this).attr("href");
			var theTarget = $(this).attr("target");
			if ( theHref !== "" && theHref.indexOf("#") !== 0 && theHref.toLowerCase().indexOf("http") !== 0 && 
				($P.nullOrEmpty(theTarget) || theTarget === "_self")) {
				e.preventDefault();
				location.href = theHref;
			}
		});
	}
	
	/*
	$(".btn-share").click(function(e) {
		var sharer = "https://upload.facebook.com/sharer/sharer.php?u=";
		var url = $P.getData($(this), "href", location.href);
		window.open(sharer + url, 'sharer', 'width=626,height=436');
		e.preventDefault();
	});
	*/
	$(".avatar-photo").each(function(){
		var $t = $(this);
		var photoUrl = $t.attr("src");
		var parts = photoUrl.split("=");
		var rate = window.devicePixelRatio || 0;
		if (rate > 1) {
			if (rate < 1.5) rate = 1.5;
			var size = (parts[1] * rate) | 0;
			$t.attr("src", parts[0] + "=" + size);
		}
	});
	
	// auto switch
	//$(".switch").flipswitch();
	
	// make code pretty
	window.prettyPrint && prettyPrint();
	
	// auto action
	$("[data-action]").perform();
});

(function( $ ){
    var actionDefaults = {
		action: "toggle",
		timing: "click"
		//target: "selector",
		//relative: "closest",
		//options: [array of arguments],
		//advanced: some extra settings
	};
	
	var doAction = function($target, args) {
		//if (args.action === ":xxx") { // special support for special action, should start with :
			//
		//} else { // trigger, toggle, show, hide, effect, toggleClass, addClass, removeClass, switchClass, remove, detach, etc.
			doCoreAction($target, args);
		//}
	};
	
	var doCoreAction = function($target, args) {
		//if (args.action === "toggle" || args.action === "show") {
			if (args.advanced === ":overlay") {
				var $overlay = $('#overlay');
				if ($overlay.length === 0) {
					$("<div id='overlay'></div>").appendTo($("body")).show().click(function() {
						$(args.self).trigger(args.timing);
						$(this).fadeOut();
					});
				} else {
					$overlay.show();
				}
			}
		//}
		
		if (args.action === "remove" || args.action === "detach") {
			if (typeof args.options === "object") {
				$target.hide($.extend({}, args.options, {
					complete: function() {
						doGenericAction($target, args);
					}}));
			} else {
				$target.hide(args.options, function() {
						doGenericAction($target, args);
					});
			}
		} else {
			doGenericAction($target, args);
		}
	};
	
	var doGenericAction = function($target, args) {
		var actionName = args.action.replace(/\(\)$/, "");
		var parts = actionName.split(".");
		if (!args.target) {
			if (parts.length === 1) {
				$.each([$target, window, $(args.self), args.self], function(index, value){
					$target = value;
					return !$target[actionName];
				});
			}
			
			if (parts[0] === "window") {
				$target = window;
				parts = parts.slice(1);
			} else if (parts[0] === "this") {
				$target = args.self;
				parts = parts.slice(1);
			} else if (parts[0] === "$(this)") {
				$target = $(args.self);
				parts = parts.slice(1);
			}
		}
				
		var len = parts.length;	
		if (len > 0) {
			actionName = parts[len - 1];
		}
		if (len > 1) {
			parts = parts.slice(0, len - 1);
			$target = walk($target, parts);
		}
		if (typeof $target[actionName] === "function") {
			if ($.isArray(args.options)) {
				$target[actionName].apply(this, args.options);
			} else {
				$target[actionName](args.options);
			}
		} else {
			$target[actionName] = args.options;
		}
	};
	
	var performAction = function(actionInfo, selfTag) {
		var actionArray;
		if ($.isArray(actionInfo)) {
			actionArray = actionInfo;
		} else {
			actionArray = [actionInfo];
		}
		
		$.each(actionArray, function(index, value) {
			var args = $.extend({}, actionDefaults, ((typeof value === "object") ? value : {action: value}));
			args.self = selfTag;

			// special support for some action
			if (args.action === "tooltip" && !value.timing) {
				args.timing = "now";
			}
			
			var internalPerform = function() {
				if ($P.nullOrEmpty(args.condition) || $(args.condition).length) {
					var $target = null;
					if (args.target) {
						if (typeof args.target === "object") {
							$target = args.target;
						} else {
							if (args.relative) {
								$target = $(selfTag)[args.relative](args.target);
							} else {
								$target = $(args.target);
							}
						}
					} else {
						$target = window;
					}
					doAction($target, args);
				}
			};
			
			if (args.timing === "now") {
				internalPerform();
			} else {
				$(selfTag).on(args.timing, function(event) {
					internalPerform();
					if (this.nodeName === "A") {
						event.preventDefault();
					}
				});
			}
		});
		};
	
	var walk = function(target, steps) {
		$.each(steps, function(index, step) {
			step.replace(/\(\)$/, "");
			target = target[step];
			if (typeof target === "function") {
				target = target();
			}
		});
		
		return target;
	};
	
	$.fn.perform = function() {
		return this.each(function() {
			var $this = $(this);
			var action = $this.data("action");
			if (action) {
				if (typeof action === "object") {
					performAction(action, this);
				} else {
					performAction($this.data(), this);
				}
			}
		});
  }	
})( jQuery );

(function( global ) {
  var Poem = (function() {

    return {
		// getData with default. Please note the passed-in object must be a jQuery object
		getData: function(jObject, dataName, defaultValue) {
				var value = jObject.data(dataName);
				if (this.nullOrEmpty(value)) {
					value = defaultValue;
				}
				
				return value;
		},
		nullOrEmpty: function(something) {
			if (typeof something === 'undefined' || something === null || something === "") {
				return true;
			}
			return false;
		}
    };
  })();

  // expose our module to the global object
  global.$P = Poem;

})( this );

if (Modernizr.touch && !(/iPad|iPhone|iPod/.test(navigator.platform))) {
	jQuery(document).ready(function($){
		// browser window scroll (in pixels) after which the "back to top" link is shown
		var offset = 1000,
			//browser window scroll (in pixels) after which the "back to top" link opacity is reduced
			offset_opacity = 1500,
			//duration of the top scrolling animation (in ms)
			scroll_top_duration = 200,
			//grab the "back to top" link
			$b = $('.cd-top'),
			wait = false,
			called = false,
			$w = $(window),
			updateStatus = function() {
				var t = $w.scrollTop();
				var fade = false;
				
				( t > offset ) ? $b.addClass('cd-is-visible') : $b.removeClass('cd-is-visible cd-fade-out cd-bottom');
				if( t > offset_opacity ) { 
					fade = true;
				}
				
				if (t > offset) {
					var nearBottom = t + $w.height() > $(document).height() - 150;
					if (nearBottom) {
						fade = false;
						$b.removeClass('cd-fade-out').addClass('cd-bottom');
					} else {
						$b.removeClass('cd-bottom');
					}
				}
				
				if (fade) $b.addClass('cd-fade-out');
			};
		//hide or show the "back to top" link
		$(window).scroll(function(){
			//updateStatus();

			called = true;
			if (!wait) {
				updateStatus();
				wait = true;
				called = false;
				setTimeout(function () {
					wait = false;
					if (!!called) {
						updateStatus();
						called = false;
					}
				}, 100);
			}
		});

		//smooth scroll to top
		$b.on('click', function(event){
			event.preventDefault();
			$('body,html').animate({
				scrollTop: 0 ,
				}, scroll_top_duration
			);
		});

	});
}