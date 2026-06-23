/* ============================================
   INNER LIGHT — Universe 3D (Three.js)
   Galaxy + Planets + Rings + Nebula + Stars
============================================ */
(function () {
  const canvas   = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.set(0, 12, 55);
  camera.lookAt(0, 0, 0);

  /* ---- Fog ---- */
  scene.fog = new THREE.FogExp2(0x00000f, 0.008);

  /* ---- Lights ---- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  const sunLight = new THREE.PointLight(0xfff5cc, 3, 200);
  sunLight.position.set(0, 30, 0);
  scene.add(sunLight);

  const greenLight  = new THREE.PointLight(0x52b788, 2, 80);
  greenLight.position.set(-30, 10, 10);
  scene.add(greenLight);

  const goldLight   = new THREE.PointLight(0xe8c97e, 2, 80);
  goldLight.position.set(30, -10, 5);
  scene.add(goldLight);

  const purpleLight = new THREE.PointLight(0x9b72cf, 1.5, 60);
  purpleLight.position.set(0, -20, -10);
  scene.add(purpleLight);

  /* ============ GALAXY ============ */
  const galaxyParams = {
    count:     14000,
    radius:    80,
    branches:  5,
    spin:      1.2,
    randomness: 0.5,
    randomPow: 2.5,
    insideColor:  new THREE.Color(0xe8c97e),
    outsideColor: new THREE.Color(0x2d6a4f),
  };

  const galaxyGeo  = new THREE.BufferGeometry();
  const galaxyPos  = new Float32Array(galaxyParams.count * 3);
  const galaxyCol  = new Float32Array(galaxyParams.count * 3);
  const colorIn    = galaxyParams.insideColor;
  const colorOut   = galaxyParams.outsideColor;

  for (let i = 0; i < galaxyParams.count; i++) {
    const r      = Math.pow(Math.random(), 1.5) * galaxyParams.radius;
    const branch = (i % galaxyParams.branches) / galaxyParams.branches * Math.PI * 2;
    const spin   = r * galaxyParams.spin;
    const rand   = (axis) => Math.pow(Math.random(), galaxyParams.randomPow) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * r * 0.1;

    galaxyPos[i*3]   = Math.cos(branch + spin) * r + rand('x');
    galaxyPos[i*3+1] = rand('y') * 0.3;
    galaxyPos[i*3+2] = Math.sin(branch + spin) * r + rand('z');

    const mixed = colorIn.clone().lerp(colorOut, r / galaxyParams.radius);
    galaxyCol[i*3]   = mixed.r;
    galaxyCol[i*3+1] = mixed.g;
    galaxyCol[i*3+2] = mixed.b;
  }

  galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPos, 3));
  galaxyGeo.setAttribute('color',    new THREE.BufferAttribute(galaxyCol, 3));

  const galaxyMat = new THREE.PointsMaterial({
    size: 0.22, sizeAttenuation: true,
    vertexColors: true, transparent: true, opacity: 0.85,
    depthWrite: false, blending: THREE.AdditiveBlending,
  });

  const galaxy = new THREE.Points(galaxyGeo, galaxyMat);
  galaxy.rotation.x = Math.PI * 0.15;
  galaxy.position.y = -15;
  scene.add(galaxy);

  /* ============ EXTRA STAR FIELD ============ */
  const starCount = 2000;
  const starGeo   = new THREE.BufferGeometry();
  const starPos   = new Float32Array(starCount * 3);
  const starCol   = new Float32Array(starCount * 3);
  const sPalette  = [
    new THREE.Color(0xffffff),
    new THREE.Color(0x95d5b2),
    new THREE.Color(0xe8c97e),
    new THREE.Color(0x9b72cf),
    new THREE.Color(0xc8e6ff),
  ];

  for (let i = 0; i < starCount; i++) {
    starPos[i*3]   = (Math.random() - 0.5) * 300;
    starPos[i*3+1] = (Math.random() - 0.5) * 200;
    starPos[i*3+2] = (Math.random() - 0.5) * 200 - 20;
    const c = sPalette[Math.floor(Math.random() * sPalette.length)];
    starCol[i*3]   = c.r;
    starCol[i*3+1] = c.g;
    starCol[i*3+2] = c.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color',    new THREE.BufferAttribute(starCol, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.15, vertexColors: true,
    transparent: true, opacity: 0.9,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });

  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  /* ============ PLANETS ============ */
  const planets = [];

  function makePlanet(radius, color, x, y, z, hasRing, ringColor) {
    const geo  = new THREE.SphereGeometry(radius, 32, 32);
    const mat  = new THREE.MeshPhongMaterial({
      color, shininess: 60, transparent: true, opacity: 0.9,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);

    const group = new THREE.Group();
    group.add(mesh);

    if (hasRing) {
      const rGeo = new THREE.TorusGeometry(radius * 1.8, radius * 0.22, 3, 64);
      const rMat = new THREE.MeshPhongMaterial({
        color: ringColor || 0xe8c97e,
        transparent: true, opacity: 0.5,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.x = Math.PI * 0.42;
      group.add(ring);

      // Wireframe ring
      const rWire = new THREE.Mesh(rGeo, new THREE.MeshBasicMaterial({
        color: ringColor || 0xe8c97e, wireframe:true, transparent:true, opacity:0.15,
      }));
      rWire.rotation.x = Math.PI * 0.42;
      group.add(rWire);
    }

    // Atmosphere glow
    const atmGeo = new THREE.SphereGeometry(radius * 1.12, 32, 32);
    const atmMat = new THREE.MeshPhongMaterial({
      color, transparent: true, opacity: 0.08,
      side: THREE.BackSide,
    });
    group.add(new THREE.Mesh(atmGeo, atmMat));

    scene.add(group);
    planets.push({ group, mesh, speed: 0.002 + Math.random() * 0.003, offset: Math.random() * Math.PI * 2 });
    return group;
  }

  // Saturn-like — gold with rings
  makePlanet(4.5, 0xc9a84c, -28, 8, -20, true, 0xe8c97e);

  // Purple planet with rings
  makePlanet(3.2, 0x6b3fa0, 30, -5, -25, true, 0x9b72cf);

  // Green planet — no ring
  makePlanet(2.8, 0x2d6a4f, -20, -12, -10, false);

  // Small white/blue
  makePlanet(1.8, 0x8ecae6, 22, 14, -15, false);

  // Tiny gold
  makePlanet(1.2, 0xe8c97e, -8, 16, -8, false);

  // Medium purple no ring
  makePlanet(2.2, 0x9b72cf, 18, -16, -12, false);

  /* ============ NEBULA CLOUDS ============ */
  function makeNebula(count, color, cx, cy, cz, spread) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3]   = cx + (Math.random()-0.5)*spread;
      pos[i*3+1] = cy + (Math.random()-0.5)*spread*0.5;
      pos[i*3+2] = cz + (Math.random()-0.5)*spread;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color, size: 0.8, transparent:true, opacity:0.06,
      blending: THREE.AdditiveBlending, depthWrite:false,
    });
    scene.add(new THREE.Points(geo, mat));
  }

  makeNebula(800, 0x52b788, -35, 5, -30, 30);
  makeNebula(800, 0x9b72cf, 35, -5, -35, 28);
  makeNebula(600, 0xe8c97e, 0, 20, -40, 25);
  makeNebula(500, 0x2d6a4f, -10, -18, -20, 20);

  /* ============ MOUSE PARALLAX ============ */
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ============ RESIZE ============ */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ============ ANIMATION LOOP ============ */
  let time = 0;

  function animate() {
    requestAnimationFrame(animate);
    time += 0.004;

    // Smooth mouse
    targetX += (mouseX - targetX) * 0.025;
    targetY += (mouseY - targetY) * 0.025;

    // Galaxy rotation
    galaxy.rotation.y = time * 0.06;

    // Stars slow drift
    stars.rotation.y = time * 0.012;
    stars.rotation.x = time * 0.005;

    // Animate lights
    greenLight.position.x  = Math.sin(time * 0.5) * 35;
    greenLight.position.y  = Math.cos(time * 0.3) * 20;
    goldLight.position.x   = Math.cos(time * 0.4) * 30;
    goldLight.position.y   = Math.sin(time * 0.6) * 15;
    purpleLight.position.x = Math.sin(time * 0.3 + 1) * 25;
    purpleLight.position.z = Math.cos(time * 0.2) * 20;

    // Animate planets
    planets.forEach((p, i) => {
      p.group.rotation.y += p.speed;
      p.mesh.rotation.y  += p.speed * 0.5;
      p.group.position.y += Math.sin(time * 0.5 + p.offset) * 0.01;
    });

    // Camera parallax
    camera.position.x += (targetX * 6 - camera.position.x) * 0.04;
    camera.position.y += (-targetY * 4 - camera.position.y + 12) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();
})();