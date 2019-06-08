(function() {

$("#mc-embedded-subscribe-form").on("submit", function(ev) {
	ev.preventDefault();
	$("#mce-error-response").hide();
	
	var email = $.trim($("#mce-EMAIL").val());
	if ($P.validateEmail(email)) {
		$("#mce-success-response").text("Đang xử lý...").show();
		$.ajax({
			url: $(this).attr("action").replace("/post?", "/post-json?"),
			data: $(this).serialize(),
			dataType: 'jsonp',
			jsonp: 'c',
			success: function(data) {
				if (data.result === "error") {
					$("#mce-success-response").hide();
					$("#mce-error-response").show();
					$("#mce-EMAIL").focus();
				} else {
					$P.setStorage("emailSubscribed", "true");
					location.href = "/email/thankyou.html?e=" + encodeURIComponent(email);
				}
			}
		});
	} else {
		$("#mce-error-response").show();
		$("#mce-EMAIL").focus();
	}
});

var email = $.trim($P.getQuery("e"));
if (email) {
	$("#mce-EMAIL").val(email);
	$("#mc-embedded-subscribe-form").submit();
}

})();