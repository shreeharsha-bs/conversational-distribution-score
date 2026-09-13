'use strict';
const $ = (id) => document.getElementById(id);
let sections = [];
const shortNames = {'paper-figures':'Paper figures','group-distributions':'Group distributions','cds-correlations':'CDS correlations','pair-preferences':'Conversation pairs','system-ordering':'System ordering','system-comparisons':'Six system comparisons','conversation-clouds':'Conversation clouds','anchor-distances':'Distances to anchors','weighting':'Weighting ablation','feature-removal':'Feature ablation','ttsds2-correlations':'TTSDS2 correlations','ttsds2-pooled-clouds':'TTSDS2 reference clouds','linguistic-correlations':'Linguistic features','nli-control':'Actual vs shuffled replies','caller-duration':'Callers and duration','pair-diagnostics':'System-pair diagnostics'};
function element(tag, attrs = {}, text) { const n = document.createElement(tag); for (const [k,v] of Object.entries(attrs)) n.setAttribute(k,v); if(text != null)n.textContent=text; return n; }
function download(label, href) {return element('a',{class:'download-link',href,download:''},label);}
function parseHash(){let parts=decodeURIComponent(location.hash.slice(1)).split('/');return {section:parts[0],variant:parts[1]};}
function selectSection(id, variantId, updateHash=false){
 const section=sections.find(s=>s.id===id)||sections[0];
 if(!section)return;
 const variant=section.variants.find(v=>v.id===variantId)||section.variants[0];
 $('collection').value=section.id;
 $('variant').replaceChildren(...section.variants.map(v=>element('option',{value:v.id},v.label)));
 $('variant').value=variant.id;
 $('results-title').textContent=section.title;
 $('collection-kicker').textContent='Results';
 $('collection-count').textContent=`${section.variants.length} ${section.variants.length===1?'view':'views'}`;
 $('plot-lead').textContent=section.lead||'';
 $('plot-image').alt=`${variant.label}. ${variant.alt||variant.meta||section.lead||section.title}`;
 $('plot-image').src=variant.png;
 $('large-plot').href=variant.png;
 $('large-plot').setAttribute('aria-label',`Open ${variant.label} at full size`);
 $('plot-meta').textContent=variant.meta||'';
 $('plot-notes').replaceChildren(...[...(section.notes||[]),...(variant.notes||[])].map(note=>element('li',{},note)));
 $('interpretation').hidden=!$('plot-notes').children.length;
 const dl=[]; if(variant.pdf)dl.push(download('Download PDF',variant.pdf));if(variant.png)dl.push(download('Download PNG',variant.png));if(variant.svg)dl.push(download('Download SVG',variant.svg));
 dl.push(element('a',{class:'download-link',href:variant.png,target:'_blank',rel:'noopener'},'Open full size'));
 $('plot-downloads').replaceChildren(...dl);
 $('plot-stats').replaceChildren(...(variant.stats||[]).map(s=>{const n=element('div',{class:'stat'});n.append(element('span',{},s.label),element('strong',{},String(s.value)));return n;}));
 $('data-downloads').replaceChildren(...[...(section.downloads||[]),...(variant.downloads||[])].map(d=>download(d.label,d.href)));
 $('tables').replaceChildren();
 for(const t of [...(section.tables||[]),...(variant.tables||[])]){
  const block=element('section',{class:'table-block'});if(t.title)block.append(element('h3',{},t.title));
  const scroll=element('div',{class:'table-scroll',tabindex:'0','aria-label':t.title||'Results table'}),table=element('table');
  const head=element('thead'),hr=element('tr');const cols=t.columns.map(c=>typeof c==='string'?{key:c,label:c}:c);cols.forEach(c=>hr.append(element('th',{scope:'col'},c.label)));head.append(hr);table.append(head);
  const body=element('tbody');t.rows.forEach(r=>{const tr=element('tr');cols.forEach((c,i)=>tr.append(element('td',{},String(Array.isArray(r)?(r[i]??''):(r[c.key]??'')))));body.append(tr)});table.append(body);scroll.append(table);block.append(scroll);$('tables').append(block);
 }
 document.querySelectorAll('.nav-link').forEach(n=>{const active=n.dataset.id===section.id;n.classList.toggle('active',active);if(active)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');});
 $('plot-content').setAttribute('aria-busy','false');
 document.title=`${shortNames[section.id]||section.title} — Conversational Distribution Score`;
 if(updateHash)history.replaceState(null,'',`#${section.id}/${variant.id}`);
}
async function init(){
 try{
  const response=await fetch('catalog.json?v=20260913-2');if(!response.ok)throw new Error('Results catalogue could not be loaded.');
  const data=await response.json();sections=(Array.isArray(data)?data:data.sections).sort((a,b)=>a.order-b.order);
  $('collection').replaceChildren(...sections.map(s=>element('option',{value:s.id},`${String(s.order).padStart(2,'0')} · ${s.title}`)));
  $('section-nav').replaceChildren(...sections.map(s=>{const a=element('a',{class:'nav-link',href:`#${s.id}`,'data-id':s.id});a.append(element('span',{class:'num'},String(s.order).padStart(2,'0')),element('span',{},shortNames[s.id]||s.title));a.addEventListener('click',()=>{$('explorer').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});});return a;}));
  $('collection').addEventListener('change',()=>selectSection($('collection').value,null,true));
  $('variant').addEventListener('change',()=>selectSection($('collection').value,$('variant').value,true));
  addEventListener('hashchange',()=>{const h=parseHash();if(sections.some(s=>s.id===h.section))selectSection(h.section,h.variant);});
  $('plot-image').addEventListener('error',()=>{$('plot-meta').textContent='The image could not be loaded. Please reload the page or use the PDF download.';});
  const h=parseHash();selectSection(h.section,h.variant);
 }catch(error){$('plot-content').setAttribute('aria-busy','false');$('plot-lead').className='error';$('plot-lead').textContent=`${error.message} Please reload this page.`;}
}
init();
