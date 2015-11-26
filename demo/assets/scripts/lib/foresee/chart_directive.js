function chartDirective($axisProvider,$injector){
	return {
		restrict : "EA",
		require : true,
		template:	"<div style='position:absolute;top:30px;left:5px;z-index:200;'>" +
						"<div>" +
							"<input type='image' class='btn' style='width:32px;height:32px; padding:0px;' src='assets/images/icons/config.png' ng-click='isCollapsed = !isCollapsed'/>" +
						"</div>" +
						"<div collapse='isCollapsed'>" +
							"<div class='chartConfig'>" +
								"<div class='chartConfigItem'><input type='checkbox' ng-model='chartAnimate'/> Animate</div>" +
								"<div class='chartConfigItem'>Chart Tilt " +
									" <select ng-model='chartTilt'>" +
										"<option value='tiltLeft'>Tilt Left</option>" +
										"<option value='tiltRight'>Tilt Right</option>" +
										"<option value=''>Flat</option>" +
									"</select>" +
								"</div>" +
								"<div class='chartConfigItem'>Effect " +
								" <select ng-model='chartEffect'>" +
									"<option value='3D'>3D</option>" +
									"<option value='2D'>2D</option>" +
									"<option value='Blur'>Blur</option>" +
									"<option value='Turbulence'>Turbulence</option>" +
								"</select>" +
							"</div>" +
								"<div class='chartConfigItem'><input type='checkbox' ng-model='$axisProvider.drawGrid'/> Show Grid</div>" +
								"<div class='chartConfigItem'><input type='checkbox' ng-model='$axisProvider.drawXGrid'/> Show X Grid</div>" +
								"<div class='chartConfigItem'><input type='checkbox' ng-model='$axisProvider.drawYGrid'/> Show Y Grid</div>" +
								"<div class='chartConfigItem'>Axis Ticks <input class='chartConfigTextNumber' type='text' ng-model='$axisProvider.ticks'/></div>" +
								"<div class='chartConfigItem'>Grid Ticks <input  class='chartConfigTextNumber' type='text' ng-model='$axisProvider.gridTicks'/></div>" +
								"<div class='chartConfigItem'>X Title <input  class='chartConfigTextString' type='text' ng-model='$axisProvider.xTitle'/></div>" +
								"<div class='chartConfigItem'>Y Title <input  class='chartConfigTextString' type='text' ng-model='$axisProvider.yTitle'/></div>" +
								"<div class='chartConfigItem'>Title <input  class='chartConfigTextString' type='text' ng-model='$axisProvider.title'/></div>" +
								"<div class='chartConfigItem'><input type='checkbox' ng-model='dataLabels'/> Data Labels</div>" +
								"<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>" +
							"</div>" +
						"</div>" +
						"<br/>" +
					//"</div>" +
					//"<div style='position:absolute;top:63px;left:5px;margin-top:5px;z-index:200;'>" +
						"<div>" +
							"<input type='image' class='btn' style='width:32px;height:32px; padding:0px;float: left;clear:both;' src='assets/images/icons/charts.png' ng-click='isChartsCollapsed = !isChartsCollapsed' />" +
						"</div>"+
						"<div collapse='isChartsCollapsed' style='clear:both;' >" +
							"<div class='chartConfig'>" +
								"<div class='btn-group'>" +
							        "<img src='assets/images/icons/bar.png' class='btn btn-primary chartPicker' ng-model='chartTypeToggle.bar' btn-checkbox>" +
							        "<img src='assets/images/icons/line.png'  class='btn btn-primary chartPicker' ng-model='chartTypeToggle.line' btn-checkbox>" +
							        "<img src='assets/images/icons/scatter.png'  class='btn btn-primary chartPicker' ng-model='chartTypeToggle.scatter' btn-checkbox>" +
							        "<img src='assets/images/icons/area.png'  class='btn btn-primary chartPicker' ng-model='chartTypeToggle.area' btn-checkbox>" +
							        "<img src='assets/images/icons/pie.png'  class='btn btn-primary chartPicker' ng-model='chartTypeToggle.pie' btn-checkbox>" +
							        "<img src='assets/images/icons/circlepacking.png'  class='btn btn-primary chartPicker' ng-model='chartTypeToggle.circlepacking' btn-checkbox>" +
						        "</div>" +
					        "</div>" +
				        "</div>" +
			        "</div>" +
			        "<svg width='0px' height='0px'>" +
				        "<filter id='blur'>" +
					        "<feGaussianBlur in='SourceGraphic' result='SourceGraphic' stdDeviation='3' />" +
				        "</filter>" +
				        "<filter id='turb' filterUnits='objectBoundingBox' x='0%' y='0%' width='100%' height='100%'>" +
				        	"<feTurbulence type='turbulence' baseFrequency='0.05' numOctaves='2'/>" +
			        	"</filter>" +
			        	"<filter id='shadow'>" +
			        		"<feGaussianBlur in='SourceAlpha' stdDeviation='4' result='blur'/>" +
			        		"<feOffset in='blur' dx='4' dy='4' result='offsetBlur'/>" +
			        		"<feSpecularLighting in='blur' surfaceScale='5' specularConstant='1' specularExponent='15' lighting-color='white' result='specOut'>" +
			        			"<fePointLight x='-5000' y='-10000' z='15000'/>" +
			        		"</feSpecularLighting>" +
			        		"<feComposite in='specOut' in2='SourceAlpha' operator='in' result='specOut'/>" +
			        		"<feComposite in='SourceGraphic' in2='specOut' operator='arithmetic' k1='0' k2='1' k3='1' k4='0' result='litPaint'/>" +
			        		"<feMerge>" +
			        			"<feMergeNode in='offsetBlur'/>" +
			        			"<feMergeNode in='litPaint'/>" +
			        			"</feMerge>" +
	        			"</filter>" +
        			"</svg>",
		priority : 1,
		link :{ 
			pre: function ($scope, iElement, iAttrs, controller){
				//initialize locals
				$scope.isCollapsed = true;
				$scope.isChartsCollapsed = true;
				$scope.chartType = {};
				$scope.chartTypeToggle= {bar:false,line:false,scatter:false,area:false,pie:false,circlepacking:false};
				$scope.$axisProvider = $axisProvider;
				$scope.$injector = $injector;
				//Read element attributes
				readAttributes($scope,iAttrs);
			    //create the root SVG element in which the chart is plotted
			    var svg =d3.select(iElement[0])
			            .append("svg")
			            .attr("width", $scope.width)
			            .attr("height", $scope.height)
			            .attr("overflow","visible");
			    $scope.svg = svg;
			    sniffClassAttr($scope);
			    //Render axis
			    drawAxis($scope);
			    //Process all requested charts
			    var charts = $scope.chartType.split(",");
			    //Render bar chart
			    if(charts.indexOf("bar")>=0){
			    	$scope.chartTypeToggle.bar = true;
			    	drawBarChart($scope);
			    }
			    //Render line chart
			    if(charts.indexOf("line")>=0){
			    	$scope.chartTypeToggle.line = true;
			    	drawLineChart($scope);
			    }
			  //Render line chart
			    if(charts.indexOf("scatter")>=0){
			    	$scope.chartTypeToggle.scatter = true;
			    	drawScatterChart($scope);
			    }
			    //Render data label
			    if($scope.dataLabels){
			    	drawDataLabels($scope);
			    }
			    
			    //chart type toggle
			    handleChartTypeToggle($scope);
			},
			post : angular.noop
		}
	};
}

