var _SUPPORT_MOUSE = true;
var _LOCAL = (location.protocol === "file:");

var sounds = {
	enable: true,
	standard: {
		music: "music.mp3",
		start: "start.mp3",
		revealSoundVaries: false,
		reveal: function(cellID) {
			if (sounds.standard.revealSoundVaries) {
				return cellID + ".mp3";
			} else {
				return "reveal.mp3";
			}
		},
		match: "match.mp3",
		win: "win.mp3",
		play: function(id, cellID) {
			if (sounds.enable) {
				if (id === "reveal" && sounds.standard.revealSoundVaries) {
					return createjs.Sound.play(id + cellID);
				} else if (id === "music") {
					return createjs.Sound.play(
						id,
						createjs.Sound.INTERRUPT_ANY, 
						0, // delay
						0, // offset
						-1, // loop forever
						0.5 // volumn, haft of sound :)
					);
				} else {
					return createjs.Sound.play(id);
				}
			}
		}
	}
};

var standardColors = [
		"#e33",
		"darkorange",
		"#ee3",
		"limegreen",
		"#33e",
		"darkviolet",
		"hotpink",
		"black",
		"#3ee",
		"whitesmoke"
	];

var colors = standardColors;

var defaultBackColor = "#333";
var winningColor = "black";
var cardBackColor = "gray";


var cellSize = 64;
var maxSize = 80;

var cellDecor = {
	setColor: function($item, cellID) {
		$item.css({"background-color": currentMode.data[cellID]});
		showNumber && $item.text(($item.data("cell") + 1) + "");
		
		return $item;
	},
	setImage: function($item, cellID) {
		return $item.css({"background-color": currentMode.wall, "background-image": "url('mode/" + currentMode.name + "/img/" + currentMode.data[cellID] + ".png')"});
	},
	reset: function($item) {
		$item.removeClass("open fixed").css({"background-color": cardBackColor, "background-image": "none"});
		showNumber && $item.text("");
		return $item;
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
		data: colors,
		set: cellDecor.setColor,
		reset: cellDecor.reset
	},
	cellDecor.makeImageMode("fruit", 12, "HSL(105,15%,70%);"),
	cellDecor.makeImageMode("moon", 32, "HSL(330,15%,70%)"),
	cellDecor.makeImageMode("monster", 28, "HSL(220,15%,70%)")
];

var currentMode = modes[1];

var startTime;
var lonelyCell;
var secondCounter;

var column = 4;
var row = 4;
var cells;
var showNumber = false;
 
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
	$("#menu td").tap(function() {
		if (!$(this).hasClass("active")) {
			$("#menu td.active").removeClass("active");
			$(this).addClass("active");
			toggleMenu();
			
			column = $(this).data("column");
			row = $(this).data("row");
			buildPlayGround();
			start();
		} else {
			toggleMenu();
		}
	});
	
	$("#showMenu").tap(function() {
		toggleMenu();
	});
	
	// setup buttons
	$("#restart").tap(start);
	
	// setup cells
	// cache the cells
	$("#playGround").on("tap", "#playGround .row div", function() {
		var $t = $(this);
		if ($t.hasClass("open") === false) {
			$t.addClass("open");
			var cellID = $t.data("cell");
			currentMode.set($t, cellID);
			
			if (lonelyCell) {
				if (cellID == lonelyCell.data("cell")) {
					// match
					$t.addClass("fixed");
					lonelyCell.addClass("fixed");
					lonelyCell = null;
					
					// if win
					if ($("#playGround .row div.fixed").length === cells.length) {
						clearInterval(secondCounter);
						secondCounter = null;
						$("body").css({'background-color': winningColor});
						$("#playGround").addClass("swing");
						sounds.standard.play("win");
					} else {
						sounds.standard.play("match");
					}
				} else {
					// not match -> close both cell
					var lonelyPhamtom = lonelyCell;
					lonelyCell = null;
					sounds.standard.play("reveal", cellID);
					setTimeout(function() {
						currentMode.reset(lonelyPhamtom);
						currentMode.reset($t);
					}, 500);
				}
			} else {
				lonelyCell = $t;
				sounds.standard.play("reveal", cellID);
				// close all open unfixed one (don't wait the timer)
				//currentMode.reset($("#playGround .row div.open").not(".fixed"));
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
		$("#splash").remove();
		$("#main").show();
		
		// build the play ground
		buildPlayGround();
		
		// play some background music
		sounds.standard.play("music");
		
		// start the game
		start();
	});
	queue.addEventListener("error", function(e) {
		console.log("Could not preload " + e.item.type + ": " + e.item.src);
	});
	
	var manifest = new Array();
	
	// add images
	for (var i = 1; i < modes.length; i ++) {
		for (var j = 0; j < modes[i].data.length; j++) {
			var fileName = modes[i].name + "/img/" + modes[i].data[j] + ".png";
			manifest.push(fileName);
		}
	}
	
	// add sounds
	manifest.push( {id: "music", src: "default/snd/" + sounds.standard.music});
	manifest.push( {id: "start", src: "default/snd/" + sounds.standard.start});
	manifest.push({id: "reveal", src: "default/snd/" + sounds.standard.reveal(1)});
	manifest.push({id: "match", src: "default/snd/" + sounds.standard.match});
	manifest.push({id: "win", src: "default/snd/" + sounds.standard.win});
	
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
	
	if ( ((row * column) / 2) > modes[1].data.length ) {
		currentMode = modes[0];
	} else {
		var index = 1;// (Math.random()*modes.length) | 0
		currentMode = modes[index];
	}
	
	if (currentMode.name === "color") {
		currentMode.data = makeColors();
	} else {
		showNumber = false;
	}
	shuffle(currentMode.data);
	
	$("#playGround").removeClass("swing");
	currentMode.reset($("#playGround .row div")).each(function(index) {
		var number = cells[index];
		$(this).data("cell", number).removeClass("open fixed");
		//if (showNumber) {
		//	$(this).text("" + (number + 1));
		//}
	});
	
	$("#playGround").addClass("bounceInDown").one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
		function(e) {
			$(this).removeClass("bounceInDown");
		});
	
	$("#counter").text("000");
	$("body").css({'background-color': defaultBackColor});
	
	startTime = new Date();
	startTime.setSeconds(startTime.getSeconds() + 2);
	secondCounter = window.setInterval(function() {
		$("#counter").text(secondPassed());
	}, 1000);
	
	// play the sound
	sounds.standard.play("start");
}

