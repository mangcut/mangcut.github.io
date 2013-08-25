window.onerror=function(m,u,l){alert(m+"\n"+u+":"+l);};
var _SUPPORT_MOUSE = true;
var _LOCAL = (location.protocol === "file:");
var CELL_CSS = "#playGround span";

var settings = {
	column: 4,
	row: 4,
	theme: 3, // fruit
	sound: true,
	music: true,
	vibrate: true,
	load: function() {
		settings.column = parseInt(localStorage["flip.settings.column"]) || 4;
		settings.row = parseInt(localStorage["flip.settings.row"]) || 4;
		settings.theme = parseInt(localStorage["flip.settings.theme"]);
		if (isNaN(settings.theme)) settings.theme = 3;
		settings.music = localStorage["flip.settings.music"] !== "false";
		settings.sound = localStorage["flip.settings.sound"] !== "false";
		settings.vibrate = localStorage["flip.settings.vibrate"] !== "false";
		
		$("#tableSize td[data-row='" + settings.row + "']").addClass("active");
		
		var $c = $("#tableTheme td[data-theme='" + settings.theme + "']").addClass("active");
		$(".theme-sample span").each(function(index) {
			$(this).removeClass().addClass("theme-" + $c.data("theme") + "-" + index);
			var text = $c.data("text" + index);
			if (!!text) {
				$(this).text(text);
			} else {
				$(this).text("");
			}
		});
		
		$("#tableSound td").each(function() {
			settings[$(this).data("settings")] && $(this).addClass("active");
		});
		
		return settings;
	},
	save: function() {
		localStorage["flip.settings.column"] = settings.column;
		localStorage["flip.settings.row"] = settings.row;
		localStorage["flip.settings.theme"] = settings.theme;
		localStorage["flip.settings.music"] = settings.music;
		localStorage["flip.settings.sound"] = settings.sound;
		localStorage["flip.settings.vibrate"] = settings.vibrate;
		
		return settings;
	}
};
settings.load();

var soundThemes = {
	standard: {
		music: "music.mp3",
		start: "start.mp3",
		cellPrivateSound: false,
		privateSoundAction: "reveal",
		reveal: "reveal.mp3",
		match: "match.mp3",
		win: "win.mp3"
	}
};

var sounds = {
	enableAll: function() {
		sounds.config.music = settings.music;
		sounds.config.start = settings.sound;
		sounds.config.reveal = settings.sound;
		sounds.config.match = settings.sound;
		sounds.config.win = settings.sound;
	},
	disableAll: function() {
		sounds.config.music = false;
		sounds.config.start = false;
		sounds.config.reveal = false;
		sounds.config.match = false;
		sounds.config.win = false;
	},
	disableAdvanced: function() {
		sounds.config.music = false;
		sounds.config.start = settings.sound;
		sounds.config.reveal = false;
		sounds.config.match = settings.sound;
		sounds.config.win = settings.sound;
	},
	readyForPlaying: false,
	refresh: function() {
		if (!createjs.Sound.initializeDefaultPlugins()) {
			sounds.disableAll();
		} else if (createjs.Sound.activePlugin.toString() !== "[WebAudioPlugin]") {
			(!!$.os.phone || !!$.os.tablet) ? sounds.disableAll() : sounds.disableAdvanced();
		} else {
			sounds.enableAll();
		}
		
		if (sounds.readyForPlaying) {
			if (!settings.music) {
				createjs.Sound.stop();
			} else if (!createjs.Sound.instances || createjs.Sound.instances.length === 0) {
				sounds.playMusic();
			}
		}
	},
	configMusic: function(value) {
		sounds.config.music = value;
	},
	toggleMusic: function() {
		sounds.config.music = !sounds.config.music;
	},
	configSound: function(value) {
		sounds.config.start = value;
		sounds.config.reveal = value;
		sounds.config.match = value;
		sounds.config.win = value;
	},
	toggleMusic: function() {
		sounds.config.start = !sounds.config.start;
		sounds.config.reveal = !sounds.config.reveal;
		sounds.config.match = !sounds.config.match;
		sounds.config.win = !sounds.config.win;
	},
	config: {
		music: settings.music,
		start: settings.sound,
		reveal: settings.sound,
		match: settings.sound,
		win: settings.sound,
	},
	theme: "standard",
	play: function(id, cellID) {
		if (sounds.config[id]) {
			var theTheme = soundThemes[sounds.theme];
			var soundID = sounds.theme + "_" + id;
			if (id === theTheme.privateSoundAction && theTheme.cellPrivateSound) {
				soundID = sound.theme + "_" + cellID;
			}
			
			return createjs.Sound.play(soundID, createjs.Sound.INTERRUPT_ANY);
		}
	},
	playMusic: function() {
		if (sounds.config.music) {
			return createjs.Sound.play(
				sounds.theme + "_music",
				createjs.Sound.INTERRUPT_ANY, 
				0, // delay
				0, // offset
				-1, // loop forever
				0.5 // volumn, haft of sound :)
			);
		}
	}
};

