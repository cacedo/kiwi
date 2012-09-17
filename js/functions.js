// ------------ Global Stores Declararions ----------------
var stores = {};

/* ----------------------- CONTROL PANEL INITIALIZATION  ----------------------------- */


// ------- Change menu indicator -------------------------------------------------------------
require(["dojo/fx", "dojo/on", "dojo/dom", "dojo", "dojo/domReady!"], function(fx, on, dom){  

    // Slide indicator to position pos and select tab
    function setCurrentIndicator(indicatorNode, pos, slide, fxAnim){
        indicatorNode = dom.byId(indicatorNode);                
        fx.slideTo({ node: indicatorNode, left: pos, top: dojo.position(indicatorNode,true).y }).play();            

        dijit.byId('center_panel').selectChild(slide);
    }

    function getMenuItemPos(node){
        node = dom.byId(node);
        return dojo.position(node,true).x+50;
    }

    // Initial menu indicator poitns to Home item
    var ci = dom.byId("current_indicatorb");            
    ci.style.left = getMenuItemPos("nav_home") + "px";

    // Register onClick event to all .nav_item nodes
    var myObject = {
        id: "myObject",
        onClick: function(evt){
            var ci = dom.byId("current_indicatorb");
            setCurrentIndicator(ci,getMenuItemPos(this.id), this.id.slice(4), true);
        }
    };
    var div = dom.byId("nav_list");
    on(div, ".nav_item:click", myObject.onClick);

    window.onresize = function() {
        var slide = dijit.byId('center_panel').selectedChildWidget.id;
        var ci = dom.byId("current_indicatorb");
        ci.style.left = getMenuItemPos("nav_"+slide) + "px";
    }

});






// ------------ User Profile-----------------------------------------------------------------------------

require(["dijit/Tooltip"], function(tooltip) {
     new dijit.Tooltip({
       connectId: ["profile"],
       label: "Edit your profile",
       position: ["below"],
       showDelay:0
   });

});

// Show profile when clicking on the name
require(["dojo/ready", "dijit/Dialog"], function(ready, Dialog){
    var profileDiv = dojo.byId("profile");
    dojo.connect(profileDiv, "onclick", function(evt){
        dijit.byId("profile_dialog").show();  
    });

});

require([
    "dojo/ready", "dojo/store/Memory", "dijit/form/ComboBox"
], function(ready, Memory, ComboBox){
    var countryStore = new Memory({
        data: [
        {name:"Afghanistan", id:"AF"},
        {name:"Albania", id:"AL"},
        {name:"Algeria", id:"DZ"},
        {name:"American Samoa", id:"AS"},
        {name:"Andorra", id:"AD"},
        {name:"Angola", id:"AG"},
        {name:"Anguilla", id:"AI"},
        {name:"Antigua &amp; Barbuda", id:"AG"},
        {name:"Argentina", id:"AR"},
        {name:"Armenia", id:"AA"},
        {name:"Aruba", id:"AW"},
        {name:"Australia", id:"AU"},
        {name:"Austria", id:"AT"},
        {name:"Spain", id:"ES"},
        ]
    });

    ready(function(){
        var comboBox = new ComboBox({
            id: "country",
            name: "country",
            value: "Spain",
            store: countryStore,
            searchAttr: "name"
        }, "country");
    });
});


// ---------------- Store functions ----------------------------------------------


// Create a new store: json url, div container id, store name
function newStore(url, store){
    require(["dojo/store/JsonRest","dojo/dom","dojo/store/Observable",
        "dojo/store/Memory", "dojo/store/Cache", "dojo/dom-construct", "dojo/on",
        "dojo/domReady!"
    ],
    function(JsonRest, dom, Observable, Memory, Cache, domConstruct, on, fx){
        var memoryStore = new Memory({ idProperty: "id" });
        jsonStore = new JsonRest({
            idProperty: "id",
            target: "api/"+url,            
            queryEngine: memoryStore.queryEngine
        });
        jsonStore = Observable(jsonStore);
        stores[store] = new Cache(jsonStore, memoryStore);
    });

}


// For main (root) objects like, vacation, profile...
newStore("", "rootStore");


// -------------------------- Get user profile and create View -------------------------------------
require(["dojo/_base/array", "dojo/html", "dojo/domReady!"], function(array, html){
    stores['rootStore'].get('profile').then(function(profile){
        for (var i in profile) {
            // console.log(i + ': ' + profile[i]);
            var res = dijit.byId(i);
            if (res!=null) res.set('value', profile[i]);
            if (i == 'firstName') html.set(dojo.byId('profile'), profile[i]);
            if (i == 'lastAccess') html.set(dojo.byId('last_access'), profile[i]);
        }
    });    
})






// -------------------------- Loading screeen ----------------------------------------------
require(["dojo/_base/fx", "dojo/dom-style", "dojo/domReady!"], function(fx, style){
    var loader = dojo.byId('loader');
    fx.fadeOut({
      node: loader,
      
      onEnd: function() {
        style.set(loader, "display", "none");
        
      }
    }).play(300);
});




// ------------------------- FX helpers------------------------------------------------------

 
function blink(node, count){
    require(["dojo/fx"], function(fx){
        var effects = new Array();
         
        var hide = dojo.fadeOut({node: node});
        var show = dojo.fadeIn({node: node});
         
        for(var i = 0; i < count; i++){
            effects.push(hide);
            effects.push(show);
        }
         
        fx.chain(effects).play()
    });
}



// ------------ Translations--------------------------------------------------------------------------   

require(["dojo/i18n!nls/resources", "dojo/query"], function(resources, query) {
  // myDiv = dojo.byId("_notifications_");
  // myDiv.innerText = resources.notifications;
  query(".__notifications__").forEach(function(node, index, arr){  node.innerText = resources.notifications;  });
  query(".__pending_tasks__").forEach(function(node, index, arr){  node.innerText = resources.pending_tasks;  });
  query(".__mail__").forEach(function(node, index, arr){  node.innerText = resources.mail;  });

});