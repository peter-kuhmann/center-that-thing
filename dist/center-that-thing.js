const _ctt_centeredElements=new Map;let _ctt_previousWindowWidth=window.innerWidth;const _ctt_autoDiscoveryBlackListedElements=new Set;let _ctt_autoDiscoveryMutationObserver=null;function centerThatThing(t,e={collisionDetection:!1}){let n=null;if(null===(n="string"==typeof t?document.querySelector(t):t))throw new Error("Element could not be found (invalid selector) or is null. Was: "+t);_ctt_autoDiscoveryBlackListedElements.add(n),_ctt_centeredElements.set(n,e),_ctt_updateElement(n,e);const o=new ResizeObserver(()=>{_ctt_updateElement(n,e)});function r(){o.disconnect(),_ctt_centeredElements.delete(n),_ctt_resetElement(n)}return o.observe(n,{box:"border-box"}),n.parentElement&&o.observe(n.parentElement,{box:"border-box"}),n._ctt_cleanup=r}function uncenterThatThing(t){"function"==typeof t._ctt_cleanup&&t._ctt_cleanup()}function getCenterThatThingElementsAndOptions(){return Array.from(_ctt_centeredElements.keys()).map(t=>({element:t,options:_ctt_centeredElements.get(t)}))}function enableCenterThatThingDynamicDiscovery(){_ctt_autoDiscoveryMutationObserver||(_ctt_autoDiscoveryMutationObserver=new MutationObserver(_ctt_autoDiscovery)).observe(document.body,{subtree:!0,childList:!0})}function _ctt_updateElement(n,o){var r=window.innerWidth,{x:i,width:c}=n.getBoundingClientRect(),i=i-(n._ctt_offsetX??0);let l=Math.floor((r-c)/2-i);r=i+l;if(n._ctt_old_position||(n._ctt_old_position=n.style.position,n.style.position="relative"),"siblings"===o.collisionDetection){var s,o=n.previousElementSibling,a=n.nextElementSibling;let t=0,e=(o&&({x:o,width:s}=o.getBoundingClientRect(),t=o+s+1),1/0);a&&(o=a.getBoundingClientRect()["x"],e=o-1),r<t?l+=t-r:r+c>e&&(l=e-c-i)}n._ctt_offsetX=l,n.style.left=l+"px"}function _ctt_resetElement(t){t.style.position=t._ctt_old_position,t.style.left="0px"}function _ctt_updateAllElements(){for(const t of _ctt_centeredElements.keys())_ctt_updateElement(t,_ctt_centeredElements.get(t))}function _ctt_autoDiscovery(){let e=[],n=(e.push(...Array.from(document.querySelectorAll("*[data-ctt-enable='true']")).filter(t=>!_ctt_centeredElements.has(t)).map(t=>{return{element:t,options:{collisionDetection:t.dataset.cttCollisionDetection??!1}}})),(getComputedStyle(document.documentElement).getPropertyValue("--center-that-thing")??"").trim().replaceAll('\\"','"'));if(0<(n=n.startsWith('"')||n.startsWith("'")?n.substring(1,n.length-1):n).length){let t=[];try{t=JSON.parse(n)}catch(t){throw new Error("Could not parse '--center-that-thing' CSS variable: "+(t.msg??t))}if(!Array.isArray(t))throw new Error("Value of '--center-that-thing' CSS var was not a JSON array.");for(const r of t)try{if(!r?.selector)throw new Error("CenterThatThing CSS variable declaration contained an element without a 'selector' prop: "+i);const i=document.querySelector(r.selector);if(!i)throw new Error("Element could not be found by selector defined in CSS var '--center-that-thing'. Selector was: "+i.selector);var o={...r};delete o.selector,e.push({element:i,options:o})}catch(t){console.error("Got malformed CenterThatThing CSS var element: "+(t?.msg??t))}}(e=e.filter(t=>!_ctt_autoDiscoveryBlackListedElements.has(t.element))).forEach(t=>{centerThatThing(t.element,t.options)})}window.addEventListener("resize",()=>{var t=window.innerWidth;t!==_ctt_previousWindowWidth&&setTimeout(_ctt_updateAllElements,0),_ctt_previousWindowWidth=t}),"complete"===document.readyState?_ctt_autoDiscovery():document.addEventListener("DOMContentLoaded",function(){_ctt_autoDiscovery()});