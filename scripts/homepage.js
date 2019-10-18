

// set footer year
function setFooterYear() {
  var d = new Date();
  document.getElementById('footerYear').textContent = d.getFullYear();
}
setFooterYear();


function setHeight() {
  // set home page per page height
  document.querySelector('.homeFace').style.height = window.innerHeight - 100 + 'px';
  // set rna_ss height
  document.getElementById('rna_ss').style.height = document.querySelector('.homeFace').clientHeight - document.querySelector('h1').clientHeight + 'px';
  // set other sections height
  let sects = document.getElementsByTagName('section');
  for (let i = 0; i < sects.length; i++) {
    sects[i].style.height = window.innerHeight + 'px';
  }
}
setHeight();


function setPageScrollCtrl() {
	document.getElementById('pageScrollCtrl').style.top = window.innerHeight / 2 - 60 + 'px';
	document.getElementById('pagedown').addEventListener('click', function(){
		window.scrollBy(0, window.innerHeight);
	});
	document.getElementById('pageup').addEventListener('click', function(){
		window.scrollBy(0, -window.innerHeight);
	});
}
setPageScrollCtrl();


// rna ss plot
$(function(){
	let container = new fornac.FornaContainer("#rna_ss", {'applyForce': true});
	let options = {'structure': '.(((.(((((((((((.(((.(((((((((((..(((.......)))............))))).))))))..))).))))))).(((....))).......)))).)))................',
		'sequence': 'CCGGCCUGCUACCUCACUGAAAUUGUGGAGGUCCGCAAAAAGUCUGCCGUCAUCUCAAAACCUCACACAGUAAUUACUGGGGUGUGCAAACUUGUUUAACAUGCAGCCCGAUCGUUGACUAGUGUU'};
	container.addRNA(options.structure, options);
});


// prepare main content
function makeTimeLine(datain) {
	google.charts.load('current', {'packages':['timeline']});
  google.charts.setOnLoadCallback(drawTimeline);
  function drawTimeline() {
  	let container = document.getElementById('timeLine');
    let chart = new google.visualization.Timeline(container);
    let dataTable = new google.visualization.DataTable();

    dataTable.addColumn({ type: 'string', id: 'rowLabel' });
    dataTable.addColumn({ type: 'string', id: 'barLabel' });
    dataTable.addColumn({ type: 'string', role: 'tooltip' });
    dataTable.addColumn({ type: 'number', id: 'Start' });
    dataTable.addColumn({ type: 'number', id: 'End' });
    dataTable.addRows(getRowCtx());

		let options = {
      timeline: { showRowLabels: false,
      						groupByRowLabel: true },
      height: document.querySelector('section').clientHeight - document.querySelector('h3').clientHeight - 60
    };

		// add selection event handler
		function selectHandler() {
    	var selectedItem = chart.getSelection()[0];
    	if (selectedItem) {
      	makePopup(dataTable.getValue(selectedItem.row, 2));
    	}
  	}
    google.visualization.events.addListener(chart, 'select', selectHandler);
    
    chart.draw(dataTable, options);
  }
	function getRowCtx() {
		rowCtx = []
  	$.each( datain, function( key, val ) {
  		rowCtx.push([
  			'rowlabel',
  			val.Method.length > 8 ? val.Method.substring(0, 5) + '...' : val.Method,
  			val.Method,
  			new Date(val.Year, 0, 1).getTime(),
  			new Date(val.Year, 11, 31).getTime(),
  		])
  	});
  	return rowCtx;
	}
	function makePopup(methodName) {
		$.each(datain, function(key, val){
			if (val.Method === methodName) {
				$("#dialog").html("<ul><li>Method: <a target='_blank' href='operations/showMethodDetails.html?methodName=" + val.Method + "'>" + val.Method + "</a></li><li>Year: " + val.Year + "</li><li>Name: " +
					 val.Name + "</li><li>Probe: " + val.Probe + "</li><li>Probe class: " + val['Probe class'] + "</li><li>Probe target: " +
					 val['Probe target'] + "</li><li>Target region: " + val['Target region'] + "</li><li>Readout: " +
					 val.Readout + "</li><li>Experimental setting: " + val['Experimental setting'] + "</li><li>Original application data: " +
					 val['Ori. App. Data'] +
					 "</li></ul>");
				$( "#dialog" ).dialog( "open" );
				return false;
			}
		});
	}
}


