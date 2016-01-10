(function() {
	function getQuery(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	var email = getQuery("e");
	ga("send", "event", "Email", "Subscribe", email, Math.floor((new Date().getTime()) / 1440000));
})();