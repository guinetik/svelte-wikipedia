import{_ as M}from"../chunks/preload-helper-06517e71.js";import{S as O,i as U,s as W,l as wt,g as D,e as k,t as K,k as z,c as _,a as m,h as Q,d as v,m as E,b as r,I as b,J as A,K as Bt,L,M as V,j as _t,E as T,G as ot,N as P,O as zt,w as R,x as q,y as H,P as pt,Q as It,q as C,o as I,B as G,R as tt,T as At,U as Et,V as Yt,W as $t,X as Lt,Y as Vt,Z as Tt,_ as St,p as st,$ as Mt,a0 as Nt,a1 as Xt,n as bt}from"../chunks/index-f0dd9566.js";import{Y as et,D as rt,g as Ft,r as Dt,y as N,F as Ot,$ as Ut,k as vt,f as Wt,a as Pt}from"../chunks/index-f9c319bc.js";import{W as X,s as Rt}from"../chunks/WikiArticle.svelte_svelte_type_style_lang-750171ad.js";import"../chunks/singletons-e01e0108.js";function ut(n,t,o){const e=n.slice();return e[8]=t[o],e}function yt(n){let t,o=n[3],e=[];for(let a=0;a<o.length;a+=1)e[a]=ht(ut(n,o,a));return{c(){for(let a=0;a<e.length;a+=1)e[a].c();t=wt()},l(a){for(let w=0;w<e.length;w+=1)e[w].l(a);t=wt()},m(a,w){for(let i=0;i<e.length;i+=1)e[i].m(a,w);D(a,t,w)},p(a,w){if(w&25){o=a[3];let i;for(i=0;i<o.length;i+=1){const p=ut(a,o,i);e[i]?e[i].p(p,w):(e[i]=ht(p),e[i].c(),e[i].m(t.parentNode,t))}for(;i<e.length;i+=1)e[i].d(1);e.length=o.length}},d(a){Bt(e,a),a&&v(t)}}}function ht(n){let t,o,e=n[8].name+"",a,w,i,p,l,u;return{c(){t=k("li"),o=k("button"),a=K(e),p=z(),this.h()},l(c){t=_(c,"LI",{});var g=m(t);o=_(g,"BUTTON",{type:!0,"data-lang":!0,class:!0});var s=m(o);a=Q(s,e),s.forEach(v),p=E(g),g.forEach(v),this.h()},h(){r(o,"type","button"),r(o,"data-lang",w=n[8].value),r(o,"class",i=(n[0]===n[8].value?"font-bold":"font-normal")+" inline-flex py-2 px-4 w-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white")},m(c,g){D(c,t,g),b(t,o),b(o,a),b(t,p),l||(u=A(o,"click",n[4]),l=!0)},p(c,g){g&1&&i!==(i=(c[0]===c[8].value?"font-bold":"font-normal")+" inline-flex py-2 px-4 w-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white")&&r(o,"class",i)},d(c){c&&v(t),l=!1,u()}}}function qt(n){let t,o=n[2]("lang")+"",e,a,w,i,p,l,u,c,g,s,h,x=n[0]&&yt(n);return{c(){t=k("button"),e=K(o),a=z(),w=L("svg"),i=L("path"),p=z(),l=k("div"),u=k("ul"),x&&x.c(),g=z(),this.h()},l(y){t=_(y,"BUTTON",{id:!0,class:!0,type:!0});var d=m(t);e=Q(d,o),a=E(d),w=V(d,"svg",{class:!0,fill:!0,viewBox:!0,xmlns:!0});var f=m(w);i=V(f,"path",{"fill-rule":!0,d:!0,"clip-rule":!0}),m(i).forEach(v),f.forEach(v),d.forEach(v),p=E(y),l=_(y,"DIV",{id:!0,class:!0});var $=m(l);u=_($,"UL",{class:!0,"aria-labelledby":!0});var F=m(u);x&&x.l(F),F.forEach(v),$.forEach(v),g=E(y),this.h()},h(){r(i,"fill-rule","evenodd"),r(i,"d","M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"),r(i,"clip-rule","evenodd"),r(w,"class","ml-1 w-4 h-4"),r(w,"fill","currentColor"),r(w,"viewBox","0 0 20 20"),r(w,"xmlns","http://www.w3.org/2000/svg"),r(t,"id","dropdown-button"),r(t,"class","flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"),r(t,"type","button"),r(u,"class","py-1 text-sm text-gray-700 dark:text-gray-200"),r(u,"aria-labelledby","dropdown-button"),r(l,"id","dropdown"),r(l,"class",c=(n[1]?"":"hidden")+" z-50 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 top-16 -ml-8 absolute")},m(y,d){D(y,t,d),b(t,e),b(t,a),b(t,w),b(w,i),D(y,p,d),D(y,l,d),b(l,u),x&&x.m(u,null),D(y,g,d),s||(h=[A(t,"click",n[5]),A(l,"pointerleave",n[6]),A(document.body,"keydown",n[6])],s=!0)},p(y,[d]){d&4&&o!==(o=y[2]("lang")+"")&&_t(e,o),y[0]?x?x.p(y,d):(x=yt(y),x.c(),x.m(u,null)):x&&(x.d(1),x=null),d&2&&c!==(c=(y[1]?"":"hidden")+" z-50 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 top-16 -ml-8 absolute")&&r(l,"class",c)},i:T,o:T,d(y){y&&v(t),y&&v(p),y&&v(l),x&&x.d(),y&&v(g),s=!1,ot(h)}}}function Ht(n,t,o){let e;P(n,et,g=>o(2,e=g));const a=zt();let w=[{name:"English",value:"en"},{name:"Portugu\xEAs",value:"pt"},{name:"Espa\xF1ol",value:"es"},{name:"Fran\xE7ais",value:"fr"},{name:"Italiano",value:"it"},{name:"Deutsch",value:"de"}],i=null,p=!1;rt.subscribe(g=>o(0,i=g!=null?g.split("-")[0]:"en"));const l=g=>{o(0,i=g.target.attributes["data-lang"].nodeValue),console.log("Language Changed",i),rt.set(i),a("lang-change",i),u()},u=()=>{o(1,p=!p)};return[i,p,e,w,l,u,()=>{p&&u()}]}class Gt extends O{constructor(t){super(),U(this,t,Ht,qt,W,{})}}function Jt(n){let t,o,e,a,w,i,p,l,u,c,g,s,h,x;return e=new Gt({}),e.$on("lang-change",n[4]),{c(){t=k("form"),o=k("div"),R(e.$$.fragment),a=z(),w=k("div"),i=k("input"),l=z(),u=k("button"),c=L("svg"),g=L("path"),this.h()},l(y){t=_(y,"FORM",{class:!0});var d=m(t);o=_(d,"DIV",{class:!0});var f=m(o);q(e.$$.fragment,f),a=E(f),w=_(f,"DIV",{class:!0});var $=m(w);i=_($,"INPUT",{type:!0,id:!0,class:!0,placeholder:!0}),l=E($),u=_($,"BUTTON",{type:!0,class:!0});var F=m(u);c=V(F,"svg",{class:!0,fill:!0,stroke:!0,viewBox:!0,xmlns:!0});var B=m(c);g=V(B,"path",{"stroke-linecap":!0,"stroke-linejoin":!0,"stroke-width":!0,d:!0}),m(g).forEach(v),B.forEach(v),F.forEach(v),$.forEach(v),f.forEach(v),d.forEach(v),this.h()},h(){r(i,"type","search"),r(i,"id","search-dropdown"),r(i,"class","block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"),r(i,"placeholder",p=n[1]("search_placeholder")),i.required=!0,r(g,"stroke-linecap","round"),r(g,"stroke-linejoin","round"),r(g,"stroke-width","2"),r(g,"d","M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"),r(c,"class","w-5 h-5"),r(c,"fill","none"),r(c,"stroke","currentColor"),r(c,"viewBox","0 0 24 24"),r(c,"xmlns","http://www.w3.org/2000/svg"),r(u,"type","submit"),r(u,"class","absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"),r(w,"class","relative w-full"),r(o,"class","flex"),r(t,"class","mb-2 max-w-3xl sm:w-full searchbar")},m(y,d){D(y,t,d),b(t,o),H(e,o,null),b(o,a),b(o,w),b(w,i),pt(i,n[0]),b(w,l),b(w,u),b(u,c),b(c,g),s=!0,h||(x=[A(i,"input",n[5]),A(t,"submit",It(n[2]))],h=!0)},p(y,[d]){(!s||d&2&&p!==(p=y[1]("search_placeholder")))&&r(i,"placeholder",p),d&1&&pt(i,y[0])},i(y){s||(C(e.$$.fragment,y),s=!0)},o(y){I(e.$$.fragment,y),s=!1},d(y){y&&v(t),G(e),h=!1,ot(x)}}}function Kt(n,t,o){let e;P(n,et,c=>o(1,e=c));const a=zt();let w="";const i=c=>{a("wiki-search",w)};function p(){o(0,w=""),X.searchApiUrl=null}function l(c){tt.call(this,n,c)}function u(){w=this.value,o(0,w)}return[w,e,i,p,l,u]}class Qt extends O{constructor(t){super(),U(this,t,Kt,Jt,W,{clear:3})}get clear(){return this.$$.ctx[3]}}function Zt(n){let t,o,e,a,w=n[0]("nav_about")+"",i,p,l;return{c(){t=k("nav"),o=k("ul"),e=k("li"),a=k("a"),i=K(w),p=z(),l=k("li"),this.h()},l(u){t=_(u,"NAV",{class:!0});var c=m(t);o=_(c,"UL",{class:!0});var g=m(o);e=_(g,"LI",{class:!0});var s=m(e);a=_(s,"A",{href:!0,class:!0,"aria-current":!0});var h=m(a);i=Q(h,w),h.forEach(v),s.forEach(v),p=E(g),l=_(g,"LI",{class:!0}),m(l).forEach(v),g.forEach(v),c.forEach(v),this.h()},h(){r(a,"href",Ft("about")),r(a,"class","block py-2 pr-4 pl-3 dark:text-gray-500 dark:hover:text-white font-bold"),r(a,"aria-current","page"),r(e,"class","md:ml-2"),r(l,"class","md:ml-2"),r(o,"class","list-reset md:flex md:items-center"),r(t,"class","")},m(u,c){D(u,t,c),b(t,o),b(o,e),b(e,a),b(a,i),b(o,p),b(o,l)},p(u,[c]){c&1&&w!==(w=u[0]("nav_about")+"")&&_t(i,w)},i:T,o:T,d(u){u&&v(t)}}}function tr(n,t,o){let e;return P(n,et,a=>o(0,e=a)),[e]}class rr extends O{constructor(t){super(),U(this,t,tr,Zt,W,{})}}const or=()=>{const n=At("__svelte__");return{page:{subscribe:n.page.subscribe},navigating:{subscribe:n.navigating.subscribe},get preloading(){return console.error("stores.preloading is deprecated; use stores.navigating instead"),{subscribe:n.navigating.subscribe}},session:n.session,updated:n.updated}},jt={subscribe(n){return or().page.subscribe(n)}};function er(n){let t,o,e,a,w,i,p,l,u,c,g,s,h,x,y,d,f,$,F,B,Z,at,Ct={};return d=new Qt({props:Ct}),n[3](d),d.$on("wiki-search",n[4]),d.$on("lang-change",n[5]),F=new rr({}),{c(){t=k("header"),o=k("div"),e=k("div"),a=k("img"),i=z(),p=k("h1"),l=k("a"),u=K("Wiki Search"),c=z(),g=k("div"),s=k("button"),h=L("svg"),x=L("path"),y=z(),R(d.$$.fragment),f=z(),$=k("div"),R(F.$$.fragment),this.h()},l(j){t=_(j,"HEADER",{class:!0});var Y=m(t);o=_(Y,"DIV",{class:!0});var S=m(o);e=_(S,"DIV",{class:!0});var J=m(e);a=_(J,"IMG",{alt:!0,width:!0,height:!0,class:!0,src:!0}),i=E(J),p=_(J,"H1",{class:!0});var it=m(p);l=_(it,"A",{class:!0,href:!0});var ct=m(l);u=Q(ct,"Wiki Search"),ct.forEach(v),it.forEach(v),J.forEach(v),c=E(S),g=_(S,"DIV",{class:!0});var nt=m(g);s=_(nt,"BUTTON",{class:!0});var gt=m(s);h=V(gt,"svg",{class:!0,"x-show":!0,fill:!0,"stroke-linecap":!0,"stroke-linejoin":!0,"stroke-width":!0,viewBox:!0,stroke:!0});var dt=m(h);x=V(dt,"path",{d:!0}),m(x).forEach(v),dt.forEach(v),gt.forEach(v),nt.forEach(v),S.forEach(v),y=E(Y),q(d.$$.fragment,Y),f=E(Y),$=_(Y,"DIV",{class:!0});var lt=m($);q(F.$$.fragment,lt),lt.forEach(v),Y.forEach(v),this.h()},h(){r(a,"alt","logo"),r(a,"width","54"),r(a,"height","54"),r(a,"class","pr-2"),Et(a.src,w="https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/155px-Wikipedia-logo-v2.svg.png")||r(a,"src",w),r(l,"class","no-underline text-grey-darkest hover:text-black dark:text-white dark:hover:text-cyan-300"),r(l,"href",Ft("/")),r(p,"class","leading-none text-2xl text-grey-darkest flex-grow mt-2"),r(e,"class","flex justify-center cursor-pointer align-middle"),r(x,"d","M4 6h16M4 12h16M4 18h16"),r(h,"class","w-6 h-6 text-white hover:text-green-500 "),r(h,"x-show","!showMenu"),r(h,"fill","none"),r(h,"stroke-linecap","round"),r(h,"stroke-linejoin","round"),r(h,"stroke-width","2"),r(h,"viewBox","0 0 24 24"),r(h,"stroke","currentColor"),r(s,"class","outline-none mobile-menu-button"),r(g,"class","md:hidden sm:flex"),r(o,"class","flex items-center mb-4 md:mb-0"),r($,"class","mobile-menu hidden md:flex items-center space-x-3 "),r(t,"class","w-full border-b md:flex justify-between md:items-center p-4 pb-0 shadow-lg md:pb-4 dark:bg-gray-800 bg-white")},m(j,Y){D(j,t,Y),b(t,o),b(o,e),b(e,a),b(e,i),b(e,p),b(p,l),b(l,u),b(o,c),b(o,g),b(g,s),b(s,h),b(h,x),b(t,y),H(d,t,null),b(t,f),b(t,$),H(F,$,null),B=!0,Z||(at=[A(e,"click",n[2]),A(s,"click",n[1])],Z=!0)},p(j,[Y]){const S={};d.$set(S)},i(j){B||(C(d.$$.fragment,j),C(F.$$.fragment,j),B=!0)},o(j){I(d.$$.fragment,j),I(F.$$.fragment,j),B=!1},d(j){j&&v(t),n[3](null),G(d),G(F),Z=!1,ot(at)}}}function ar(n,t,o){let e,a;jt.subscribe(c=>a=c);const w=()=>{document.querySelector(".mobile-menu").classList.toggle("hidden")},i=()=>{Rt.set([]),e.clear(),Dt(a)};function p(c){Yt[c?"unshift":"push"](()=>{e=c,o(0,e)})}function l(c){tt.call(this,n,c)}function u(c){tt.call(this,n,c)}return[e,w,i,p,l,u]}class ir extends O{constructor(t){super(),U(this,t,ar,er,W,{})}}function cr(n){let t,o,e,a,w,i,p,l,u,c,g,s,h,x,y;return{c(){t=k("div"),o=k("div"),e=z(),a=k("div"),w=z(),i=k("div"),p=z(),l=k("div"),u=z(),c=k("div"),g=z(),s=k("div"),h=z(),x=k("img"),this.h()},l(d){t=_(d,"DIV",{class:!0});var f=m(t);o=_(f,"DIV",{class:!0}),m(o).forEach(v),e=E(f),a=_(f,"DIV",{class:!0}),m(a).forEach(v),w=E(f),i=_(f,"DIV",{class:!0}),m(i).forEach(v),p=E(f),l=_(f,"DIV",{class:!0}),m(l).forEach(v),u=E(f),c=_(f,"DIV",{class:!0}),m(c).forEach(v),g=E(f),s=_(f,"DIV",{class:!0}),m(s).forEach(v),h=E(f),x=_(f,"IMG",{alt:!0,width:!0,height:!0,src:!0}),f.forEach(v),this.h()},h(){r(o,"class","blue-orbit leo svelte-ag8793"),r(a,"class","green-orbit leo svelte-ag8793"),r(i,"class","red-orbit leo svelte-ag8793"),r(l,"class","white-orbit w1 leo svelte-ag8793"),r(c,"class","white-orbit w2 leo svelte-ag8793"),r(s,"class","white-orbit w3 leo svelte-ag8793"),r(x,"alt","logo"),r(x,"width","20"),r(x,"height","20"),Et(x.src,y="https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/155px-Wikipedia-logo-v2.svg.png")||r(x,"src",y),r(t,"class","spinner-box absolute left-2/4 top-2/4 -ml-20 -mt-20 svelte-ag8793")},m(d,f){D(d,t,f),b(t,o),b(t,e),b(t,a),b(t,w),b(t,i),b(t,p),b(t,l),b(t,u),b(t,c),b(t,g),b(t,s),b(t,h),b(t,x)},p:T,i:T,o:T,d(d){d&&v(t)}}}class nr extends O{constructor(t){super(),U(this,t,null,cr,W,{})}}const{document:ft}=Mt,gr=n=>({}),mt=n=>({class:"h-full"});function xt(n){let t,o,e,a,w,i;return a=new nr({}),{c(){t=k("div"),o=k("div"),e=z(),R(a.$$.fragment),this.h()},l(p){t=_(p,"DIV",{class:!0});var l=m(t);o=_(l,"DIV",{class:!0}),m(o).forEach(v),e=E(l),q(a.$$.fragment,l),l.forEach(v),this.h()},h(){r(o,"class","w-full h-full bg-slate-800 opacity-80"),r(t,"class","fixed w-screen h-screen z-40")},m(p,l){D(p,t,l),b(t,o),b(t,e),H(a,t,null),i=!0},i(p){i||(C(a.$$.fragment,p),w||$t(()=>{w=Nt(t,Wt(Pt),{}),w.start()}),i=!0)},o(p){I(a.$$.fragment,p),i=!1},d(p){p&&v(t),G(a)}}}function kt(n){let t,o,e,a,w,i,p,l,u,c,g,s,h;e=new ir({}),e.$on("wiki-search",n[3]),e.$on("lang-change",n[4]);const x=n[7].default,y=Xt(x,n,n[6],mt);return{c(){t=k("main"),o=k("div"),R(e.$$.fragment),w=z(),y&&y.c(),i=z(),p=k("button"),l=L("svg"),u=L("path"),this.h()},l(d){t=_(d,"MAIN",{class:!0});var f=m(t);o=_(f,"DIV",{class:!0});var $=m(o);q(e.$$.fragment,$),$.forEach(v),w=E(f),y&&y.l(f),i=E(f),p=_(f,"BUTTON",{type:!0,"data-mdb-ripple":!0,"data-mdb-ripple-color":!0,class:!0,id:!0});var F=m(p);l=V(F,"svg",{"aria-hidden":!0,focusable:!0,"data-prefix":!0,class:!0,role:!0,xmlns:!0,viewBox:!0});var B=m(l);u=V(B,"path",{fill:!0,d:!0}),m(u).forEach(v),B.forEach(v),F.forEach(v),f.forEach(v),this.h()},h(){r(o,"class",a=(n[0]>120?"fixed top-0":"relative")+" w-full transition-transform"),r(u,"fill","currentColor"),r(u,"d","M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"),r(l,"aria-hidden","true"),r(l,"focusable","false"),r(l,"data-prefix","fas"),r(l,"class","w-4 h-4"),r(l,"role","img"),r(l,"xmlns","http://www.w3.org/2000/svg"),r(l,"viewBox","0 0 448 512"),r(p,"type","button"),r(p,"data-mdb-ripple","true"),r(p,"data-mdb-ripple-color","light"),r(p,"class",c=(n[0]>100?"inline-block":"hidden")+" p-3 fixed bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out bottom-5 right-5 dark:bg-cyan-500 dark:hover:bg-cyan-700 dark:focus:bg-cyan-700 dark:active:bg-cyan-800"),r(p,"id","btn-back-to-top"),r(t,"class","dark:bg-gray-800 bg-gray-100 min-h-screen")},m(d,f){D(d,t,f),b(t,o),H(e,o,null),b(t,w),y&&y.m(t,null),b(t,i),b(t,p),b(p,l),b(l,u),g=!0,s||(h=A(p,"click",n[5]),s=!0)},p(d,f){(!g||f&1&&a!==(a=(d[0]>120?"fixed top-0":"relative")+" w-full transition-transform"))&&r(o,"class",a),y&&y.p&&(!g||f&64)&&Lt(y,x,d,d[6],g?Tt(x,d[6],f,gr):Vt(d[6]),mt),(!g||f&1&&c!==(c=(d[0]>100?"inline-block":"hidden")+" p-3 fixed bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out bottom-5 right-5 dark:bg-cyan-500 dark:hover:bg-cyan-700 dark:focus:bg-cyan-700 dark:active:bg-cyan-800"))&&r(p,"class",c)},i(d){g||(C(e.$$.fragment,d),C(y,d),g=!0)},o(d){I(e.$$.fragment,d),I(y,d),g=!1},d(d){d&&v(t),G(e),y&&y.d(d),s=!1,h()}}}function dr(n){let t=!1,o=()=>{t=!1},e,a,w,i,p,l,u;$t(n[8]);let c=(n[1].loading||n[2])&&xt(),g=!n[2]&&kt(n);return{c(){c&&c.c(),a=z(),g&&g.c(),w=z(),i=z(),this.h()},l(s){c&&c.l(s),a=E(s),g&&g.l(s),w=E(s),i=E(s),St('[data-svelte="svelte-1f43glv"]',ft.head).forEach(v),this.h()},h(){ft.title="Svelte Wikipedia Search"},m(s,h){c&&c.m(s,h),D(s,a,h),g&&g.m(s,h),D(s,w,h),D(s,i,h),p=!0,l||(u=A(window,"scroll",()=>{t=!0,clearTimeout(e),e=setTimeout(o,100),n[8]()}),l=!0)},p(s,[h]){h&1&&!t&&(t=!0,clearTimeout(e),scrollTo(window.pageXOffset,s[0]),e=setTimeout(o,100)),s[1].loading||s[2]?c?h&6&&C(c,1):(c=xt(),c.c(),C(c,1),c.m(a.parentNode,a)):c&&(bt(),I(c,1,1,()=>{c=null}),st()),s[2]?g&&(bt(),I(g,1,1,()=>{g=null}),st()):g?(g.p(s,h),h&4&&C(g,1)):(g=kt(s),g.c(),C(g,1),g.m(w.parentNode,w))},i(s){p||(C(c),C(g),p=!0)},o(s){I(c),I(g),p=!1},d(s){c&&c.d(s),s&&v(a),g&&g.d(s),s&&v(w),s&&v(i),l=!1,u()}}}function lr(n,t,o){let e,a;P(n,rt,d=>o(11,e=d)),P(n,vt,d=>o(2,a=d));let{$$slots:w={},$$scope:i}=t;N("de",()=>M(()=>import("../chunks/de-52f06e9b.js"),[])),N("en",()=>M(()=>import("../chunks/en-b6912cb9.js"),[])),N("es",()=>M(()=>import("../chunks/es-3c016c06.js"),[])),N("fr",()=>M(()=>import("../chunks/fr-00270f4f.js"),[])),N("it",()=>M(()=>import("../chunks/it-2addf9e4.js"),[])),N("pt",()=>M(()=>import("../chunks/pt-1b01c7d6.js"),[]));let p=Ot();Ut({fallbackLocale:"en",initialLocale:p}),vt.subscribe(d=>{if(!d){let f=e;f&&(X.language=f.split("-")[0],console.log("WikiApiClient.language",X.language))}});let l=0,u={};jt.subscribe(d=>u=d);let c={loading:!1};X.state.subscribe(d=>o(1,c=d));const g=d=>{x(),X.search(d.detail)},s=d=>{x(),X.setLanguage(d.detail)},h=()=>{document.body.scrollIntoView()},x=()=>{h(),Dt(u)};function y(){o(0,l=window.pageYOffset)}return n.$$set=d=>{"$$scope"in d&&o(6,i=d.$$scope)},[l,c,a,g,s,h,i,w,y]}class ur extends O{constructor(t){super(),U(this,t,lr,dr,W,{})}}export{ur as default};