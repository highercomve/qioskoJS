
var feedController={
	showCategory:function(name){
		if (typeof(feeds)=='undefined' && typeof(category)=='undefined') {
			var feeds;
			var category;
		};
		$('#content').html('');
		$('#detail').html('');
		$('.article').hide();
		$('#over').hide();
		feeds=new feedModel();
		category=feeds.readCategory(name,false);
		localStorage.removeItem('feed_temp');
		var allfeeds={feed:new Array()};
		for (var i=0,len=category.values.length; i<len; i++) {
			var test_feed=getFeed(category.values[i].url,i,name);
		};
		
	},
	showDetail:function(category,site,id){
		if (typeof(result)=='undefined' && typeof(content)=='undefined') {
			var result;
			var content;
		};

		result=localStorage.getObject('feed_temp');
		console.log(result[site].content.feed.entries[id]);
		content={
			position:[site,id],
			content:result[site].content.feed.entries[id]
		};
		var template = new EJS({url:'app/views/detail.ejs'});
		var renderizado=template.render(content);
		$('#detail').html(renderizado);
		$('.detail').jScrollPane();
		$('#over').show();
		$('.detail').slideDown('medium');
		$('#over').click(function(){
			setHashSilently(category);
			$('.article').hide();
			$('#over').hide();
		});
	}
}