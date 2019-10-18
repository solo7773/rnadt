

// set footer year
function setFooterYear() {
  let d = new Date();
  document.getElementById('footerYear').textContent = d.getFullYear();
}


function makeThead(){
	let headEles = [
		"Method",
		"Year",
		//"Name",
		//"Publication",
		//"Published by",
		//"Publication abstract",
		"Publication data",
		//"Publication doi",
		"Probe",
		"Probe class",
		"Probe target",
		"Target region",
		"Readout",
		"Experimental setting",
		"Scale",
		"Structure inferred",
		"Validated by",
		"Validated in"//,
		//"Workflow",
		//"Figure reuse license"
	];
	let colEles = [];
	let theadStr = '<thead><tr>';
	for (let ii = 0; ii < headEles.length; ii++) {
		theadStr += '<th>' + headEles[ii] + '</th>';
		colEles[ii] = {"data": headEles[ii]};
	}
	theadStr += '</tr></thead>';
	$('#infoTable thead').replaceWith(theadStr);
	return colEles;
}


// when document is ready
$(function() {
	setFooterYear();
	
	// prepare method table
	columnEles = makeThead();
	$('#infoTable').DataTable({
		"scrollX": true,
		"ajax": {
			"url": "../data/3_techs_data.json",
			"type": "POST",
			"dataSrc": function(d){
				$.each(d, function(key, val){
					val.Method = '<a href="showMethodDetails.html?methodName=' + val.Method + '" target="_blank">' + val.Method + '</a>';
				});
				return Object.values(d);
			}
		},
		"columns":columnEles
	});

});