var standardColors = [
		"#111",
		"#999",
		"#f33",
		"#f90",
		"#ff3",
		"#0f3",
		"#03f",
		"#f3c",
		"#90c",
		"#060"
	];

var defaultBackColor = "#333";
var winningColor = "black";
var cardBackColor = "#fff";


var cellSize = 64;
var maxSize = 96;

var cellDecor = {
	setColor: function($item) {
		var cellID = $item.data("cell");
		$item.css({"background-color": currentMode.data[cellID], "background-image": "none", "opacity":1});
		
		return $item;
	},
	setNumber: function($item) {
		var cellID = $item.data("cell");
		$item.css({"background-color": currentMode.data[cellID], "background-image": "none", "opacity":1});
		$item.text((cellID + 1) + "");
		
		return $item;
	},
	setAlpha: function($item) {
		var cellID = $item.data("cell");
		$item.css({"background-color": currentMode.data[cellID], "background-image": "none", "opacity":1});
		$item.text(String.fromCharCode(cellID + 65));
		
		return $item;
	},
	setImage: function($item) {
		var cellID = $item.data("cell");
		return $item.css({"background-color": currentMode.wall, "opacity":1, "background-image": "url('mode/" + currentMode.name + "/img/" + currentMode.data[cellID] + ".png')"});
	},
	reset: function($item) {
		return $item.removeClass("open fixed").css({"background-color": cardBackColor, "background-image": null, "opacity":null}).text("");
	},
	makeImageMode: function(name, max, wallColor) {
		return {
			name: name,
			wall: wallColor,
			data: makeData(max),
			set: cellDecor.setImage,
			reset: cellDecor.reset
		}
	}
}

var modes = [
	{
		name: "color",
		color: "standard",
		set: cellDecor.setColor,
		reset: cellDecor.reset
	},
	{
		name: "number",
		color: "random",
		set: cellDecor.setNumber,
		reset: cellDecor.reset
	},
	{
		name: "alpha",
		color: "random",
		set: cellDecor.setAlpha,
		reset: cellDecor.reset
	},
	cellDecor.makeImageMode("fruit", 12, "rgba(0,0,0,0.1)"),
	cellDecor.makeImageMode("monster", 28, "rgba(0,0,0,0.1)"),
	cellDecor.makeImageMode("moon", 32, "rgba(0,0,0,0.1)")
];

var currentMode = modes[settings.theme];

var startTime;
var lonelyCell;
var secondCounter;

var cells;
 