function readAttributes($scope,iAttrs){
	$scope.height=iAttrs.chartHeight;
	$scope.width=iAttrs.chartWidth;
	$scope.padding=iAttrs.chartPadding;
	$scope.chartDataHolder=iAttrs.chartData;
	$scope.chartType = iAttrs.chartType;
	$scope.chartEffect = iAttrs.chartEffect;
	$scope.chartClass = iAttrs.chartClass;
	$scope.chartAnimate = ("true"===iAttrs.chartAnimate);
	$scope.dataLabels = ("true"===iAttrs.chartDataLabels);
	$scope.chartX = iAttrs.chartX;
	$scope.chartY = iAttrs.chartY;
	$scope.labelSeries = iAttrs.chartLabels;
	$scope.chartXTitle = iAttrs.chartXtitle;
	$scope.chartYTitle = iAttrs.chartYtitle;
	$scope.chartTitle = iAttrs.chartTitle;
}
//Responsible for rendering axis and axis titles
function drawAxis($scope){
	var svg = $scope.svg;
	var chartData = getDataFromScope($scope);
	$axisProvider = $scope.$axisProvider;
	$axisProvider.setAxisContainer(svg);
    $axisProvider.xTitle=$scope.chartXTitle;
    $axisProvider.yTitle=$scope.chartYTitle;
    $axisProvider.title=$scope.chartTitle;
    $axisProvider.setXScale($axisProvider.makeLinearScale([0,$scope.width],[0,d3.max(chartData, function(d) { return d[$scope.chartX]; })]));
    $axisProvider.setYScale($axisProvider.makeLinearScale([$scope.height,0],[0,d3.max(chartData, function(d) { return d[$scope.chartY]; })]));
    $axisProvider.draw();
    
    $scope.$watch('$axisProvider.drawGrid',function(newValue,oldValue){
    	if(oldValue!=newValue){
    		$axisProvider.draw();
    	}
    	});
    $scope.$watch('$axisProvider.drawXGrid',function(newValue,oldValue){
    	if(oldValue!=newValue){
    		$axisProvider.draw();
    	}
    	});
    $scope.$watch('$axisProvider.drawYGrid',function(newValue,oldValue){
    	if(oldValue!=newValue){
    		$axisProvider.draw();
		}
    });
    $scope.$watch('$axisProvider.xTitle',function(newValue,oldValue){
    	if(oldValue!=newValue){
    		$axisProvider.draw();
    	}
    	});
    $scope.$watch('$axisProvider.title',function(newValue,oldValue){
    	if(oldValue!=newValue){
    		$axisProvider.draw();
    	}
    	});
    $scope.$watch('$axisProvider.yTitle',function(newValue,oldValue){
    	if(oldValue!=newValue){
    		$axisProvider.draw();
    	}
    	});
    $scope.$watch('$axisProvider.ticks',function(newValue,oldValue){
    	if(oldValue!=newValue){
	    	$axisProvider.setXScale($axisProvider.xScale);
	    	$axisProvider.setYScale($axisProvider.yScale);
	    	$axisProvider.draw();
    	}
    	});
    $scope.$watch('$axisProvider.gridTicks',function(newValue,oldValue){
    	if(oldValue!=newValue){
	    	$axisProvider.setXScale($axisProvider.xScale);
	    	$axisProvider.setYScale($axisProvider.yScale);
	    	$axisProvider.draw();
    	}
    	});
    $scope.$watch('chartTilt',function(newValue,oldValue){
    	if(isDefined(newValue) && oldValue!=newValue){
    		svg.classed("tiltLeft",false);
    		svg.classed("tiltRight",false);
    		svg.classed(newValue,true);
    	}
    });
} 
//Responsible for rendering bar chart
function drawBarChart($scope){
	if(!$scope.chartTypeToggle.bar){
		return;
	}
	var svg = $scope.svg;
	var $barChartProvider = $scope.$injector.get("$barChartProvider");
	$scope.$barChartProvider = $barChartProvider;
	$barChartProvider.axisProvider = $scope.$axisProvider;
	$barChartProvider.svg = svg;
	$barChartProvider.effect = $scope.chartEffect;
	$barChartProvider.dataX = $scope.chartX;
	$barChartProvider.dataY = $scope.chartY;
	$barChartProvider.animate = $scope.chartAnimate;
    
	$barChartProvider.data =  getDataFromScope($scope);
	
	$barChartProvider.draw();
	
	$scope.$watch('chartAnimate',function(newValue,oldValue){
		$barChartProvider.animate = newValue;
		//redraw only when animate was turned on from off.
		if(!oldValue && newValue && $scope.chartTypeToggle.bar){
			$barChartProvider.draw();
		}
	});
	$scope.$watch('chartEffect',function(newValue,oldValue){
		$barChartProvider.effect = newValue;
		if(oldValue!=newValue && $scope.chartTypeToggle.bar){
			$barChartProvider.draw();
		}
	});
	
}
//Responsible for rendering Line chart
function drawLineChart($scope){
	if(!$scope.chartTypeToggle.line){
		return;
	}
	var svg = $scope.svg;
	var $axisProvider = $scope.$axisProvider;
	var $lineChartProvider = $scope.$injector.get("$lineChartProvider");
	$scope.$lineChartProvider = $lineChartProvider;
	$lineChartProvider.axisProvider = $axisProvider;
	$lineChartProvider.svg = svg;
	$lineChartProvider.data = getDataFromScope($scope);
	$lineChartProvider.effect = $scope.chartEffect;
	$lineChartProvider.dataX = $scope.chartX;
	$lineChartProvider.dataY = $scope.chartY;
	$lineChartProvider.animate = $scope.chartAnimate;
    
	$lineChartProvider.draw();
	
	$scope.$watch('chartAnimate',function(newValue,oldValue){
		$lineChartProvider.animate = newValue;
		//redraw only when animate was turned on from off.
		if(!oldValue && newValue && $scope.chartTypeToggle.line){
			$lineChartProvider.draw();
		}
	});
	$scope.$watch('chartEffect',function(newValue,oldValue){
		$lineChartProvider.effect = newValue;
		if(oldValue!=newValue && $scope.chartTypeToggle.line){
			$lineChartProvider.draw();
		}
	});	
}

