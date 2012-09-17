// ------------------------------- Mail Article ---------------------------------------------------





// ------------- Info Tooltips --------------------
require(["dijit/TooltipDialog","dojo/domReady!"], function(tooltip) {

    function addTooltipDialog(_id_,text){
        var infoImg = dojo.byId(_id_);
        dojo.connect(infoImg, "onclick", function(evt){
            dijit.popup.open({
                popup:
                    new tooltip({
                        style: "width: 300px;",
                        content: text,            
                        onMouseLeave: function(){
                            dijit.popup.close(this);
                        },
                        onClick: function(){
                            dijit.popup.close(this);
                        }
                    }),
                around: dojo.byId(_id_)
            });
        });
    }

    addTooltipDialog('info_vacation', 'Incoming messages will be auto-responded with this message');
    addTooltipDialog('info_forward', 'Incoming messages will be forwarded to the following addresses');
    addTooltipDialog('info_alias', 'All mails sent to the following addresses will be delivered to my account');
    addTooltipDialog('info_access', 'Input this settings in your mail client (Outlook, Thunderbird...)');
});



// ----------------- Vacation enable/disable check --------------
require(["dijit/form/CheckBox"], function(checkBox) {
  var checkBox = new checkBox({
    name: "vacation_status",
    value: "enabled",
    checked: false,
    onClick: function(){ disableVacationForm(); }
  }, "vacation_status");
});


// Helper function to submit a *validated* mail
function submitNewMailDialog(dialogId, caption, store){
    var textBox = dijit.byId(caption); 
    var pass = dijit.byId('password');
    if( textBox.isValid(false) ){
        // Add mail to the store 
        stores[store].add({address: textBox.get("value")}).then(
            function(value){
                console.log("added, now go to hell!");
                textBox.reset();
                pass.reset();
                dijit.byId(dialogId).onCancel(); // Hide tooltip dialog
                //TODO: add notification
            },
            function(error){
                console.log(error);
                if (error.status==409) alert('This address already exists');
            });

    } else {
        textBox.focus(); // Focus shows error
    }
}

function aliasForwardForm(dialogId, caption, store){    
    var content = '<label style="margin-right:10px" for="'+caption+'">'+caption+' address:</label>'+
    '<input type="text" data-dojo-type="dijit.form.ValidationTextBox" '+
    ' id="'+ caption +'" '+ 
    'regExpGen="dojox.validate.regexp.emailAddress" trim="true" lowercase="true" '+
    ' invalidMessage="Invalid Email Address."> '+
    '<button data-dojo-type="dijit.form.Button" data-dojo-props="iconClass:\'plusIcon\'">Add' + 
    '   <script type="dojo/method" data-dojo-event="onClick" data-dojo-args="evt">' +
    '       submitNewMailDialog("'+dialogId+'","'+caption+'","'+store+'");' +
    '   </script>' +
    '</button>' 

    return content;
}

function newAccountForm(dialogId, caption, store){
        var content = '<label style="margin-right:10px" class="fieldLabel" for="'+caption+'">Mail address:</label>'+
    '<input type="text" data-dojo-type="dijit.form.ValidationTextBox" '+
    ' id="'+ caption +'" '+ 
    'regExpGen="dojox.validate.regexp.emailAddress" trim="true" lowercase="true" '+
    ' invalidMessage="Invalid Email Address."> <br>'+
    '<label style="margin-right:10px" class="fieldLabel" for="password">Password:</label>' +
    '<input type="text" data-dojo-type="dijit.form.TextBox" id="password" ><br>'+
    '<div class="dijitDialogPaneActionBar">'+
    '<button data-dojo-type="dijit.form.Button" data-dojo-props="iconClass:\'plusIcon\'">Add' + 
    '   <script type="dojo/method" data-dojo-event="onClick" data-dojo-args="evt">' +
    '       submitNewMailDialog("'+dialogId+'","'+caption+'","'+store+'");' +
    '   </script>' +
    '</button>' +
    '</div>'

    return content;
}


// ----------- Generic + Add Mail Button --------------------
addMailDialog = function(dialogId, caption, buttonName, store){
    require(["dojo/ready", "dijit/TooltipDialog", "dijit/form/ValidationTextBox", "dijit/form/Button", 
            "dijit/form/DropDownButton", "dojo/dom", "dojo/dom-style", "dojo/on","dojox/validate/regexp",
            "dojo/domReady!"],
            function(ready, TooltipDialog, TextBox, Button, DropDownButton, dom, style, on){
            ready(function(){
                
                if (dialogId=="new_mail_dialog")
                    var _content = newAccountForm(dialogId, caption, store);
                else
                    var _content = aliasForwardForm(dialogId, caption, store);

                var myDialog = new TooltipDialog({
                    id: dialogId,
                    content: _content
                });

                var node = dijit.byId(caption);
                on(myDialog, "keyPress", function(k){ // on keyPress Enter
                    if (k.keyCode == 13){
                        node.validate();
                        submitNewMailDialog(dialogId, caption, store);
                    }

                });


                var btn = new DropDownButton({
                    label: "Add " + caption,
                    dropDown: myDialog,
                    style: "font-size:0.8em",
                    iconClass:'plusIcon'
                });
                dom.byId(buttonName).appendChild(btn.domNode);
                // Float right the "add new..." button
                style.set(buttonName, "float", "right");

            });
    });
}
// Args:       dialog id, caption, Dropbutton name, store name
addMailDialog('fwd_dialog', 'Forward', 'new_forward_drop', 'forwardStore');
addMailDialog('alias_dialog', 'Alias', 'new_alias_drop', 'aliasStore');
addMailDialog('new_mail_dialog', 'Account', 'new_mail_drop', 'otherAccountsStore');





