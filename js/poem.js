/* Google Analytics */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-8597504-3', 'mangcut.vn');
  ga('send', 'pageview');
/* End Goolge Analytics */

$(document).ready(function () {
	// prevent page-load on <a href='#'>Something</a>
	$(document).on("click", "a", function(e) {
		if ($(this).attr("href") === "#") {
			e.preventDefault();
		}
	});

	$(".btn-share").click(function(e) {
		var sharer = "https://upload.facebook.com/sharer/sharer.php?u=";
		var url = $P.getData($(this), "href", location.href);
		window.open(sharer + url, 'sharer', 'width=626,height=436');
		e.preventDefault();
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
		if (args.action === "toggle" || args.action === "show") {
			if (args.advanced === "overlay") {
				var $overlay = $('#overlay');
				if ($overlay.length === 0) {
					$("<div id='overlay'></div>").appendTo($("body")).show().click(function() {
						$target.hide(args.options);
						$(this).fadeOut();
					});
				} else {
					$overlay.show();
				}
			}
		}
		
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
				$(selfTag).on(args.timing, internalPerform);
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

(function( $ ){
	$.fn.flipswitch = function() {
		var template = 
			'<label class="switch-ui">' +
			'	<div class="switch-inner"></div>' +
			'	<div class="switch-switch"></div>' +
			'</label>';
		var $switchUI;
		return this.hide().wrap("<div class='switch-wrapper' />").after(function() {
			if ($switchUI) {
				$switchUI = $switchUI.clone();
			} else {
				$switchUI = $(template);
			}
			return $switchUI.attr("for", this.id);
		});
	}
})( jQuery );

(function( global ) {
  var Poem = (function() {

    return {
		checkAll: function(target, notHilight) {
			var $target = $(target);
			if ($target.not(":checked").length) {
				$target.prop('checked', true);
				$(this).prop('checked', true);
			} else {
				$target.prop('checked', false);
				$(this).prop('checked', false);
			}
			
			if (!notHilight) {
				$target.each(function() {
					$c = $(this);
					if ($c.closest("table.table-select")) {
						var checked = $c.prop('checked');
						if (checked) {
							$c.closest("tr").addClass("selected");
						} else {
							$c.closest("tr").removeClass("selected");
						}
					}
				});
			}
		},
		// getData with default. Please note the passed-in object must be a jQuery object
		getData: function(jObject, dataName, defaultValue) {
				var value = jObject.data(dataName);
				if (this.nullOrEmpty(value)) {
					value = defaultValue;
				}
				
				return value;
		},
		format: function() {
		  var s = arguments[0];
		  for (var i = 0; i < arguments.length - 1; i++) {
			var reg = new RegExp("\\{" + i + "\\}", "gm");
			s = s.replace(reg, arguments[i + 1]);
		  }

		  return s;
		},
		param: function(name) {
			var match = RegExp('[?&]' + name + '=([^&]*)')
							.exec(window.location.search);
			return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
		},
		addCommas: function(nStr) {
			nStr += '';
			x = nStr.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return x1 + x2;
		},
		padZeros: function(number, length) {
			var str = '' + number;
			while (str.length < length) {
				str = '0' + str;
			}
			return str;
		},
		nullOrEmpty: function(something) {
			if (typeof something === 'undefined' || something === null || something === "") {
				return true;
			}
			return false;
		},
		toggleColumn: function(table, index, effect) {
			return $(table).find('td:nth-child(' + index + '),th:nth-child(' + index + ')').toggle(effect || "fade");
		},
		alert: function(message, title) {
			var appTitle = title || this.AppTitle || document.title;
			alert(message);
		},
		ask: function(message, title) {
			var appTitle = title || this.AppTitle || document.title;
			confirm(message);
		},
		confirm: function(message, title) {
			var appTitle = title || this.AppTitle || document.title;
			confirm(message);
		}
    };
  })();

  // expose our module to the global object
  global.$P = Poem;

})( this );