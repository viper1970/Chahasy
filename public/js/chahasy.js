function start(data){
	
	dataObj = { itemIdx:{}, pageIdx:{}, pageList:[]};
	// Index items
	for(var i = 0; i < data.items.length ; i++) {
		dataObj.itemIdx[data.items[i].id] = data.items[i];
	}
	// Index pages and replace items by links to items
	
	for(var i = 0; i < data.pages.length ; i++) {
		var page = data.pages[i];
		dataObj.pageList[i] = page;
		dataObj.pageIdx[page.id]=i;
		for(var j = 0; j < page.items.length ; j++) {
			page.items[j] = dataObj.itemIdx[ page.items[j] ];
		}
	}
	
	console.log(JSON.stringify(dataObj.pageList));
	console.log(JSON.stringify(dataObj.pageIdx));
}	
 
var dataObj={}
 $.getJSON('js/objects.json').done(function (data) { start(data)});
 