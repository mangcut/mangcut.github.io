(function() {

$("#mc-embedded-subscribe-form").on("submit", function(ev) {
	ev.preventDefault();
	$("#mce-error-response").hide();
	
	var email = $.trim($("#mce-EMAIL").val());
	if (validateEmailForm(email)) {
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
					location.href = "/email/confirm.html?e=" + encodeURIComponent(email);
				}
			}
		});
	} else {
		$("#mce-error-response").show();
		$("#mce-EMAIL").focus();
	}
});

function validateEmailForm(email)
{
	var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	
	return !!re.test(email);
}

function getQuery(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var email = $.trim(getQuery("e"));
if (email) {
	$("#mce-EMAIL").val(email);
	$("#mc-embedded-subscribe-form").submit();
}

})();