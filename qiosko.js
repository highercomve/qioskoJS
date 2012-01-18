function setHashSilently(hash){
  hasher.changed.active = false; //disable changed signal
  hasher.setHash(hash); //set hash without dispatching changed signal
  hasher.changed.active = true; //re-enable signal
}

$(document).ready(function(){
	//localStorage.removeItem('feed_temp');
	localStorage.clear();
	crossroads.addRoute('{id}',function(id){
		feedController.showCategory(id);
	});
	crossroads.addRoute('detail/{category}/{site}/{id}',function(category,site,id){
		feedController.showDetail(category,site,id); 
	});
	crossroads.routed.add(console.log, console); //log all routes
	//setup hasher
	hasher.initialized.add(crossroads.parse, crossroads); //parse initial hash value
	hasher.changed.add(crossroads.parse, crossroads); //parse hash changes
	hasher.init(); //start listening for history change
	var menu={enlaces:[
			
			{title:'Deportes',url:'#deportes'},
			{title:'Internacionales',url:'#internacionales'},
			{title:'Regionales',url:'#regionales'},
			{title:'Tecnología',url:'#tecnologia'},
			{title:'Venezuela',url:'#venezuela'}
	]};
	try{
		var template = new EJS({url:'app/views/menu.ejs'});
		var renderizado=template.render(menu);
		$('#main_nav_inner').html(renderizado);
	}
	catch(e) {
		console.log(e);
		return
	}
});