function toggleMenu() {
	$("#showMenu").toggleClass("active");
	var $m = $("#menu");
	if ($m.hasClass("bounceIn") === false) {
		$m.removeClass("hinge").show().addClass("bounceIn");
	} else {
		$m.removeClass("bounceIn").addClass("hinge");
	}
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

function makeColors() {
	var count = (column * row) / 2;
	
	if (count <= standardColors.length) {
		colors = standardColors;
		showNumber = false;
	} else {
		colors = new Array();
		var hueStep = 360 / count;
		for (var i = 0; i < count; i++) {
			var hue = (i * hueStep) | 0;
			var sat = Math.round((100 - Math.random() * 50));
			var light = Math.round((20 + Math.random() * 20));
			var c = "HSL(" + hue + ",100%,40%)";
			
			colors.push(c);
		}
		showNumber = true;
	}
	
	return colors; // for chaining
}

function makeCells() {
	cells = new Array();
	var count = (column * row) / 2;
	
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
	var width = calcCellSize(4, 4);
	var sw = "width:" + width + "px";
	var sh = "height:" + width + "px";
	var style = "style='" + sw + ";" + sh + ";";
	
	// set fontsize and padding-top
	var fontSize = ((width / 2) | 0) + 1;
	style += "font-size:" + fontSize + "px;'";
	
	var className = (width < 64) ? "class='stretch-image'" : "class=''";
	
	var html = "";
	for (var i = 0; i < row; i++)  {
		var rowHtml = "<div class='row'>";
		for (var j = 0; j < column; j++) {
			rowHtml += "<div " + className + " " + style + "></div>";
		}
		rowHtml += "</div>";
		html += rowHtml;
	}
	
	var $pg = $("#playGround");
	$pg.html(html);
	
	var topH = $("#topbar").height();
	var bottomH = $("#bottomPart").height();
	var nowH = $(window).height() - topH - bottomH - $pg.height();
	var p1 = (nowH / 3) | 0
	var p2 = p1;
	var p3 = nowH - p1 - p2;
	$pg.css({'margin-top': p1, 'margin-bottom': p2});
	$("#bottomPart").css({'margin-bottom': p3});
}

// assume cell must be square
function calcCellSize() {
	var w = $(window).width() - 40;
	var x = (w / column) | 0;
	
	var topH = $("#topbar").height();
	var bottomH = $("#bottomPart").height();
	
	var h = $(window).height() - topH - bottomH - 40; // 10 for some padding
	var y = (h / row) | 0;
	
	cellSize = Math.min(x, y, maxSize);
	return cellSize;
}
