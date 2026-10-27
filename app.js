import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

const backendConfigured = Boolean(SUPABASE_URL?.trim() && SUPABASE_ANON_KEY?.trim());
let supabaseClient = null;
let secureBackendLoadError = null;
let backendFormFields = [];
let backendFormReady = false;
if (backendConfigured) {
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    supabaseClient = createClient(SUPABASE_URL.trim(), SUPABASE_ANON_KEY.trim(), { auth: { persistSession: false, autoRefreshToken: false } });
  } catch (error) {
    secureBackendLoadError = error;
    console.error('Could not load the secure form backend client.', error);
  }
}

const parts = [
  {
    id: 'TP-CAD-001', type: 'shaft', category: 'shaft', model: 'models/stepped-shaft.glb',
    name: { de: 'Stufenwelle', en: 'Stepped shaft' },
    short: { de: 'Selbst erstelltes 3D-CAD-Modell mit zwei technischen Zeichnungen.', en: 'Self-created 3D CAD model with two technical drawings.' },
    description: { de: 'Eigenes CAD-Modell aus KOMPAS-3D v25. Technische Maße und Toleranzen bitte den beiden Originalzeichnungen entnehmen.', en: 'Original CAD model created in KOMPAS-3D v25. Refer to the two original drawings for dimensions and tolerances.' },
    material: 'KOMPAS-3D v25',
    stock: 24, price: null,
    drawings: [
      { label: { de: 'Zeichnung 1 – Stufenwelle', en: 'Drawing 1 – Stepped shaft' }, url: 'drawings/stepped-shaft-drawing-01.pdf.pdf' },
      { label: { de: 'Zeichnung 2 – Schnitt / weiterer Zeichnungsstand', en: 'Drawing 2 – Section / additional drawing' }, url: 'drawings/stepped-shaft-section.pdf.pdf' }
    ],
    application: { de: 'Technisches Portfolio-Modell zur Demonstration der Verbindung von CAD-Konstruktion und Webentwicklung. Die Originalzeichnung ist maßgeblich für technische Angaben.', en: 'Portfolio model demonstrating the connection between CAD design and web development. Use the original drawing as the source of technical dimensions.' },
    tags: { de: ['KOMPAS-3D v25', 'Stufenwelle', '2 Zeichnungen'], en: ['KOMPAS-3D v25', 'Stepped shaft', '2 drawings'] },
    specs: {
      de: [['Artikelnummer','TP-CAD-001'],['CAD-System','KOMPAS-3D v25'],['3D-Webformat','GLB'],['Technische Zeichnungen','2 × PDF'],['Maße / Toleranzen','Siehe Originalzeichnungen']],
      en: [['Part number','TP-CAD-001'],['CAD system','KOMPAS-3D v25'],['Web 3D format','GLB'],['Technical drawings','2 × PDF'],['Dimensions / tolerances','See original drawings']]
    }
  },
  {
    id: 'TP-CAD-002', type: 'pulley', category: 'pulley', model: 'models/v-belt-pulley.glb',
    name: { de: 'Keilriemenscheibe', en: 'V-belt pulley' },
    short: { de: 'Selbst erstelltes CAD-Modell mit technischer Zeichnung.', en: 'Self-created CAD model with a technical drawing.' },
    description: { de: 'Eigenes CAD-Modell aus KOMPAS-3D v25. Maße und technische Angaben sind der Originalzeichnung zu entnehmen.', en: 'Original CAD model created in KOMPAS-3D v25. Consult the original drawing for dimensions and technical details.' },
    material: 'KOMPAS-3D v25',
    stock: 7, price: null,
    drawings: [
      { label: { de: 'Zeichnung – Keilriemenscheibe', en: 'Drawing – V-belt pulley' }, url: 'drawings/v-belt-pulley-drawing.pdf.pdf' }
    ],
    application: { de: 'Technisches Portfolio-Modell einer Keilriemenscheibe. Konkrete Maße und Einsatzgrenzen bitte der Originalzeichnung entnehmen.', en: 'Portfolio model of a V-belt pulley. Consult the original drawing for dimensions and intended-use limits.' },
    tags: { de: ['KOMPAS-3D v25', 'Antriebstechnik', '1 Zeichnung'], en: ['KOMPAS-3D v25', 'Drive technology', '1 drawing'] },
    specs: {
      de: [['Artikelnummer','TP-CAD-002'],['CAD-System','KOMPAS-3D v25'],['3D-Webformat','GLB'],['Technische Zeichnungen','1 × PDF'],['Maße / Toleranzen','Siehe Originalzeichnung']],
      en: [['Part number','TP-CAD-002'],['CAD system','KOMPAS-3D v25'],['Web 3D format','GLB'],['Technical drawings','1 × PDF'],['Dimensions / tolerances','See original drawing']]
    }
  },
  {
    id: 'TP-CAD-003', type: 'bearing', category: 'bearing', model: 'models/bearing.glb',
    name: { de: 'Wälzlager', en: 'Rolling bearing' },
    short: { de: 'In Autodesk Fusion erstelltes 3D-Modell mit PDF-Zeichnung.', en: '3D model created in Autodesk Fusion with a PDF drawing.' },
    description: { de: 'Eigenes Modell aus Autodesk Fusion. Die PDF-Datei wurde über den Druckdialog erstellt; Maße bitte der Zeichnung entnehmen.', en: 'Original model created in Autodesk Fusion. The PDF was produced through the print dialog; refer to the drawing for dimensions.' },
    material: 'Autodesk Fusion',
    stock: 0, price: null,
    drawings: [
      { label: { de: 'Zeichnung – Wälzlager', en: 'Drawing – Rolling bearing' }, url: 'drawings/bearing-drawing.pdf.pdf' }
    ],
    application: { de: 'CAD-Übungsmodell aus Autodesk Fusion als Teil des TechParts-3D-Portfolios. Die Darstellung ist keine Aussage über die Normkonformität oder Eignung eines realen Lagers.', en: 'CAD practice model created in Autodesk Fusion for the TechParts 3D portfolio. The model does not certify compliance or suitability of a real bearing.' },
    tags: { de: ['Autodesk Fusion', 'Lagertechnik', '1 Zeichnung'], en: ['Autodesk Fusion', 'Bearing', '1 drawing'] },
    specs: {
      de: [['Artikelnummer','TP-CAD-003'],['CAD-System','Autodesk Fusion'],['Quelldatei','F3D'],['3D-Webformat','GLB'],['Technische Zeichnung','1 × PDF']],
      en: [['Part number','TP-CAD-003'],['CAD system','Autodesk Fusion'],['Source file','F3D'],['Web 3D format','GLB'],['Technical drawing','1 × PDF']]
    }
  }
];

