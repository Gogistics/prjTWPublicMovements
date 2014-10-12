// credit
// close map (temp)
$('img#close_credit_data_analysis_chart').click(function() {
	$('div#financial_credit_data_analysis_block').toggle("slow", function() {
		$('div#financial_credit_bars_chart_container').empty();
	});
});

// show
var financial_grouped_bars_chart_credit_data;
var financial_grouped_bars_chart_debit_data;
var financial_summary_grouped_bars_chart;

$('#btns_of_showing_plots > input.form-control')
		.click(
				function() {
					var obj_key = $(this).attr('id');
					var data_source = [];
					if (obj_key.indexOf('credit') !== -1) {
						data_source = financial_grouped_bars_chart_credit_data
								.slice();

					} else if (obj_key.indexOf('debit') !== -1) {
						data_source = financial_grouped_bars_chart_debit_data
								.slice();
					} else if (obj_key.indexOf('summary') !== -1) {
						data_source = financial_summary_grouped_bars_chart
								.slice();
					}

					$('div#financial_credit_data_analysis_block')
							.toggle(
									"slow",
									function() {
										if (typeof (data_source) !== 'undefined') {
											show_grouped_bars_chart(
													data_source,
													'div#financial_credit_bars_chart_container');
										}
									});

				});
// end of credit

// show data
function show_grouped_bars_chart(arg_data, arg_selected_div) {
	var data = JSON.parse(JSON.stringify(arg_data));

	var margin = {
		top : 20,
		right : 150,
		bottom : 30,
		left : 40
	}, width = 1000 - margin.left - margin.right, height = 500 - margin.top
			- margin.bottom;

	var x0 = d3.scale.ordinal().rangeRoundBands([ 0, width ], .1);

	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear().range([ height, 0 ]);

	var color = d3.scale.ordinal().range(
			[ "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c",
					"#ff8c00" ]);

	var xAxis = d3.svg.axis().scale(x0).orient("bottom");

	var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(
			d3.format(".2s"));

	var svg = d3.select(arg_selected_div).append("svg").attr("width",
			width + margin.left + margin.right).attr("height",
			height + margin.top + margin.bottom).append("g").attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	var tip = d3
			.tip()
			.attr('class', 'd3-tip')
			.offset([ -10, 0 ])
			.html(
					function(d) {
						return "<strong>"
								+ d.name
								+ '('
								+ d.year_month
								+ ')'
								+ ":&nbsp;&nbsp;</strong><span style='color:red'>新台幣&nbsp;"
								+ numeral(d.value).format('0,0') + "</span>";
					});

	// start
	var ageNames = d3.keys(data[0]).filter(function(key) {
		return key !== "State"; // state
	});

	data.forEach(function(d) {
		d.ages = ageNames.map(function(name) {
			return {
				name : name,
				value : +d[name],
				year_month : d.State
			// state
			};
		});
	});

	x0.domain(data.map(function(d) {
		return d.State; // state
	}));
	x1.domain(ageNames).rangeRoundBands([ 0, x0.rangeBand() ]);
	y.domain([ 0, d3.max(data, function(d) {
		return d3.max(d.ages, function(d) {
			return d.value;
		});
	}) ]);

	svg.append("g").attr("class", "x axis").attr("transform",
			"translate(0," + height + ")").call(xAxis);

	svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr(
			"transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style(
			"text-anchor", "end").text("金額(新台幣)");

	var state = svg.selectAll(".state").data(data).enter().append("g").attr(
			"class", "g").attr("transform", function(d) {
		return "translate(" + x0(d.State) + ",0)"; // state
	});

	state.selectAll("rect").data(function(d) {
		return d.ages;
	}).enter().append("rect").attr("width", x1.rangeBand()).attr("x",
			function(d) {
				return x1(d.name);
			}).attr("y", function(d) {
		return y(d.value);
	}).attr("height", function(d) {
		return height - y(d.value);
	}).style("fill", function(d) {
		return color(d.name);
	}).on('mouseover', tip.show).on('mouseout', tip.hide);

	var legend = svg.selectAll(".legend").data(ageNames.slice().reverse())
			.enter().append("g").attr("class", "legend").attr("transform",
					function(d, i) {
						return "translate(150," + i * 20 + ")";
					});

	legend.append("rect").attr("x", width - 18).attr("width", 18).attr(
			"height", 18).style("fill", color);

	legend.append("text").attr("x", width - 24).attr("y", 9)
			.attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
				return d;
			});

	// apply tips
	svg.call(tip);
}