import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const configured = Boolean(SUPABASE_URL?.trim() && SUPABASE_ANON_KEY?.trim());
const state = { client: null, user: null, fields: [], inquiries: [] };
const TYPES = ['text','email','tel','number','date','textarea','select','checkbox'];
const STATUSES = [
  {value:'new', de:'Neu'},
  {value:'in_progress', de:'In Bearbeitung'},
  {value:'closed', de:'Abgeschlossen'}
];
function esc(value='') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function message(text, error=false, target='#globalMessage') { const el=$(target); if(!el)return;el.textContent=text;el.classList.toggle('error',error); }
function show(id) { $(id).hidden=false; }
function hide(id) { $(id).hidden=true; }
function isAdminGrantError(err) { return Boolean(err && (err.code==='PGRST116'||/0 rows|permission|row-level/i.test(err.message||''))); }

async function start(){
  if(!configured){show('#setupAlert');hide('#loginPanel');return;}
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    state.client = createClient(SUPABASE_URL.trim(), SUPABASE_ANON_KEY.trim(), {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    const {data,error}=await state.client.auth.getSession();
    if(error)throw error;
    if(data.session) await onSignedIn(data.session);
    else show('#loginPanel');
  } catch(err){
    console.error(err);show('#setupAlert');message('Supabase-Client konnte nicht geladen werden. Prüfe die Internetverbindung und supabase-config.js.',true);
  }
}

async function onSignedIn(session){
  hide('#loginPanel');hide('#noAdminPanel');
  const user=session.user;
  const {data:grant,error}=await state.client.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle();
  if(error){
    await state.client.auth.signOut();hide('#dashboard');show('#noAdminPanel');
    message('Adminrechte konnten nicht geprüft werden. Kontrolliere, ob schema.sql korrekt ausgeführt wurde.',true);console.error(error);return;
  }
  if(!grant){
    await state.client.auth.signOut();hide('#dashboard');show('#noAdminPanel');
    message('Dieses Konto hat keine Admin-Freigabe. Ergänze die eigene UUID manuell in admin_users.',true);return;
  }
  state.user=user;show('#dashboard');$('#signedInAs').textContent=`Angemeldet als ${user.email||user.id}`;
  await Promise.all([loadFields(),loadInquiries()]);
}

$('#loginForm').addEventListener('submit',async event=>{
  event.preventDefault();
  if(!state.client){message('Backend nicht konfiguriert.',true);return;}
  const button=$('button[type="submit"]',event.currentTarget);button.disabled=true;
  try{
    const {data,error}=await state.client.auth.signInWithPassword({email:$('#loginEmail').value.trim(),password:$('#loginPassword').value});
    if(error)throw error;
    if(data.session) await onSignedIn(data.session);
    message('Anmeldung geprüft.');
  }catch(err){message('Anmeldung fehlgeschlagen. Prüfe E-Mail, Passwort und Admin-Freigabe.',true);console.error(err);}
  finally{button.disabled=false;}
});
async function logout(){if(state.client)await state.client.auth.signOut();state.user=null;hide('#dashboard');show('#loginPanel');$('#loginPassword').value='';}
$('#logoutButton').addEventListener('click',logout);
$('#logoutNoAdmin').addEventListener('click',logout);
$('#refreshButton').addEventListener('click',async()=>{await Promise.all([loadFields(),loadInquiries()]);message('Daten aktualisiert.');});

$$('.tab').forEach(button=>button.addEventListener('click',()=>{
  $$('.tab').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});
  $$('.tab-panel').forEach(panel=>panel.hidden=panel.id!==`tab-${button.dataset.tab}`);
}));