const words = {
 de:{demo:'DEMO-PROJEKT · TECHNISCHER BAUTEILKATALOG',static:'Statische Demo · keine echten Bestellungen',navCatalog:'Bauteilkatalog',navProcess:'So funktioniert’s',navAbout:'Projekt',navRequest:'Anfrage stellen',heroEyebrow:'DIGITALE TECHNIK. KLAR GEDACHT.',heroTitle:'Das richtige Bauteil.<br><em>Bis ins Detail.</em>',heroLead:'Technische Komponenten entdecken, 3D-Modelle erkunden und Produktdaten auf einen Blick vergleichen.',explore:'Bauteile entdecken',howItWorks:'Wie es funktioniert',proofTitle:'Technische Daten an einem Ort',proofSub:'Modell · Zeichnung · Verfügbarkeit',interactiveModel:'INTERAKTIVES 3D-MODELL',dragHint:'Ziehen zum Drehen · Scrollen zum Zoomen',sampleModel:'EIGENES CAD-MODELL / STUFENWELLE',heroBottom:'ENGINEERING MEETS SOFTWARE',metric1:'Interaktives 3D-Modell',metric2:'Technische Spezifikationen',metric3:'Schnelle Anfrage',metric4:'Zweisprachige Oberfläche',catalogEyebrow:'PRODUKTE / 01',catalogTitle:'Bauteile im <em>Überblick.</em>',catalogDesc:'Sieh dir die drei eigenen CAD-Modelle direkt in den Karten an und öffne die zugehörigen Originalzeichnungen.',searchPlaceholder:'Bauteil, Material oder Artikelnummer suchen …',filterAll:'Alle Bauteile',filterShaft:'Wellen',filterPulley:'Riemenscheiben',filterBearing:'Lager',detailEyebrow:'PRODUKTDETAILS / 02',modelViewer:'3D-MODELLANSICHT',viewerHint:'Maus ziehen: drehen · Scrollen: zoomen',technicalData:'TECHNISCHE DATEN',specTitle:'Spezifikationen',technicalDrawing:'TECHNISCHE ZEICHNUNG',drawingTitle:'Originalzeichnung (PDF)',drawingNote:'Original-PDF öffnen.',viewDrawing:'Zeichnung ansehen',stock:'LAGERBESTAND',application:'ANWENDUNG',applicationTitle:'Eigene CAD-Konstruktionen im Portfolio.',delivery:'LIEFERZEIT / ORIENTIERUNG',deliveryTitle:'Menge beeinflusst die Lieferzeit.',deliveryDesc:'Unverbindliche Beispielrechnung auf Basis einer angenommenen Produktionskapazität.',quantity:'Gewünschte Menge',pieces:'Stück',estimatedDelivery:'Geschätzte Lieferzeit',deliveryDisclaimer:'Nur demonstrative Berechnung; keine echten Lieferdaten.',requestEyebrow:'KONTAKT / 03',requestTitle:'Lass uns über dein <em>Projekt sprechen.</em>',requestDesc:'Anfragen werden in diesem Browser gesammelt und können später gemeinsam als CSV-Datei für Excel exportiert werden. Es wird nichts an einen Server übertragen.',requestPoint1:'Bauteil und Menge auswählen',requestPoint2:'Kontaktdaten eintragen',requestPoint3:'Alle Anfragen gesammelt exportieren',privacyNote:'Bitte keine echten sensiblen Daten verwenden. Dies ist ein öffentliches Portfolio-Demo-Projekt ohne Backend.',formLabel:'ANFRAGEFORMULAR',labelName:'Vor- und Nachname *',labelCompany:'Unternehmen',labelEmail:'E-Mail-Adresse *',labelPhone:'Telefon (optional)',labelPart:'Bauteil *',labelQuantity:'Menge (Stück) *',labelMessage:'Nachricht / Anmerkungen',messagePlaceholder:'Ihre Anforderungen oder Fragen …',consent:'Ich bestätige, dass dies eine Demo-Anfrage mit Testdaten ist. *',exportRequest:'Anfrage lokal speichern',formFootnote:'* Pflichtfelder · Anfragen bleiben in diesem Browser, bis du sie gesammelt exportierst.',projectEyebrow:'ÜBER DAS PROJEKT',projectTitle:'Ingenieurwissen trifft <em>Softwareentwicklung.</em>',projectDesc:'TechParts 3D ist ein eigenständiges Portfolio-Projekt. Es verbindet CAD-Grundlagen mit Webentwicklung und zeigt, wie technische Produktinformationen digital strukturiert und zugänglich gemacht werden können.',projectNote:'Die CAD-Modelle und Zeichnungen wurden für dieses Portfolio erstellt. Lagerbestände (24 / 7 / 0 Stück) und Lieferzeiten sind fiktive Demo-Werte, keine realen Bestandsdaten.',footerText:'Unabhängiges Ausbildungs- und Portfolio-Projekt.',backTop:'Nach oben ↑',available:'Auf Lager (Demo)',lowStock:'Geringer Bestand (Demo)',outOfStock:'Nicht auf Lager (Demo)',piecesInStock:'Stück verfügbar (Demo-Bestand)',noResults:'Keine passenden Bauteile gefunden.',partDetails:'Details ansehen',from:'Demo-Richtpreis',deliveryStock:'Auf Lager: voraussichtlich 2–4 Werktage',deliveryLow:'Kleine Menge verfügbar: voraussichtlich 4–7 Werktage',deliveryOut:'Nicht auf Lager: Fertigung/Bestellung prüfen',deliveryMedium:'Voraussichtlich 5–8 Werktage',deliveryLarge:'Voraussichtlich 8–15 Werktage',deliveryVeryLarge:'Individuelle Terminprüfung erforderlich',drawingDialogLabel:'TECHNISCHE ZEICHNUNG',drawingDisclaimer:'Dies sind die bereitgestellten Originalzeichnungen. Maßgeblich sind die Angaben in den jeweiligen Zeichnungsdateien.',success:'Demo-Anfrage wurde als CSV-Datei exportiert. Es wurden keine Daten an einen Server übertragen.',error:'Bitte prüfe die Pflichtfelder und gib eine gültige E-Mail-Adresse ein.',formPartPlaceholder:'Bauteil auswählen',saveRequest:'Anfrage lokal speichern',exportAllRequests:'Alle Anfragen gesammelt als CSV exportieren',requestSaved:'Anfrage lokal gespeichert. Insgesamt {count} Anfragen in diesem Browser.',noRequests:'Noch keine Anfragen gespeichert.',requestsExported:'{count} Anfragen in einer gemeinsamen CSV-Datei exportiert.',processEyebrow:'VOM CAD INS WEB',processTitle:'Vom Entwurf bis zum <em>Browser.</em>',processDesc:'Drei eigene CAD-Modelle, für das Web exportiert und mit den Originalzeichnungen verbunden.',processStep1Title:'01 · Konstruieren',processStep1Text:'Stufenwelle und Keilriemenscheibe in KOMPAS-3D v25; Wälzlager in Autodesk Fusion.',processStep2Title:'02 · Exportieren',processStep2Text:'GLB für die 3D-Vorschau und PDF für technische Zeichnungen.',processStep3Title:'03 · Interaktiv darstellen',processStep3Text:'Three.js lädt die Modelle im Browser. Modelle, Spezifikationen und Zeichnungen sind getrennt zugänglich.'},
 en:{demo:'DEMO PROJECT · TECHNICAL PARTS CATALOG',static:'Static demo · no real orders',navCatalog:'Parts catalog',navProcess:'How it works',navAbout:'Project',navRequest:'Make an inquiry',heroEyebrow:'DIGITAL ENGINEERING. CLEARLY DESIGNED.',heroTitle:'The right component.<br><em>Down to the detail.</em>',heroLead:'Discover technical components, explore 3D models, and compare product data at a glance.',explore:'Explore components',howItWorks:'How it works',proofTitle:'Technical data in one place',proofSub:'Model · drawing · availability',interactiveModel:'INTERACTIVE 3D MODEL',dragHint:'Drag to rotate · Scroll to zoom',sampleModel:'OWN CAD MODEL / STEPPED SHAFT',heroBottom:'ENGINEERING MEETS SOFTWARE',metric1:'Interactive 3D model',metric2:'Technical specifications',metric3:'Quick inquiry',metric4:'Bilingual interface',catalogEyebrow:'PRODUCTS / 01',catalogTitle:'Parts at a <em>glance.</em>',catalogDesc:'Preview three self-created CAD models directly in the cards and open the associated original drawings.',searchPlaceholder:'Search part, material, or part number …',filterAll:'All components',filterShaft:'Shafts',filterPulley:'Pulleys',filterBearing:'Bearings',detailEyebrow:'PRODUCT DETAILS / 02',modelViewer:'3D MODEL VIEWER',viewerHint:'Drag to rotate · Scroll to zoom',technicalData:'TECHNICAL DATA',specTitle:'Specifications',technicalDrawing:'TECHNICAL DRAWING',drawingTitle:'Original drawing (PDF)',drawingNote:'Open original PDF.',viewDrawing:'View drawing',stock:'INVENTORY',application:'APPLICATION',applicationTitle:'Original CAD work in the portfolio.',delivery:'LEAD TIME / ESTIMATE',deliveryTitle:'Quantity affects lead time.',deliveryDesc:'Illustrative estimate based on an assumed production capacity.',quantity:'Requested quantity',pieces:'pcs',estimatedDelivery:'Estimated lead time',deliveryDisclaimer:'Demonstration only; these are not real lead-time data.',requestEyebrow:'CONTACT / 03',requestTitle:'Let’s talk about your <em>project.</em>',requestDesc:'Inquiries are collected in this browser and can later be exported together as a CSV file for Excel. Nothing is sent to a server.',requestPoint1:'Choose a part and quantity',requestPoint2:'Enter contact details',requestPoint3:'Export all inquiries together',privacyNote:'Please do not use real sensitive data. This public portfolio demo has no backend.',formLabel:'INQUIRY FORM',labelName:'Full name *',labelCompany:'Company',labelEmail:'Email address *',labelPhone:'Phone (optional)',labelPart:'Component *',labelQuantity:'Quantity (pcs) *',labelMessage:'Message / notes',messagePlaceholder:'Your requirements or questions …',consent:'I confirm this is a demo inquiry using test data. *',exportRequest:'Save inquiry locally',formFootnote:'* Required fields · Inquiries stay in this browser until you export them together.',projectEyebrow:'ABOUT THE PROJECT',projectTitle:'Engineering knowledge meets <em>software development.</em>',projectDesc:'TechParts 3D is an independent portfolio project. It combines CAD fundamentals with web development and demonstrates how technical product information can be structured and made accessible digitally.',projectNote:'The CAD models and drawings were created for this portfolio. Inventory levels (24 / 7 / 0 pcs) and lead times are fictional demo values, not real stock data.',footerText:'Independent training and portfolio project.',backTop:'Back to top ↑',available:'In stock (demo)',lowStock:'Low stock (demo)',outOfStock:'Out of stock (demo)',piecesInStock:'pcs available (demo stock)',noResults:'No matching components found.',partDetails:'View details',from:'Indicative demo price',deliveryStock:'In stock: estimated 2–4 business days',deliveryLow:'Limited stock: estimated 4–7 business days',deliveryOut:'Out of stock: check production/order options',deliveryMedium:'Estimated 5–8 business days',deliveryLarge:'Estimated 8–15 business days',deliveryVeryLarge:'Individual delivery date review required',drawingDialogLabel:'TECHNICAL DRAWING',drawingDisclaimer:'These are the provided original drawings. Refer to each drawing file for its technical information.',success:'Demo inquiry exported as a CSV file. No data was sent to a server.',error:'Please check required fields and enter a valid email address.',formPartPlaceholder:'Select a component',saveRequest:'Save inquiry locally',exportAllRequests:'Export all inquiries together as CSV',requestSaved:'Inquiry saved in this browser. Total saved inquiries: {count}.',noRequests:'No inquiries have been saved yet.',requestsExported:'Exported {count} inquiries in one combined CSV file.',processEyebrow:'FROM CAD TO WEB',processTitle:'From design to the <em>browser.</em>',processDesc:'Three self-created CAD models, exported for the web and connected to their original technical drawings.',processStep1Title:'01 · Design',processStep1Text:'Stepped shaft and V-belt pulley in KOMPAS-3D v25; rolling bearing in Autodesk Fusion.',processStep2Title:'02 · Export',processStep2Text:'GLB for the 3D preview and PDF for technical drawings.',processStep3Title:'03 · Present interactively',processStep3Text:'Three.js loads the models in the browser. Models, specifications and drawings remain separately accessible.'}
};
let lang='de', activeFilter='all', selectedId='TP-CAD-001', heroViewer=null, detailViewer=null;
let cardPreviewDisposers=[];
const REQUESTS_STORAGE_KEY='techparts3d_requests_v1';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const t=k=>words[lang][k]||k;
const money=n=>new Intl.NumberFormat(lang==='de'?'de-DE':'en-GB',{style:'currency',currency:'EUR'}).format(n);
function stockStatus(p){return p.stock===0?t('outOfStock'):p.stock<10?t('lowStock'):t('available')}
function productCard(p){
  const title=p.name[lang];
  const categoryLabel={shaft:lang==='de'?'WELLE / CAD':'SHAFT / CAD',pulley:lang==='de'?'RIEMENSCHEIBE / CAD':'PULLEY / CAD',bearing:lang==='de'?'LAGER / CAD':'BEARING / CAD'}[p.category];
  const drawingText=p.drawings.length===2?(lang==='de'?'2 PDF':'2 PDFs'):(lang==='de'?'1 PDF':'1 PDF');
  const inventoryText=p.stock===0?(lang==='de'?'0 Stk. · nicht verfügbar':'0 pcs · unavailable'):`${p.stock} ${lang==='de'?'Stk.':'pcs'} · ${p.stock<10?(lang==='de'?'geringer Bestand':'low stock'):(lang==='de'?'auf Lager':'in stock')}`;
  return `<article class="product-card ${p.id===selectedId?'selected':''}" data-id="${p.id}" tabindex="0" role="button" aria-label="${esc(title)}"><div class="product-art"><div class="product-preview" data-preview-part="${p.id}" aria-hidden="true"></div><span class="product-badge">${categoryLabel}</span><span class="preview-hint">3D · GLB</span><span class="product-arrow">↗</span></div><div class="product-info"><div class="product-meta"><span>${p.id}</span><span>${p.stock===0?'○':'●'} ${esc(inventoryText)}</span></div><h3>${esc(title)}</h3><p>${esc(p.short[lang])}</p><div class="product-foot"><span>${lang==='de'?'Dateien':'Files'}</span><strong>GLB + ${drawingText}</strong></div></div></article>`
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderProducts(){
  cardPreviewDisposers.forEach(dispose=>{try{dispose()}catch(e){console.warn('Could not dispose catalog preview',e)}});
  cardPreviewDisposers=[];
  const q=$('#searchInput').value.trim().toLowerCase();
  const found=parts.filter(p=>(activeFilter==='all'||p.category===activeFilter)&&[p.id,p.name.de,p.name.en,p.material,p.short.de,p.short.en].some(v=>v.toLowerCase().includes(q)));
  $('#productGrid').innerHTML=found.length?found.map(productCard).join(''):`<div class="empty-state">${t('noResults')}</div>`;
  $('#resultCount').textContent=`${found.length.toString().padStart(2,'0')} ${lang==='de'?'BAUTEILE':'COMPONENTS'}`;
  $$('.product-card').forEach(el=>{const open=()=>selectPart(el.dataset.id);el.addEventListener('click',open);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})});
  $$('.product-preview').forEach(el=>{const p=parts.find(item=>item.id===el.dataset.previewPart);if(p)cardPreviewDisposers.push(createCardPreview(el,p));});
}

