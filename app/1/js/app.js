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

$(document).ready(function () {
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
	startTime = new Date();
	cells = shuffle(cells);
	setCellColor($("#playGround .row div"), 'grey').each(function(index) {
		$(this).data("color", colors[cells[index]]).removeClass("open fixed");
	});
	
	$("#counter").text("000");
	$("body").css({'background-color': '#f0f0f0'});
}

function toggleMenu() {
	$("#showMenu").toggleClass("active");
	var $m = $("#menu");
	if ($m.hasClass("bounceIn") === false) {
		$m.show().removeClass("hinge").addClass("bounceIn");
	} else {
		$m.removeClass("bounceIn").addClass("hinge");
	}
}

function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = (Math.random() * counter--) | 0;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
