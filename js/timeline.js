cubism_contextPrototype.timeline = function() {
  var context = this,
      buffer = document.createElement("canvas"),
      width = buffer.width = context.size(),
      height = buffer.height = 30,
      metric = cubism_identity,
      color = "#333";

  function timeline(selection) {

    selection.append("canvas")
        .attr("width", width)
        .attr("height", height);

    selection.each(function(d, i) {
      var that = this,
          id = ++cubism_id,
          canvas = d3.select(that).select("canvas"),

      canvas = canvas.node().getContext("2d");
      function change(start, stop) {

        function getData() {
          d3.text("http://crash.innovalangues.net:81/events/get_data?" + "&target=" + encodeURIComponent("events('*')"), function(json) { 

            var events = JSON.parse(json);

            var avatarSize = 25;

            canvas.clearRect(0, 0, width, height);
            
            var latestDeploys  = $("#latest-deploys");

            for (var i = 0, len = events.length; i < len; i++) {

              if($("#deploy-" + event.when).length == 0) { 

                $("#latest-deploys").prepend(
                  '<li id="' + "deploy-" + event.when + '"><h3>' + event.what + '</h3><em>' + event.data + '</em></li>'
                );
              }

              startTs =  start.getTime() / 1000
              endTs =  stop.getTime() / 1000

              event = events[i];

              var ts = Math.round(event.when / 10) * 10;

              var image  = document.getElementById("donovan");

              canvas.fillStyle = '#333';

              canvas.fillRect(
                (ts - startTs) / 10,
                0,
                1, 
                height
              );

              canvas.drawImage(
                image,
                ((ts - startTs) / 10) - (avatarSize/2),
                (height - avatarSize) / 2,
                avatarSize, 
                avatarSize
              );

            }

          })
        }
        getData();
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
