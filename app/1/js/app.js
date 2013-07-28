var colors = [
		"red",
		"darkorange",
		"yellow",
		"limegreen",
		"blue",
		"purple",
		"hotpink",
		"black"
	];
var cells = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];

var startTime;
var lonelyCell;
var secondCounter;

$(document).ready(function () {
	// build the play ground
	buildPlayGround(4, 4);
	
	// setup menu
	$("#menu td").tap(function() {
		if (!$(this).hasClass("disabled")) {
			$("#menu td.active").removeClass("active");
			$(this).addClass("active");
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
	var $cells = $("#playGround .row div");
	$cells.tap(function() {
		var $t = $(this);
		if ($t.hasClass("open") === false) {
			$t.addClass("open");
			var revealedColor = $t.data("color");
			setCellColor($t, revealedColor);
			
			if (lonelyCell) {
				if (revealedColor == lonelyCell.data("color")) {
					// match
					$t.addClass("fixed");
					lonelyCell.addClass("fixed");
					lonelyCell = null;
					
					// if win
					if ($("#playGround .row div.fixed").length === 16) {
						$("body").css({'background-color': 'pink'});
						clearInterval(secondCounter);
						secondCounter = null;
					}
				} else {
					// not match -> close both cell
					var lonelyPhamtom = lonelyCell;
					lonelyCell = null;
					setTimeout(function() {
						setCellColor(lonelyPhamtom, "grey").removeClass("open");
						setCellColor($t, "grey").removeClass("open");
					}, 1000);
				}
			} else {
				lonelyCell = $t;
			}
		}
	});
	
	// start the game
	start();
});

function setCellColor($item, color) {
	return $item.css({'background-color': color});
}

function start() {
	lonelyCell = null;
	clearInterval(secondCounter);
	secondCounter = null;
	
	cells = shuffle(cells);
	setCellColor($("#playGround .row div"), 'grey').each(function(index) {
		$(this).data("color", colors[cells[index]]).removeClass("open fixed");
	});
	
	$("#counter").text("000");
	$("body").css({'background-color': '#f0f0f0'});
	
	startTime = new Date();
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
	var passedSeconds = ((endTime - startTime) / 1000) | 0; // bitwise for Math.floor
	if (passedSeconds > 999) passedSeconds = 999;
	if (passedSeconds < 10) {
		return "00" + passedSeconds;
	} else if (passedSeconds < 100) {
		return "0" + passedSeconds;
	}
}

function buildPlayGround(col, row) {
	var width = calcCellSize(4, 4);
	var sw = "width:" + width + "px";
	var sh = "height:" + width + "px";
	var style = "style='" + sw + ";" + sh + ";'";
	var html = "";
	for (var i = 0; i < row; i++)  {
		var rowHtml = "<div class='row'>";
		for (var j = 0; j < col; j++) {
			rowHtml += "<div " + style + "></div>";
		}
		rowHtml += "</div>";
		html += rowHtml;
	}
	
	$("#playGround").html(html);
}

// assume cell must be square
function calcCellSize(col, row) {
	var w = window.innerWidth - 10;
	var x = (w / col) | 0;
	
	return x;
}
