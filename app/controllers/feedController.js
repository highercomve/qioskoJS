
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
			getFeed(category.values[i].url,name);
			setInterval(function(){},500);
		};
		
	},
	renderCategory:function(result,cat){
		var template = new EJS({url:'app/views/feeds.ejs'});
		console.log('renderCategory');
		console.log({category:cat,result:result});
		var renderizado=template.render({category:cat,result:result});
		$('#content').append(renderizado);
		for (var i = 0,len=result.length; i<len; i++) {
			$('#carousel_'+i).elastislide({
				imageW 		: 300,
				minItems	: 3,
				margin		: 2,
				border		: 0
			});
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
		$('#over').show();
		$('.detail').slideDown('medium');
		$('.detail').jScrollPane({autoReinitialise: true});
		$('#over').click(function(){
			setHashSilently(category);
			$('.article').hide();
			$('#over').hide();
		});
	}
}