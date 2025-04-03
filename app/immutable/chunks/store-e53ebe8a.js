var R=Object.defineProperty,U=Object.defineProperties;var w=Object.getOwnPropertyDescriptors;var h=Object.getOwnPropertySymbols;var x=Object.prototype.hasOwnProperty,S=Object.prototype.propertyIsEnumerable;var m=(t,a,i)=>a in t?R(t,a,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[a]=i,l=(t,a)=>{for(var i in a||(a={}))x.call(a,i)&&m(t,i,a[i]);if(h)for(var i of h(a))S.call(a,i)&&m(t,i,a[i]);return t},c=(t,a)=>U(t,w(a));import{w as d,d as A}from"./singletons-09f04b3d.js";import{b as P}from"./utils-3c35a618.js";let f=d([]),u=d({});Array.prototype.forEachAsyncParallel=async function(t){await Promise.all(this.map(t))};const e={retries:0,maxRetries:10,language:"en",SEARCH_BASE_URL:"https://:lang.wikipedia.org/w/api.php",FEATURED_BASE_URL:"https://wikimedia.org/api/rest_v1/metrics/pageviews/top/:lang.wikipedia.org/all-access/:date",searchApiUrl:null,SEARCH_REQUEST_OPTIONS:{format:"json",action:"query",generator:"search",gsrnamespace:0,gsrlimit:10,prop:"pageimages|extracts|pageterms|images|info|extracts&inprop=url",pilimit:"max",exintro:"",explaintext:"",exsentences:1,exlimit:"max",origin:"*",pithumbsize:500},banned:["Wikipedia:Portada","Main_Page","Special:Search","Wikip\xE9dia:P\xE1gina_principal","Especial:Pesquisar","Wikipedia:Featured_pictures","Wikip\xE9dia:Accueil_principal","Portal:Current_events","Wikipedia:Hauptseite","Pagina_principale","Help:IPA/English","CEO","Video_hosting_service","F5_Networks","File:","Ficheiro:","Help","Ajuda"],featuredDate:new Date,state:d({loading:!1}),searchResults:A(f,t=>{let a=[];if(t.query){let i=0;Object.entries(t.query.pages).forEach(s=>{const[o,r]=s,n={i,title:r.title,text:r.extract?r.extract:"",tags:r.terms.alias?r.terms.alias:[],link:r.canonicalurl,image:r.thumbnail?r.thumbnail.source:""};a.push(n),i++})}return a}),featuredArticles:A(u,t=>t),search:t=>{e.searchApiUrl=e.getSearchApiUrl(t),e.fetch(e.searchApiUrl,f)},getFeaturedPosts:async t=>{function a(){e.retries<e.maxRetries?(setTimeout(e.getFeaturedPosts,1e3*e.retries+1,P(t)),e.retries++):console.warn("MAX RETRIES REACHED! GIVING UP!")}let i=e.FEATURED_BASE_URL.replaceAll(":lang",e.language).replaceAll(":date",t.toJSON().slice(0,10).replaceAll("-","/"));e.state.set(c(l({},e.state),{loading:!0})),fetch(i).catch(s=>{e.state.set(c(l({},e.state),{loading:!1})),console.error("API ERROR",s)}).then((s,o)=>(e.state.set(c(l({},e.state),{loading:!1})),s&&s.status==200?s.json():(u.set({data:null,status:"wiki_no_data",featuredDate:t}),null))).then(async s=>s?e.parseFeatured(s,t):a())},parseFeatured:async(t,a)=>{u.set([]);const i=[];if(t.items&&t.items.length>0){const s=t.items[0].articles;if(s){let o=1;await s.filter(r=>!e.banned.includes(r.article)).slice(0,50).forEachAsyncParallel(async r=>{const n=await e.getPageDetails(r.article);if(!n.title.toLowerCase().includes("not found")){let p=n.thumbnail?n.thumbnail.source:null;if(p&&p.includes("px-")){const g=p;p=g.split("/").splice(0,g.split("/").length-1).join("/")+"/400px"+g.split("/").pop().slice(g.split("/").pop().indexOf("px")+2)}let E={i:o,title:n.title,tags:["{} views".replace("{}",r.views.toLocaleString())],link:n.content_urls?n.content_urls.desktop.page:"/",image:p,views:r.views,text:n.extract||n.description};i.push(E)}o++})}}e.featuredDate=a,i.length>0?u.set({data:i,featuredDate:a}):u.set({data:null,status:"wiki_no_data",featuredDate:a})},getPageDetails:async t=>{let a="https://:lang.wikipedia.org/api/rest_v1/page/summary/:page?origin=*".replaceAll(":lang",e.language).replaceAll(":page",t);e.state.set(c(l({},e.state),{loading:!0}));const i=await fetch(a);return e.state.set(c(l({},e.state),{loading:!1})),await i.json()},fetch:(t,a)=>{e.state.set(c(l({},e.state),{loading:!0})),fetch(t).then(i=>i.json()).then(i=>{a.set(i),e.state.set(c(l({},e.state),{loading:!1}))}).catch(i=>(e.state.set(c(l({},e.state),{loading:!1})),[]))},getSearchApiUrl:t=>{const a="?gsrsearch="+t+Object.entries(e.SEARCH_REQUEST_OPTIONS).reduce((i,s)=>{const[o,r]=s;return i+"&"+o+"="+r},"");return e.getApiBaseURL()+a},getApiBaseURL:()=>e.SEARCH_BASE_URL.replaceAll(":lang",e.language),setLanguage:t=>{const a=e.getApiBaseURL();e.language=t;const i=e.getApiBaseURL();e.searchApiUrl&&(e.searchApiUrl=e.searchApiUrl.replaceAll(a,i),e.fetch(e.searchApiUrl,f)),e.getFeaturedPosts(e.featuredDate)}},_=d([]),F=t=>{const a=Math.floor(Math.random()*1e4),i={id:a,type:"info",dismissible:!0,timeout:3e3};_.update(s=>[l(l({},i),t),...s]),t.timeout&&setTimeout(()=>k(a),t.timeout)},k=t=>{_.update(a=>a.filter(i=>i.id!==t))};export{e as W,F as a,k as d,f as s,_ as t};
