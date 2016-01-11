(function() {
	var email = $P.getQuery("e");
	ga("send", "event", "Email", "Subscribe", email, Math.floor((new Date().getTime()) / 1440000));
})();