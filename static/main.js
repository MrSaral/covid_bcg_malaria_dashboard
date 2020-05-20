function malaria() {
    d3.select("svg").style('display', 'block')

    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var tooltip = d3.select('body').append('div')
        .attr('class', 'hidden tooltip');

    var legend = svg.append("g").attr("class", "legend").attr("transform", "translate(450,405)");

    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
        .scale(150)
        .center([0, 5])
        .translate([width / 2, height / 2]);

    // Data and color scale
    var data = d3.map();

    var colorScale = d3.scaleThreshold()
        .domain([0, 2, 5, 7, 14, 15, 20, 25, 50, 75, 100, 120])
        .range(d3.schemeGreens[9]);



    // Load external data and boot
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .defer(d3.csv, "static/data/malaria_deaths.csv", function (d) { data.set(d.Entity, +d.Deaths); })
        .await(ready);

    function ready(error, topo) {

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            // draw each country
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            // set the color of each country
            .attr("fill", function (d) {
                d.total = data.get(d.properties.name) || 0;
                return colorScale(d.total);
            }).on('mousemove', function (d) {
                var mouse = d3.mouse(svg.node()).map(function (d) {
                    return parseInt(d);
                });
                tooltip.classed('hidden', false)
                    .attr('style', 'left:' + (mouse[0] + 100) +
                        'px; top:' + (mouse[1] + 20) + 'px')
                    .html(d.properties.name + " <br />Deaths:" + (Math.round(data.get(d.properties.name) * 100) / 100 || 0));
            })
            .on('mouseout', function () {
                tooltip.classed('hidden', true);
            }).attr("class", "province").transition()
            .duration(650)
            .ease(d3.easeLinear);
    }


    var newData = [];
    var legend_width = 200;
    var divisions = 100;
    var sectionWidth = Math.floor(legend_width / divisions);

    for (var i = 0; i < legend_width; i += sectionWidth) {
        newData.push(i);
    }
    var col_range_low = "#fff",
        col_range_high = "#006827";
    var colorScaleLin = d3.scaleLinear()
        .domain([0, newData.length - 1])
        .interpolate(d3.interpolateLab)
        .range([col_range_low, col_range_high]);

    legend.selectAll('rect')
        .data(newData)
        .enter()
        .append('rect')
        .attr("x", function (d) { return d; })
        .attr("y", 10)
        .attr("height", 10)
        .attr("width", sectionWidth)
        .attr('fill', function (d, i) { return colorScaleLin(i) });

    legend.append("text").text(function () { return (0 * 100).toFixed(1) + "%"; }).attr("transform", "translate(0,0)").style("font-size", "10px");
    legend.append("text").text(function () { return (1 * 100).toFixed(1) + "%"; }).attr("transform", "translate(" + (legend_width - 20) + ",0)").style("font-size", "10px");

}
 function covid() {
     d3.select("svg").style('display', 'block')

     var svg = d3.select("svg"),
         width = +svg.attr("width"),
         height = +svg.attr("height");

     var tooltip = d3.select('body').append('div')
         .attr('class', 'hidden tooltip');

     // Map and projection
     var path = d3.geoPath();
     var projection = d3.geoMercator()
         .scale(150)
         .center([0, 5])
         .translate([width / 2, height / 2]);

     // Data and color scale
     var data = d3.map();

     var colorScale = d3.scaleThreshold()
         .domain([0, 50, 100, 1000, 5000, 10000, 15000, 30000])
         .range(d3.schemeReds[9]);



     // Load external data and boot
     d3.queue()
         .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
         .defer(d3.csv, "static/data/corona_deaths.csv", function (d) { data.set(d.Countries, +d.Deaths_c); })
         .await(ready);

     function ready(error, topo) {

         // Draw the map
         svg.append("g")
             .selectAll("path")
             .data(topo.features)
             .enter()
             .append("path")
             // draw each country
             .attr("d", d3.geoPath()
                 .projection(projection)
             )
             // set the color of each country
             .attr("fill", function (d) {
                 if ((d.properties.name)=='England'){
                     d.total = data.get("United Kingdom")
                 }
                 else{d.total = data.get(d.properties.name) || 0;
                 }
                 return colorScale(d.total);
             }).on('mousemove', function (d) {
                 var mouse = d3.mouse(svg.node()).map(function (d) {
                     return parseInt(d);
                 });
                 tooltip.classed('hidden', false)
                     .attr('style', 'left:' + (mouse[0] + 100) +
                         'px; top:' + (mouse[1] + 20) + 'px')
                     .html(d.properties.name + " <br />Deaths:" + (Math.round(data.get(d.properties.name) * 100) / 100 || 0));
             })
             .on('mouseout', function () {
                 tooltip.classed('hidden', true);
             }).attr("class", "province");
     }

 }