function k(){}const X=t=>t;function vt(t,e){for(const n in e)t[n]=e[n];return t}function lt(t){return t()}function rt(){return Object.create(null)}function A(t){t.forEach(lt)}function q(t){return typeof t=="function"}function Gt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let T;function Jt(t,e){return T||(T=document.createElement("a")),T.href=e,t===T.href}function kt(t){return Object.keys(t).length===0}function at(t,...e){if(t==null)return k;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Kt(t){let e;return at(t,n=>e=n)(),e}function Qt(t,e,n){t.$$.on_destroy.push(at(e,n))}function Ut(t,e,n,i){if(t){const r=ut(t,e,n,i);return t[0](r)}}function ut(t,e,n,i){return t[1]&&i?vt(n.ctx.slice(),t[1](i(e))):n.ctx}function Vt(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const c=[],s=Math.max(e.dirty.length,r.length);for(let l=0;l<s;l+=1)c[l]=e.dirty[l]|r[l];return c}return e.dirty|r}return e.dirty}function Xt(t,e,n,i,r,c){if(r){const s=ut(e,n,i,c);t.p(s,r)}}function Yt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function Zt(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function te(t){return t==null?"":t}function ee(t){return t&&q(t.destroy)?t.destroy:k}const ft=typeof window!="undefined";let Y=ft?()=>window.performance.now():()=>Date.now(),Z=ft?t=>requestAnimationFrame(t):k;const S=new Set;function dt(t){S.forEach(e=>{e.c(t)||(S.delete(e),e.f())}),S.size!==0&&Z(dt)}function tt(t){let e;return S.size===0&&Z(dt),{promise:new Promise(n=>{S.add(e={c:t,f:n})}),abort(){S.delete(e)}}}let J=!1;function Et(){J=!0}function At(){J=!1}function St(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function Ct(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const o=[];for(let a=0;a<e.length;a++){const d=e[a];d.claim_order!==void 0&&o.push(d)}e=o}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let o=0;o<e.length;o++){const a=e[o].claim_order,d=(r>0&&e[n[r]].claim_order<=a?r+1:St(1,r,u=>e[n[u]].claim_order,a))-1;i[o]=n[d]+1;const f=d+1;n[f]=o,r=Math.max(f,r)}const c=[],s=[];let l=e.length-1;for(let o=n[r]+1;o!=0;o=i[o-1]){for(c.push(e[o-1]);l>=o;l--)s.push(e[l]);l--}for(;l>=0;l--)s.push(e[l]);c.reverse(),s.sort((o,a)=>o.claim_order-a.claim_order);for(let o=0,a=0;o<s.length;o++){for(;a<c.length&&s[o].claim_order>=c[a].claim_order;)a++;const d=a<c.length?c[a]:null;t.insertBefore(s[o],d)}}function _t(t,e){t.appendChild(e)}function ht(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function Nt(t){const e=et("style");return Mt(ht(t),e),e.sheet}function Mt(t,e){_t(t.head||t,e)}function jt(t,e){if(J){for(Ct(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentElement!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function ne(t,e,n){J&&!n?jt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function mt(t){t.parentNode.removeChild(t)}function ie(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function et(t){return document.createElement(t)}function zt(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function nt(t){return document.createTextNode(t)}function se(){return nt(" ")}function re(){return nt("")}function ot(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function oe(t){return function(e){return e.preventDefault(),t.call(this,e)}}function ce(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function Dt(t){return Array.from(t.childNodes)}function qt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function pt(t,e,n,i,r=!1){qt(t);const c=(()=>{for(let s=t.claim_info.last_index;s<t.length;s++){const l=t[s];if(e(l)){const o=n(l);return o===void 0?t.splice(s,1):t[s]=o,r||(t.claim_info.last_index=s),l}}for(let s=t.claim_info.last_index-1;s>=0;s--){const l=t[s];if(e(l)){const o=n(l);return o===void 0?t.splice(s,1):t[s]=o,r?o===void 0&&t.claim_info.last_index--:t.claim_info.last_index=s,l}}return i()})();return c.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,c}function yt(t,e,n,i){return pt(t,r=>r.nodeName===e,r=>{const c=[];for(let s=0;s<r.attributes.length;s++){const l=r.attributes[s];n[l.name]||c.push(l.name)}c.forEach(s=>r.removeAttribute(s))},()=>i(e))}function le(t,e,n){return yt(t,e,n,et)}function ae(t,e,n){return yt(t,e,n,zt)}function Pt(t,e){return pt(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>nt(e),!0)}function ue(t){return Pt(t," ")}function fe(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function de(t,e){t.value=e==null?"":e}function _e(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}let O;function Rt(){if(O===void 0){O=!1;try{typeof window!="undefined"&&window.parent&&window.parent.document}catch{O=!0}}return O}function he(t,e){getComputedStyle(t).position==="static"&&(t.style.position="relative");const i=et("iframe");i.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),i.setAttribute("aria-hidden","true"),i.tabIndex=-1;const r=Rt();let c;return r?(i.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",c=ot(window,"message",s=>{s.source===i.contentWindow&&e()})):(i.src="about:blank",i.onload=()=>{c=ot(i.contentWindow,"resize",e)}),_t(t,i),()=>{(r||c&&i.contentWindow)&&c(),mt(i)}}function me(t,e,n){t.classList[n?"add":"remove"](e)}function gt(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const r=document.createEvent("CustomEvent");return r.initCustomEvent(t,n,i,e),r}function pe(t,e=document.body){return Array.from(e.querySelectorAll(t))}const F=new Map;let I=0;function Tt(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function Ot(t,e){const n={stylesheet:Nt(e),rules:{}};return F.set(t,n),n}function H(t,e,n,i,r,c,s,l=0){const o=16.666/i;let a=`{
`;for(let m=0;m<=1;m+=o){const g=e+(n-e)*c(m);a+=m*100+`%{${s(g,1-g)}}
`}const d=a+`100% {${s(n,1-n)}}
}`,f=`__svelte_${Tt(d)}_${l}`,u=ht(t),{stylesheet:_,rules:h}=F.get(u)||Ot(u,t);h[f]||(h[f]=!0,_.insertRule(`@keyframes ${f} ${d}`,_.cssRules.length));const y=t.style.animation||"";return t.style.animation=`${y?`${y}, `:""}${f} ${i}ms linear ${r}ms 1 both`,I+=1,f}function G(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?c=>c.indexOf(e)<0:c=>c.indexOf("__svelte")===-1),r=n.length-i.length;r&&(t.style.animation=i.join(", "),I-=r,I||Lt())}function Lt(){Z(()=>{I||(F.forEach(t=>{const{stylesheet:e}=t;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.rules={}}),F.clear())})}let D;function z(t){D=t}function N(){if(!D)throw new Error("Function called outside component initialization");return D}function ye(t){N().$$.on_mount.push(t)}function ge(t){N().$$.after_update.push(t)}function be(t){N().$$.on_destroy.push(t)}function we(){const t=N();return(e,n,{cancelable:i=!1}={})=>{const r=t.$$.callbacks[e];if(r){const c=gt(e,n,{cancelable:i});return r.slice().forEach(s=>{s.call(t,c)}),!c.defaultPrevented}return!0}}function $e(t,e){return N().$$.context.set(t,e),e}function xe(t){return N().$$.context.get(t)}function ve(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(i=>i.call(this,e))}const j=[],ct=[],W=[],U=[],bt=Promise.resolve();let V=!1;function wt(){V||(V=!0,bt.then($t))}function ke(){return wt(),bt}function C(t){W.push(t)}function Ee(t){U.push(t)}const Q=new Set;let L=0;function $t(){const t=D;do{for(;L<j.length;){const e=j[L];L++,z(e),Wt(e.$$)}for(z(null),j.length=0,L=0;ct.length;)ct.pop()();for(let e=0;e<W.length;e+=1){const n=W[e];Q.has(n)||(Q.add(n),n())}W.length=0}while(j.length);for(;U.length;)U.pop()();V=!1,Q.clear(),z(t)}function Wt(t){if(t.fragment!==null){t.update(),A(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(C)}}let M;function it(){return M||(M=Promise.resolve(),M.then(()=>{M=null})),M}function E(t,e,n){t.dispatchEvent(gt(`${e?"intro":"outro"}${n}`))}const B=new Set;let v;function Ae(){v={r:0,c:[],p:v}}function Se(){v.r||A(v.c),v=v.p}function xt(t,e){t&&t.i&&(B.delete(t),t.i(e))}function Bt(t,e,n,i){if(t&&t.o){if(B.has(t))return;B.add(t),v.c.push(()=>{B.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}}const st={duration:0};function Ce(t,e,n){let i=e(t,n),r=!1,c,s,l=0;function o(){c&&G(t,c)}function a(){const{delay:f=0,duration:u=300,easing:_=X,tick:h=k,css:y}=i||st;y&&(c=H(t,0,1,u,f,_,y,l++)),h(0,1);const m=Y()+f,g=m+u;s&&s.abort(),r=!0,C(()=>E(t,!0,"start")),s=tt(b=>{if(r){if(b>=g)return h(1,0),E(t,!0,"end"),o(),r=!1;if(b>=m){const w=_((b-m)/u);h(w,1-w)}}return r})}let d=!1;return{start(){d||(d=!0,G(t),q(i)?(i=i(),it().then(a)):a())},invalidate(){d=!1},end(){r&&(o(),r=!1)}}}function Ne(t,e,n){let i=e(t,n),r=!0,c;const s=v;s.r+=1;function l(){const{delay:o=0,duration:a=300,easing:d=X,tick:f=k,css:u}=i||st;u&&(c=H(t,1,0,a,o,d,u));const _=Y()+o,h=_+a;C(()=>E(t,!1,"start")),tt(y=>{if(r){if(y>=h)return f(0,1),E(t,!1,"end"),--s.r||A(s.c),!1;if(y>=_){const m=d((y-_)/a);f(1-m,m)}}return r})}return q(i)?it().then(()=>{i=i(),l()}):l(),{end(o){o&&i.tick&&i.tick(1,0),r&&(c&&G(t,c),r=!1)}}}function Me(t,e,n,i){let r=e(t,n),c=i?0:1,s=null,l=null,o=null;function a(){o&&G(t,o)}function d(u,_){const h=u.b-c;return _*=Math.abs(h),{a:c,b:u.b,d:h,duration:_,start:u.start,end:u.start+_,group:u.group}}function f(u){const{delay:_=0,duration:h=300,easing:y=X,tick:m=k,css:g}=r||st,b={start:Y()+_,b:u};u||(b.group=v,v.r+=1),s||l?l=b:(g&&(a(),o=H(t,c,u,h,_,y,g)),u&&m(0,1),s=d(b,h),C(()=>E(t,u,"start")),tt(w=>{if(l&&w>l.start&&(s=d(l,h),l=null,E(t,s.b,"start"),g&&(a(),o=H(t,c,s.b,s.duration,0,y,r.css))),s){if(w>=s.end)m(c=s.b,1-c),E(t,s.b,"end"),l||(s.b?a():--s.group.r||A(s.group.c)),s=null;else if(w>=s.start){const P=w-s.start;c=s.a+s.d*y(P/s.duration),m(c,1-c)}}return!!(s||l)}))}return{run(u){q(r)?it().then(()=>{r=r(),f(u)}):f(u)},end(){a(),s=l=null}}}const je=typeof window!="undefined"?window:typeof globalThis!="undefined"?globalThis:global;function ze(t,e){t.d(1),e.delete(t.key)}function De(t,e){Bt(t,1,1,()=>{e.delete(t.key)})}function qe(t,e,n,i,r,c,s,l,o,a,d,f){let u=t.length,_=c.length,h=u;const y={};for(;h--;)y[t[h].key]=h;const m=[],g=new Map,b=new Map;for(h=_;h--;){const p=f(r,c,h),$=n(p);let x=s.get($);x?i&&x.p(p,e):(x=a($,p),x.c()),g.set($,m[h]=x),$ in y&&b.set($,Math.abs(h-y[$]))}const w=new Set,P=new Set;function K(p){xt(p,1),p.m(l,d),s.set(p.key,p),d=p.first,_--}for(;u&&_;){const p=m[_-1],$=t[u-1],x=p.key,R=$.key;p===$?(d=p.first,u--,_--):g.has(R)?!s.has(x)||w.has(x)?K(p):P.has(R)?u--:b.get(x)>b.get(R)?(P.add(x),K(p)):(w.add(R),u--):(o($,s),u--)}for(;u--;){const p=t[u];g.has(p.key)||o(p,s)}for(;_;)K(m[_-1]);return m}function Pe(t,e){const n={},i={},r={$$scope:1};let c=t.length;for(;c--;){const s=t[c],l=e[c];if(l){for(const o in s)o in l||(i[o]=1);for(const o in l)r[o]||(n[o]=l[o],r[o]=1);t[c]=l}else for(const o in s)r[o]=1}for(const s in i)s in n||(n[s]=void 0);return n}function Re(t){return typeof t=="object"&&t!==null?t:{}}function Te(t,e,n){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,n(t.$$.ctx[i]))}function Oe(t){t&&t.c()}function Le(t,e){t&&t.l(e)}function Ft(t,e,n,i){const{fragment:r,on_mount:c,on_destroy:s,after_update:l}=t.$$;r&&r.m(e,n),i||C(()=>{const o=c.map(lt).filter(q);s?s.push(...o):A(o),t.$$.on_mount=[]}),l.forEach(C)}function It(t,e){const n=t.$$;n.fragment!==null&&(A(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Ht(t,e){t.$$.dirty[0]===-1&&(j.push(t),wt(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function We(t,e,n,i,r,c,s,l=[-1]){const o=D;z(t);const a=t.$$={fragment:null,ctx:null,props:c,update:k,not_equal:r,bound:rt(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(o?o.$$.context:[])),callbacks:rt(),dirty:l,skip_bound:!1,root:e.target||o.$$.root};s&&s(a.root);let d=!1;if(a.ctx=n?n(t,e.props||{},(f,u,..._)=>{const h=_.length?_[0]:u;return a.ctx&&r(a.ctx[f],a.ctx[f]=h)&&(!a.skip_bound&&a.bound[f]&&a.bound[f](h),d&&Ht(t,f)),u}):[],a.update(),d=!0,A(a.before_update),a.fragment=i?i(a.ctx):!1,e.target){if(e.hydrate){Et();const f=Dt(e.target);a.fragment&&a.fragment.l(f),f.forEach(mt)}else a.fragment&&a.fragment.c();e.intro&&xt(t.$$.fragment),Ft(t,e.target,e.anchor,e.customElement),At(),$t()}z(o)}class Be{$destroy(){It(this,1),this.$destroy=k}$on(e,n){const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(e){this.$$set&&!kt(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{je as $,Re as A,It as B,vt as C,ke as D,k as E,at as F,A as G,q as H,xe as I,jt as J,ot as K,ie as L,zt as M,ae as N,Qt as O,we as P,de as Q,oe as R,Be as S,ve as T,Jt as U,ct as V,C as W,Xt as X,Yt as Y,Vt as Z,pe as _,Dt as a,Ce as a0,Ut as a1,X as a2,Ne as a3,Kt as a4,ee as a5,he as a6,Zt as a7,Y as a8,tt as a9,qe as aa,De as ab,Te as ac,Ee as ad,me as ae,ze as af,te as ag,Me as ah,be as ai,ce as b,le as c,mt as d,et as e,_e as f,ne as g,Pt as h,We as i,fe as j,se as k,re as l,ue as m,Ae as n,Bt as o,Se as p,xt as q,$e as r,Gt as s,nt as t,ge as u,ye as v,Oe as w,Le as x,Ft as y,Pe as z};