async function loadFields(){
  const {data,error}=await state.client.from('form_fields').select('*').order('position',{ascending:true});
  if(error){message('Formularfelder konnten nicht geladen werden. Prüfe schema.sql und die RLS-Regeln.',true);console.error(error);return;}
  state.fields=data||[];renderFields();
}
function renderFields(){
  const host=$('#fieldsBody');
  if(!state.fields.length){host.innerHTML='<tr><td colspan="9">Noch keine Felder vorhanden. Nutze die SQL-Initialisierung oder füge ein Feld hinzu.</td></tr>';return;}
  host.innerHTML=state.fields.map((f,index)=>`<tr data-id="${esc(f.id)}" data-key="${esc(f.field_key)}">
    <td><input class="field-input key-input" value="${esc(f.field_key)}" readonly aria-label="Feld-ID"></td>
    <td><input class="field-input" data-prop="label_de" value="${esc(f.label_de||'')}" aria-label="Label Deutsch"></td>
    <td><input class="field-input" data-prop="label_en" value="${esc(f.label_en||'')}" aria-label="Label Englisch"></td>
    <td><select class="field-type" data-prop="input_type" aria-label="Feldtyp">${TYPES.map(t=>`<option value="${t}" ${f.input_type===t?'selected':''}>${t}</option>`).join('')}</select></td>
    <td><input type="checkbox" data-prop="is_required" ${f.is_required?'checked':''} aria-label="Pflichtfeld"></td>
    <td><input type="checkbox" data-prop="enabled" ${f.enabled?'checked':''} aria-label="Aktiv"></td>
    <td><input class="options-input" data-prop="options" value="${esc(Array.isArray(f.options)?f.options.join(', '):'')}" aria-label="Auswahloptionen"></td>
    <td><button class="move-button" data-move="up" ${index===0?'disabled':''}>↑</button> <button class="move-button" data-move="down" ${index===state.fields.length-1?'disabled':''}>↓</button></td>
    <td><button class="delete-button" data-delete="${esc(f.id)}" type="button">Löschen</button></td>
  </tr>`).join('');
  $$('[data-move]',host).forEach(btn=>btn.addEventListener('click',()=>moveField(btn.closest('tr').dataset.id,btn.dataset.move)));
  $$('[data-delete]',host).forEach(btn=>btn.addEventListener('click',()=>deleteField(btn.dataset.delete)));
}
function moveField(id,direction){
  const idx=state.fields.findIndex(f=>String(f.id)===String(id));const target=idx+(direction==='up'?-1:1);
  if(idx<0||target<0||target>=state.fields.length)return;
  [state.fields[idx],state.fields[target]]=[state.fields[target],state.fields[idx]];
  state.fields.forEach((f,i)=>f.position=i+1);renderFields();
}
async function deleteField(id){
  const field=state.fields.find(f=>String(f.id)===String(id));if(!field)return;
  if(!confirm(`Feld „${field.field_key}“ deaktivieren/löschen? Bereits gespeicherte Anfragen werden dadurch nicht gelöscht, aber die Spalte verschwindet eventuell aus der Formularansicht.`))return;
  const {error}=await state.client.from('form_fields').delete().eq('id',id);
  if(error){message('Feld konnte nicht gelöscht werden.',true);console.error(error);return;}
  state.fields=state.fields.filter(f=>String(f.id)!==String(id));state.fields.forEach((f,i)=>f.position=i+1);renderFields();message('Feld gelöscht.');
}
$('#newFieldForm').addEventListener('submit',event=>{
  event.preventDefault();const key=$('#newFieldKey').value.trim();
  if(!/^[a-z][a-z0-9_]{1,39}$/.test(key)){message('Die Feld-ID muss mit Kleinbuchstaben beginnen und darf nur Kleinbuchstaben, Zahlen und Unterstriche enthalten.',true);return;}
  if(state.fields.some(f=>f.field_key===key)){message('Diese Feld-ID existiert bereits.',true);return;}
  const type=$('#newFieldType').value;
  state.fields.push({id:`new-${crypto.randomUUID()}`,field_key:key,label_de:$('#newFieldLabelDe').value.trim(),label_en:$('#newFieldLabelEn').value.trim(),input_type:type,is_required:false,enabled:true,options:[],position:state.fields.length+1,isNew:true});
  renderFields();event.currentTarget.reset();message('Neues Feld hinzugefügt. Vergiss nicht, die Konfiguration zu speichern.');
});
$('#saveFieldsButton').addEventListener('click',saveFields);
async function saveFields(){
  const rows=$$('#fieldsBody tr[data-key]');if(!rows.length){message('Keine Felder zum Speichern vorhanden.',true);return;}
  const payload=[];
  for(let i=0;i<rows.length;i++){
    const row=rows[i];const old=state.fields.find(f=>f.field_key===row.dataset.key);if(!old)continue;
    const value=prop=>row.querySelector(`[data-prop="${prop}"]`);
    const type=value('input_type').value;
    const options=type==='select'?value('options').value.split(',').map(v=>v.trim()).filter(Boolean):[];
    if(type==='select'&&!options.length){message(`Für das Auswahlfeld „${old.field_key}“ muss mindestens eine Option angegeben werden.`,true);return;}
    const field={field_key:old.field_key,label_de:value('label_de').value.trim(),label_en:value('label_en').value.trim(),input_type:type,is_required:value('is_required').checked,enabled:value('enabled').checked,options,position:i+1};
    if(!field.label_de||!field.label_en){message(`Bitte beide Labels für „${field.field_key}“ ausfüllen.`,true);return;}
    if(old.id&&!String(old.id).startsWith('new-'))field.id=old.id;
    payload.push(field);
  }
  const button=$('#saveFieldsButton');button.disabled=true;
  try{
    const {error}=await state.client
  .from('form_fields')
  .upsert(payload,{
    onConflict: 'field_key',
    defaultToNull: false
  });
    if(error)throw error;
    await loadFields();message('Formular-Konfiguration gespeichert. Änderungen sind für neue Besucher aktiv.');message('Gespeichert.',false,'#fieldSaveMessage');
  }catch(err){console.error(err);message('Speichern fehlgeschlagen. Prüfe Datenbankrechte und Feld-ID.',true);}
  finally{button.disabled=false;}
}

