cubism_contextPrototype.timeline = function() {
  var context = this,
      buffer = document.createElement("canvas"),
      width = buffer.width = context.size(),
      height = buffer.height = 30,
      scale = d3.scale.linear().interpolate(d3.interpolateRound),
      metric = cubism_identity,
      extent = null,
      color = "#333";

  function timeline(selection) {

    selection.append("canvas")
        .attr("width", width)
        .attr("height", height);

    selection.each(function(d, i) {
      var that = this,
          id = ++cubism_id,
          metric_ = typeof metric === "function" ? metric.call(that, d, i) : metric,
          start = -Infinity,
          step = context.step(),
          canvas = d3.select(that).select("canvas"),
          span = d3.select(that).select(".value"),
          ready;

      canvas = canvas.node().getContext("2d");

      // Start1 and stop are dates -ex : Thu Jan 14 2016 11:43:20 GMT+0100 (CET)
      function change(start1, stop) {
        canvas.save();

        // compute the new extent and ready flag
        var extent = metric_.extent();

        ready = extent.every(isFinite);

        // if this is an update (with no extent change), copy old values!
        var i0 = 0;

        if (this === context) {
            i0 = width - cubism_metricOverlap;
            var dx = (start1 - start) / step;
            //console.log(dx);
            if (dx < width) {
              var canvas0 = buffer.getContext("2d");
              canvas0.clearRect(0, 0, width, height);
              canvas0.drawImage(canvas.canvas, dx, 0, width - dx, height, 0, 0, width - dx, height);
              canvas.clearRect(0, 0, width, height);
              canvas.drawImage(canvas0.canvas, 0, 0);
            }
          
          start = start1;
        }

        // clear for the new data
        canvas.clearRect(i0, 0, width - i0, height);

        canvas.fillStyle = color;

        // Adjust the range based on the current band index.
        scale.range([height, 0]);


        // height
        var y0 = height;

        // Loops 1600x (width)
        for (var i = i0, n = width, y1; i < n; ++i) {
          y1 = metric_.valueAt(i);

          // Fill recttangle (X, Y, width, height)
          console.log("+++");
          console.log(i);
          console.log(scale(y1));
          console.log(y0 - y1);
          console.log("+++");
          
          canvas.fillRect(i, 180, 1, 20); // 180 = 200 - 20
        }

        canvas.restore();
      }

      // Update the chart when the context changes.
      context.on("change.timeline-" + id, change);

      // Display the first metric change immediately,
      // but defer subsequent updates to the canvas change.
      // Note that someone still needs to listen to the metric,
      // so that it continues to update automatically.
      metric_.on("change.timeline-" + id, function(start, stop) {
        change(start, stop);
        if (ready) metric_.on("change.timeline-" + id, cubism_identity);
      });
    });
  }

  timeline.height = function(_) {
    if (!arguments.length) return height;
    buffer.height = height = +_;
    return timeline;
  };

  timeline.metric = function(_) {
    if (!arguments.length) return metric;
    metric = _;
    return timeline;
  };

  timeline.scale = function(_) {
    if (!arguments.length) return scale;
    scale = _;
    return timeline;
  };

  return timeline;
};
