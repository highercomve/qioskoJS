Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return JSON.parse(value);
};

function setTempFeed(result){
	localStorage.removeItem('temp_feed');
	localStorage.setObject('temp_feed',result.feed);
};
var default_sites=[
	{
		name:'tecnologia',
		values:[
			{title:'Bitelia',url:'http://feeds.hipertextual.com/bitelia'},
			{title:'Xataka',url:'http://feeds.weblogssl.com/xataka2'}
		]
	},
	{
		name:'venezuela',
		values:[
			{title:'La Patilla',url:'http://feeds.feedburner.com/lapatilla'},
			{title:'6to Poder',url:'http://www.6topoder.com/feed/'}
		]
	}
];

var feedModel=function(){
	this.key='feeds';
	var category;
	var feed;
	if(!localStorage.getObject(this.key)){
		localStorage.setObject(this.key,default_sites);
		var sites=default_sites;
	}
	else {
		var sites=localStorage.getObject(this.key);	
	};
	this.updateFeed=function() {
		localStorage.removeItem(this.key);
		localStorage.setObject(this.key,sites);
	}
	this.readCategory=function(name,bydefault){
		key=(typeof(key)!='undefined') ? bydefault:null;
		for(var i=0,len=sites.length;i<len; i++){
			if (sites[i].name==name){
				category=(!key) ? sites[i]:i; 
				break;
			}
			else{
				category='esto';
			}
		}
		return category;
	}
	this.setCategory=function(name,values){
		if(typeof(this.readCategory(name))=='object'){
			sites.push({name:name,value:values});
			this.updateFeed();
		}
	}
	this.findFeed=function(title,category){
		if(typeof(this.readCategory(category))=='object'){
			var actual=this.readCategory(category);
			for(var i=0,len=actual.values.length; i<len; i++){
				if(actual.values[i].title==title){
					feed=actual.values[i];
					break;
				}
				else{
					feed=null;
				}
			}
			return feed;
		}
		else{
			return null;
		}
	}
	this.setFeed=function(title,url,category){
		if(typeof(this.readCategory(category))=='object'){
			var actual=this.readCategory(category);
			if(this.findFeed(title,category)==null){
				actual.values.push({title:title,url:url});
				var y=this.readCategory(category,true);
				sites[y]=actual;
				this.updateFeed();
				return sites;
			}
			else
			{
				return false
			}
		}
		return 'nada';
	}
	this.getAll=function(){
		return sites;
	}
}
function getFeed(url,guid,category,max,callback){
	max=(typeof(max)=='undefined') ? 50:max;
	var content=new Array();
	var rss = new google.feeds.Feed(url);
    rss.includeHistoricalEntries();
    rss.setNumEntries(max);
    rss.load(function(result){
    	if (!result.error) {
    		console.log(result);
	    	try{
	    		if(!localStorage.getObject('feed_temp'))
				{
					localStorage.setObject('feed_temp',{feed:result.feed.title,content:result});
					content.push({feed:result.feed.title,content:result});
				}
				else
				{
					var temp=localStorage.getObject('feed_temp');
					content.push(temp);
					content.push({feed:result.feed.title,content:result});
					localStorage.setObject('feed_temp',content);
				}
				var poraqui=content.length - 1;
				var template = new EJS({url:'app/views/feeds.ejs'});
				var renderizado=template.render({id:poraqui,category:category,feed:result.feed});
				$('#content').append(renderizado);
				$('#carousel_'+poraqui).elastislide({
					imageW 		: 300,
					minItems	: 3,
					margin		: 2,
					border		: 0
				});
			}
			catch(e) {
				console.log(e);
				return false;
			}
	    }
	    else
	    {
	    	return false;
	    }
    });
    return true;
}