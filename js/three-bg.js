/* ============================================
   INNER LIGHT — Three.js 3D Background
   Floating geometric shapes + star field
============================================ */

(function () {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 30;

  /* ---- Lights ---- */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const greenLight = new THREE.PointLight(0x52b788, 2.5, 60);
  greenLight.position.set(-15, 10, 10);
  scene.add(greenLight);

  const goldLight = new THREE.PointLight(0xe8c97e, 1.8, 50);
  goldLight.position.set(15, -10, 5);
  scene.add(goldLight);

  const purpleLight = new THREE.PointLight(0x9b72cf, 1.5, 40);
  purpleLight.position.set(0, 15, -5);
  scene.add(purpleLight);

  /* ---- Star Field ---- */
  const starCount = 320;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const starPalette = [
    new THREE.Color(0x52b788),
    new THREE.Color(0xe8c97e),
    new THREE.Color(0x9b72cf),
    new THREE.Color(0xf0ede6),
  ];

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3]     = (Math.random() - 0.5) * 120;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;

    const c = starPalette[Math.floor(Math.random() * starPalette.length)];
    starColors[i * 3]     = c.r;
    starColors[i * 3 + 1] = c.g;
    starColors[i * 3 + 2] = c.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color',    new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });

  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  /* ---- Floating Geometric Meshes ---- */
  const meshes = [];

  function createMesh(geometry, color, x, y, z, scale) {
    const mat = new THREE.MeshPhongMaterial({
      color,
      transparent: true,
      opacity: 0.12,
      wireframe: false,
      shininess: 80,
    });
    const wireframeMat = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const solid = new THREE.Mesh(geometry, mat);
    const wire  = new THREE.Mesh(geometry, wireframeMat);
    const group = new THREE.Group();
    group.add(solid, wire);
    group.position.set(x, y, z);
    group.scale.setScalar(scale);
    scene.add(group);
    meshes.push(group);
    return group;
  }

  // Icosahedra — green
  createMesh(new THREE.IcosahedronGeometry(3, 1), 0x52b788, -18, 8, -8, 1);
  createMesh(new THREE.IcosahedronGeometry(2, 1), 0x95d5b2,  20, -6, -5, 0.8);

  // Octahedra — gold
  createMesh(new THREE.OctahedronGeometry(2.5, 0), 0xe8c97e, 14, 10, -12, 1);
  createMesh(new THREE.OctahedronGeometry(1.8, 0), 0xc9a84c, -22, -8, -6, 0.9);

  // Torus — purple
  createMesh(new THREE.TorusGeometry(3, 0.6, 12, 40), 0x9b72cf, 0, -14, -10, 0.9);
  createMesh(new THREE.TorusGeometry(2, 0.4, 10, 30), 0x6b3fa0, -10, 12, -15, 0.7);

  // Dodecahedron — white
  createMesh(new THREE.DodecahedronGeometry(2, 0), 0xf0ede6, 8, -10, -8, 0.75);

  /* ---- Mouse Parallax ---- */
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ---- Resize ---- */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ---- Animation Loop ---- */
  let time = 0;

  function animate() {
    requestAnimationFrame(animate);
    time += 0.005;

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.03;
    targetY += (mouseY - targetY) * 0.03;

    // Rotate stars slowly
    stars.rotation.y = time * 0.04;
    stars.rotation.x = time * 0.015;

    // Animate lights
    greenLight.position.x  = Math.sin(time * 0.7) * 20;
    greenLight.position.y  = Math.cos(time * 0.5) * 15;
    goldLight.position.x   = Math.cos(time * 0.6) * 18;
    goldLight.position.y   = Math.sin(time * 0.8) * 12;
    purpleLight.position.x = Math.sin(time * 0.4) * 15;
    purpleLight.position.z = Math.cos(time * 0.3) * 10;

    // Animate each mesh
    meshes.forEach((mesh, i) => {
      const speed  = 0.003 + i * 0.001;
      const offset = i * 1.2;
      mesh.rotation.x += speed;
      mesh.rotation.y += speed * 1.3;
      mesh.position.y += Math.sin(time + offset) * 0.008;
      mesh.position.x += Math.cos(time * 0.7 + offset) * 0.004;
    });

    // Camera parallax
    camera.position.x += (targetX * 3 - camera.position.x) * 0.05;
    camera.position.y += (-targetY * 2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();
})();
