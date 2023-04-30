// Define a function to build the charts for a given sample ID
function buildBar(sample) {

    // retrieve the JSON data from "samples.json" using the D3 library
    d3.json("samples.json").then((data) => {

        // Extract the "samples" array from the data
        let samples = data.samples;

        // Filter the samples array => return the sample object with ID matching selected sample ID
        let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0];

        // Extract the OTU IDs, labels, sample values, and individual ID from the sample object
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        let individual_id = result.id;
        
        // Create the bar chart trace data array
        let barData = [{
            y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID} `).reverse(),
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
            marker: {color: sample_values.slice(0, 10).reverse()}
        }];

        // Create the bar chart layout object
        let barLayout = {
            title: {
                text: "<b>Top 10 Bacteria Cultures Found in Individual " + `${individual_id}<b>`,
                font: {
                    size: 20
                },
            },
            width: 600,
            height: 450,
            margin: { t: 100, l: 100 }
        };
        
        // Use Plotly to create the bar chart
        Plotly.newPlot("bar", barData, barLayout);
    });
};

// Define a function to build the charts for a given sample ID
function buildBubble(sample) {

    // retrieve the JSON data from "samples.json" using the D3 library
    d3.json("samples.json").then((data) => {

        // Extract the "samples" array from the data
        let samples = data.samples;

        // Filter the samples array => return the sample object with ID matching selected sample ID
        let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0];

        // Extract the OTU IDs, labels, sample values, and individual ID from the sample object
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        let individual_id = result.id;
        
        // Create the bubble chart trace data array
        let bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    opacity: 0.8
                },
            type: 'scatter'
        }];

        // Create the bubble chart layout object
        let bubbleLayout = {
            title: {
                text: "<b>Amount of Each Bacteria Culture Found in Individual " + `${individual_id}<b>`,
                font: {
                    size: 20
                }
            },
            xaxis: {
                title: '<b>OTU ID<b>',
            },
            margin: { t: 60, l: 100 }
        };
        
        // Use Plotly to create the bubble chart
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
};

function buildGauge(sample) {
    
    // retrieve the JSON data from "samples.json" using the D3 library
    d3.json("samples.json").then((data) => {

        // Extract the "samples" array from the data
        let metadata = data.metadata;

        // Filter the samples array => return the sample object with ID matching selected sample ID
        let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0];

        // Extract the wash frequency, and individual ID from the sample object
        let wash_frequency = result.wfreq;
        let individual_id = result.id;

        // Create the gauge chart trace data array
        let gaugeData = [{
            type: "indicator",
            value: wash_frequency,
            mode: "gauge+number",
            title: { 
                text: `<b>Individual ${individual_id} Belly Button Washing Frequency</b><br>Scrubs per Week`,
                font: {size: 20}
            }, 
            gauge: {
                axis: { range: [0, 9] },
                bar: { color: "rgba(103, 0, 13, 1)" },
                steps: [
                    { range: [0, 1], color: "rgba(217, 217, 217, 0.7)" },
                    { range: [1, 2], color: "rgba(254, 229, 217, 0.7)" },
                    { range: [2, 3], color: "rgba(252, 187, 161, 0.7)" },
                    { range: [3, 4], color: "rgba(252, 146, 114, 0.7)" },
                    { range: [4, 5], color: "rgba(251, 106, 74, 0.7)" },
                    { range: [5, 6], color: "rgba(239, 59, 44, 0.7)" },
                    { range: [6, 7], color: "rgba(203, 24, 29, 0.7)" },
                    { range: [7, 8], color: "rgba(165, 15, 21, 0.7)" },
                    { range: [8, 9], color: "rgba(103, 0, 13, 0.7)" }
                ]
            }
        }];

        var gaugeLayout = {
            width: 550,
            height: 450,
            margin: { t: 25, r: 25, l: 25, b: 25 }
        };
          
        Plotly.newPlot('gauge', gaugeData, gaugeLayout);
});
};

// Define a function to build the demographic information section based on the selected ID
function buildDemoInfo(sample) {

    // retrieve the JSON data from "samples.json" using the D3 library
    d3.json("samples.json").then((data) => {

        // Extract the "metadata" array from the data
        let metadata = data.metadata;

        // Filter the metadata array => return the sample object with ID matching selected sample ID
        let resultArray = metadata.filter(metaObj => metaObj.id == sample);
        let result = resultArray[0];

        let panel = d3.select("#sample-metadata");

        // Clear any existing content in the panel
        panel.html("");
    
        Object.entries(result).forEach(([key, value]) => {
            panel.append("p").text(`${key}: ${value}`);
        });
    })
};

// Define a function to initialize the dashboard
function init() {
    // Grab a reference to the dropdown select element
    let selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
    
        // Extract the list of sample names from the data
        let sampleNames = data.names;
        
        // Use a for loop to set the value attribute of each option to the corresponding sample name
        for (let i = 0; i < sampleNames.length; i++){
            selector.append("option").text(sampleNames[i]).property("value", sampleNames[i]);
        };
  
        // Use the first sample from the list to build the initial bar plots
        let firstSample = sampleNames[0];
        buildBar(firstSample);

        // Use the first sample from the list to populate the initial Demographic Info panel
        buildDemoInfo(firstSample);

        // Use the first sample from the list to build the initial bubble plots
        buildBubble(firstSample);

        // Use the first sample from the list to build the initial gauge plots
        buildGauge(firstSample);
    });
};

// Initialize the dashboard
init();

let selector = d3.select("#selDataset");

// Define a function to update the bar plot based on selected ID
function updateBar() 
{
    // Access value property from the selected ID
    let id_value = selector.property("value");

    // Retrieve the JSON data from "samples.json" using the D3 library
    d3.json("samples.json").then((data) => {

        // Extract the "samples" array from the data
        let samples = data.samples;

        // Filter the samples array => return the sample object with ID matching selected sample ID
        let resultArray = samples.filter(sampleObj => sampleObj.id == id_value);
        let result = resultArray[0];

        // Extract the OTU IDs, sample values, and individual ID from the sample object
        let otu_ids = result.otu_ids;
        let sample_values = result.sample_values;
        let individual_id = result.id;

        // Update the chart trace data
        Plotly.restyle("bar", "y", [otu_ids.slice(0, 10).map(otuID => `OTU ${otuID} `).reverse()]);
        Plotly.restyle("bar", "x", [sample_values.slice(0, 10).reverse()]);
        Plotly.restyle("bar", "marker.color", [sample_values.slice(0, 10).reverse()]);
        
        // Update the chart layout with the selected ID
        let newTitle = "<b>Top 10 Bacteria Cultures Found in Individual " + `${individual_id}<b>`;
        Plotly.relayout("bar", {title: newTitle});
    })
};

// Define a function to update the bubble plot based on selected ID
function updateBubble() {
    
    // Access value property from the selected ID
    let id_value = selector.property("value");

    // retrieve the JSON data from "samples.json" using the D3 library
    d3.json("samples.json").then((data) => {

        // Extract the "samples" array from the data
        let samples = data.samples;

        // Filter the samples array => return the sample object with ID matching selected sample ID
        let resultArray = samples.filter(sampleObj => sampleObj.id == id_value);
        let result = resultArray[0];

        // Extract the OTU IDs, labels, sample values, and individual ID from the sample object
        let otu_ids = result.otu_ids;
        let sample_values = result.sample_values;
        let otu_labels = result.otu_labels;
        let individual_id = result.id;
    
        // Update the chart trace data
        Plotly.restyle("bubble", "x", [otu_ids]);
        Plotly.restyle("bubble", "y", [sample_values]);
        Plotly.restyle("bubble", "text", [otu_labels]);
        Plotly.restyle("bubble", "marker.size", [sample_values]);
        Plotly.restyle("bubble", "marker.color", [otu_ids]);
        Plotly.restyle("bubble", "marker.opacity", 0.8);
        
        // Update the chart layout with the selected ID
        let newTitle = "<b>Amount of Each Bacteria Culture Found in Individual " + `${individual_id}<b>`;
        Plotly.relayout("bubble", {title: newTitle});
        
    });
};

// Define a function to update the gauge plot based on selected ID
function updateGauge() {
    
    // Access value property from the selected ID
    let id_value = selector.property("value");

    // retrieve the JSON data from "samples.json" using the D3 library
    d3.json("samples.json").then((data) => {

        // Extract the "samples" array from the data
        let metadata = data.metadata;

        // Filter the samples array => return the sample object with ID matching selected sample ID
        let resultArray = metadata.filter(sampleObj => sampleObj.id == id_value);
        let result = resultArray[0];

        // Extract the wash frequency, and individual ID from the sample object
        let wash_frequency = result.wfreq;
        let individual_id = result.id;

        // Update the chart trace data
        Plotly.restyle("gauge", "value", [wash_frequency]);
        Plotly.restyle("gauge", "title.text", `<b>Individual ${individual_id} Belly Button Washing Frequency</b><br>Scrubs per Week`);
});
};

// Update the demographic information section based on the selected ID
function updateDemoInfo() {

    // Access value property from the selected ID
    let id_value = selector.property("value");

    // retrieve the JSON data from "samples.json" using the D3 library
    d3.json("samples.json").then((data) => {

    // Extract the "metadata" array from the data
    let metadata = data.metadata;

    // Filter the metadata array => return the sample object with ID matching selected sample ID
    let resultArray = metadata.filter(metaObj => metaObj.id == id_value);
    let result = resultArray[0];

    let panel = d3.select("#sample-metadata");

    // Clear any existing content in the panel
    panel.html("");
    
    Object.entries(result).forEach(([key, value]) => {
        panel.append("p").text(`${key}: ${value}`);
      });
    })
};

// Attach the updateBar and updateDemoInfo functions to the dropdown's change event
d3.selectAll("#selDataset").on("change", function() {
    updateDemoInfo();
    updateBar();
    updateBubble();
    updateGauge()
});