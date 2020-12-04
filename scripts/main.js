
//arcgis online service link world boundaries https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries/FeatureServer
/* var boundariesUrl = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries/FeatureServer';
var esrijsonFormat = new ol.format.EsriJSON(); */

//https://info.gesundheitsministerium.at/data/austria_map.json  //details for austria
//https://opendata.ecdc.europa.eu/covid19/casedistribution/json/


//https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer



//Function to create the map
function createMap() {
  //Center of the first view
  var center = ol.proj.fromLonLat([13.06072, 47.78869]);

  //First view of the map
  var startingView = new ol.View({
    center: center,
    zoom: 5,
    minZoom: 3
  });

  /**
* My update **/

  //Declaring a covidSource to be used in the covidLayer which is a vector layer
  var covidSource = new ol.source.Vector();
  //Declaring covidLayer with a source and style

  var covidLayer = new ol.layer.Vector({
    source: covidSource,
    style: covidStyle
  });

  // Loading the data 
  var request = new XMLHttpRequest();
  request.open("GET", "https://corona.lmao.ninja/v2/countries", false);
  request.overrideMimeType("application/json");
  request.send(null);
  var data = JSON.parse(request.responseText);
  console.log("Data is below");
  console.log(data);

  /* In this section, the lat and long information will be Extracted from the json data to be added to the map
   as vector layer in the map afterwards*/


  var features = [];
  console.log("The features Are");
  console.log(features);



  //Looping through each data object to create features
  data.forEach(function (data) {
    // Creating a new feature with the data as the properties
    feature = new ol.Feature(data);
    console.log("Feature is Below");
    console.log(feature);
    //Adding the feature to the empty features array
    features.push(feature);
    // Convert the projection from EPSG:4326 to EPSG:3857 so that it can display in scene of the map 
    var transform = ol.proj.getTransform('EPSG:4326', 'EPSG:3857');
    // Create an appropriate geometry and adding it to the feature
    var coordinate = transform([parseFloat(data.countryInfo.long), parseFloat(data.countryInfo.lat)]);
    var geometry = new ol.geom.Point(coordinate);
    feature.setGeometry(geometry);
    // Add the feature to the source
    covidSource.addFeature(feature);

  });

  //Style for json data
  function covidStyle(feature) {
    //Styling the number of cases depending on their magnitude per country
    var f = feature.get('cases');
    console.log("Cases");
    console.log(f);

    if (f <= 5000) {
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'Red'
          })
        })
      });
      return [style];
    }
    else if (f > 5000 && f <= 20000) {
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 7,
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'red'
          })
        })
      });
      return [style];
    }
    else if (f > 20000 && f <= 100000) {
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 15,
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'red'
          })
        })
      });
      return [style];
    }

    else if (f > 100000 && f <= 500000) {
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'red'
          })
        })
      });
      return [style];
    }

    else if (f > 500000 && f <= 1000000) {
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 15,
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'red'
          })
        })
      });
      return [style];
    }

    else if (f > 1000000 && f <= 2000000) {
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 20,
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'red'
          })
        })
      });
      return [style];
    }

    else if (f > 2000000 && f <= 3000000) {
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 30,
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'red'
          })
        })
      });
      return [style];
    }

    else if (f > 3000000 && f <= 4000000) {
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 35,
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'red'
          })
        })
      });
      return [style];
    }

    else if (f > 4000000 && f <= 5000000) {
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 40,
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'red'
          })
        })
      });
      return [style];
    }


    else if (f > 5000000) {
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 50,
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'Red'
          })
        })
      });
    }
    return [style];
  }

  /*End of mine*/

  // Basemaps to use
  var olMap = new ol.layer.Tile({
    source: new ol.source.OSM(),
    title: 'OL standard',
    type: 'base'
  });

  var bingMapsAerial = new ol.layer.Tile({
    preload: Infinity,
    title: 'Aerial',
    type: 'base',
    /*         wrapDateLine: false, */
    source: new ol.source.BingMaps({
      key: 'ApTJzdkyN1DdFKkRAE6QIDtzihNaf6IWJsT-nQ_2eMoO4PN__0Tzhl2-WgJtXFSp',
      imagerySet: 'Aerial'
    })
  });

  //style for the country boundaries
  var style = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.1)'
    }),
    stroke: new ol.style.Stroke({
      color: "orange",
      width: 1
    }),
    text: new ol.style.Text({
      font: '12px Calibri,sans-serif',
      fill: new ol.style.Fill({
        color: '#000'
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 3
      })
    })
  });

  //data for the world boundaries
  var countriesLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      //Data from openlayers example
      url: 'https://openlayers.org/en/latest/examples/data/geojson/countries.geojson',
      format: new ol.format.GeoJSON()
    }),
    style: function (feature) {
      style.getText().setText(feature.get('name'));
      return style;

    }

  })

  //Austria data //https://api.apify.com/v2/key-value-stores/RJtyHLXtCepb4aYxB/records/LATEST?disableRedirect=true
  /*     var austriaLayer = new ol.layer.Vector({
          source: new ol.source.Vector({
              url: 'https://info.gesundheitsministerium.at/data/austria_map.json',
              format: new ol.format.GeoJSON()
          })
      }) */


  var map = new ol.Map({
    target: 'mapDiv',
    layers: [
      bingMapsAerial,
      countriesLayer,
      covidLayer  //  the Layer from Bismark
    ],

    view: startingView
  })

  //style for highlighting the hovered over countries
  var highlightStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#f00',
      width: 3
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255,0,0,0.1)'
    }),
    text: new ol.style.Text({
      font: '12px Calibri,sans-serif',
      fill: new ol.style.Fill({
        color: '#000'
      }),
      stroke: new ol.style.Stroke({
        color: '#f00',
        width: 1
      })
    })
  })
  //highlight through adding a new clone layer
  var featureOverlay = new ol.layer.Vector({
    source: new ol.source.Vector(),
    map: map,
    style: function (feature) {
      highlightStyle.getText().setText(feature.get('name'))
      return highlightStyle;

    },
    covidStyle
  })


  var highlight;
  var displayFeatureInfo = function (pixel) {

    var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
      return feature;
    })


    if (feature !== highlight) {
      if (highlight) {
        featureOverlay.getSource().removeFeature(highlight);
      }
      if (feature) {
        featureOverlay.getSource().addFeature(feature);
        var info = document.getElementById('info');
        if (feature) {
          info.innerHTML = "<b>Country: </b><br>" + feature.getId() + ': ' + feature.get('name');

        } else {
          info.innerHTML = 'Click on a country';
        }

      }
      highlight = feature;
    }

  }
  //while moving the mouse update the info div
  map.on('pointermove', function (evt) {
    if (evt.dragging) {
      return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel);
  })

  //the dom for the chart
  ctxDom = document.getElementById("chart")
  //dom for button bar
  buttonBar = document.getElementById("buttonBar");

  //button to close the chart
  var chartCloseBtn = document.getElementById('closeChart');
  chartCloseBtn.addEventListener("click", function () {
    ctxDom.style.display = "none";
    buttonBar.style.display = "none";
  })

  //create the chart template (empty)
  var ctx = document.getElementById('chart').getContext('2d')
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
      ]
    }
  })


  fetchTotalData();
  //if the map is clicked fetch the infos for the selected country (would be better with an hittest event)
  map.on('click', function (evt) {
    document.getElementById("yScale").innerHTML = "Logarithmic";
    ctxDom.style.display = "block";
    buttonBar.style.display = "block";
    //The two geojson use different country names. E.g. "united states of america" and "us"
    //The if condition replaces some of the more important ones hard coded
    console.log(highlight.values_.name);
    if (highlight.values_.name === "United States of America") {
      fetchData("US", myChart);
    }
    if (highlight.values_.name === "Czech Republic") {
      fetchData("Czechia", myChart);
    }
    if (highlight.values_.name === "Republic of Serbia") {
      fetchData("Serbia", myChart);
    }
    if (highlight.values_.name === "Myanmar") {
      fetchData("Burma", myChart);
    }
    if (highlight.values_.name === "French Guiana") {
      alert("no data");
    }
    if (highlight.values_.name === "Greenland") {
      alert("no data");
    }
    if (highlight.values_.name === "Democratic Republic of the Congo") {
      alert("no data for the whole country (only for the capital Brazzaville")
      fetchData("Congo (Brazzaville)", myChart);
    }
    else {
      fetchData(highlight.values_.name, myChart);
    }




  })
  //button for x-axis modes
  var yScaleType = document.getElementById("yScale");
  yScaleType.addEventListener("click", function () {
    updateYAxis(myChart);
  });

  //function to change the y Axis from linear mode to logarithmic
  function updateYAxis(chart) {
    console.log("changing y scale1");

    if (chart.options.scales.yAxes[0].type === 'linear') {
      yScaleType.innerHTML = 'linear';
      chart.options.scales.yAxes[0] = {
        type: 'logarithmic',
        position: 'right'
      }
      chart.update();
    } else if (chart.options.scales.yAxes[0].type === 'logarithmic') {
      yScaleType.innerHTML = 'logarithmic';
      chart.options.scales.yAxes[0] = {
        type: 'linear',
        position: 'right'
      }
      chart.update();
    }
  }





  /*     var totalChartBtn = document.getElementById("totalChart");
      totalChartBtn.addEventListener("click", function(){
          console.log("button works");
          fetchTotalChart(myChart);
      }) */



}


