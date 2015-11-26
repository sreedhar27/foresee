/*
 * Foresee is a visualization module that provides charting directives using d3js.
 * Author : Sreedhar Potturi
 * */
angular.module("foresee",[])
		.provider("$axisProvider",axisProvider)
		.provider("$dataLabelProvider",dataLabelProvider)
		.provider("$barChartProvider",barChartProvider)
		.provider("$lineChartProvider",lineChartProvider)
		.provider("$scatterChartProvider",scatterChartProvider)
		.provider("$pieChartProvider",pieChartProvider)
		.provider("$areaChartProvider",areaChartProvider)
		.provider("$circlePackingChartProvider",circlePackingChartProvider);

/*
 * TODO : smart way to mix ordinal and linear scaled visualizations.
 * */

//axis rendering service provider
function axisProvider(){
	/*
	 * setAxisContainer(svg);
	 * setXScale(makeLinearScale([0,width],[0,d3.max(data, function(d) { return d.x; })]));
	 * setYScale(makeLinearScale([height,0],[0,d3.max(data, function(d) { return d.y; })]));
	 * draw()
	 * */
	var axisProviderImpl = {
			height 	: 0,
			width	: 0,
			svg		: null,
			xScale	: null,
			yScale	: null,
			xAxis	: null,
			xGrid	: null,
			yAxis	: null,
			yGrid	: null,
			drawXGrid: true,
			drawYGrid: true,
			drawGrid: true,
			xScaleOrient : "bottom",
			yScaleOrient : "left",
			xTitle:"",
			yTitle:"",
			title:"",
			ticks	: 10,
			gridTicks : 10,
			tickFormat:",r",
			setAxisContainer: function(svg){
				if(!isDefined(svg) || isNull(svg)){
					return ;
				}
				this.height = svg.attr("height");
				this.width  = svg.attr("width");
				this.svg	= svg;
			},
			makeLinearScale : function(range,domain){
				return d3.scale.linear().range(range).domain(domain).nice();
			},
			setXScale	: function(xScale){
				this.xScale = xScale;
				this.xAxis = d3.svg.axis().scale(xScale).orient(this.xScaleOrient).ticks(this.ticks, this.tickFormat);
			    this.xGrid = d3.svg.axis().scale(xScale).orient(this.xScaleOrient).tickSize(-this.height, 0, 0).ticks(this.gridTicks).tickFormat("");
			},
			setYScale	:function(yScale){
				this.yScale = yScale;
				this.yAxis = d3.svg.axis().scale(yScale).orient(this.yScaleOrient).ticks(this.ticks, this.tickFormat);
			    this.yGrid = d3.svg.axis().scale(yScale).orient(this.yScaleOrient).tickSize(-this.width, 0, 0).ticks(this.gridTicks).tickFormat("");
			},
			draw	: function(){
				console.log("Drawing Axis.");
				this.clear();
				if(this.drawGrid && this.drawYGrid){
					this.svg.insert("g",":first-child").attr("class", "grid").call(this.yGrid);
				}
				this.svg.insert("g",":first-child").attr("class","axis").call(this.yAxis);
				//Y axis title
				this.svg.append("g")
				.attr("class","axisLabel")
			    .append("text")
			    .attr("class","axisLabel")
			    .attr("transform", "rotate(-90)")
			    .text(this.yTitle)
			    .attr("text-anchor","middle")
			    .attr("x",-((this.height/2)))
			    .attr("y",-30);
				
				if(this.drawGrid && this.drawXGrid){
					this.svg.insert("g",":first-child").attr("class", "grid").attr("transform", "translate(0," + this.height + ")").call(this.xGrid);
				}
				this.svg.insert("g",":first-child").attr("class","axis").attr("transform", "translate(0," + this.height + ")").call(this.xAxis);
				//X axis title
			    this.svg.append("g")
			    .attr("class","axisLabel")
			    .append("text")
			    .attr("transform", "translate(0," + this.height + ")")
			    .attr("class","axisLabel")
			    .attr("text-anchor","middle")
			    .text(this.xTitle)
			    .attr("x",(this.width/2))
			    .attr("y",30);
			    //chart Title
			    this.svg.append("g")
			    .attr("class","axisLabel")
			    .append("text")
			    .attr("class","chartTitle")
			    .text(this.title)
			    .attr("text-anchor","middle")
			    .attr("x",(this.width/2))
			    .attr("y",0);
			},
			clear : function(){
				this.svg.selectAll(".grid").remove();
				this.svg.selectAll(".axis").remove();
				this.svg.selectAll(".axisLabel").remove();
			}
	};
	
	this.$get = function(){
		return axisProviderImpl;
	};
}
//bar chart rendering service provider
function barChartProvider(){
	var barChartProviderImpl = {
			svg : null,
			axisProvider : null,
			data : [],
			dataX:"",
			dataY:"",
			effect : null,
			animate : true,
			draw : function(){
				console.log("Drawing Bar chart.");
				var xScale = this.axisProvider.xScale;
				var yScale = this.axisProvider.yScale;
				var width = this.axisProvider.width;
				var height = this.axisProvider.height;
				var rangeBand = Math.ceil(width/this.data.length);
				var dataX = this.dataX;
				var dataY = this.dataY;
				this.clear();				
				var tip = d3.tip()
				  .attr('class', 'd3-tip')
				  .offset([-10, 0])
				  .html(function(d) {
				    return "<strong>Frequency:</strong> <span style='color:red'>" + d[dataY] + "</span>";
				  });
				this.svg.call(tip);
				var bars = this.svg.selectAll(".bar")
						.data(this.data)
						.enter()
						.append("rect")
						.attr("x", function(d) {return (xScale(d[dataX])-rangeBand)+2;})
						.attr("width",rangeBand-4)
						.attr("class","bar")
						.on('mouseover', tip.show)
						.on('mouseout', tip.hide);
				if(this.animate){
					bars = bars.attr("y", height)
						.attr("height", 0)
						.transition()
						.duration(2000);
				}
				bars.attr("y", function(d) { return yScale(d[dataY]); })
					.attr("height", function(d) { return height - yScale(d[dataY]); });
				if(isDefined(this.effect) && !isNull(this.effect)){
					bars.attr("filter",getFilter(this.effect));
				}
			},
			clear:function(){this.svg.selectAll(".bar").remove();}
	};
	this.$get = function(){
		return barChartProviderImpl;
	};
}
//line chart rendering service provider
function lineChartProvider(){
	var lineChartProviderImpl = {
			svg : null,
			axisProvider : null,
			data : [],
			dataX:"",
			dataY:"",
			effect : null,
			animate : true,
			filterIgnoreList :["url(#turb)"],
			draw : function(){
				console.log("Drawing Line chart.");
				this.svg.selectAll(".line").remove();
				var xScale = this.axisProvider.xScale;
				var yScale = this.axisProvider.yScale;
				var width = this.axisProvider.width;
				var rangeBand = Math.ceil(width/this.data.length);
				var dataX = this.dataX;
				var dataY = this.dataY;
				var line = d3.svg.line()
			    			.x(((xScale(this.data[0][dataX])-rangeBand)+(rangeBand/2)))
			    			.y((yScale(this.data[0][dataY])));
			    
			    var path = this.svg.append("path")
			        	.datum(this.data)
			        	.attr("class", "line")      
			        	.attr("d", line);
			    
			    if(isDefined(this.effect) && !isNull(this.effect)){
			    	if(this.filterIgnoreList.indexOf(getFilter(this.effect))<0){
			    		path.attr("filter",getFilter(this.effect));
			    	}
				}
			    
			    line.x(function(d) { return ((xScale(d[dataX])-rangeBand)+(rangeBand/2)); })
			    	.y(function(d) { return (yScale(d[dataY])); });
			    if(this.animate){
			    	path = path.transition()
			    		.duration(2000);
			    }
			    path.attr("d",line);
			},
		clear:function(){this.svg.selectAll(".line").remove();}
	};
	this.$get = function(){
		return lineChartProviderImpl;
	};
}
//line scatter rendering service provider
function scatterChartProvider(){
	var scatterChartProviderImpl = {
			svg : null,
			axisProvider : null,
			data : [],
			dataX:"",
			dataY:"",
			effect : null,
			animate : true,
			filterIgnoreList :["url(#turb)"],
			draw : function(){
				console.log("Drawing Scatter chart.");
				this.svg.selectAll(".circle").remove();
				var xScale = this.axisProvider.xScale;
				var yScale = this.axisProvider.yScale;
				var width = this.axisProvider.width;
				var rangeBand = Math.ceil(width/this.data.length);
				var dataX = this.dataX;
				var dataY = this.dataY;
				 var circles =  this.svg.selectAll(".circle")
			        .data(this.data)
			        .enter()
			        .append("circle")
			        .attr("class","circle")
			        .attr("r", 0)
			        .attr("cx", function(d) { return ((xScale(d[dataX])-rangeBand)+(rangeBand/2)); })
			        .attr("cy", function(d) { return yScale(d[dataY]); });
				 if(isDefined(this.effect) && !isNull(this.effect)){
				    	if(this.filterIgnoreList.indexOf(getFilter(this.effect))<0){
				    		circles.attr("filter",getFilter(this.effect));
				    	}
				 }
			    if(this.animate){
			    	circles.transition().duration(2000).ease("elastic").attr("r",4);
			    }else{
			    	circles.attr("r",4);
			    }
			},
		clear:function(){this.svg.selectAll(".circle").remove();}
	};
	this.$get = function(){
		return scatterChartProviderImpl;
	};
}
//line scatter rendering service provider
function pieChartProvider(){
	var pieChartProviderImpl = {
			svg : null,
			axisProvider : null,
			data : [],
			dataX:"",
			dataY:"",
			yTitle:"",
			xTitle:"",
			title:"",
			effect : null,
			animate : true,
			filterIgnoreList :["url(#turb)","url(#blur)"],
			draw : function(){
				console.log("Drawing pie chart.");
				this.svg.selectAll(".arc").remove();
				var width = this.axisProvider.width;
				var height = this.axisProvider.height;
				var dataX = this.dataX;
				var dataY = this.dataY;
				var radius = Math.min(width, height) / 2;
				   
			    var color = d3.scale.category10();
			    
			    var arc = d3.svg.arc()
			        .outerRadius(radius - 10)
			        .innerRadius(15);
			    var pie = d3.layout.pie()
			        .sort(null)
			        .value(function(d) { return d.values; });
			    
			    var nestedData = d3.nest()
			                .key(function(d){return d[dataX];})
			                .rollup(function(leaves){return d3.sum(leaves,function(d){return +d[dataY];});})
			    			.entries(this.data);
			    
			    var g = this.svg.append("g")
			    				.attr("class", "arc")
                				.attr("filter",getFilter(this.effect))
            					.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            					.selectAll(".arc")
            					.data(pie(nestedData))
        						.enter().append("g");
			    
        					g.attr("class", "arc")
        						.append("path")
        						.attr("d", arc)
        						.style("fill", function(d) { return color(d.data.key); });
			    
			    g.data(pie(nestedData))
			    	  .append("text")
			          .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
			          .attr("dy", "0.35em")
			          .style("text-anchor", "middle")
			          .text(function(d) { return d.data.key+"("+d.data.values+")"; });
			    
			  //Y axis title
				/*this.svg.append("g")
				.attr("class","axisLabel")
			    .append("text")
			    .attr("class","axisLabel")
			    .attr("transform", "rotate(-90)")
			    .text(this.yTitle)
			    .attr("text-anchor","middle")
			    .attr("x",-((height/2)))
			    .attr("y",-30);*/
				//X axis title
			    /*this.svg.append("g")
			    .attr("class","axisLabel")
			    .append("text")
			    .attr("transform", "translate(0," + this.height + ")")
			    .attr("class","axisLabel")
			    .attr("text-anchor","middle")
			    .text(this.xTitle)
			    .attr("x",(width/2))
			    .attr("y",30);*/
			    //chart Title
			    this.svg.append("g")
			    .attr("class","pieTitle")
			    .append("text")
			    .attr("class","pieTitle")
			    .text(this.title)
			    .attr("text-anchor","middle")
			    .attr("x",(width/2))
			    .attr("y",0);
			},
		clear:function(){
				this.svg.selectAll(".arc").remove();
				this.svg.selectAll(".pieTitle").remove();
			}
	};
	this.$get = function(){
		return pieChartProviderImpl;
	};
}
//line scatter rendering service provider
function areaChartProvider(){
	var areaChartProviderImpl = {
			svg : null,
			axisProvider : null,
			data : [],
			dataX:"",
			dataY:"",
			effect : null,
			animate : true,
			filterIgnoreList :["url(#turb)"],
			draw : function(){
				console.log("Drawing area chart.");
				this.clear();
				var xScale = this.axisProvider.xScale;
				var yScale = this.axisProvider.yScale;
				var width = this.axisProvider.width;
				var height = this.axisProvider.height;
				var rangeBand = Math.ceil(width/this.data.length);
				var dataX = this.dataX;
				var dataY = this.dataY;
				
				var area = d3.svg.area()
			    			.x(function(d) { return ((xScale(d[dataX])-rangeBand)+(rangeBand/2)); })
			    			.y((yScale(this.data[0][dataY])));
			    
			    var path1 = this.svg.append("path");
			    if(isDefined(this.effect) && !isNull(this.effect)){
			    	if(this.filterIgnoreList.indexOf(getFilter(this.effect))<0){
			    		path1.attr("filter",getFilter(this.effect));
			    	}
			    }
			    path1 = path1.datum(this.data)
			      			.attr("class", "area")      
			      			.attr("d", area);
			   
			    area.y0(height)
					.y1(function(d) { return (yScale(d[dataY])); });
			    
				if(this.animate){
			    	path1.transition().duration(1000).attr("d",area);
			    }else{
			    	path1.attr("d",area);
			    }
				 
			},
		clear:function(){this.svg.selectAll(".area").remove();}
	};
	this.$get = function(){
		return areaChartProviderImpl;
	};
}

