// ---------------------------------------- Web Article ----------------------------------------------------

// ------------------ Web tab -------------------------------------------

// ----------- Add Site Button --------------------

require(["dojo/ready", "dijit/TooltipDialog", "dijit/form/ValidationTextBox", "dijit/form/Button", 
        "dijit/form/DropDownButton", "dojo/dom", "dojo/dom-style","dojo/on","dojox/validate/regexp","dojo/domReady!"],
        function(ready, TooltipDialog, TextBox, Button, DropDownButton, dom,style,on){
        ready(function(){
            var myDialog = new TooltipDialog({
                id: 'new_site_dialog',
                content:
                    '<label class="fieldLabel" style="margin-right:10px" for="domain">Domain:</label>'+
                    '<input type="text" data-dojo-type="dijit.form.ValidationTextBox" required="true" id="domain" ><br>' + 
                    '<label class="fieldLabel" style="margin-right:10px" for="directory">Directory:</label>'+
                    '<input type="text" data-dojo-type="dijit.form.ValidationTextBox" required="true" id="directory" ><br>' + 
                    '<div class="dijitDialogPaneActionBar">'+
                    '<button data-dojo-type="dijit.form.Button" data-dojo-props="iconClass:\'plusIcon\'">Add' + 
                    '   <script type="dojo/method" data-dojo-event="onClick" data-dojo-args="evt">' +
                    '       submitNewSiteDialog();' +
                    '   </script>' +
                    '</button>' +
                    '</div>'
            });

            var btn = new DropDownButton({
                label: "Add website",
                dropDown: myDialog,
                style: "font-size:0.8em",
                iconClass:'plusIcon'
            });
            dom.byId('new_website_btn').appendChild(btn.domNode);
            style.set('new_website_btn', "float", "right");

            var node = dijit.byId('domain');
            on(myDialog, "keyPress", function(k){ // on keyPress Enter
                if (k.keyCode == 13){
                    node.validate();
                    submitNewSiteDialog();
                }
            });
        });
});


function submitNewSiteDialog(){
    var domain = dijit.byId('domain');
    var directory = dijit.byId('directory');

    if( domain.isValid(false) && directory.isValid(false) ){
    var vhost = {
              'domain':domain.get('value'), 
              'directory': directory.get('value'), 
              'description':'',
              'aliases': '',
              'database': ''
             };

    stores['sites'].add(vhost).then(
        function(value){
            console.log("added, now go to hell!");
            domain.reset();
            directory.reset();            
            dijit.byId('new_site_dialog').onCancel(); // Hide tooltip dialog
            
        },
        function(error){
            console.log(error);
            if (error.status==409) alert('This site already exists');
    });
    }else{
        if (name.isValid(false)) user.focus();
        else name.focus();
    }
}


// Define Virtual Hosts widget from template
require([
    "dojo/_base/declare", "dojo/parser", "dojo/_base/array",
    "dijit/_WidgetBase", "dijit/_TemplatedMixin",
    "dojo/text!templates/VirtualHost.html", "dojo/dom","dojo/domReady!"

], function(declare, parser, arrayUtil, _WidgetBase, _TemplatedMixin, template, dom){
    declare("VirtualHost", [_WidgetBase, _TemplatedMixin], {
        
        templateString: template,
        baseClass: "virtualHost",

        // Attributes
        address: "unknown",
        _setAddressAttr: { node: "addressNode", type: "innerHTML" },

    });

});


function createSitesView(store){
    require([
        "dojo/_base/array", "dojo/dom","dojo/dom-construct","dojo/on","dojo/_base/fx",
        "dojo/parser", "dojox/fx/scroll", "dojo/domReady!"

    ], function(arrayUtil, dom, domConstruct, on, fx, parser, scroll){

            var container = dom.byId('VirtualHostContainer');
            var rows = [];
            var results = stores[store].query({});
            
            results.forEach(insertRow);

            results.observe(function(item, removedIndex, insertedIndex){
                // this will be called any time a item is added, removed, and updates
                if(removedIndex > -1){
                    removeRow(removedIndex);
                }
                if(insertedIndex > -1){
                    insertRow(item, insertedIndex);
                }
            }, true); // we can indicate to be notified of object updates as well


            function insertRow(vhost, i){
                // ListInput needs a certain format
                var domainList = "[";
                arrayUtil.forEach(vhost.aliases, function(domain){
                    domainList = domainList + "'"+domain+"',";
                });
                vhost.aliases = domainList + "]";

                var vh = ({'id': vhost.id,
                           'address': vhost.address, 
                           'description': vhost.description, 
                           'directory': vhost.directory, 
                           'domain': vhost.domain,
                           'aliases': vhost.aliases, 
                           'database':  vhost.database,
                           'options': '<option value="TN">Tennessee</option>'});

                vhostWidget = new VirtualHost(vh).placeAt(container, 'first'); 
                parser.parse("VirtualHostContainer");

                // var row = dojo.byId(vhost.get("id")); 
                row = vhostWidget.domNode; 
                row.itemId = vhost.id;
                rows.splice(i, 0, row);

                        // Remove db event
                on(dom.byId("rm_vh_"+vhost.id), "click", function(){
                    stores[store].remove(vhost.id);
                });

                blink(row,1);

            } 


            function removeRow(i){
                console.log("You shall remove " + i);
                if (confirm("Are you sure you want to delete this site?\n\n" + 
                     "You will lose the configuration, but your site files will not be removed.")) { 
                    var node = rows.splice(i, 1)[0];
                    console.log("Destroying VHOST: " + node);
                    fx.fadeOut({
                        node: node,
                        onEnd: function(){
                            dojo.destroy(node);      
                        }
                    }).play();
                }
            }


    });
}




