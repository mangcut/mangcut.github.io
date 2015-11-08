$(document).ready(function() {
	var svgOk = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
	if (!svgOk) {
		$("img[src$='.svg']").each(function(){
			$(this).attr("src", $(this).attr("src").replace(".svg", ".png"));
		});
	}
});
	
$(window).on("load", function () {
	$(".avatar-photo").each(function(){
		var $t = $(this);
		var photoUrl = $t.attr("src");
		var parts = photoUrl.split("=");
		var rate = window.devicePixelRatio || 0;
		if (rate > 1) {
			if (rate < 1.5) rate = 1.5;
			var size = (parts[1] * rate) | 0;
			photoUrl = parts[0] + "=" + size;
			$t.attr("src", photoUrl);
		}
	});
	
	$(".swap-photo, .img-container img[data-src]").each(function(){
		var $t = $(this);
		$t.attr("src", $t.attr("data-src"))
	});
	
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
	$(window).on("load", function(){
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

/**
* Bootstrap.js by @fat & @mdo
* plugins: bootstrap-dropdown.js
* Copyright 2012 Twitter, Inc.
* http://www.apache.org/licenses/LICENSE-2.0.txt
*/
!function(a){function d(){a(b).each(function(){e(a(this)).removeClass("open")})}function e(b){var c=b.attr("data-target"),d;c||(c=b.attr("href"),c=c&&/#/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,"")),d=c&&a(c);if(!d||!d.length)d=b.parent();return d}var b="[data-toggle=dropdown]",c=function(b){var c=a(b).on("click.dropdown.data-api",this.toggle);a("html").on("click.dropdown.data-api",function(){c.parent().removeClass("open")})};c.prototype={constructor:c,toggle:function(b){var c=a(this),f,g;if(c.is(".disabled, :disabled"))return;return f=e(c),g=f.hasClass("open"),d(),g||f.toggleClass("open"),c.focus(),!1},keydown:function(c){var d,f,g,h,i,j;if(!/(38|40|27)/.test(c.keyCode))return;d=a(this),c.preventDefault(),c.stopPropagation();if(d.is(".disabled, :disabled"))return;h=e(d),i=h.hasClass("open");if(!i||i&&c.keyCode==27)return c.which==27&&h.find(b).focus(),d.click();f=a("[role=menu] li:not(.divider):visible a",h);if(!f.length)return;j=f.index(f.filter(":focus")),c.keyCode==38&&j>0&&j--,c.keyCode==40&&j<f.length-1&&j++,~j||(j=0),f.eq(j).focus()}};var f=a.fn.dropdown;a.fn.dropdown=function(b){return this.each(function(){var d=a(this),e=d.data("dropdown");e||d.data("dropdown",e=new c(this)),typeof b=="string"&&e[b].call(d)})},a.fn.dropdown.Constructor=c,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=f,this},a(document).on("click.dropdown.data-api",d).on("click.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.dropdown-menu",function(a){a.stopPropagation()}).on("click.dropdown.data-api",b,c.prototype.toggle).on("keydown.dropdown.data-api",b+", [role=menu]",c.prototype.keydown)}(window.jQuery)