// --------------------- Mail Stores & Views -----------------------------------------------
require(["dojo/store/JsonRest","dojo/dom","dojo/store/Observable",
        "dojo/store/Memory", "dojo/store/Cache", "dojo/dom-construct", "dojo/on",
        "dojo/_base/fx","dojo/html","dojo/domReady!"
],
function(JsonRest, dom, Observable, Memory, Cache, domConstruct, on, fx, html){
                    //  html container, store name
    function createView(containerName, store){
        //Get a reference to our container
        var container = dom.byId(containerName);  
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

        function insertRow(item, i){
            // console.log("You shall add " + item.address);
            var row = domConstruct.create("li", {
                className: "SimpleList",
                innerHTML: item.address + "&nbsp;" +
                           '<div class="link closeIcon" id="rm_'+item.address+'"></div>'
            });
            row.itemId = item.address;            
            rows.splice(i, 0, container.insertBefore(row, rows[i]));

            // Remove item event
            on(dom.byId("rm_"+item.address), "click", function(){
                    stores[store].remove(item.id);
            });

            blink(row,1)

            if (containerName == 'other_accounts_list') 
                // console.log(i+1);
                html.set(dojo.byId('mail_accounts_limit'), '<div class="limitIcon"></div>Using ' + ++i + ' of 10 accounts');
        }

        function removeRow(i){
            console.log("You shall remove " + i);
            var node = rows.splice(i, 1)[0];
            fx.fadeOut({
                node: node,
                duration: 200,
                onEnd: function(){
                    domConstruct.destroy(node);
                }
            }).play();
            
            console.log("You shall remove " + i);
        }
    }


    function createVacationView(store){        
        stores[store].get('vacation').then(function(obj){
            dijit.byId('vac_message').set('value', obj.message) ;
            dijit.byId('vac_from_date').set('value', obj.fromDate);
            dijit.byId('vac_to_date').set('value', obj.toDate);
            dijit.byId('vacation_status').set('checked',obj.active);    
            hideVacationForm(obj.active);
            obj.addressList.forEach(function(item){
                dijit.byId('vac_from_address').addOption({label:item.address, value:item.id});
            });                        
        });
    }



            // url, store name
    newStore("aliases/","aliasStore");
    createView("alias_list", "aliasStore");

    newStore("forwards/", "forwardStore");    
    createView("forward_list", "forwardStore");

    newStore("accounts/mail/", "otherAccountsStore");
    createView("other_accounts_list", "otherAccountsStore");

    createVacationView("rootStore");


    
});


// -------- Save vacation ---------------
function saveVacation(){
    stores["rootStore"].put({
        'fromAdress': dijit.byId('vac_from_address').get('value'),
        'fromDate': dijit.byId('vac_from_date').get('value'),
        'toDate': dijit.byId('vac_to_date').get('value'),
        'message': dijit.byId('vac_message').get('value'),
        'active': dijit.byId('vacation_status').get('value') == "enabled" ? true : false,
    },
    {    // Object id
        id:'vacation'
    }).then(function(value){
        console.log('did good!');
    },
    function error(e){
        console.log('god why?');
    });
}

// --------- Disable / enable vacation form -----------------
// bool b: ture -> enable, false -> disable
function disableVacationForm() {
    var b = dijit.byId('vacation_status').get('value') == "enabled" ? true : false;    
    
    stores["rootStore"].put({
         'active': b,
    },
    {    // Object id
        id:'vacation'
    }).then(function(value){
        console.log('did good!');
        hideVacationForm(b);
    },
    function error(e){
        console.log('god why?');
    });
}

// --------- show / hide vacation container -----------------
// b: true-> show / false-> hide
function hideVacationForm(b){
    var containerHeight = (b)?"550px":"200px";
 
    var slideName = (b)?"vacation_enabled":"vacation_disabled";
    var slide = dijit.byId(slideName);
    var container = dijit.byId('vacation_container');
    require(["dojo/dom", "dojo/_base/fx", "dojo/on", "dojo/dom-style", "dojo/query", "dojo/domReady!"],
    function(dom, fx, on, style, query){
        container.selectChild(slide);  
        style.set(slideName, "opacity", "0");
        query(".vacation_container").style("height", containerHeight);
       
        var fadeArgs = {
            node: slideName
        };
        fx.fadeIn(fadeArgs).play();   
    });    
}