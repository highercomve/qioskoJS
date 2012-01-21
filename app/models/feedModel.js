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
			{title:'Xataka',url:'http://feeds.weblogssl.com/xataka2'},
			{title:'Engadget Espanol',url:'http://feeds.feedburner.com/EngadgetSpanish'},
			{title:'Alt1040',url:'http://feeds.hipertextual.com/alt1040'},
			{title:'Xataka Movil',url:'http://feeds.weblogssl.com/xatakamovil'},
			{title:'Guizmodo.es',url:'http://feeds.feedburner.com/es/gizmodo'},
			{title:'Fayerwayer',url:'http://feeds.feedburner.com/fayerwayer'},
			{title:'Conecti.ca',url:'http://feeds.feedburner.com/feedconectica'},
			{title:'Genbeta',url:'http://feeds.weblogssl.com/genbeta'},
			{title:'Androidve',url:'http://androidve.com/feed/'}
		]
	},
	{
		name:'venezuela',
		values:[
			{title:'La Patilla',url:'http://feeds.feedburner.com/lapatilla'},
			{title:'6to Poder',url:'http://www.6topoder.com/feed/'},
			{title:'Noticias 24',url:'http://www.noticias24.com/actualidad/feed/'},
			{title:'Noticiero Digital',url:'http://www.noticierodigital.com/feed/'},
			{title:'El Universal',url:'http://www.eluniversal.com/rss/avances.xml'},
			{title:'Diario la Verdad',url:'http://feeds.feedburner.com/diariolaverdad'},
			{title:'Tal Cual Digital',url:'http://www.talcualdigital.com/rss/TalCualDigital_avances.xml'}
		]
	},
	{
		name:'regionales',
		values:[
			{title:'El Impulso',url:'http://www.elimpulso.com/rss/feed.php?feeds=Todos&enviar=Buscar'},
			{title:'La Verdad de Monagas',url:'http://www.laverdaddemonagas.com/?format=feed&type=rss'},
			{title:'Notidiario',url:'http://www.notidiario.com.ve/index.php?format=feed&type=rss'},
			{title:'Noticia al dia',url:'http://feeds2.feedburner.com/NoticiaAlDia'},
			{title:'El Tiempo',url:'http://eltiempo.com.ve/rss/global'}
		]
	},
	{
		name:'deportes',
		values:[
			{title:'Sin Uniforme',url:'http://sinuniforme.com/feed'},
			{title:'Jonron',url:'http://www.jonron.com/sitio/feed/'},
			{title:'El Informador',url:'http://www.elinformador.com.ve/rss/deportes'},
			{title:'Ultimas Noticias Deportes',url:'http://www.ultimasnoticias.com.ve/CMSPages/RSS/Un/Deportes.aspx'},
			{title:'As',url:'http://www.as.com/rss.html'}
		]
	},
	{
		name:'internacionales',
		values:[
			{title:'El Pais',url:'http://www.elpais.com/rss/feed.html?feedId=1022'},
			{title:'Emol',url:'http://rss.emol.com/rss.asp?canal=0'},
			{title:'El Tiempo',url:'http://www.eltiempo.com/mundo/latinoamerica/rss.xml'},
			{title:'El Nuevo Erald',url:'http://www.elnuevoherald.com/primera-plana/index.xml'},
			{title:'El Universal',url:'http://www.eluniversal.com.mx/rss/notashome.xml'},
			{title:'Clarin',url:'http://clarin.feedsportal.com/c/33088/f/577681/index.rss'},
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
function getFeed(url,cat_name,max,callback){
	max=(typeof(max)=='undefined') ? 50:max;
	var content=new Array();
	var rss = new google.feeds.Feed(url);
    rss.includeHistoricalEntries();
    rss.setNumEntries(max);
    rss.load(function(result){
    	if (!result.error) {
    		//console.log(result);
	    	try{
	    		if(!localStorage.getObject('feed_temp'))
				{
					var temp=new Array();
					temp.push({feed:result.feed.title,content:result});
					localStorage.setObject('feed_temp',temp);
				}
				else
				{
					var temp=new Array();
					temp=localStorage.getObject('feed_temp');
					temp.push({feed:result.feed.title,content:result});
					localStorage.setObject('feed_temp',temp);
				}
				//console.log(temp);
				feeds=new feedModel();
				var category=feeds.readCategory(cat_name);
				if(temp.length==category.values.length){
					feedController.renderCategory(temp,cat_name);
				}
				else{
					//console.log('Error no mando ha hacer render '+temp.length+'<>'+category.values.length);
				}
			}
			catch(e) {
				console.log(e);
				return false;
			}
	    }
	    else
	    {
	    	console.log(result.error);
	    	return false;
	    }
    });
    return true;
}