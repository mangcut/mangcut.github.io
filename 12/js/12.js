$(document).ready(function () {
	//toggleMenu();
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
});

//$(window).load(function() {
//});

function toggleMenu() {
	$("#showMenu").toggleClass("active");
	$("#menu").toggleClass("collapsed expanded");
}
