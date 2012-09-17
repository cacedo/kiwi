// ----------------------------- Home Article ------------------------------------------------  


// ------------ Charts inicialitazion ------------------------------------------------         

require([                
    "dojox/charting/Chart",                
    "dojox/charting/themes/Claro",
    "dojox/charting/plot2d/Pie",                
    "dojox/charting/plot2d/Markers",
    "dojox/charting/widget/Legend",
    "dojox/charting/action2d/Tooltip",
    "dojox/charting/action2d/Magnify",
    "dojox/charting/themes/ThreeD",
    "dojox/charting/action2d/MoveSlice",
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojox/charting/axis2d/Default",
    // Wait until the DOM is ready
    "dojo/domReady!"
], function(Chart, theme, PiePlot, Markers, Legend, Tooltip, Magnify, ThreeD, MoveSlice, array, domConstruct){

    // ----------------- Mail Chart -----------------------------
    function createMailQuotaView(container, store) {
        // Create the chart within it's "holding" node
        var pieChart = new Chart(container);

        // Set the theme
        pieChart.setTheme(ThreeD);
        
        // Add the only/default plot 
        pieChart.addPlot("default", {
            type: PiePlot, // our plot2d/Pie module reference as type value
                font: "normal normal 12pt Sans",
                fontColor: "#000",
                labelWiring: "#000",
                radius: 60,
                labelStyle: "columns",
                htmlLabels: true,
                startAngle: -10,
                              
        });

        pieChart.size = { width: 180, height: 170 };

        new Tooltip(pieChart);
        new MoveSlice(pieChart);
        
        stores[store].get('mail').then(function(data){
            // Add the series of data
            pieChart.addSeries("Available space",[
            {
                y: data.used,
                stroke: "black",    
                text: "Used",
                tooltip: data.used + " MB",
            },
            {
                y: data.free,
                stroke: "black",
                text: "Available",
                tooltip: data.free + " MB",
            }            
            ]);            
            // Render the chart!
            pieChart.render();

            });        
    }
    

// ----------------- Mail Chart -----------------------------
    function createWebQuotaView(container, store) {
        // Create the chart within it's "holding" node
        var pieChart = new Chart(container);

        // Set the theme
        pieChart.setTheme(ThreeD);
        
        // Add the only/default plot 
        pieChart.addPlot("default", {
            type: PiePlot, // our plot2d/Pie module reference as type value
                font: "normal normal 12pt Sans",
                fontColor: "#000",
                labelWiring: "#000",
                radius: 60,
                labelStyle: "columns",
                htmlLabels: true,
                startAngle: 10
                              
        });
        new Tooltip(pieChart);
        new MoveSlice(pieChart);
        
        stores[store].get('web/space').then(function(data){
            // Add the series of data
            pieChart.addSeries("Available space",[
            {
                y: data.used,
                stroke: "black",    
                text: "Used",
                tooltip: data.used + " MB",
            },
            {
                y: data.free,
                stroke: "black",
                text: "Available",
                tooltip: data.free + " MB",
            }            
            ]);            
            // Render the chart!
            pieChart.render();

            });        
    }
    
    // ----------------- Web Chart -----------------------------
    function createWebTrafficView(container, store){

        var linesChart = new Chart(container);
        
        // Set the theme
        linesChart.setTheme(ThreeD);
        
        // Add the only/default plot 
        linesChart.addPlot("default", {
            type: Markers, // our plot2d/Pie module reference as type value
            markers: true,
            fontColor: "black",                    
        });

        new Tooltip(linesChart, "default");
        new Magnify(linesChart,"default");


        // Add axes
        linesChart.addAxis("x", {includeZero: false, rotation: 50,font: "normal normal normal 8pt Sans",
                 
                 labels: [                            
                    { value: 1, text: "January"},
                    { value: 2, text: "February" },
                    { value: 3, text: "March" },
                    { value: 4, text: "April" },
                    { value: 5, text: "May" },
                    { value: 6, text: "June" },
                    { value: 7, text: "July" },
                    { value: 8, text: "August" },
                    { value: 9, text: "September" },
                    { value: 10, text: "October" },
                    { value: 11, text: "November" },
                    { value: 12, text: "December" }
                ]});
        linesChart.addAxis("y", {vertical: true, fixLower: "major", fixUpper: "major", includeZero: true});


        stores[store].get('web').then(function(data,i){
            array.forEach(data, function(site,i){
                linesChart.addSeries(site.name, site.data);
            });
            // render inside then(), otherwise will render before getting data (async stuff)
            linesChart.render();
            new Legend({ chart: linesChart }, "web_legend");
        }); 
    } // /createWebTrafficView


    function createDomainView(container, store){
        stores[store].get('domains').then(function(domains){
            var empty=true;
            var ul = domConstruct.create("ul", null, container, "first");
            array.forEach(domains, function(domain){
                domConstruct.create("li", { innerHTML: domain.name }, ul);
                empty=false;
            });
            if (empty)
                domConstruct.create("div", { innerHTML: "The are no domains" }, container);
        });
    }


    function createNotificationsView(container, store){
        stores[store].get('notifications').then(function(notys){
            var empty=true;
            var ul = domConstruct.create("ul", null, container, "first");
            array.forEach(notys, function(noty){
                domConstruct.create("li", { innerHTML: noty.date + ' - ' + noty.message }, ul);
                empty=false;
            });
            if (empty)
                domConstruct.create("div", { innerHTML: "The are no notifications" }, container);
        });
    }

    
    function createTasksView(container, store){
        stores[store].get('tasks').then(function(tasks){
            var empty=true;
            var ul = domConstruct.create("ul", null, container, "first");
            array.forEach(tasks, function(task){
                domConstruct.create("li", { innerHTML:task.date + ' - ' + task.message }, ul);
                empty=false;
            });
            if (empty)
                domConstruct.create("div", { innerHTML: "The are no pending tasks" }, container);
        });
    }


    newStore("quota/","quotaStore");
    
    createMailQuotaView("mail_chart", "quotaStore");
    createWebQuotaView("web_space_chart", "quotaStore");
    createWebTrafficView("web_chart", "quotaStore");
    

        
    createNotificationsView("notification_items", "rootStore");
    createTasksView("task_items", "rootStore");
    createDomainView("domain_items", "rootStore");


});


    