function circlePackingChartProvider(){
	var circlePackingChartProviderImpl = {
			svg : null,
			axisProvider : null,
			data : [],
			dataX:"",
			dataY:"",
			effect : null,
			animate : true,
			filterIgnoreList :["url(#turb)"],
			draw : function(){
				console.log("Drawing circle packing chart.");
				this.clear();
				var diameter = this.axisProvider.height;
				var height = this.axisProvider.height;
				var width = this.axisProvider.width;
				var dataX = this.dataX;
				var dataY = this.dataY;
				var data = this.data;
				var root = this.data;
				var x = d3.scale.linear().range([0, diameter]);
				var y = d3.scale.linear().range([0, diameter]);

				var color = d3.scale.linear().domain([-1, 5])
			    			.range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
			    			.interpolate(d3.interpolateHcl);

				var pack = d3.layout.pack()
				    .padding(2)
				    .size([diameter, diameter])
				    .value(function(d) { return d[dataY]; });

				//var svg = this.svg.append("g");
				    //.attr("transform", "translate(" + margin + "," + margin + ")");

				var focus = this.data;
			    var nodes = pack.nodes(this.data);

			    this.svg.append("g")
			    		.attr("class","circlepack")
			    		.attr("transform","translate(" + diameter + ", 0)")
						.selectAll("circle")
						.data(nodes)
						.enter().append("circle")
						.attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
						.attr("filter", getFilter(this.effect))
						.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
						.attr("r", function(d) { return d.r; })
						.style("fill", function(d) { return d.children ? color(d.depth) : null; })
						.on("click", function(d) { return zoom(focus == d ? data : d); });

			  this.svg.append("g").attr("class","circlepack")
			  					.attr("transform","translate(" + diameter + ", 0)")
			  					.selectAll("text")
							    .data(nodes)
							    .enter().append("text")
							    .attr("class", "label")
							    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
							    .style("fill-opacity", function(d) { return d.parent === data ? 1 : 0; })
							    .style("display", function(d) { return d.parent === data ? null : "none"; })
							    .text(function(d) { return d[dataX]; });

			  d3.select(window).on("click", function() { zoom(root); });

			  function zoom(d, i) {
			    var focus0 = focus;
			    focus = d;

			    var k = diameter / d.r / 2;
			    x.domain([d.x - d.r, d.x + d.r]);
			    y.domain([d.y - d.r, d.y + d.r]);
			    d3.event.stopPropagation();

			    var transition = d3.selectAll("text,circle").transition()
			        .duration(d3.event.altKey ? 7500 : 750)
			        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

			    transition.filter("circle")
			        .attr("r", function(d) { return k * d.r; });

			    transition.filter("text")
			      .filter(function(d) { return d.parent === focus || d.parent === focus0; })
			        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
			        .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
			        .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
			  } 
			},
		clear:function(){
				d3.select("#vis").on("click",null);
				this.svg.selectAll(".circlepack").remove();
			}
	};
	this.$get = function(){
		return circlePackingChartProviderImpl;
	};
}
//Data label rendering service provider