//Responsible for rendering Line chart
function drawScatterChart($scope){
	if(!$scope.chartTypeToggle.scatter){
		return;
	}
	var svg = $scope.svg;
	var $axisProvider = $scope.$axisProvider;
	var $scatterChartProvider = $scope.$injector.get("$scatterChartProvider");
	$scope.$scatterChartProvider = $scatterChartProvider;
	$scatterChartProvider.axisProvider = $axisProvider;
	$scatterChartProvider.svg = svg;
	$scatterChartProvider.data = getDataFromScope($scope);
	$scatterChartProvider.effect = $scope.chartEffect;
	$scatterChartProvider.dataX = $scope.chartX;
	$scatterChartProvider.dataY = $scope.chartY;
	$scatterChartProvider.animate = $scope.chartAnimate;
    
	$scatterChartProvider.draw();
	
	$scope.$watch('chartAnimate',function(newValue,oldValue){
		$scatterChartProvider.animate = newValue;
		//redraw only when animate was turned on from off.
		if(!oldValue && newValue && $scope.chartTypeToggle.scatter){
			$scatterChartProvider.draw();
		}
	});
	$scope.$watch('chartEffect',function(newValue,oldValue){
		$scatterChartProvider.effect = newValue;
		if(oldValue!=newValue && $scope.chartTypeToggle.scatter){
			$scatterChartProvider.draw();
		}
	});	
}
//Responsible for rendering Pie chart
function drawPieChart($scope){
	if(!$scope.chartTypeToggle.pie){
		return;
	}
	var svg = $scope.svg;
	var $pieChartProvider = $scope.$injector.get("$pieChartProvider");
	$scope.$pieChartProvider = $pieChartProvider;
	$pieChartProvider.axisProvider = $axisProvider;
	$axisProvider.clear();
	$scope.dataLabels = false;
	$pieChartProvider.svg = svg;
	$pieChartProvider.data = getDataFromScope($scope);
	$pieChartProvider.effect = $scope.chartEffect;
	$pieChartProvider.dataX = $scope.chartX;
	$pieChartProvider.dataY = $scope.chartY;
	$pieChartProvider.animate = $scope.chartAnimate;
	$pieChartProvider.xTitle=$scope.chartXTitle;
	$pieChartProvider.yTitle=$scope.chartYTitle;
	$pieChartProvider.title=$scope.chartTitle;
    
	$pieChartProvider.draw();
	
	$scope.$watch('chartAnimate',function(newValue,oldValue){
		$pieChartProvider.animate = newValue;
		//redraw only when animate was turned on from off.
		if(!oldValue && newValue && $scope.chartTypeToggle.scatter){
			$pieChartProvider.draw();
		}
	});
	$scope.$watch('chartEffect',function(newValue,oldValue){
		$pieChartProvider.effect = newValue;
		if(oldValue!=newValue && $scope.chartTypeToggle.pie){
			$pieChartProvider.draw();
		}
	});	
}
//Responsible for rendering area chart
function drawAreaChart($scope){
	if(!$scope.chartTypeToggle.area){
		return;
	}
	var svg = $scope.svg;
	var $areaChartProvider = $scope.$injector.get("$areaChartProvider");
	$scope.$areaChartProvider = $areaChartProvider;
	$areaChartProvider.axisProvider = $axisProvider;
	$areaChartProvider.svg = svg;
	$areaChartProvider.data = getDataFromScope($scope);
	$areaChartProvider.effect = $scope.chartEffect;
	$areaChartProvider.dataX = $scope.chartX;
	$areaChartProvider.dataY = $scope.chartY;
	$areaChartProvider.animate = $scope.chartAnimate;
    
	$areaChartProvider.draw();
	
	$scope.$watch('chartAnimate',function(newValue,oldValue){
		$areaChartProvider.animate = newValue;
		//redraw only when animate was turned on from off.
		if(!oldValue && newValue && $scope.chartTypeToggle.scatter){
			$areaChartProvider.draw();
		}
	});
	$scope.$watch('chartEffect',function(newValue,oldValue){
		$areaChartProvider.effect = newValue;
		if(oldValue!=newValue && $scope.chartTypeToggle.area){
			$areaChartProvider.draw();
		}
	});	
}
//Responsible for rendering Circle packing chart
function drawCirclePackingChart($scope){
	if(!$scope.chartTypeToggle.circlepacking){
		return;
	}
	var svg = $scope.svg;
	var $circlePackingChartProvider = $scope.$injector.get("$circlePackingChartProvider");
	$scope.$circlePackingChartProvider = $circlePackingChartProvider;
	$circlePackingChartProvider.axisProvider = $axisProvider;
	$axisProvider.clear();
	$scope.dataLabels = false;
	$circlePackingChartProvider.svg = svg;
	$circlePackingChartProvider.data = {x:"root",children:getDataFromScope($scope)};
	$circlePackingChartProvider.effect = $scope.chartEffect;
	$circlePackingChartProvider.dataX = $scope.chartX;
	$circlePackingChartProvider.dataY = $scope.chartY;
	$circlePackingChartProvider.animate = $scope.chartAnimate;
    
	$circlePackingChartProvider.draw();
	
	$scope.$watch('chartAnimate',function(newValue,oldValue){
		$circlePackingChartProvider.animate = newValue;
		//redraw only when animate was turned on from off.
		if(!oldValue && newValue && $scope.chartTypeToggle.circlepacking){
			$circlePackingChartProvider.draw();
		}
	});
	$scope.$watch('chartEffect',function(newValue,oldValue){
		$circlePackingChartProvider.effect = newValue;
		if(oldValue!=newValue && $scope.chartTypeToggle.circlepacking){
			$circlePackingChartProvider.draw();
		}
	});	
}
//Responsible for rendering data labels
function drawDataLabels($scope){
	var svg = $scope.svg;
	var chartData = getDataFromScope($scope);
	var $axisProvider = $scope.$axisProvider;
	var $dataLabelProvider = $scope.$injector.get("$dataLabelProvider");
	$dataLabelProvider.data = chartData;
    $dataLabelProvider.svg = svg;
    $dataLabelProvider.xScale = $axisProvider.xScale;
    $dataLabelProvider.yScale = $axisProvider.yScale;
    $dataLabelProvider.width = $axisProvider.width;
    $dataLabelProvider.dataX = $scope.chartX;
    $dataLabelProvider.dataY = $scope.chartY;
    $dataLabelProvider.animate = $scope.chartAnimate;
    $dataLabelProvider.labelSeries = $scope.labelSeries;
    $dataLabelProvider.draw();
    $scope.$watch('dataLabels',function(newValue,oldValue){
		if(newValue!=oldValue){
			$dataLabelProvider.animate = $scope.chartAnimate;
			if(newValue){
				$dataLabelProvider.draw();
			}else{
				$dataLabelProvider.clear();
			}
		}
	});
    $scope.$watch('chartAnimate',function(newValue,oldValue){
    	$dataLabelProvider.animate = newValue;
		//redraw only when animate was turned on from off.
		if($scope.dataLabels && !oldValue && newValue){
			$dataLabelProvider.draw();
		}
	});
}

