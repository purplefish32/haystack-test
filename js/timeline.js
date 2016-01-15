cubism_contextPrototype.timeline = function() {
  var context = this,
      buffer = document.createElement("canvas"),
      width = buffer.width = context.size(),
      height = buffer.height = 30,
      metric = cubism_identity,
      //scale = d3.scale.linear().interpolate(d3.interpolateRound),
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
        console.log(stop);

        function getData() {
          d3.text("http://crash.innovalangues.net:81/events/get_data?" + "&target=" + encodeURIComponent("events('*')"), function(json) { 

            var events = JSON.parse(json);

            var avatarSize = 25;

            canvas.clearRect(0, 0, width, height);
            
            var latestDeploys  = document.getElementById("latest-deploys");
            //latestDeploys.removeChild('li'); //TODO



            for (var i = 0, len = events.length; i < len; i++) {

              var li = document.createElement("li");
              li.appendChild(document.createTextNode("Four"));
              latestDeploys.appendChild(li);
              
              startTs =  start.getTime() / 1000
              endTs =  stop.getTime() / 1000

              event = events[i];

              console.log(event.when);

              ts = Math.round(event.when / 10) * 10;

              console.log(events[i]);
              console.log(startTs + ":" + ts + ":" + (ts - startTs) / 10);

              var image  = document.getElementById("donovan");

              console.log(image);

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

        console.log(start);

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