$(document).ready(function () {
	if (_SUPPORT_MOUSE === true) {
		if (!('ontouchend' in window)) {
			console.log("Non-touch devices detected.");
			$(document).delegate('body', 'click', function(e) {
				$(e.target).trigger('tap');
			});
		}
	}

	// setup menu
	$(".tile-menu td").tap(function() {
		var $parentTable = $(this).closest(".tile-menu");
		if ($parentTable.hasClass("radio")) {
			$parentTable.find("td.active").removeClass("active");
			$(this).addClass("active");
		} else {
			$(this).toggleClass("active");
		}
	});
	
	$("#tableTheme td").tap(function(){
		var $c = $(this);
		$(".theme-sample span").each(function(index) {
			$(this).removeClass().addClass("theme-" + $c.data("theme") + "-" + index);
			var text = $c.data("text" + index);
			if (!!text) {
				$(this).text(text);
			} else {
				$(this).text("");
			}
		});
	});
	
	$("#tableSound td").tap(function(){
		var settingName = $(this).data("settings");
		settings[settingName] = $(this).hasClass("active");
		if (settingName === "music") {
			sounds.refresh();
		}
	});
	
	$("[data-page-role='back']").tap(function(){
		Pages.back();
	});
	
	$("[data-page-toggle]").tap(function(){
		Pages.toggle($(this).data("page-toggle"));
	});
	
	$("[data-page-replace]").tap(function(){
		Pages.toggle($(this).data("page-replace"), true);
	});
	
	$("#settings [data-page-role='close']").tap(function(){
		var $sizeCell = $("#tableSize td.active");
		settings.column = $sizeCell.data("column");
		settings.row = $sizeCell.data("row");
		
		var $themeCell = $("#tableTheme td.active");
		settings.theme = $themeCell.data("theme");
		currentMode = modes[settings.theme];
		
		settings.save();
		Pages.back();
		
		if (Pages.current().attr("id") === "main") {
			// TODO: determine what change and does it need restart
			buildPlayGround();
			start();
		}
	});
	
	// setup buttons
	$("[data-action]").tap(function() {
		window[$(this).data("action")].apply();
	});
	
	// setup cells
	// cache the cells
	$("#playGround").on("tap", CELL_CSS, function() {
		var $t = $(this);
		if ($t.hasClass("open") === false) {
			$t.addClass("open");
			var cellID = $t.data("cell");
			currentMode.set($t);
			
			if (lonelyCell) {
				if (cellID == lonelyCell.data("cell")) {
					// match
					$t.addClass("fixed");
					lonelyCell.addClass("fixed");
					lonelyCell = null;
					
					// if win
					if ($(CELL_CSS + ".fixed").length === cells.length) {
						clearInterval(secondCounter);
						secondCounter = null;
						//$("body").css({'background-color': winningColor});
						celebrateWin();
						sounds.play("win", cellID);
					} else {
						sounds.play("match", cellID);
					}
				} else {
					// not match -> close both cell
					var lonelyPhamtom = lonelyCell;
					lonelyCell = null;
					sounds.play("reveal", cellID);
					setTimeout(function() {
						currentMode.reset(lonelyPhamtom);
						currentMode.reset($t);
					}, 500);
				}
			} else {
				lonelyCell = $t;
				sounds.play("reveal", cellID);
				// close all open unfixed one (don't wait the timer)
				//currentMode.reset($(CELL_CSS + ".open").not(".fixed"));
			}
		}
	});
	
	// Load data
	preload();
});

function preload() {
	var queue = new createjs.LoadQueue(!_LOCAL, "mode/");
	queue.installPlugin(createjs.Sound);
	queue.addEventListener("complete", function() {
		
		$("#progress").hide();
		$("#splashButtons").show();
		$("#startGame").click(function() {
			sounds.refresh();
			sounds.readyForPlaying = true;
			
			makeFullScreen(document.documentElement);
			//$("#splash").remove();
			//$("#main").show();
			Pages.toggle("#main");
			
			// build the play ground
			buildPlayGround();
			
			// play some background music
			sounds.playMusic();
			
			// start the game
			start();
		});
	});
	queue.addEventListener("error", function(e) {
		console.log("Could not preload " + e.item.type + ": " + e.item.src);
	});
	
	var manifest = new Array();
	
	// add images
	for (var i = 1; i < modes.length; i ++) {
		if (!modes[i].color) {
			for (var j = 0; j < modes[i].data.length; j++) {
				var fileName = modes[i].name + "/img/" + modes[i].data[j] + ".png";
				manifest.push(fileName);
			}
		}
	}
	
	var cacheSound = function(mf, id) {
		//if (sounds.config[id]) {
			mf.push( {id: sounds.theme + "_" + id, src: "default/snd/" + soundThemes[sounds.theme][id]});
		//}
	}
	
	// add sounds
	cacheSound(manifest, "music");
	cacheSound(manifest, "start");
	cacheSound(manifest, "reveal");
	cacheSound(manifest, "match");
	cacheSound(manifest, "win");
	
	queue.addEventListener("progress", function(e) {
		var pc = ((e.loaded / e.total)*100) + "%";
		$("#indicator").width(pc);
	});
	
	queue.setMaxConnections(5);
	queue.loadManifest(manifest);
}

