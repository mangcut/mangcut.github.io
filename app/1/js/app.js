var standardColors = [
		//"red",
		"#f33",
		"darkorange",
		//"yellow",
		"#dd3",
		"limegreen",
		//"blue",
		"#33f",
		//"purple",
		"darkviolet",
		"hotpink",
		//"black",
		"#333",
		//"cyan",
		"#3dd",
		"olive",
		"saddlebrown",
		"darkkhaki"
	];
var fruits = [
		"apple",
		"banana",
		"pear",
		"orange",
		"tomato",
		"kiwi",
		"mango",
		"lemon",
		"peach",
		"cherry",
		"strawberry",
		"apricot"
	];

var colors = standardColors;
var maxSize = 80;

var mode = {
	color: {
		data: colors,
		set: function($item, cellID) {
			return $item.css({"background-color": currentMode.data[cellID]});
		},
		reset: function($item) {
			return $item.css({"background-color": "gray", "background-image": "none"});
		}
	},
	fruit: {
		data: fruits,
		set: function($item, cellID) {
			return $item.css({"background-color": "HSL(105,15%,70%);", "background-image": "url('mode/fruit/" + currentMode.data[cellID] + ".png')"});
		},
		reset: function($item) {
			return $item.css({"background-color": "gray", "background-image": "none"});
		}
	}
}
var currentMode = mode.fruit;

var startTime;
var lonelyCell;
var secondCounter;

var column = 4;
var row = 4;
var cells;
var showNumber = false;

$(document).ready(function () {
	// build the play ground
	buildPlayGround();
	
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
						$("body").css({'background-color': 'pink'});
						$("#playGround").addClass("swing");
					}
				} else {
					// not match -> close both cell
					var lonelyPhamtom = lonelyCell;
					lonelyCell = null;
					setTimeout(function() {
						currentMode.reset(lonelyPhamtom).removeClass("open");
						currentMode.reset($t).removeClass("open");
					}, 700);
				}
			} else {
				lonelyCell = $t;
			}
		}
	});
	
	// start the game
	start();
});

function start() {
	lonelyCell = null;
	clearInterval(secondCounter);
	secondCounter = null;
	
	cells = shuffle(makeCells());
	
	if ( ((row * column) / 2) > 12 ) {
		currentMode = mode.color;
	} else {
		currentMode = (new Date().getTime() % 2 === 0) ? mode.color : mode.fruit;
	}
	
	if (currentMode === mode.color) {
		shuffle(makeColors());
	}
	
	$("#playGround").removeClass("swing");
	currentMode.reset($("#playGround .row div")).each(function(index) {
		var number = cells[index];
		$(this).data("cell", number).removeClass("open fixed");
		if (showNumber) {
			$(this).text("" + (number + 1));
		}
	});
	
	$("#counter").text("000");
	$("body").css({'background-color': '#f0f0f0'});
	
	startTime = new Date();
	startTime.setSeconds(startTime.getSeconds() + 2);
	secondCounter = window.setInterval(function() {
		$("#counter").text(secondPassed());
	}, 1000)
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

function buildPlayGround() {
	var width = calcCellSize(4, 4);
	var sw = "width:" + width + "px";
	var sh = "height:" + width + "px";
	var style = "style='" + sw + ";" + sh + ";";
	
	// set fontsize and padding-top
	var fontSize = ((width / 2) | 0) + 1;
	style += "font-size:" + fontSize + "px;'";
	
	var html = "";
	for (var i = 0; i < row; i++)  {
		var rowHtml = "<div class='row'>";
		for (var j = 0; j < column; j++) {
			rowHtml += "<div " + style + "></div>";
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
	
	var z = Math.min(x, y, maxSize);
	
	//if (x < y && z >= 60) {
	//	z = 60;
	//}
	
	return z;
}