function createCardPreview(container,p){
  let renderer=null, root=null, disposed=false, resizeObserver=null;
  const scene=new THREE.Scene();scene.background=new THREE.Color('#e8eee8');
  const camera=new THREE.PerspectiveCamera(34,1,.1,100);
  try{
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;
    renderer.setSize(Math.max(1,container.clientWidth),Math.max(1,container.clientHeight));
    container.innerHTML='';container.appendChild(renderer.domElement);
  }catch(err){
    console.warn('Catalog thumbnail renderer unavailable:',err);
    container.innerHTML=`<div class="preview-fallback">${lang==='de'?'3D-Vorschau im Browser nicht verfügbar':'3D preview unavailable in this browser'}</div>`;
    return ()=>{};
  }
  scene.add(new THREE.HemisphereLight(0xffffff,0x526359,1.25));
  const light=new THREE.DirectionalLight(0xffffff,1.65);light.position.set(4,6,5);scene.add(light);
  const fillLight=new THREE.DirectionalLight(0xffffff,.45);fillLight.position.set(-4,2,-3);scene.add(fillLight);
  const loader=new GLTFLoader();
  loader.load(p.model,gltf=>{
    if(disposed){disposeObject(gltf.scene);return;}
    root=gltf.scene;
    const replacedMaterials=new Set();
    root.traverse(node=>{
      if(!node.isMesh)return;
      if(p.type==='shaft'){
        for(const mat of (Array.isArray(node.material)?node.material:[node.material]))if(mat)replacedMaterials.add(mat);
        node.material=new THREE.MeshStandardMaterial({color:0x62766a,metalness:.24,roughness:.42,side:THREE.DoubleSide});
      }
    });
    replacedMaterials.forEach(mat=>mat.dispose());
    const bounds=new THREE.Box3().setFromObject(root);
    const size=bounds.getSize(new THREE.Vector3());
    const center=bounds.getCenter(new THREE.Vector3());
    const maxDim=Math.max(size.x,size.y,size.z);
    if(!Number.isFinite(maxDim)||maxDim<=0){container.innerHTML=`<div class="preview-fallback">${lang==='de'?'Modell nicht verfügbar':'Model unavailable'}</div>`;return;}
    const scale=1.6/maxDim;root.scale.setScalar(scale);root.position.set(-center.x*scale,-center.y*scale,-center.z*scale);scene.add(root);
    camera.position.set(2.6,1.9,3.1);camera.lookAt(0,0,0);
    camera.aspect=Math.max(1,container.clientWidth)/Math.max(1,container.clientHeight);camera.updateProjectionMatrix();renderer.render(scene,camera);
  },undefined,err=>{
    if(disposed)return;console.error('Catalog GLB preview failed:',p.model,err);
    container.innerHTML=`<div class="preview-fallback">${lang==='de'?'3D-Datei nicht geladen':'Could not load 3D file'}</div>`;
  });
  const resize=()=>{if(disposed||!renderer)return;const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.render(scene,camera);};
  resizeObserver=new ResizeObserver(resize);resizeObserver.observe(container);
  return ()=>{disposed=true;resizeObserver?.disconnect();if(root)disposeObject(root);renderer?.dispose();container.innerHTML='';};
}

