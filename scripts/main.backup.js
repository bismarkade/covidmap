
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
            countriesLayer
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
        }
    })


    var highlight;
    var displayFeatureInfo = function (pixel) {

        var feature = map.forEachFeatureAtPixel(pixel, function(feature){
            return feature;
        })


        if (feature !== highlight){
            if (highlight){
                featureOverlay.getSource().removeFeature(highlight);
            }
            if (feature) {
                featureOverlay.getSource().addFeature(feature);
                var info = document.getElementById('info');
                if (feature){
                    info.innerHTML = "<b>Country: </b><br>" + feature.getId() + ': ' + feature.get('name');
                   
                } else {
                    info.innerHTML = 'Click on a country';
                }

            }
            highlight = feature; 
        }

    }
    //while moving the mouse update the info div
    map.on('pointermove', function(evt){
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
    chartCloseBtn.addEventListener("click", function(){
        ctxDom.style.display="none";
        buttonBar.style.display="none";
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
    map.on('click', function(evt){
        document.getElementById("yScale").innerHTML ="Logarithmic";
        ctxDom.style.display="block";
        buttonBar.style.display="block";
            //The two geojson use different country names. E.g. "united states of america" and "us"
            //The if condition replaces some of the more important ones hard coded
            console.log(highlight.values_.name);
            if (highlight.values_.name === "United States of America"){
                fetchData("US", myChart);
            }
            if (highlight.values_.name === "Czech Republic"){
                fetchData("Czechia", myChart);
            }
            if (highlight.values_.name === "Republic of Serbia"){
                fetchData("Serbia", myChart);
            }
            if (highlight.values_.name === "Myanmar"){
                fetchData("Burma", myChart);
            }
            if (highlight.values_.name === "French Guiana"){
                alert("no data");
            }
            if (highlight.values_.name === "Greenland"){
                alert("no data");
            }
            if (highlight.values_.name === "Democratic Republic of the Congo"){
                alert("no data for the whole country (only for the capital Brazzaville")
                fetchData("Congo (Brazzaville)", myChart);
            }
            else {
                fetchData(highlight.values_.name, myChart);
            }




    })
    //button for x-axis modes
    var yScaleType = document.getElementById("yScale");
    yScaleType.addEventListener("click", function(){
       updateYAxis(myChart);
    });

    //function to change the y Axis from linear mode to logarithmic
    function updateYAxis(chart){
        console.log("changing y scale1");

        if (chart.options.scales.yAxes[0].type === 'linear'){
            yScaleType.innerHTML = 'linear';
            chart.options.scales.yAxes[0] = {
                type: 'logarithmic',
                position: 'right'
            }
            chart.update();
        }else if (chart.options.scales.yAxes[0].type === 'logarithmic'){
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

                    if (confirmed === 0){
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


                chart.data= {
                labels: resultsDate, 
                datasets: [
    
                    {
                        label: "active cases",
                        data:  resultsActive, //testDate //[resultsActive]
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


        })


}
//get the data for the sum of all cases
function fetchTotalData(){
    var resultsDate = [];   
    var resultsConfirmed = 0;
    var resultsRecovered = 0;
    var resultsDead = 0;
    var resultsActive = 0;

    var resultsConfirmedBefore = 0;
    var resultsConfirmedIncrease =0;
    var resultsRecoveredBefore = 0;
    var resultsRecoveredIncrease =0;
    var resultsDeadBefore = 0;
    var resultsDeadIncrease =0;
    var resultsActiveBefore = 0;
    var resultsActiveIncrease =0;
    
    


    fetch("https://pomber.github.io/covid19/timeseries.json") //request data asynchronously
        .then(response => response.json())
        .then(function(data){
            var countryValues = Object.values(data);
            var countries = Object.values(data).length;
            var days = Object.values(data)[0].length - 1;
            console.log("amount of countries: " + countries);
            console.log("amount of days: " + days);
            console.log(countryValues[68][days].deaths);  // [country][days]

            var c; 
            for (c =0; c < countries; c++){
                resultsConfirmed = resultsConfirmed + countryValues[c][days].confirmed;
                resultsRecovered = resultsRecovered + countryValues[c][days].recovered;
                resultsDead = resultsDead + countryValues[c][days].deaths;
                resultsActive = resultsConfirmed - resultsRecovered - resultsDead;
                
                resultsConfirmedBefore = resultsConfirmedBefore + countryValues[c][days-1].confirmed;
                resultsRecoveredBefore = resultsRecoveredBefore + countryValues[c][days-1].recovered;
                resultsDeadBefore = resultsDeadBefore + countryValues[c][days-1].deaths;
                
                
            }
            resultsConfirmedIncrease = resultsConfirmed - resultsConfirmedBefore; 
            resultsRecoveredIncrease = resultsRecovered - resultsRecoveredBefore; 
            resultsDeadIncrease = resultsDead - resultsDeadBefore; 
            resultsActiveIncrease = resultsConfirmedIncrease - resultsRecoveredIncrease - resultsDeadIncrease;

            console.log(resultsConfirmedIncrease);
            document.getElementById("totalStats").innerHTML=("<table><th>Global </th><th>Cases</th></th><th>Increase</th>"
            + "<tr><td>Confirmed: </td><td>" + resultsConfirmed + "</td><td class='globalPlus'>  &#8593; &nbsp;" + resultsConfirmedIncrease + "</td></tr>" 
            + "<tr><td>Active:    </td><td>" + resultsActive    + "</td><td class='globalPlus'>  &#8593; &nbsp;" +resultsActiveIncrease + "</td></tr>" 
            + "<tr><td>Recovered: </td><td>" + resultsRecovered + "</td><td class='globalPlus'>  &#8593; &nbsp;" +resultsRecoveredIncrease + "</td></tr>" 
            + "<tr><td>Dead:      </td><td>" + resultsDead      + "</td><td class='globalPlus'>  &#8593; &nbsp;" +resultsDeadIncrease      + "</td></tr></table> "
            );
        })

}

//function for the total chart, hopefully not too slow (not implemented yet)
function fetchTotalChart (chart) {
    console.log("fetching total chart");
    var resultsDate = [];   
    var resultsActiveTotal = 0;
    var resultsConfirmedTotal = 0;
    var resultsRecoveredTotal = 0;
    var resultsDeadTotal = 0;


    fetch("https://pomber.github.io/covid19/timeseries.json") //request data asynchronously
        .then(response => response.json())
        .then(function(data){
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
            for (d=0; d< days.length; d++){
               // let deadTotal =
               // console.log(countries);
                for (c=0; c < countries.length; c++){

                }

            }

        })

}