function start() {
	lonelyCell = null;
	clearInterval(secondCounter);
	secondCounter = null;
	
	cells = shuffle(makeCells());
	
	if (!!currentMode.color) {
		currentMode.data = makeColors();
	}
	shuffle(currentMode.data);
	
	celebrateEnd();
	currentMode.reset($(CELL_CSS)).each(function(index) {
		var number = cells[index];
		$(this).data("cell", number).removeClass("open fixed");
	});
	
	animateStartGame();
	
	$("#counter").text("000");
	//$("body").css({'background-color': defaultBackColor});
	
	startTime = new Date();
	startTime.setSeconds(startTime.getSeconds() + 1);
	secondCounter = window.setInterval(function() {
		$("#counter").text(secondPassed());
	}, 1000);
	
	// play the sound
	sounds.play("start");
}

function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = (Math.random() * counter--) | 0; // bitwise for Math.floor

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function secondPassed() {
	var endTime = new Date();
	if (endTime <= startTime) return "000";
	
	var passedSeconds = ((endTime - startTime) / 1000) | 0; // bitwise for Math.floor
	if (passedSeconds > 999) passedSeconds = 999;
	if (passedSeconds < 10) {
		return "00" + passedSeconds;
	} else if (passedSeconds < 100) {
		return "0" + passedSeconds;
	} else {
		return "" + passedSeconds;
	}
	
}

function rand(max) {
	return (Math.random() * max) | 0;
}

function makeColors() {
	var count = (settings.column * settings.row) / 2;
	var colors = standardColors;
	if (currentMode.color === "random") { //count > standardColors.length) {
		colors = new Array();
		var hueStep = 360 / count;
		for (var i = 0; i < count; i++) {
			var hue = (i * hueStep) | 0;
			var sat = Math.round((100 - Math.random() * 50));
			var light = Math.round((40 + Math.random() * 20));
			var c = "HSL(" + hue + "," + sat + "%," + light + "%)";
			
			colors.push(c);
		}
	}
	
	return colors; // for chaining
}

function makeCells() {
	cells = new Array();
	var count = (settings.column * settings.row) / 2;
	
	for (var i = 0; i < count; i++) {
		cells.push(i);
		cells.push(i);
	}
	
	return cells; // for chaining
}

function makeData(max) {
	var d = new Array();
	for (var i = 1; i <= max; i++) {
		d.push(i);
	}
	
	return d; // for chaining
}

function buildPlayGround() {
	
	var html = "";
	for (var i = 0, n = settings.row * settings.column; i < n; i++) {
		html += "<span class='animated'></span>";
	}
	
	$("#playGround").html(html);
	resizePlayGround(true);
}