// function called on X button clicked
function removeSite(d){
    if (confirm("Are you sure you want to delete this site?\n\n" + 
                 "You will lose the configuration, but your site files will not be removed.")) { 
        require(["dojo/_base/fx"], function(fx) {
            console.log("Destroying VHOST");

            fx.fadeOut({
                node: d,
                onEnd: function(){
                    dojo.destroy(d);      
                }
            }).play();
        });
    }
    
}



// ------------------------ Databases tab -------------------------------------------------

// Add new database from form popup
function submitNewDBDialog(){

    var name = dijit.byId('dbname');
    var user = dijit.byId('dbuser');
    var password = dijit.byId('dbpassword');
    if( name.isValid(false) && user.isValid(false) ){
    var db = {
              'name':name.get('value'), 
              'user': user.get('value'), 
              'password': password.get('value')
             };

    stores['databases'].add(db).then(
        function(value){
            console.log("added, now go to hell!");
            name.reset();
            user.reset();
            password.reset();
            dijit.byId('new_database_dialog').onCancel(); // Hide tooltip dialog
            
        },
        function(error){
            console.log(error);
            if (error.status==409) alert('This database already exists');
    });
    }else{
        if (name.isValid(false)) user.focus();
        else name.focus();
    }
}


// ----------- Add Database Button --------------------

require(["dojo/ready", "dijit/TooltipDialog", "dijit/form/ValidationTextBox", "dijit/form/Button", 
        "dijit/form/DropDownButton", "dojo/dom", "dojo/dom-style","dojo/on", "dojox/validate/regexp","dojo/domReady!"],
        function(ready, TooltipDialog, TextBox, Button, DropDownButton, dom, style, on){
        ready(function(){
            var myDialog = new TooltipDialog({
                id: 'new_database_dialog',
                content:
                    '<label class="fieldLabel" style="margin-right:10px" for="database">Name:</label>'+
                    '<input type="text" data-dojo-type="dijit.form.ValidationTextBox" required="true" id="dbname" ><br>' + 
                    '<label class="fieldLabel" style="margin-right:10px" for="dbuser">User name:</label>'+
                    '<input type="text" data-dojo-type="dijit.form.ValidationTextBox" required="true" id="dbuser" ><br>' + 
                    '<label class="fieldLabel" style="margin-right:10px" for="dbpassword">Password:</label>'+
                    '<input type="text" data-dojo-type="dijit.form.TextBox" id="dbpassword" ><br>' + 
                    '<div class="dijitDialogPaneActionBar">'+
                    '<button data-dojo-type="dijit.form.Button" data-dojo-props="iconClass:\'plusIcon\'">Add' + 
                    '   <script type="dojo/method" data-dojo-event="onClick" data-dojo-args="evt">' +
                    '       submitNewDBDialog();' +
                    '   </script>' +
                    '</button>' +
                    '</div>'
            });

            var btn = new DropDownButton({
                label: "Add database",
                dropDown: myDialog,
                style: "font-size:0.8em",
                iconClass:'plusIcon'
            });
            dom.byId('new_database_btn').appendChild(btn.domNode);
            style.set('new_database_btn', "float", "right");

            var node = dijit.byId('dbname');
            on(myDialog, "keyPress", function(k){ // on keyPress Enter
                if (k.keyCode == 13){
                    node.validate();
                    submitNewDBDialog();
                }
            });
        });
});




// Get All databases and create view
function addDatabaseRowView(name, user, id, store){
    var row;
    require(["dojo/dom-construct","dojo/dom", "dojo/domReady!"],
    function(domConstruct,dom, on){
        
        var content = '<td>'+name+'</td><td>'+user+'</td>' +
            '<td><div class="link closeIcon" id="rm_db_'+name+'"></div></td>';
        row = domConstruct.create("tr", {innerHTML: content});
    });
    return row;
}


function createDatabaseView(store){
    require([
        "dojo/_base/array", "dojo/dom","dojo/dom-construct","dojo/on","dojo/_base/fx","dojo/html", "dojo/domReady!"
    ], function(arrayUtil, dom, domConstruct, on, fx, html){
            var table = dom.byId('database_table');
            var rows = [];
            var results = stores[store].query({});
            results.forEach(insertRow);

            results.observe(function(item, removedIndex, insertedIndex){
                // this will be called any time a item is added, removed, and updates
                if(removedIndex > -1){
                    removeRow(removedIndex);
                }
                if(insertedIndex > -1){
                    insertRow(item, insertedIndex);
                }
            }, true); // we can indicate to be notified of object updates as well


            function insertRow(db, i){
                var row = addDatabaseRowView(db.name, db.user, db.id, store);
                row.itemId = db.id;
                rows.splice(i, 0, table.insertBefore(row, rows[i]));
                        // Remove db event
                on(dom.byId("rm_db_"+db.name), "click", function(){
                    stores[store].remove(db.id);
                });

                blink(row,1);

                html.set(dojo.byId('databases_limit'), '<div class="limitIcon"></div>Using ' + ++i + ' of 10 databases');

            } 


            function removeRow(i){
                console.log("You shall remove " + i);
                var node = rows.splice(i, 1)[0];
                fx.fadeOut({
                    node: node,
                    duration: 200,
                    onEnd: function(){ domConstruct.destroy(node); }
            }).play();
            
            console.log("You shall remove " + i);
        }
    });
}





// ---------------------- Stores  -----------------------------

newStore('sites/', 'sites');

newStore('databases/', 'databases');

createSitesView('sites');

createDatabaseView('databases');