//fetch updated data from https://github.com/pomber/covid19
function fetchData(country, chart) {
  var resultsDate = [];
  var resultsActive = [];
  var resultsRecovered = [];
  var resultsDead = [];
  var resultsConfirmed = [];

  var resultsEmpty = [];
  var resultsDateSinceFirstDay = [];
  var resultsRecoveredSinceFirstDay = [];
  var resultsDeadSinceFirstDay = [];
  var resultsConfirmedSinceFirstDay = [];


  fetch("https://pomber.github.io/covid19/timeseries.json") //request data asynchronously
    .then(response => response.json())
    .then(data => {

      data[country].forEach(({ date, confirmed, recovered, deaths }) => {
        resultsDate.push(date) //Date.parse()
        resultsActive.push(confirmed - recovered - deaths)
        resultsRecovered.push(recovered)
        resultsDead.push(deaths)
        resultsConfirmed.push(confirmed)

        if (confirmed === 0) {
          resultsEmpty.push(confirmed);

        }
      })
      console.log("Days without incident: " + resultsEmpty.length);

      //sets the aspectRatio so that the chart doesn't cover the whole screen or is squeezed
      chart.aspectRatio = 3;
      const newLocal = chart.options = {
        title: {
          display: true,
          text: country
        },
        scales: {
          yAxes: [
            {
              type: 'linear',
              position: 'right'
            }
          ]
        },
        layout: {
          padding: {
            left: 0,
            right: 20,
            top: 0,
            bottom: 0
          }
        }
      };


      chart.data = {
        labels: resultsDate,
        datasets: [

          {
            label: "active cases",
            data: resultsActive, //testDate //[resultsActive]
            borderColor: "yellow",
            fill: false
          },
          {
            label: "confirmed",
            data: resultsConfirmed,
            borderColor: "grey"
          },
          {
            label: "recovered",
            data: resultsRecovered,
            borderColor: "green"
          },
          {
            label: "dead",
            data: resultsDead,
            borderColor: "red"
          }

        ]

      }

      chart.update();

      /* Ziyang Dai: echart: pie chart */
      var myChart = echarts.init(document.getElementById('main'));
      var showdata = data[country][data[country].length - 1];
      var activedata = showdata.confirmed - showdata.deaths - showdata.recovered;



      option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [{
          name: 'data',
          type: 'pie',
          radius: '50',
          center: ['50%', '50%'],
          data: [{
            value: activedata,
            name: 'active'
          },
          {
            value: showdata.deaths,
            name: 'deaths'
          },
          {
            value: showdata.recovered,
            name: 'recovered'
          }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      myChart.setOption(option);

      //bar chart
      var myChart2 = echarts.init(document.getElementById('main2'));
      var showdata2 = data[country][data[country].length - 1];
      var activedata2 = showdata2.confirmed - showdata2.deaths - showdata2.recovered;
      option2 = {
        color: ['#1A5276'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['confirmed', 'active', 'deaths', 'recovered'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'data',
            type: 'bar',
            barWidth: '60%',
            data: [
              {
                value: showdata2.confirmed,
                name: 'confirmed'
              },
              {
                value: activedata2,
                name: 'active'
              },
              {
                value: showdata2.deaths,
                name: 'deaths'
              },
              {
                value: showdata2.recovered,
                name: 'recovered'
              }
            ],
          }
        ]
      };
      myChart2.setOption(option2);

      //rate 
      var myChart3 = echarts.init(document.getElementById('main3'));
      var mColor = ["red", "green"];
      option3 = {

        grid: {
          top: "10%",
          left: "22%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          show: false
        },

        yAxis: [
          {
            type: 'category',
            data: ['Mortality rate', 'Recovery rate'],

            axisLine: {
              show: false
            },
            aixsTick: {
              show: false
            }
          }, {
            show: true,
            data: [showdata.deaths, showdata.recovered],
            axisLine: {
              show: false
            },
            aixsLabel: {
              show: false
            }
          },

        ],
        series: [
          {
            name: "country",
            type: 'bar',
            data: [Math.round((showdata.deaths / showdata.confirmed) * 10000) / 100, Math.round((showdata.recovered / showdata.confirmed) * 10000) / 100],
            yAxisIndex: 0,
            itemStyle: {
              barBorderRadius: 20,
              color: function (params) {
                return mColor[params.dataIndex];
              }
            },
            barCategoryGap: 20,
            barWidth: 10,
            label: {
              show: true,
              position: "insideLeft",
              formatter: "{c}%"
            }
          },
          {
            name: "confirmedcase",
            type: 'bar',
            data: [100, 100],
            itemStyle: {
              color: "none",
              borderColor: "black",
              borderWidth: 3,
              barBorderRadius: 15
            },
            yAxisIndex: 1,
            barCategoryGap: 50,
            barWidth: 15
          }
        ]
      };

      myChart3.setOption(option3);

    })

}

//get the data for the sum of all cases
function fetchTotalData() {
  var resultsDate = [];
  var resultsConfirmed = 0;
  var resultsRecovered = 0;
  var resultsDead = 0;
  var resultsActive = 0;

  var resultsConfirmedBefore = 0;
  var resultsConfirmedIncrease = 0;
  var resultsRecoveredBefore = 0;
  var resultsRecoveredIncrease = 0;
  var resultsDeadBefore = 0;
  var resultsDeadIncrease = 0;
  var resultsActiveBefore = 0;
  var resultsActiveIncrease = 0;




  fetch("https://pomber.github.io/covid19/timeseries.json") //request data asynchronously
    .then(response => response.json())
    .then(function (data) {
      var countryValues = Object.values(data);
      var countries = Object.values(data).length;
      var days = Object.values(data)[0].length - 1;
      console.log("amount of countries: " + countries);
      console.log("amount of days: " + days);
      console.log(countryValues[68][days].deaths);  // [country][days]

      var c;
      for (c = 0; c < countries; c++) {
        resultsConfirmed = resultsConfirmed + countryValues[c][days].confirmed;
        resultsRecovered = resultsRecovered + countryValues[c][days].recovered;
        resultsDead = resultsDead + countryValues[c][days].deaths;
        resultsActive = resultsConfirmed - resultsRecovered - resultsDead;

        resultsConfirmedBefore = resultsConfirmedBefore + countryValues[c][days - 1].confirmed;
        resultsRecoveredBefore = resultsRecoveredBefore + countryValues[c][days - 1].recovered;
        resultsDeadBefore = resultsDeadBefore + countryValues[c][days - 1].deaths;


      }
      resultsConfirmedIncrease = resultsConfirmed - resultsConfirmedBefore;
      resultsRecoveredIncrease = resultsRecovered - resultsRecoveredBefore;
      resultsDeadIncrease = resultsDead - resultsDeadBefore;
      resultsActiveIncrease = resultsConfirmedIncrease - resultsRecoveredIncrease - resultsDeadIncrease;

      console.log(resultsConfirmedIncrease);
      document.getElementById("totalStats").innerHTML = ("<table><th>Global </th><th>Cases</th></th><th>Increase</th>"
        + "<tr><td>Confirmed: </td><td>" + resultsConfirmed + "</td><td class='globalPlus'>  &#8593; &nbsp;" + resultsConfirmedIncrease + "</td></tr>"
        + "<tr><td>Active:    </td><td>" + resultsActive + "</td><td class='globalPlus'>  &#8593; &nbsp;" + resultsActiveIncrease + "</td></tr>"
        + "<tr><td>Recovered: </td><td>" + resultsRecovered + "</td><td class='globalPlus'>  &#8593; &nbsp;" + resultsRecoveredIncrease + "</td></tr>"
        + "<tr><td>Dead:      </td><td>" + resultsDead + "</td><td class='globalPlus'>  &#8593; &nbsp;" + resultsDeadIncrease + "</td></tr></table> "
      );

       /* Ziyang Dai: echart display*/
       var myChart = echarts.init(document.getElementById('main'));
       var myChart2 = echarts.init(document.getElementById('main2'));
       var myChart3 = echarts.init(document.getElementById('main3'));

       var mycon = Object.values(data);
       var sumconfirmed = 0;
       var sumdeaths = 0;
       var sumrecovered = 0;
       mycon.forEach((ele) => {
           sumconfirmed += ele[ele.length - 1].confirmed;
           sumdeaths += ele[ele.length - 1].deaths;
           sumrecovered += ele[ele.length - 1].recovered;
       })
       console.log(sumconfirmed)
       console.log(sumdeaths)
       console.log(sumrecovered)
       var activedata = sumconfirmed - sumdeaths - sumrecovered;

       option = {
           tooltip: {
               trigger: 'item',
               formatter: '{a} <br/>{b} : {c} ({d}%)'
           },
           series: [{
               name: 'data',
               type: 'pie',
               radius: '50',
               center: ['50%', '40%'],
               data: [{
                   value: activedata,
                   name: 'active'
               },
               {
                   value: sumdeaths,
                   name: 'deaths'
               },
               {
                   value: sumrecovered,
                   name: 'recovered'
               }
               ],
               emphasis: {
                   itemStyle: {
                       shadowBlur: 10,
                       shadowOffsetX: 0,
                       shadowColor: 'rgba(0, 0, 0, 0.5)'
                   }
               }
           }]
       };
       myChart.setOption(option);

       option2 = {
           color: ['#1A5276'],
           tooltip: {
               trigger: 'axis',
               axisPointer: {
                   type: 'shadow'
               }
           },
           grid: {
               left: '3%',
               right: '4%',
               bottom: '2%',
               containLabel: true
           },
           xAxis: [
               {
                   type: 'category',
                   data: ['confirmed', 'active', 'deaths', 'recovered'],
                   axisTick: {
                       alignWithLabel: true
                   }
               }
           ],
           yAxis: [
               {
                   type: 'value'
               }
           ],
           series: [
               {
                   name: 'data',
                   type: 'bar',
                   barWidth: '60%',
                   data: [
                       {
                           value: sumconfirmed,
                           name: 'confirmed'
                       },
                       {
                           value: activedata,
                           name: 'active'
                       },
                       {
                           value: sumdeaths,
                           name: 'deaths'
                       },
                       {
                           value: sumrecovered,
                           name: 'recovered'
                       }
                   ],
               }
           ]
       };
       myChart2.setOption(option2);



       var mColor = ["red", "green"];
       option3 = {

           grid: {
               top: "10%",
               left: "22%",
               bottom: "10%",
               containLabel: true
           },
           xAxis: {
               show: false
           },

           yAxis: [
               {
                   type: 'category',
                   data: ['Mortality rate', 'Recovery rate'],

                   axisLine: {
                       show: false
                   },
                   aixsTick: {
                       show: false
                   }
               }, {
                   show: true,
                   data: [resultsDead, resultsRecovered],
                   axisLine: {
                       show: false
                   },
                   aixsLabel: {
                       show: false
                   }
               },

           ],
           series: [
               {
                   name: "country",
                   type: 'bar',
                   data: [Math.round((resultsDead / resultsConfirmed) * 10000) / 100, Math.round((resultsRecovered / resultsConfirmed) * 10000) / 100],
                   yAxisIndex: 0,
                   itemStyle: {
                       barBorderRadius: 20,
                       color: function (params) {
                           return mColor[params.dataIndex];
                       }
                   },
                   barCategoryGap: 20,
                   barWidth: 10,
                   label: {
                       show: true,
                       position: "insideLeft",
                       formatter: "{c}%"
                   }
               },
               {
                   name: "confirmedcase",
                   type: 'bar',
                   data: [100, 100],
                   itemStyle: {
                       color: "none",
                       borderColor: "black",
                       borderWidth: 3,
                       barBorderRadius: 15
                   },
                   yAxisIndex: 1,
                   barCategoryGap: 50,
                   barWidth: 15
               }
           ]
       };

       myChart3.setOption(option3);
    })

}

//function for the total chart, hopefully not too slow (not implemented yet)
function fetchTotalChart(chart) {
  console.log("fetching total chart");
  var resultsDate = [];
  var resultsActiveTotal = 0;
  var resultsConfirmedTotal = 0;
  var resultsRecoveredTotal = 0;
  var resultsDeadTotal = 0;


  fetch("https://pomber.github.io/covid19/timeseries.json") //request data asynchronously
    .then(response => response.json())
    .then(function (data) {
      var countries = Object.values(data);
      var days = Object.values(data)[0]; //[0]
      // console.log(countryValues[68][days].deaths);  // [country][days]
      console.log(countries);
      console.log(days.length);

      /*             var c;
                  var d; 
                  for (c =0; c < countries.length; c++){  // c for country
                      let country = countries[c];
                      for (d = 0; d < days.length - 1; d++){ // d for day
      
                          console.log(country[0].confirmed);
                          totalConfirmedDay = totalConfirmedDay + country[d].confirmed;
      
      
      
                      }
                  } */
      var d;
      var c;
      for (d = 0; d < days.length; d++) {
        // let deadTotal =
        // console.log(countries);
        for (c = 0; c < countries.length; c++) {

        }

      }

    })

}

