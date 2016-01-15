cubism_contextPrototype.timeline = function() {
  var context = this,
      buffer = document.createElement("canvas"),
      width = buffer.width = context.size(),
      height = buffer.height = 30,
      metric = cubism_identity,
      color = "#333";

  function timeline(selection) {

    console.log(selection);

    selection.append("canvas")
        .attr("width", width)
        .attr("height", height);

    selection.each(function(d, i) {
      var that = this,
          id = ++cubism_id,
          canvas = d3.select(that).select("canvas"),

      canvas = canvas.node().getContext("2d");

      // Start1 and stop are dates -ex : Thu Jan 14 2016 11:43:20 GMT+0100 (CET)
      function change(start, stop) {
        console.log(start);

        //canvas.save();

        canvas.fillStyle = 'red';
        canvas.fillRect(20,height-35,20,20);

        //canvas.restore();
      }

      // Update the chart when the context changes.
      context.on("change.timeline-" + id, change);
    });
  }

  timeline.height = function(_) {
    if (!arguments.length) return height;
    buffer.height = height = +_;
    return timeline;
  };

  return timeline;
};