async function loadInquiries(){
  const {data,error}=await state.client.from('inquiries').select('id,created_at,status,data').order('created_at',{ascending:false}).limit(500);
  if(error){message('Anfragen konnten nicht geladen werden. Prüfe die RLS-Policies.',true,'#requestsMessage');console.error(error);return;}
  state.inquiries=data||[];renderStats();renderInquiries();
}
function renderStats(){
  $('#totalCount').textContent=String(state.inquiries.length);
  $('#newCount').textContent=String(state.inquiries.filter(r=>r.status==='new').length);
  $('#progressCount').textContent=String(state.inquiries.filter(r=>r.status==='in_progress').length);
  $('#closedCount').textContent=String(state.inquiries.filter(r=>r.status==='closed').length);
}
function formatDate(value){if(!value)return'';const d=new Date(value);return Number.isNaN(d.getTime())?String(value):new Intl.DateTimeFormat('de-DE',{dateStyle:'short',timeStyle:'short'}).format(d);}
function displayValue(v){if(v===null||v===undefined)return'';if(typeof v==='boolean')return v?'Ja':'Nein';return String(v);}
function fieldsForExport(){
  const keys=[];for(const f of [...state.fields].sort((a,b)=>a.position-b.position)){if(!keys.includes(f.field_key))keys.push(f.field_key);}
  for(const row of state.inquiries){if(row.data&&typeof row.data==='object')for(const k of Object.keys(row.data)){if(!k.startsWith('_')&&!keys.includes(k))keys.push(k);}}
  return keys.map(key=>{const f=state.fields.find(item=>item.field_key===key);return {key,label:f?.label_de||key,labelEn:f?.label_en||key};});
}
function renderInquiries(){
  const table=$('#requestsTable');const head=$('thead',table);const body=$('tbody',table);const fields=fieldsForExport();
  const colHeaders=['Eingegangen','Status',...fields.map(f=>f.label)];
  head.innerHTML=`<tr><th>Vorgang</th>${colHeaders.map(h=>`<th>${esc(h)}</th>`).join('')}<th>Aktion</th></tr>`;
  if(!state.inquiries.length){body.innerHTML=`<tr><td colspan="${colHeaders.length+2}" class="subtle">Noch keine Anfragen gespeichert.</td></tr>`;$('#exportXlsxButton').disabled=true;return;}
  $('#exportXlsxButton').disabled=false;
  body.innerHTML=state.inquiries.map(row=>{
    const status=STATUSES.map(s=>`<option value="${s.value}" ${row.status===s.value?'selected':''}>${s.de}</option>`).join('');
    const cells=fields.map(f=>`<td class="${f.key==='message'?'message-cell':''}" title="${esc(displayValue(row.data?.[f.key]))}">${esc(displayValue(row.data?.[f.key]))}</td>`).join('');
    return `<tr data-id="${esc(row.id)}"><td><code>${esc(String(row.id).slice(0,8))}</code></td><td>${esc(formatDate(row.created_at))}</td><td><select class="status-select" data-status="${esc(row.id)}">${status}</select></td>${cells}<td><button type="button" class="delete-button" data-delete-request="${esc(row.id)}">Löschen</button></td></tr>`;
  }).join('');
  $$('[data-status]',body).forEach(el=>el.addEventListener('change',()=>updateStatus(el.dataset.status,el.value)));
  $$('[data-delete-request]',body).forEach(el=>el.addEventListener('click',()=>deleteInquiry(el.dataset.deleteRequest)));
}
async function updateStatus(id,status){
  if(!STATUSES.some(s=>s.value===status))return;
  const {error}=await state.client.from('inquiries').update({status}).eq('id',id);
  if(error){message('Status konnte nicht geändert werden.',true,'#requestsMessage');console.error(error);return;}
  const row=state.inquiries.find(r=>r.id===id);if(row)row.status=status;renderStats();message('Status aktualisiert.',false,'#requestsMessage');
}
async function deleteInquiry(id){
  if(!confirm('Diese Anfrage dauerhaft löschen? Diese Aktion lässt sich nicht rückgängig machen.'))return;
  const {error}=await state.client.from('inquiries').delete().eq('id',id);
  if(error){message('Anfrage konnte nicht gelöscht werden.',true,'#requestsMessage');console.error(error);return;}
  state.inquiries=state.inquiries.filter(r=>r.id!==id);renderStats();renderInquiries();message('Anfrage gelöscht.',false,'#requestsMessage');
}

