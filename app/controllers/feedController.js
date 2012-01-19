function addSocialScript(d,s,id,url){
	var js,fjs=d.getElementsByTagName(s)[0];
	if(!d.getElementById(id)){
		js=d.createElement(s);
		js.id=id;
		js.src=url;
		fjs.parentNode.insertBefore(js,fjs);
	}
	else{
		var objHead = document.getElementsByTagName('head')[0];
		var objScript=d.getElementById(id)
		objHead.removeChild(objScript);
		js=d.createElement(s);
		js.id=id;
		js.src=url;
		fjs.parentNode.insertBefore(js,fjs);
	}
};
var feedController={
	showCategory:function(name){
		$('#loading').show();
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
			//setTimeout(function(){},500);
		};
		
	},
	renderCategory:function(result,cat){
		$('#loading').hide();
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
		$('#loading').show();
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
		$('#loading').hide();
		$('#detail').html(renderizado);
		$('#over').show();
		$('.detail').slideDown('medium');
		$('.detail').jScrollPane({autoReinitialise: true});
		$('#over').click(function(){
			setHashSilently(category);
			$('.article').hide();
			$('#over').hide();
		});
		window.___gcfg = {lang: 'es-419'};
		addSocialScript(document,"script","twitter-wjs","http://platform.twitter.com/widgets.js");
		addSocialScript(document,"script","facebook-wjs","http://connect.facebook.net/en_US/all.js#appId=224680044218666&amp;xfbml=1");
		addSocialScript(document,"script","googleplus-wjs","https://apis.google.com/js/plusone.js");
		
		/*
		(function() {
		    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
		    po.src = 'http://connect.facebook.net/en_US/all.js#appId=224680044218666&amp;xfbml=1';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
		})();*/
		setTimeout(function(){
			$('.googlemasuno').find('iframe').css({position:"relative",top:0,left:0});
		},500);
	}
}