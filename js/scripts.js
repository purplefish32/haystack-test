	var context = cubism.context()
	    .step(10 * 1000) // 10 seconds
	    .serverDelay(0) // No server delay
		.clientDelay(0) // No client delay
	    .size(1600); //seconds

	var graphite = context.graphite("http://crash.innovalangues.net:81");

	var shortterm = graphite.metric("collectd.crash.load.load.shortterm").alias("Load Short Term");
	var midterm = graphite.metric("collectd.crash.load.load.midterm").alias("Load Mid Term");
	var longterm = graphite.metric("collectd.crash.load.load.longterm").alias("Load Long Term");	

	// draw graph
	var horizon = context
		.horizon()
		.extent([0,0.5])
		.height(50)
		.colors(
			[
				//Must be even number, first half are for negatif numbers
				"#f00",
				"#f00",
				"#f00",

				"#003242", // Dark blue
				"#009bd0", // Light blue
				"#ffffff" // White
			]
		);

	d3.select("#graphs").selectAll(".horizon")
      .data([shortterm, midterm, longterm])
      .enter()
      .append("div")
      .attr("class", "horizon")
      .call(horizon);

	var timeline = context.timeline().height(45);

    d3.select("#graphs").selectAll(".timeline")
      .data([shortterm])
      .enter()
      .append("div")
      .attr("class", "timeline")
      .call(timeline);

	// Transport bar
	d3.select("#graphs").append("div")
	    .call(context.rule());

	// Values follow transport bar
	context.on("focus", function(i) {
	  d3.selectAll(".value").style("right", i == null ? null : context.size() - i + "px");
	});

	// Axis
	d3.select("#graphs").selectAll(".axis")
	    .data(["bottom"])
	  .enter().append("div")
	    .attr("class", function(d) { return d + " axis"; })
	    .each(function(d) { d3.select(this).call(context.axis().ticks(12).orient(d)); });

	moment().format();