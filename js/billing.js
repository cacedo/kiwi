require([
    "dojox/grid/DataGrid","dojo/data/ObjectStore","dojo/domReady!"
], 
function(DataGrid, ObjectStore){

	
	function price(price){return price + ' &euro;';}
	function tax(tax){return tax + '%';}

	newStore('services/', 'services');

	var grid = new DataGrid({
            store: dataStore = ObjectStore({ objectStore: stores['services'] }),
			autoHeight: true,
			autoWidth: true,
            structure: [
				{name:"Date", field:"date", width: "100px", styles: 'text-align: center;'},
				{name:"Reference", field:"reference", width: "90px"},
				{name:"Description", field:"description", width: "240px"},
				{name:"Status", field:"status", width: "60px", styles: 'text-align: center;'},
				{name:"Quantity", field:"quantity", width: "90px", styles: 'text-align: center;'},				
				{name:"Price", field:"price", width: "60px", formatter: price},
				{name:"Tax", field:"tax", width: "60px", formatter: tax},
            ]
    }, "services_grid");
	grid.startup();


	function link2pdf(link){return '<a href='+link+'><img src=images/pdf.png></a>'}

	newStore('bills/', 'bills');
	
	var grid = new DataGrid({
            store: dataStore = ObjectStore({ objectStore: stores['bills'] }),
			autoHeight: true,
			autoWidth: true,
            structure: [
				{name:"Date", field:"date", width: "100px", styles: 'text-align: center;'},
				{name:"Reference", field:"reference", width: "90px"},
				{name:"Type", field:"type", width: "210px"},		
				{name:"Status", field:"status", width: "60px", styles: 'text-align: center;'},		
				{name:"Price", field:"price", width: "60px", formatter: price},
				{name:"Tax", field:"tax", width: "60px", formatter: tax},
				{name:"Download", field:"httpLink", width: "80px", formatter: link2pdf, styles: 'text-align: center;'},
            ]
    }, "bills_grid");
	grid.startup();

	// Account info
	stores['bills'].get('account').then(function(account){
		dijit.byId('account_name').set('value', account.name);
		dijit.byId('account_entity').set('value', account.entity);
		dijit.byId('account_branch').set('value', account.branch);
		dijit.byId('account_control_digit').set('value', account.controlDigit);
		dijit.byId('account_number').set('value', account.accountNumber);
	});
	
});