function renderDetails(){
  const p=parts.find(x=>x.id===selectedId)||parts[0];
  $('#detailTitle').innerHTML=`${esc(p.name[lang])} <em>${p.id}</em>`;
  $('#detailDescription').textContent=p.description[lang];
  $('#modelPartCode').textContent=p.id;
  $('#availabilityText').textContent=stockStatus(p);
  $('#specTable').innerHTML=p.specs[lang].map(([k,v])=>`<div class="spec-row"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('');
  $('#stockValue').innerHTML=`${p.stock} <small>${lang==='de'?'Stück':'pcs'}</small>`;
  $('#stockBar').parentElement.style.display='block';
  $('#stockBar').style.width=`${Math.max(0,Math.min(100,p.stock/30*100))}%`;
  $('#stockNote').textContent=p.stock===0
    ? (lang==='de'?'Demo-Bestand: 0 Stück · Verfügbarkeit prüfen':'Demo stock: 0 pcs · check availability')
    : (lang==='de'?`${p.stock} Stück verfügbar (Demo-Bestand) · ${p.stock<10?'geringer Bestand':'auf Lager'}`:`${p.stock} pcs available (demo stock) · ${p.stock<10?'low stock':'in stock'}`);
  // CAD file availability remains separate from inventory and is already listed in the specifications and drawing dialog.
  $('#stockValue').setAttribute('aria-label', `${p.stock} ${lang==='de'?'Stück im Demo-Lager':'pcs in demo inventory'}`);
  $('#applicationText').textContent=p.application[lang];
  $('#useTags').innerHTML=p.tags[lang].map(x=>`<span>${esc(x)}</span>`).join('');
  $('#quantityInput').value=10;$('#formQuantity').value=10;$('#quantityLabel').textContent='10';updateDelivery();fillFormParts();drawTechnicalDrawing(p);renderProducts();
  if(detailViewer){detailViewer.dispose();detailViewer=null}
  detailViewer=createViewer($('#detailModel'),p);
}
function selectPart(id){selectedId=id;renderDetails();if(window.innerWidth<800)$('#detail').scrollIntoView({behavior:'smooth'})}
function updateDelivery(){
  const q=Number($('#quantityInput').value);
  $('#quantityLabel').textContent=q;
  $('#formQuantity').value=q;
  const p=parts.find(x=>x.id===selectedId)||parts[0];
  let key;
  if(p.stock===0) key='deliveryOut';
  else if(q<=p.stock) key='deliveryStock';
  else if(q>p.stock&&q<=30) key='deliveryLow';
  else if(q<=50) key='deliveryMedium';
  else if(q<=100) key='deliveryLarge';
  else key='deliveryVeryLarge';
  $('#deliveryValue').textContent=t(key).replace(/^.*?: /,'');
}
function fillFormParts(){const sel=$('#formPart');const prev=sel.value;sel.innerHTML=parts.map(p=>`<option value="${p.id}" ${p.id===selectedId?'selected':''}>${p.id} — ${esc(p.name[lang])}</option>`).join('');if(parts.some(p=>p.id===prev))sel.value=prev;else sel.value=selectedId}
function drawTechnicalDrawing(p){
  $('#drawingHeading').textContent=`${p.name[lang]} ${p.id}`;
  $('#drawingCanvas').innerHTML=`<div style="display:flex;flex-direction:column;gap:12px;padding:12px;align-items:stretch">${p.drawings.map((d,i)=>`<a class="button button-outline" href="${d.url}" target="_blank" rel="noopener noreferrer" style="display:flex;justify-content:space-between;align-items:center;gap:12px;text-decoration:none"><span>${esc(d.label[lang])}</span><strong>PDF ↗</strong></a>`).join('')}</div>`;
}
function createViewer(container,p){
  let renderer, frame=0, root=null, ro=null, dragging=false, px=0, py=0, disposed=false;
  const scene=new THREE.Scene();
  scene.background=new THREE.Color('#e8eee8');
  const camera=new THREE.PerspectiveCamera(38,1,.1,100);
  camera.position.set(3,2.6,3.8);camera.lookAt(0,0,0);
  try {
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.NoToneMapping;
    renderer.toneMappingExposure=1.0;
    renderer.setSize(Math.max(container.clientWidth,200),Math.max(container.clientHeight,180));
    container.innerHTML='';container.appendChild(renderer.domElement);
  } catch(err) {
    console.warn('WebGL renderer unavailable:',err);
    container.innerHTML=`<div class="model-placeholder"><div class="flange-art"><div class="flange-ring"></div><div class="flange-center"></div></div><span>${lang==='de'?'3D-Ansicht nicht verfügbar – WebGL 2 im Browser prüfen':'3D view unavailable — check WebGL 2 in the browser'}</span></div>`;
    return {dispose(){},reset(){}};
  }
  scene.add(new THREE.HemisphereLight(0xffffff,0x526359,1.25));
  const light=new THREE.DirectionalLight(0xffffff,1.65);light.position.set(4,6,5);scene.add(light);
  const fillLight=new THREE.DirectionalLight(0xffffff,0.45);fillLight.position.set(-4,2,-3);scene.add(fillLight);
  const group=new THREE.Group();scene.add(group);
  const grid=new THREE.GridHelper(4,16,0xb5c4b5,0xd5ded4);grid.position.y=-1.15;scene.add(grid);
  const loader=new GLTFLoader();
  loader.load(p.model, gltf=>{
    if(disposed){disposeObject(gltf.scene);return}
    root=gltf.scene;
    // Preserve the GLB's original materials for the pulley and bearing.
    // Only the stepped shaft keeps the darker satin-steel look used in the previous version.
    const replacedMaterials=new Set();
    root.traverse(node=>{
      if(!node.isMesh)return;
      if(p.type==='shaft'){
        for(const mat of (Array.isArray(node.material)?node.material:[node.material])){
          if(mat)replacedMaterials.add(mat);
        }
        node.material=new THREE.MeshStandardMaterial({
          color:0x62766a,
          metalness:0.24,
          roughness:0.42,
          side:THREE.DoubleSide
        });
      }
      node.castShadow=true;
      node.receiveShadow=true;
    });
    // Release original shaft materials that have been replaced above.
    replacedMaterials.forEach(mat=>mat.dispose());
    const box=new THREE.Box3().setFromObject(root);
    const size=box.getSize(new THREE.Vector3());
    const center=box.getCenter(new THREE.Vector3());
    const maxDim=Math.max(size.x,size.y,size.z);
    if(!Number.isFinite(maxDim)||maxDim<=0){throw new Error('The GLB file has no visible geometry')}
    const scale=2.0/maxDim;
    root.scale.setScalar(scale);
    root.position.set(-center.x*scale,-center.y*scale,-center.z*scale);
    group.add(root);
  }, undefined, err=>{
    if(disposed)return;
    console.error('Could not load GLB model:',p.model,err);
    container.innerHTML=`<div class="model-placeholder"><div class="flange-art"><div class="flange-ring"></div><div class="flange-center"></div></div><span>${lang==='de'?'3D-Datei nicht geladen – Dateipfad prüfen':'3D file not loaded — check the file path'}</span></div>`;
  });
  const onPointerDown=e=>{dragging=true;px=e.clientX;py=e.clientY;renderer.domElement.setPointerCapture?.(e.pointerId)};
  const onPointerUp=()=>{dragging=false};
  const onPointerMove=e=>{if(!dragging)return;group.rotation.y+=(e.clientX-px)*.012;group.rotation.x+=(e.clientY-py)*.009;px=e.clientX;py=e.clientY};
  const onWheel=e=>{e.preventDefault();camera.position.multiplyScalar(e.deltaY>0?1.08:.92);camera.position.clampLength(2.4,9)};
  renderer.domElement.addEventListener('pointerdown',onPointerDown);
  renderer.domElement.addEventListener('pointerup',onPointerUp);
  renderer.domElement.addEventListener('pointercancel',onPointerUp);
  renderer.domElement.addEventListener('pointermove',onPointerMove);
  renderer.domElement.addEventListener('wheel',onWheel,{passive:false});
  const resize=()=>{if(disposed)return;const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)};
  ro=new ResizeObserver(resize);ro.observe(container);
  const animate=()=>{if(disposed)return;frame=requestAnimationFrame(animate);renderer.render(scene,camera)};animate();
  return {
    dispose(){disposed=true;cancelAnimationFrame(frame);ro?.disconnect();renderer.domElement.removeEventListener('pointerdown',onPointerDown);renderer.domElement.removeEventListener('pointerup',onPointerUp);renderer.domElement.removeEventListener('pointercancel',onPointerUp);renderer.domElement.removeEventListener('pointermove',onPointerMove);renderer.domElement.removeEventListener('wheel',onWheel);if(root)disposeObject(root);renderer.dispose();container.innerHTML=''},
    reset(){group.rotation.set(0,0,0);camera.position.set(3,2.6,3.8);camera.lookAt(0,0,0)}
  };
}
function disposeObject(obj){obj.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}})}
function setLanguage(next){lang=next;document.documentElement.lang=lang;$$('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(words[lang][key])el.innerHTML=words[lang][key]});$$('[data-i18n-placeholder]').forEach(el=>{const key=el.dataset.i18nPlaceholder;if(words[lang][key])el.placeholder=words[lang][key]});$('#langToggle').innerHTML=lang==='de'?'DE <span>/</span> EN':'DE <span>/</span> EN';renderProducts();renderDetails();$('#formMessage').textContent='';updateRequestExportUI();if(backendConfigured){if($('#requestDesc'))$('#requestDesc').textContent=lang==='de'?'Anfragen werden über Supabase gespeichert. Nutze echte Kontaktdaten erst nach erfolgreichem Sicherheits- und Zugriffstest.':'Inquiries are stored through Supabase. Use real contact data only after the security and access tests have passed.';if($('#privacyNote'))$('#privacyNote').textContent=lang==='de'?'Backend-Modus: Bitte die Datenschutzerklärung veröffentlichen und keine sensiblen Daten übermitteln, solange die Konfiguration nicht geprüft wurde.':'Backend mode: publish a privacy notice and do not submit sensitive information until the configuration has been reviewed.';const submitLabel=$('#requestForm .submit-button span:first-child');if(submitLabel)submitLabel.textContent=lang==='de'?'Anfrage sicher senden':'Submit inquiry';const stepThree=$('#request .request-points>div:nth-child(3) p');if(stepThree)stepThree.textContent=lang==='de'?'Anfrage sicher senden':'Submit inquiry securely';const foot=$('.form-footnote');if(foot)foot.textContent=lang==='de'?'Anfragen werden über den geschützten Backend-Zugang übermittelt.':'Inquiries are submitted through the protected backend.';}if(backendFormReady)renderSecureFormFields();}
$('#langToggle').addEventListener('click',()=>setLanguage(lang==='de'?'en':'de'));
$('#searchInput').addEventListener('input',renderProducts);
$$('.filter').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;$$('.filter').forEach(x=>x.classList.toggle('active',x===b));renderProducts()}));
$('#quantityInput').addEventListener('input',updateDelivery);
$('#formPart').addEventListener('change',e=>{selectedId=e.target.value;renderDetails()});
$('#formQuantity').addEventListener('input',e=>{const q=Math.max(1,Math.min(200,Number(e.target.value)||1));$('#quantityInput').value=q;updateDelivery()});
function getStoredRequests(){
  try{const saved=JSON.parse(localStorage.getItem(REQUESTS_STORAGE_KEY)||'[]');return Array.isArray(saved)?saved:[];}
  catch(err){console.warn('Could not read locally stored inquiries:',err);return[];}
}
function saveStoredRequests(requests){
  try{localStorage.setItem(REQUESTS_STORAGE_KEY,JSON.stringify(requests));return true;}
  catch(err){console.error('Could not save inquiries in this browser:',err);return false;}
}
function updateRequestExportUI(){
  const count=getStoredRequests().length;
  const countEl=$('#requestCount');if(countEl)countEl.textContent=String(count);
  const button=$('#exportAllRequests');if(button)button.disabled=count===0;
}
function csvCell(value){
  let text=String(value??'');
  if(/^[=+@\-\t\r]/.test(text))text="'"+text;
  return `"${text.replace(/"/g,'""')}"`;
}
function exportAllRequests(){
  const requests=getStoredRequests();
  if(!requests.length){$('#formMessage').textContent=t('noRequests');$('#formMessage').classList.remove('error');return;}
  const headers=['Name','Company / Unternehmen','Email / E-Mail','Phone / Telefon','Part number / Artikelnummer','Part / Bauteil','Quantity / Menge','Message / Nachricht','Language / Sprache','Timestamp / Zeitpunkt'];
  const rows=requests.map(r=>[r.name,r.company,r.email,r.phone,r.partId,r.partName,r.quantity,r.message,r.language,r.timestamp]);
  const csv=[headers,...rows].map(row=>row.map(csvCell).join(';')).join('\r\n');
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='techparts3d-anfragen-gesamt.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  $('#formMessage').textContent=t('requestsExported').replace('{count}',String(requests.length));$('#formMessage').classList.remove('error');
}
$('#requestForm').addEventListener('submit',async e=>{
  e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;
  // When a backend is configured, never silently fall back to browser-only storage on an error.
  if(backendConfigured){
    if(!supabaseClient||!backendFormReady){$('#formMessage').textContent=lang==='de'?'Sicheres Formular aktuell nicht verfügbar. Es wurden keine Daten gespeichert.':'Secure form is unavailable. No data was saved.';$('#formMessage').classList.add('error');return;}
    const payload={};
    for(const field of backendFormFields){
      if(!field.enabled)continue;
      const input=form.elements.namedItem(field.field_key);
      if(!input)continue;
      if(field.input_type==='checkbox')payload[field.field_key]=Boolean(input.checked);
      else if(field.input_type==='number')payload[field.field_key]=input.value===''?null:Number(input.value);
      else payload[field.field_key]=String(input.value??'').trim();
    }
    payload._language=lang;
    try{
      const {error}=await supabaseClient.from('inquiries').insert({data:payload});
      if(error)throw error;
      $('#formMessage').textContent=lang==='de'?'Vielen Dank. Die Anfrage wurde übermittelt.':'Thank you. Your inquiry was submitted.';
      $('#formMessage').classList.remove('error');form.reset();return;
    }catch(error){
      console.error('Secure inquiry submission failed:',error);
      $('#formMessage').textContent=lang==='de'?'Übermittlung fehlgeschlagen. Bitte später erneut versuchen. Es wurden keine lokalen Kopien erstellt.':'Submission failed. Please try again later. No local copy was created.';
      $('#formMessage').classList.add('error');return;
    }
  }
  // Legacy portfolio demo mode (only when no backend credentials are configured). Use test data only.
  const data=new FormData(form);const p=parts.find(x=>x.id===data.get('part'));if(!p)return;
  const requests=getStoredRequests();
  requests.push({name:data.get('name'),company:data.get('company'),email:data.get('email'),phone:data.get('phone'),partId:p.id,partName:p.name[lang],quantity:data.get('quantity'),message:data.get('message'),language:lang,timestamp:new Date().toISOString()});
  if(!saveStoredRequests(requests)){$('#formMessage').textContent=lang==='de'?'Speichern im Browser nicht möglich. Bitte Browser-Speicher prüfen.':'Could not save in browser storage. Check browser storage settings.';$('#formMessage').classList.add('error');return;}
  updateRequestExportUI();
  $('#formMessage').textContent=t('requestSaved').replace('{count}',String(requests.length));$('#formMessage').classList.remove('error');
  form.reset();fillFormParts();$('#formQuantity').value=10;
});
$('#exportAllRequests').addEventListener('click',exportAllRequests);

