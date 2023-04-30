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
            title: "Top 10 Bacteria Cultures Found in Individual " + `${individual_id}`,
            margin: { t: 30, l: 150 }
        };
        
        // Use Plotly to create the bar chart
        Plotly.newPlot("bar", barData, barLayout);
    });
}

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
  
        // Use the first sample from the list to build the initial plots
        let firstSample = sampleNames[0];
        buildBar(firstSample);

        // Use the first sample from the list to populate the initial Demographic Info panel
        buildDemoInfo(firstSample);
    });
};

// Initialize the dashboard
init();

let selector = d3.select("#selDataset");

// Define a function to update the plot based on selected ID
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
        let newTitle = "Top 10 Bacteria Cultures Found in Individual " + `${individual_id}`;
        Plotly.relayout("bar", {title: newTitle});
    })
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
    updateBar();});

