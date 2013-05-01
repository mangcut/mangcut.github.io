/* * * DISQUS * * */
/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
var disqus_shortname = 'mangcut'; // required: replace example with your forum shortname
//var disqus_title = $(".post-title").text();
var disqus_url;
if (disqus_identifier) {
	disqus_url = 'http://mangcut.vn/' + disqus_identifier + ".html";
}
		
/* * * DON'T EDIT BELOW THIS LINE * * */
(function() {
	var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
	dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
	(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
})();

/* * * END-DISQUS * * */