function makeProbeClassPieChart(datain) {
	google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawPieChart);

	let countClass = {};
	$.each(datain, function(key, val){
		countClass[val['Probe class']] = countClass.hasOwnProperty(val['Probe class'])? countClass[val['Probe class']] + 1 : 1;
	});
	let countList = [['Method', 'Count']];
	$.each(countClass, function(key, val){
		countList.push([key, val]);
	});
	
	function drawPieChart(){
		let pieChartData = google.visualization.arrayToDataTable(countList);
		let options = {
			width: document.querySelector('section').clientWidth - 20,
			height: document.querySelector('section').clientHeight - document.querySelector('h3').clientHeight - 60
		};
		let chart = new google.visualization.PieChart(document.getElementById('pieChart'));
		
		// add selection event handler
		function selectHandler() {
    	var selectedItem = chart.getSelection()[0];
    	if (selectedItem) {
      	makePiePopup(pieChartData.getValue(selectedItem.row, 0));
    	}
  	}
    google.visualization.events.addListener(chart, 'select', selectHandler);
		chart.draw(pieChartData, options);
	}
	
	function makePiePopup(probeClass) {
		tmpStr = '';
		$.each(datain, function(key, val){
			if (val['Probe class'] === probeClass) {
				tmpStr += "<li><a target='_blank' href='operations/showMethodDetails.html?methodName=" + val.Method + "'>" + val.Method + '</a></li>';
			}
		});
		$("#dialog").html("<p>" + probeClass + ":</p><ol>" + tmpStr + "</ol>");
		$( "#dialog" ).dialog( "open" );
	}
}

function makeApplicationPieChart(datain) {
	google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawPieChart);

	let countClass = {};
	$.each(datain, function(key, val){
		countClass[val['Experimental setting']] = countClass.hasOwnProperty(val['Experimental setting'])? countClass[val['Experimental setting']] + 1 : 1;
	});
	let countList = [['ExpSetting', 'Count']];
	$.each(countClass, function(key, val){
		countList.push([key, val]);
	});
	
	function drawPieChart(){
		let pieChartData = google.visualization.arrayToDataTable(countList);
		let options = {
			width: document.querySelector('section').clientWidth - 20,
			height: document.querySelector('section').clientHeight - document.querySelector('h3').clientHeight - 60
		};
		let chart = new google.visualization.PieChart(document.getElementById('applicationPieChart'));
		
		// add selection event handler
		function selectHandler() {
    	var selectedItem = chart.getSelection()[0];
    	if (selectedItem) {
      	makePiePopup(pieChartData.getValue(selectedItem.row, 0));
    	}
  	}
    google.visualization.events.addListener(chart, 'select', selectHandler);
		chart.draw(pieChartData, options);
	}
	
	function makePiePopup(expSetting) {
		tmpStr = '';
		$.each(datain, function(key, val){
			if (val['Experimental setting'] === expSetting) {
				tmpStr += "<li><a target='_blank' href='operations/showMethodDetails.html?methodName=" + val.Method + "'>" + val.Method + '</a></li>';
			}
		});
		$("#dialog").html("<p>" + expSetting + ":</p><ol>" + tmpStr + "</ol>");
		$( "#dialog" ).dialog( "open" );
	}
}


$( function() {
  $( "#dialog" ).dialog({
  	width: 400,
    autoOpen: false,
    show: {
      effect: "blind",
      duration: 1000
    },
    hide: {
      effect: "explode",
      duration: 500
    }
  });
});


$.getJSON( "data/3_techs_data.json", function( resdb ) {
	makeTimeLine(resdb);
	makeProbeClassPieChart(resdb);
	makeApplicationPieChart(resdb);
});