function sniffClassAttr($scope){
	if(isDefined($scope.chartClass)){
    	$scope.svg.classed($scope.chartClass,true);
    }
	//this will set the correct value in chart tilt config drop down.
	if($scope.svg.classed("tiltLeft")){
		$scope.chartTilt="tiltLeft";
	}else if($scope.svg.classed("tiltRight")){
		$scope.chartTilt="tiltRight";
	}else{
		$scope.chartTilt="";
	}
}

function handleChartTypeToggle($scope){
	$scope.$watch('chartTypeToggle.bar',function(newValue,oldValue){
		if(oldValue!=newValue){
			if(!newValue){
				if (isDefined($scope.$barChartProvider)){
					$scope.$barChartProvider.clear();
				}
			}else {
				if(isDefined($scope.$barChartProvider)){
					$scope.$barChartProvider.draw();
				}else{
					drawBarChart($scope);
				}
			}
		}
		});
	$scope.$watch('chartTypeToggle.line',function(newValue,oldValue){
		if(oldValue!=newValue){
			if(!newValue){
				if (isDefined($scope.$lineChartProvider)){
					$scope.$lineChartProvider.clear();
				}
			}else {
				if(isDefined($scope.$lineChartProvider)){
					$scope.$lineChartProvider.draw();
				}else{
					drawLineChart($scope);
				}
			}
		}
		});
	$scope.$watch('chartTypeToggle.scatter',function(newValue,oldValue){
		if(oldValue!=newValue){
			if(!newValue){
				if (isDefined($scope.$scatterChartProvider)){
					$scope.$scatterChartProvider.clear();
				}
			}else {
				if(isDefined($scope.$scatterChartProvider)){
					$scope.$scatterChartProvider.draw();
				}else{
					drawScatterChart($scope);
				}
			}
		}
		});
	$scope.$watch('chartTypeToggle.pie',function(newValue,oldValue){
		if(oldValue!=newValue){
			if(!newValue){
				if (isDefined($scope.$pieChartProvider)){
					$scope.$pieChartProvider.clear();
					$scope.$axisProvider.draw();
				}
			}else {
				if(isDefined($scope.$pieChartProvider)){
					$scope.$pieChartProvider.draw();
					$scope.$axisProvider.clear();
					$scope.dataLabels = false;
				}else{
					drawPieChart($scope);
				}
			}
		}
		});
	$scope.$watch('chartTypeToggle.area',function(newValue,oldValue){
		if(oldValue!=newValue){
			if(!newValue){
				if (isDefined($scope.$areaChartProvider)){
					$scope.$areaChartProvider.clear();
				}
			}else {
				if(isDefined($scope.$areaChartProvider)){
					$scope.$areaChartProvider.draw();
				}else{
					drawAreaChart($scope);
				}
			}
		}
		});
	$scope.$watch('chartTypeToggle.circlepacking',function(newValue,oldValue){
		if(oldValue!=newValue){
			if(!newValue){
				if (isDefined($scope.$circlePackingChartProvider)){
					$scope.$circlePackingChartProvider.clear();
					$scope.$axisProvider.draw();
				}
			}else {
				if(isDefined($scope.$circlePackingChartProvider)){
					$scope.$axisProvider.clear();
					$scope.dataLabels = false;
					$scope.$circlePackingChartProvider.draw();
				}else{
					drawCirclePackingChart($scope);
				}
			}
		}
		});
}

function getDataFromScope($scope){
	return $scope[$scope.chartDataHolder];
}

angular.module("foresee").directive("chart",["$axisProvider","$injector",chartDirective]);