function dataLabelProvider(){
	var dataLabelProviderImpl = {
			svg : null,
			data:[],
			animate:true,
			xScale : null,
			yScale : null,
			width : null,
			dataX : null,
			dataY : null,
			labelSeries : null,
			draw : function(){
				this.clear();
				var rangeBand = Math.ceil(this.width/this.data.length);
				var xScale = this.xScale;
				var yScale = this.yScale;
				var dataX = this.dataX;
				var dataY = this.dataY;
				var labelSeries = this.labelSeries;
				var text = this.svg.append("g")
					.attr("class","dataLabel")
					.selectAll("text")
				    .data(this.data)
				    .enter()
				    .append("text")
				    .text(function(d){return d[labelSeries];})
				    .attr("class","dataLabel");
				if(this.animate){
					text = text.attr("x",0)
					.attr("y",0)
					.transition()
					.duration(1000);
				}
			    text.attr("x",function(d){return ((xScale(d[dataX])-rangeBand)+(rangeBand/2));})
				    .attr("y",function(d){return yScale(d[dataY])-3;});
			},
			clear:function(){this.svg.selectAll(".dataLabel").remove();}
	};
	this.$get = function(){
		return dataLabelProviderImpl;
	};
	
}

//Helper methods
function isDefined(item){
	return ("undefined"!= typeof item);
}

function isNull(item){
	return (isDefined(item) && item == null);
}

function getFilter(effectName){
	if("2D"==effectName){
		return "";
	}
	if("3D"==effectName){
		return "url(#shadow)";
	}
	if("Blur"==effectName){
		return "url(#blur)";
	}
	if("Turbulence"==effectName){
		return "url(#turb)";
	}
}