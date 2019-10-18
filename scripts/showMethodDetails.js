

// set footer year
function setFooterYear() {
  let d = new Date();
  document.getElementById('footerYear').textContent = d.getFullYear();
}
setFooterYear();


function makeContent(datain) {
	let url_string = window.location.href;
	let url = new URL(url_string);
	let methodName = url.searchParams.get("methodName");
	document.querySelector('h3').textContent = 'Details for ' + methodName;
	htmlStr = '';
	$.each(datain, function(key, val) {
		if (val.Method === methodName) {
			$('article')[0].textContent = '';
			$.each(val, function(key2, val2) {
				htmlStr += '<div  class="mdt-title_box"><div class="mdt-title">' + key2 + '</div><div class="mdt-content">' + val2 + '</div></div>';
			});
		}
	});
	$('article').append(htmlStr);
}


$.getJSON( "../data/3_techs_data.json", function( resdb ) {
	makeContent(resdb);
});