$('#exportXlsxButton').addEventListener('click',exportExcel);
async function exportExcel(){
  if(!window.ExcelJS){message('Excel-Bibliothek konnte nicht geladen werden. Prüfe die Internetverbindung.',true,'#requestsMessage');return;}
  if(!state.inquiries.length){message('Keine Anfragen zum Exportieren.',true,'#requestsMessage');return;}
  const btn=$('#exportXlsxButton');btn.disabled=true;
  try{
    const ExcelJS=window.ExcelJS;const wb=new ExcelJS.Workbook();wb.creator='TechParts 3D';wb.subject='Anfragenexport';wb.title='TechParts 3D – Anfragen';wb.company='TechParts 3D Portfolio';wb.created=new Date();wb.modified=new Date();
    const fields=fieldsForExport();const total=state.inquiries.length;const counts={new:0,in_progress:0,closed:0};state.inquiries.forEach(r=>counts[r.status]=(counts[r.status]||0)+1);
    const overview=wb.addWorksheet('Übersicht');overview.properties.defaultRowHeight=22;overview.columns=[{width:29},{width:27},{width:20},{width:28}];
    overview.mergeCells('A1:D1');overview.getCell('A1').value='TECHPARTS 3D  |  ANFRAGENÜBERSICHT';overview.getCell('A1').font={name:'Aptos Display',size:18,bold:true,color:{argb:'FFFFFFFF'}};overview.getCell('A1').fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF172B2E'}};overview.getRow(1).height=38;
    overview.mergeCells('A2:D2');overview.getCell('A2').value=`Export erstellt: ${new Intl.DateTimeFormat('de-DE',{dateStyle:'long',timeStyle:'short'}).format(new Date())}`;overview.getCell('A2').font={italic:true,color:{argb:'FF6F7C80'},size:10};overview.getRow(2).height=25;
    overview.getCell('A4').value='Kennzahl';overview.getCell('B4').value='Anzahl';overview.getCell('C4').value='Bedeutung';
    ['A4:C4'].forEach(range=>overview.getCell(range.split(':')[0]));
    for(const ref of ['A4','B4','C4']){const c=overview.getCell(ref);c.font={bold:true,color:{argb:'FFFFFFFF'}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF5C7C43'}};c.alignment={vertical:'middle'};}
    const metricRows=[['Alle Anfragen',total,'Alle geladenen Datensätze'],['Neu',counts.new,'Noch nicht bearbeitet'],['In Bearbeitung',counts.in_progress,'Aktive Bearbeitung'],['Abgeschlossen',counts.closed,'Erledigte Vorgänge']];
    metricRows.forEach((r,i)=>{const row=overview.getRow(5+i);row.values=r;row.getCell(2).alignment={horizontal:'center'};row.eachCell(c=>{c.border={bottom:{style:'hair',color:{argb:'FFE0E6DD'}}};if(i%2===1)c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFF6F8F4'}};});});
    overview.mergeCells('A11:D11');overview.getCell('A11').value='Vertraulichkeitshinweis';overview.getCell('A11').font={bold:true,color:{argb:'FF8B5D15'}};overview.getCell('A11').fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFFFF4DB'}};
    overview.mergeCells('A12:D13');overview.getCell('A12').value='Diese Datei kann persönliche Kontaktdaten enthalten. Speichere sie nur auf einem vertrauenswürdigen, geschützten Gerät, teile sie nicht öffentlich und lösche nicht mehr benötigte Kopien sicher.';overview.getCell('A12').alignment={wrapText:true,vertical:'top'};overview.getCell('A12').font={size:10,color:{argb:'FF5D594D'}};overview.getCell('A12').fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFFFFAEF'}};
    overview.getRow(12).height=29;overview.getRow(13).height=20;
    const sheet=wb.addWorksheet('Anfragen');sheet.properties.defaultRowHeight=22;sheet.views=[{state:'frozen',ySplit:1,topLeftCell:'A2',activeCell:'A2'}];
    const headers=['Vorgangs-ID','Eingegangen am','Status',...fields.map(f=>f.label)];
    const rows=state.inquiries.map(r=>[r.id,new Date(r.created_at),({new:'Neu',in_progress:'In Bearbeitung',closed:'Abgeschlossen'})[r.status]||r.status,...fields.map(f=>displayValue(r.data?.[f.key]))]);
    sheet.addTable({name:'TechPartsAnfragen',ref:'A1',headerRow:true,totalsRow:false,style:{theme:'TableStyleMedium2',showRowStripes:true},columns:headers.map(name=>({name,filterButton:true})),rows});
    sheet.autoFilter={from:{row:1,column:1},to:{row:1,column:headers.length}};
    sheet.getRow(1).height=34;sheet.getRow(1).eachCell(cell=>{cell.font={bold:true,color:{argb:'FFFFFFFF'},size:10};cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF294448'}};cell.alignment={vertical:'middle',wrapText:true};cell.border={bottom:{style:'medium',color:{argb:'FF9BC84C'}}};});
    sheet.columns.forEach((col,i)=>{let width=i===0?18:i===1?21:i===2?20:16;if(i>=3){const f=fields[i-3];const values=state.inquiries.map(r=>displayValue(r.data?.[f.key]));width=Math.max(15,Math.min(34,Math.max(f.label.length,...values.map(v=>Math.min(v.length,34)))+2));}col.width=width;});
    sheet.eachRow((row,rowNumber)=>{if(rowNumber===1)return;row.height=28;row.eachCell((cell,colNumber)=>{cell.alignment={vertical:'top',wrapText:true};cell.border={bottom:{style:'hair',color:{argb:'FFE0E6DD'}}};if(rowNumber%2===0)cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFF7F9F5'}};if(colNumber===2){cell.numFmt='dd.mm.yyyy hh:mm';cell.alignment={vertical:'top',wrapText:false};}if(colNumber===3){const status=cell.value;const color=status==='Neu'?'FFFFE7C2':status==='In Bearbeitung'?'FFDCEAF8':'FFDFEED1';cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:color}};cell.font={bold:true,color:{argb:'FF243229'}};}});});
    const config=wb.addWorksheet('Formularfelder');config.columns=[{header:'Feld-ID',key:'key',width:25},{header:'Label DE',key:'de',width:32},{header:'Label EN',key:'en',width:32},{header:'Typ',key:'type',width:16},{header:'Pflichtfeld',key:'required',width:14},{header:'Aktiv',key:'enabled',width:12},{header:'Optionen',key:'options',width:45}];
    const configRows=state.fields.map(f=>({key:f.field_key,de:f.label_de,en:f.label_en,type:f.input_type,required:f.is_required?'Ja':'Nein',enabled:f.enabled?'Ja':'Nein',options:Array.isArray(f.options)?f.options.join(' | '):''}));configRows.forEach(r=>config.addRow(r));
    config.getRow(1).height=30;config.getRow(1).eachCell(c=>{c.font={bold:true,color:{argb:'FFFFFFFF'}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF5C7C43'}};c.alignment={vertical:'middle',wrapText:true};});config.views=[{state:'frozen',ySplit:1,topLeftCell:'A2'}];
    config.eachRow((row,n)=>{if(n===1)return;row.eachCell(c=>{c.alignment={vertical:'top',wrapText:true};c.border={bottom:{style:'hair',color:{argb:'FFE0E6DD'}}};if(n%2===0)c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFF7F9F5'}};});});
    const buffer=await wb.xlsx.writeBuffer();const blob=new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`TechParts3D_Anfragen_${new Date().toISOString().slice(0,10)}.xlsx`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);message('Excel-Datei mit Übersicht, Filtertabelle und Formularfeldern wurde erstellt.',false,'#requestsMessage');
  }catch(err){console.error(err);message('Excel-Export fehlgeschlagen. Prüfe die Browserkonsole und lade die Seite neu.',true,'#requestsMessage');}
  finally{btn.disabled=false;}
}

start();