function resizePlayGround(initial) {
	var width = calcCellSize();
	
	var winH = $(window).height();
	var winW = $(window).width();
	
	var bigSide = Math.max(settings.column, settings.row);
	var smallSide = Math.min(settings.column, settings.row);
	
	var stageW = width *  ((winH > winW) ? smallSide : bigSide);
	var stageH = width *  ((winH > winW) ? bigSide : smallSide);
	
	var cellW = 100/((winH > winW) ? smallSide : bigSide) + "%";
	var cellH = 100/((winH > winW) ? bigSide : smallSide) + "%";
	
	var $pg = $("#playGround").width(stageW).height(stageH);
	
	// set fontsize and padding-top
	var fontSize = ((width / 2) | 0) + 1;

	var $cells = $(CELL_CSS).css({fontSize: fontSize, lineHeight: (width - 2) + "px", width: cellW, height: cellH});
	if (width < 64)	{
		$cells.addClass("stretch-image");
	} else {
		$cells.removeClass("stretch-image");
	}
	
	var $top = $("#topbar");
	var topH = $top.height();
	
	var $bottom = $("#bottomPart");
	var bottomH = $bottom.height();
	var nowH = winH - topH - bottomH - $pg.height();
	var p0 = (nowH / 2) | 0
	var p1 = (nowH / 3) | 0
	var p2 = p1;
	var p3 = nowH - p1 - p2;
	//$pg.css({'margin-top': p1, 'margin-bottom': p2});
	
	if (bottomH > 0) {
		$top.css({'margin-bottom': p1});
		$bottom.css({'margin-top': p2, 'margin-bottom': p3});
	} else {
		$top.css({'margin-bottom': p0});
	}
	
	return $pg;
}

// assume cell must be square
function calcCellSize() {
	var w = $(window).width() - 40;
	
	var topH = $("#topbar").height();
	var h = $(window).height() - topH - 40; // 10 for some padding
	
	
	var x = (Math.max(w, h) / Math.max(settings.column, settings.row)) | 0;
	var y = (Math.min(w, h) / Math.min(settings.column, settings.row)) | 0;
	
	cellSize = Math.min(x, y, maxSize);
	
	//if (cellSize === x) {
		$("#bottomPart").hide();
	//}
	
	return cellSize;
}

function makeFullScreen(element) {
    if (!!$.os.phone) {
		var requestMethod = element.requestFullscreen ||
							element.webkitRequestFullScreen || element.webkitRequestFullscreen ||
							element.mozRequestFullScreen || element.mozRequestFullscreen ||
							element.msRequestFullScreen || element.msRequestFullscreen;

		if (requestMethod) {
			requestMethod.call(element);
		}
	}
}

function animateStartGame() {
	$(CELL_CSS).each(function(index, item) {
		$(item).css({opacity:0});
		window.setTimeout(function() {
			$(item).css({opacity:null});
			$(item).addClass("bounceInDown").one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
			function(e) {
				$(this).removeClass("bounceInDown");
			});
		}, 100 + rand(900));
	});
}

function celebrateWin() {
	$(CELL_CSS).each(function(index, item) {
		window.setTimeout( function() {
			$(item).addClass("swing");
		}, rand(1000) + 500);
	});
}

function celebrateEnd() {
	$(CELL_CSS).removeClass("swing");
}

var Pages = {
	history: [$("#splash")],
	toggle: function(pageID, replace) {
		var $m = $(pageID);
		if ($m.css('display') === 'none') {
			if (Pages.history && Pages.history.length > 0) {
				Pages.history[Pages.history.length - 1].removeClass("bounceIn").css({display: "none"});
				if (replace === true) {
					Pages.history.pop();
				}
			}
			Pages.history.push($m);
			$m.css({display: $m.data("display") || "block"}).addClass("bounceIn");
		} else {
			Pages.history.pop();
			$m.removeClass("bounceIn").css({display: "none"});
			if (Pages.history && Pages.history.length > 0) {
				Pages.history[Pages.history.length - 1].css({display: $m.data("display") || "block"}).addClass("bounceIn");
			}
		}
		
		return $m;
	},
	back: function() {
		return Pages.toggle(Pages.history[Pages.history.length - 1]);
	},
	current: function() {
		return Pages.history[Pages.history.length - 1];
	}
};

(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  }
  // smartresize 
  $.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(Zepto,'smartresize');

$(window).smartresize(function(){
	resizePlayGround(false);
});
