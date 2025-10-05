/* script.js — 3D scene (Three.js via CDN), منتجات ديناميكية، تفاعل، صوت وترحيب عربي */

const YEAR = document.getElementById('year');
if (YEAR) YEAR.textContent = new Date().getFullYear();

// إعداد المشهد والكاميرا والـ renderer
let scene, camera, renderer, character;
let mouseX = 0, mouseY = 0;

function initThree(){
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.2, 4);

  renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.getElementById('webgl-container').appendChild(renderer.domElement);

  // إضاءة احترافية
  const hemi = new THREE.HemisphereLight(0xfff7e6, 0x220022, 0.6);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 1.0);
  dir.position.set(5,10,7);
  dir.castShadow = true;
  scene.add(dir);

  // أرضية تعرض انعكاس بسيط (plane)
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(40,40),
    new THREE.MeshStandardMaterial({color:0x0b0010, metalness:0.1, roughness:0.7})
  );
  plane.rotation.x = -Math.PI/2;
  plane.position.y = -1.6;
  scene.add(plane);

  // جزيئات ذهبية بسيطة (Points)
  initParticles();

  // تحميل نموذج glTF (مثال: نموذج من حزمة أمثلة glTF — يمكنك استبداله برابط أنمي لاحقاً)
  const loader = new THREE.GLTFLoader();
  const modelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF/CesiumMan.gltf';
  loader.load(modelUrl,
    (g) => {
      character = g.scene;
      character.scale.set(1.3,1.3,1.3);
      character.position.set(0,-1.2,0);
      scene.add(character);
    },
    undefined,
    (err) => console.error('خطأ في تحميل النموذج:', err)
  );

  // تفاعل مع الماوس / اللمس
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = - (e.clientY / window.innerHeight) * 2 + 1;
  });
  window.addEventListener('resize', onResize);
}

function onResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// particles
function initParticles(){
  const count = 800;
  const positions = new Float32Array(count * 3);
  for (let i=0;i<count;i++){
    positions[i*3+0] = (Math.random()-0.5) * 16;
    positions[i*3+1] = (Math.random()-0.1) * 10 - 2;
    positions[i*3+2] = (Math.random()-0.5) * 10;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({color:0xffd700, size:0.06});
  const pts = new THREE.Points(geom, mat);
  scene.add(pts);
}

// animation loop
function animate(){
  requestAnimationFrame(animate);

  // تحريك الكاميرا بعامل بسيط لإحساس العمق
  camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.05;
  camera.position.y += (1.2 + mouseY * 0.6 - camera.position.y) * 0.05;
  camera.lookAt(0,0.6,0);

  if (character){
    // دوران خفيف وتتبّع لموضع الماوس
    character.rotation.y += 0.01;
    character.position.x += (mouseX * 0.9 - character.position.x) * 0.08;
    character.position.y += (mouseY * 0.8 - character.position.y) * 0.06;
  }

  renderer.render(scene, camera);
}

/* --- منتجات ديناميكية (تعبئة الشبكة بمنتجات تستخدم صورك المحلية + صور احتياط من الإنترنت) --- */
const PRODUCTS = [
  {id:1, title:'علبة تاج الفرح', desc:'تغليف ذهبي فاخر ومفاجأة داخلية.', img:'images/a4.jpg'},
  {id:2, title:'باقة هدايا العرسان', desc:'تجميع أنيق للضيوف.', img:'images/a5.jpg'},
  {id:3, title:'صندوق الذكريات', desc:'خشبي نقش ذهبي حسب الطلب.', img:'images/a6.jpg'},
  {id:4, title:'طقم الضيوف الراقي', desc:'هدايا صغيرة أنيقة.', img:'images/a7.jpg'},
  // احتياط (صور عبر الإنترنت — مصادر: Unsplash)
  {id:5, title:'تغليف ذهبي فاخر', desc:'صندوق هدايا أنيق', img:'https://images.unsplash.com/photo-1618300895436-6d3cf1b7f7d3?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=0'},
  {id:6, title:'سلة ورود ملكية', desc:'باقة بنفسجية وذهبية', img:'https://images.unsplash.com/photo-1553456558-aff63285bdd2?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=0'}
];

function renderProducts(){
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';
  PRODUCTS.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `<img src="${p.img}" alt="${p.title}" onerror="this.src='images/a4.jpg'">
                     <h3>${p.title}</h3>
                     <p>${p.desc}</p>
                     <div style="margin-top:10px"><button class="btn primary" onclick="addToCart(${p.id})">اطلب الآن</button></div>`;
    grid.appendChild(div);
  });
}
function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  laboboSpeak(`${p.title} تمت إضافته للسلة. شكرًا لاختيارك تاج العروس.`);
}

/* --- صوت وترحيب عربي مع تزامن نصي --- */
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
if (musicBtn){
  musicBtn.addEventListener('click', ()=> {
    if (bgMusic.paused) { bgMusic.play(); musicBtn.setAttribute('aria-pressed','true'); }
    else { bgMusic.pause(); musicBtn.setAttribute('aria-pressed','false'); }
  });
}
// حاول التشغيل بصمت (قد تمنع المتصفحات التشغيل التلقائي)
try { bgMusic.volume = 0.28; bgMusic.play().catch(()=>{}); } catch(e){}

function speakArabic(text){
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  // حاول اختيار صوت عربي إن وُجد
  const voices = speechSynthesis.getVoices();
  const ar = voices.find(v => v.lang && v.lang.startsWith('ar')) || voices.find(v => /Arabic|Google/i.test(v.name));
  if (ar) { u.voice = ar; u.lang = ar.lang || 'ar-SA'; }
  u.rate = 0.95;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

function laboboSpeak(text){
  // عرض تنبيه بسيط (يمكن استبدال بنمط bubble مراحل لاحقًا)
  console.info('LABOBO:', text);
  speakArabic(text);
}

/* --- Tour بسيط يقود الزائر عبر الموقع --- */
document.getElementById('startTourBtn').addEventListener('click', async () => {
  const steps = [
    {el:'#hero', msg:'مرحبا! أنا مرشد تاج العروس — سنأخذ جولة قصيرة.'},
    {el:'#about', msg:'هنا تعرف على تاريخ المتجر وما نقدمه.'},
    {el:'#products', msg:'تشكيلة مختارة من أفضل الهدايا.'},
    {el:'#contact', msg:'للحجز السريع تواصل معنا عبر واتساب.'}
  ];
  for (const s of steps){
    document.querySelector(s.el).scrollIntoView({behavior:'smooth', block:'center'});
    laboboSpeak(s.msg);
    await new Promise(r=>setTimeout(r,2200));
  }
  laboboSpeak('انتهت الجولة. هل أساعدك في اختيار هدية؟');
});

/* --- init --- */
initThree();
renderProducts();
animate();
