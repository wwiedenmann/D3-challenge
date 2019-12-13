// Scatterplot Setup
var svgHeight = 500;
var svgWidth = 960;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
};
  
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Appending SVG to body of HTML

var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body")
    .append("div").attr("class", "tooltip").style("opacity", 0);

// Load Data from csv

d3.csv("data.csv").then(function(csvData) {


    // console.log(csvData);

    // Turn numbers into integers
    
    csvData.forEach(function(d) {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });

    // Scaling the x and y axes

    var xLinearScale = d3.scaleLinear().range([0, width]);
    var yLinearScale = d3.scaleLinear().range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xMin = d3.min(csvData, function(data) {
        return data.healthcare;
    });

    var xMax = d3.max(csvData, function(data) {
        return data.healthcare;
    });

    var yMin = d3.min(csvData, function(data) {
        return data.poverty;
    });

    var yMax = d3.max(csvData, function(data) {
        return data.poverty;
    });

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);

    // Append Axes to the chart

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create State Markers

    var circlesGroup = chartGroup.selectAll("circle")
        .data(csvData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.healthcare +1.5))
        .attr("cy", d => yLinearScale(d.poverty +0.3))
        .attr("r", "12")
        .attr("fill", "blue")
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    
    // Initialize tool tip

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .html(function(d) {
            return (abbr + '%');
        });

    // Create tooltip in the chart

    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip

    circlesGroup.on("click", function(data) {
        toolTip.show(data);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    // Create axes labels

    chartGroup.append("text")
    .style("font-size", "12px")
    .selectAll("tspan")
    .data(csvData)
    .enter()
    .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.healthcare +1.3);
        })
        .attr("y", function(data) {
            return yLinearScale(data.poverty +.1);
        })
        .text(function(data) {
            return data.abbr
        });

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healtcare(%)");

    chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
    
});