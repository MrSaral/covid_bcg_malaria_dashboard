

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
    .domain([0,2,5,7,14,15,20,25,50,75,100,120])
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
                .attr('style', 'left:' + (mouse[0] +100) +
                    'px; top:' + (mouse[1] +20) + 'px')
                .html(d.properties.name + " <br />Deaths:" + (Math.round(data.get(d.properties.name) * 100) / 100||0));
        })
        .on('mouseout', function () {
            tooltip.classed('hidden', true);
        }).attr("class","province");
}