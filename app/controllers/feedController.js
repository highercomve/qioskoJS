
EJS.Helpers.prototype.thumbnail=function(value){
	var img='';
	if(match=value.match(/src=\"(.*?)\"/)){
		for (var i=1,len=match.length;i<len;i++){
			if(match[i].match(/youtube\.com\/(v|embed)\/(.*)\?*/) || match[i].match(/mf\.gif/) || match[i]=='http://www.noticierodigital.com/cms/wp-content/plugins/sociable/images/facebook.png'){
					img='';	
			}
			else
			{
				img='<img src='+match[i]+' width="300"/>';
				break;
			}
		}
	}
	return img;
};

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
//var currentfeed=0;
//var categorylen=0;
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
		/*
		currentfeed=0;
		categorylen=category.values.length;
		console.log(category);
		getFeed(category,name);
		*/
		
		for (var i=0,len=category.values.length; i<len; i++) {
			getFeedOnTemp(category.values[i].url,name);
			//setTimeout(function(){},500);
		};
		
	},
	renderCategory:function(result,cat){
		$('#loading').hide();
		var template = new EJS({url:'app/views/feeds.ejs'});
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
		//console.log(result[site].content.feed.entries[id]);
		content={
			position:[site,id],
			content:result[site].content.feed.entries[id]
		};
		try{
			var template = new EJS({url:'app/views/detail.ejs'});
			var renderizado=template.render(content);	
		}
		catch(e){
			console.log(e);
		}
		$('#loading').hide();
		$('#detail').html(renderizado);
		$('#detail a').attr('target','_blank');
		$('.detail').jScrollPane({autoReinitialise: true});
		$('#over').show(0,function(){
			$('.detail').css('top','0');
			$('.tools').css('top','50');
		});
		$('#over').click(function(){
			setHashSilently(category);
			$('.detail').css('top','-100%');
			$('.tools').css('top','-300px');
			$('#over').hide();
		});
		window.___gcfg = {lang: 'es-419'};
		addSocialScript(document,"script","twitter-wjs","http://platform.twitter.com/widgets.js");
		addSocialScript(document,"script","facebook-wjs","http://connect.facebook.net/en_US/all.js#appId=224680044218666&amp;xfbml=1");
		addSocialScript(document,"script","googleplus-wjs","https://apis.google.com/js/plusone.js");
		
		setTimeout(function(){
			$('.googlemasuno').find('iframe').css({position:"relative",top:0,left:0});
		},500);
	}
}