function renderSecureFormFields(){
  const host=$('#dynamicFormFields');if(!host)return;
  const previous={};host.querySelectorAll('[name]').forEach(input=>{previous[input.name]=input.type==='checkbox'?input.checked:input.value;});
  const fields=[...backendFormFields].filter(f=>f.enabled).sort((a,b)=>a.position-b.position);
  const blocks=[];
  for(let i=0;i<fields.length;i++){
    const f=fields[i];const label=lang==='de'?f.label_de:f.label_en;
    const req=f.is_required?' required':'';
    const safeKey=esc(f.field_key);
    let control='';
    if(f.input_type==='textarea')control=`<textarea name="${safeKey}" rows="3"${req}></textarea>`;
    else if(f.input_type==='select')control=`<select name="${safeKey}"${req}><option value="">${lang==='de'?'Bitte auswählen':'Please select'}</option>${(Array.isArray(f.options)?f.options:[]).map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('')}</select>`;
    else if(f.input_type==='checkbox')control=`<input type="checkbox" name="${safeKey}" value="true"${req}>`;
    else control=`<input type="${['text','email','tel','number','date'].includes(f.input_type)?f.input_type:'text'}" name="${safeKey}"${f.input_type==='number'?' min="1"':''}${req}>`;
    const checkboxClass=f.input_type==='checkbox'?' request-checkbox':' request-dynamic-control';
    blocks.push(`<label class="secure-field ${f.input_type==='textarea'?'secure-field-full':''}${f.input_type==='checkbox'?' secure-field-check':''}"><span>${esc(label||f.field_key)}${f.is_required?' *':''}</span><div class="secure-control${checkboxClass}">${control}</div></label>`);
  }
  host.innerHTML=blocks.join('');
  host.querySelectorAll('[name]').forEach(input=>{if(Object.prototype.hasOwnProperty.call(previous,input.name)){if(input.type==='checkbox')input.checked=Boolean(previous[input.name]);else input.value=previous[input.name];}});
}
async function initializeSecureRequestForm(){
  if(!backendConfigured)return;
  const legacy=$('#legacyFormFields'),dynamic=$('#dynamicFormFields');
  const submit=$('#requestForm button[type="submit"]');
  $('#exportAllRequests').hidden=true;
  const foot=$('.form-footnote');if(foot)foot.textContent=lang==='de'?'Anfragen werden über den geschützten Backend-Zugang übermittelt.':'Inquiries are submitted through the protected backend.';
  $('#requestDesc').textContent=lang==='de'?'Anfragen werden über Supabase gespeichert. Nutze echte Kontaktdaten erst nach erfolgreichem Sicherheits- und Zugriffstest.':'Inquiries are stored through Supabase. Use real contact data only after the security and access tests have passed.';
  $('#privacyNote').textContent=lang==='de'?'Backend-Modus: Bitte die Datenschutzerklärung veröffentlichen und keine sensiblen Daten übermitteln, solange die Konfiguration nicht geprüft wurde.':'Backend mode: publish a privacy notice and do not submit sensitive information until the configuration has been reviewed.';
  if(!supabaseClient){if(submit)submit.disabled=true;$('#formMessage').textContent=lang==='de'?'Backend-Konfiguration oder Verbindung fehlt. Es werden keine Daten gespeichert.':'Backend configuration or connection is missing. No data will be saved.';$('#formMessage').classList.add('error');return;}
  try{
    const {data,error}=await supabaseClient.from('form_fields').select('id,field_key,label_de,label_en,input_type,is_required,options,position,enabled').eq('enabled',true).order('position');
    if(error)throw error;
    if(!Array.isArray(data)||!data.length)throw new Error('No enabled fields are configured.');
    backendFormFields=data;backendFormReady=true;
    legacy.querySelectorAll('input,select,textarea,button').forEach(control=>{control.disabled=true;if(control.name){control.dataset.legacyName=control.name;control.name=`legacy_${control.name}`;}});
    legacy.hidden=true;dynamic.hidden=false;renderSecureFormFields();
  }catch(error){
    console.error('Could not load public form configuration:',error);
    if(submit)submit.disabled=true;
    $('#formMessage').textContent=lang==='de'?'Sicheres Formular kann nicht geladen werden. Bitte Konfiguration prüfen. Es wurden keine Daten gespeichert.':'Secure form could not be loaded. Check configuration. No data was saved.';
    $('#formMessage').classList.add('error');
  }
}

$('#showDrawing').addEventListener('click',()=>$('#drawingDialog').showModal());
$('#closeDrawing').addEventListener('click',()=>$('#drawingDialog').close());
$('#drawingDialog').addEventListener('click',e=>{if(e.target===$('#drawingDialog'))$('#drawingDialog').close()});
$('#resetView').addEventListener('click',()=>detailViewer?.reset());
$('#menuToggle').addEventListener('click',()=>$('.main-nav').classList.toggle('open'));
$$('.main-nav a').forEach(a=>a.addEventListener('click',()=>$('.main-nav').classList.remove('open')));
// Apply the German UI translations at startup as well as when the language toggle is clicked.
setLanguage(lang);
updateRequestExportUI();
if(backendConfigured){initializeSecureRequestForm();}else if(secureBackendLoadError){const submit=$('#requestForm button[type="submit"]');if(submit)submit.disabled=true;}
$('#heroModel').parentElement.querySelector('.visual-caption span:first-child').textContent=parts[0].id;
heroViewer=createViewer($('#heroModel'),parts[0]);
