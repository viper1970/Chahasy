function setPage(url){
	var newPage = pageIdx[url];
	if (typeof(newPage) != 'undefined'){
		// mark the old page as inactive
		pages[pageIdx[currentPage]].active="";
		currentPage = url;
		// mark the new page as active
		pages[newPage].active="active";
		items=pages[newPage].items;
		ractive.set({
			pages:pages,
			items:items
		});
	}
}

function init(data){
	var itemIdx={};
	// Index items and fix the type so its easier to consume by ractive
	for(var i = 0; i < data.items.length ; i++) {
		var item=data.items[i];
		var t=item.type;
		item.type={};
		item.type[t]=true;
		itemIdx[item.id] = item;
	}
	// Index pages by URL and replace items by links to items (if any)
	
	for(var i = 0; i < data.pages.length ; i++) {
		var page = data.pages[i];
		pages[i] = page;
		pageIdx[page.url] = i;
		if ( page.items ){
			for(var j = 0; j < page.items.length ; j++) {
				page.items[j] = itemIdx[ page.items[j] ];
			}
		}
	}
	// lets see what we got
	//console.log(JSON.stringify(pages));
	//console.log(JSON.stringify(pageIdx));
	//console.log(JSON.stringify(items));
	//console.log(JSON.stringify(itemIdx));

	// start at page 0
	currentPage = pages[0].url;
	// did the user jump directly to a specific page ?
	if (typeof pageIdx[location.hash] != 'undefined'){
		currentPage = location.hash;
	}
	// mark this page as active
	setPage(currentPage);
	// listen for URL changes
	window.onhashchange = function(){ setPage(location.hash)};
}	

var currentPage, pages=[], items={}, pageIdx={};

// create the ractive object
var ractive = new Ractive({
	el: renderOutput,
	template: '#renderTemplate'
});

 $.getJSON('js/objects.json').done(function (data) { init(data)});
 