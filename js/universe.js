/* ============================================
   INNER LIGHT — Universe v2
   Galaxy + Planets (corners) + Twinkling Stars
============================================ */
(function () {
  const canvas   = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 500);
  camera.position.set(0, 8, 50);
  camera.lookAt(0, 0, 0);

  scene.fog = new THREE.FogExp2(0x00000f, 0.007);

  /* ---- Lights ---- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const greenLight  = new THREE.PointLight(0x52b788, 2.5, 100);
  const goldLight   = new THREE.PointLight(0xe8c97e, 2,   100);
  const purpleLight = new THREE.PointLight(0x9b72cf, 2,   80);
  greenLight.position.set(-30, 15, 10);
  goldLight.position.set(30, -10, 5);
  purpleLight.position.set(0, -20, -5);
  scene.add(greenLight, goldLight, purpleLight);

  /* ============ GALAXY ============ */
  const COUNT = 16000, RADIUS = 90, BRANCHES = 5;
  const gPos = new Float32Array(COUNT * 3);
  const gCol = new Float32Array(COUNT * 3);
  const cIn  = new THREE.Color(0xe8c97e);
  const cOut = new THREE.Color(0x2d6a4f);

  for (let i = 0; i < COUNT; i++) {
    const r  = Math.pow(Math.random(), 1.4) * RADIUS;
    const b  = (i % BRANCHES) / BRANCHES * Math.PI * 2;
    const sp = r * 1.3;
    const rx = (Math.pow(Math.random(), 3) * (Math.random()<0.5?1:-1)) * r * 0.06;
    const ry = (Math.pow(Math.random(), 3) * (Math.random()<0.5?1:-1)) * r * 0.02;
    const rz = (Math.pow(Math.random(), 3) * (Math.random()<0.5?1:-1)) * r * 0.06;
    gPos[i*3]   = Math.cos(b+sp)*r + rx;
    gPos[i*3+1] = ry;
    gPos[i*3+2] = Math.sin(b+sp)*r + rz;
    const m = cIn.clone().lerp(cOut, r/RADIUS);
    gCol[i*3]=m.r; gCol[i*3+1]=m.g; gCol[i*3+2]=m.b;
  }

  const galaxyGeo = new THREE.BufferGeometry();
  galaxyGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
  galaxyGeo.setAttribute('color',    new THREE.BufferAttribute(gCol, 3));
  const galaxy = new THREE.Points(galaxyGeo, new THREE.PointsMaterial({
    size:0.3, vertexColors:true, transparent:true, opacity:0.9,
    depthWrite:false, blending:THREE.AdditiveBlending, sizeAttenuation:true,
  }));
  galaxy.rotation.x = Math.PI * 0.15;
  galaxy.position.y = -20;
  scene.add(galaxy);

  /* ============ TWINKLING STARS ============ */
  const SCOUNT = 2500;
  const sPos  = new Float32Array(SCOUNT * 3);
  const sCol  = new Float32Array(SCOUNT * 3);
  const sSizes= new Float32Array(SCOUNT);
  const sPal  = [
    new THREE.Color(0xffffff),
    new THREE.Color(0x95d5b2),
    new THREE.Color(0xe8c97e),
    new THREE.Color(0x9b72cf),
    new THREE.Color(0xc8e6ff),
    new THREE.Color(0xffccaa),
  ];

  for (let i = 0; i < SCOUNT; i++) {
    sPos[i*3]   = (Math.random()-0.5)*320;
    sPos[i*3+1] = (Math.random()-0.5)*220;
    sPos[i*3+2] = (Math.random()-0.5)*180 - 20;
    const c = sPal[Math.floor(Math.random()*sPal.length)];
    sCol[i*3]=c.r; sCol[i*3+1]=c.g; sCol[i*3+2]=c.b;
    sSizes[i] = 0.2 + Math.random() * 0.6;
  }

  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  starGeo.setAttribute('color',    new THREE.BufferAttribute(sCol, 3));
  starGeo.setAttribute('size',     new THREE.BufferAttribute(sSizes, 1));

  const starMat = new THREE.PointsMaterial({
    size:0.35, vertexColors:true, transparent:true, opacity:1,
    sizeAttenuation:true, blending:THREE.AdditiveBlending, depthWrite:false,
  });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  /* ============ PLANETS — corners only ============ */
  const planets = [];

  function makePlanet(radius, color, x, y, z, hasRing, ringColor) {
    const group = new THREE.Group();
    const mesh  = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 40, 40),
      new THREE.MeshPhongMaterial({ color, shininess:80, transparent:true, opacity:0.92 })
    );
    group.add(mesh);

    // Atmosphere
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(radius*1.1, 32, 32),
      new THREE.MeshPhongMaterial({ color, transparent:true, opacity:0.07, side:THREE.BackSide })
    ));

    if (hasRing) {
      const rGeo = new THREE.TorusGeometry(radius*1.9, radius*0.2, 3, 80);
      const rMat = new THREE.MeshPhongMaterial({ color:ringColor||0xe8c97e, transparent:true, opacity:0.55, side:THREE.DoubleSide });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.x = Math.PI * 0.38;
      group.add(ring);
      const rWire = new THREE.Mesh(rGeo, new THREE.MeshBasicMaterial({ color:ringColor||0xe8c97e, wireframe:true, transparent:true, opacity:0.12 }));
      rWire.rotation.x = Math.PI * 0.38;
      group.add(rWire);
    }

    group.position.set(x, y, z);
    scene.add(group);
    planets.push({ group, mesh, speed:0.002+Math.random()*0.002, offset:Math.random()*Math.PI*2 });
    return group;
  }

  // Only ONE ringed planet — top right corner, far from center
  makePlanet(5, 0xc9a84c, 32, 18, -28, true, 0xe8c97e);

  // Small planets in other corners — no rings
  makePlanet(2.2, 0x6b3fa0, -34, 16, -22, false);   // top left
  makePlanet(1.8, 0x2d6a4f, -30, -18, -18, false);  // bottom left
  makePlanet(2.0, 0x8ecae6, 30, -16, -20, false);   // bottom right

  /* ============ NEBULA ============ */
  function makeNebula(n, color, cx, cy, cz, spread) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(n*3);
    for (let i=0;i<n;i++) {
      pos[i*3]   = cx+(Math.random()-0.5)*spread;
      pos[i*3+1] = cy+(Math.random()-0.5)*spread*0.4;
      pos[i*3+2] = cz+(Math.random()-0.5)*spread;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
      color, size:1.0, transparent:true, opacity:0.05,
      blending:THREE.AdditiveBlending, depthWrite:false,
    })));
  }
  makeNebula(900, 0x52b788, -40, 5, -35, 35);
  makeNebula(900, 0x9b72cf,  40,-5, -40, 32);
  makeNebula(700, 0xe8c97e,   0,22, -45, 28);

  /* ============ MOUSE ============ */
  let mouseX=0, mouseY=0, targetX=0, targetY=0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX/window.innerWidth  - 0.5)*2;
    mouseY = (e.clientY/window.innerHeight - 0.5)*2;
  });

  /* ============ RESIZE ============ */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ============ TWINKLE ============ */
  let twinkleTime = 0;

  /* ============ LOOP ============ */
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.004;
    twinkleTime += 0.02;

    targetX += (mouseX - targetX)*0.025;
    targetY += (mouseY - targetY)*0.025;

    // Galaxy
    galaxy.rotation.y = time * 0.05;

    // Stars twinkle — vary opacity
    starMat.opacity = 0.75 + Math.sin(twinkleTime * 0.8) * 0.25;
    stars.rotation.y = time * 0.008;

    // Individual star size twinkle via size attribute
    const sizes = starGeo.attributes.size.array;
    for (let i = 0; i < SCOUNT; i++) {
      sizes[i] = (0.2 + Math.random() * 0.01) + Math.abs(Math.sin(twinkleTime * 0.5 + i * 0.3)) * 0.5;
    }
    starGeo.attributes.size.needsUpdate = true;

    // Lights animate
    greenLight.position.x  = Math.sin(time*0.5)*35;
    greenLight.position.y  = Math.cos(time*0.3)*20;
    goldLight.position.x   = Math.cos(time*0.4)*30;
    goldLight.position.y   = Math.sin(time*0.6)*15;
    purpleLight.position.x = Math.sin(time*0.3+1)*25;

    // Planets
    planets.forEach(p => {
      p.group.rotation.y += p.speed;
      p.mesh.rotation.y  += p.speed*0.5;
      p.group.position.y += Math.sin(time*0.4 + p.offset)*0.008;
    });

    // Camera parallax
    camera.position.x += (targetX*5 - camera.position.x)*0.04;
    camera.position.y += (-targetY*3 - camera.position.y + 8)*0.04;
    camera.lookAt(0,0,0);

    renderer.render(scene, camera);
  }
  animate();
})();