import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useSeason } from '../context/SeasonContext';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function makeLathe(points: Array<[number, number]>, segments = 72) {
  return new THREE.LatheGeometry(
    points.map(([x, y]) => new THREE.Vector2(x, y)),
    segments
  );
}

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    group: THREE.Group;
    cityGroup: THREE.Group;
    beachGroup: THREE.Group;
    particles: THREE.Points;
    steam: THREE.Points;
    bubbles: THREE.Points;
    shimmer: THREE.Mesh[];
    animId: number;
    mouse: { x: number; y: number };
    targetRot: { x: number; y: number };
    currentRot: { x: number; y: number };
    targetMorph: number;
    morphProgress: number;
    isBeach: boolean;
  } | null>(null);

  const { isBeach } = useSeason();
  const isBeachRef = useRef(isBeach);

  useEffect(() => {
    isBeachRef.current = isBeach;
    if (sceneRef.current) {
      sceneRef.current.isBeach = isBeach;
      sceneRef.current.targetMorph = isBeach ? 1 : 0;
    }
  }, [isBeach]);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const isMobile = window.matchMedia('(pointer: coarse), (max-width: 768px)').matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isMobile ? 1.48 : 1.28;
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 5.2);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.55;
    pmrem.dispose();

    const ambientLight = new THREE.HemisphereLight(0xfff3df, 0x041410, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff0c4, 4.2);
    keyLight.position.set(2.4, 4.2, 5);
    keyLight.castShadow = !isMobile;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00d6c0, 2.9);
    rimLight.position.set(-4, 2.2, 2.2);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xd4af37, 2.4, 10);
    fillLight.position.set(1.8, -1.8, 3.4);
    scene.add(fillLight);

    const floorGlow = new THREE.PointLight(0xff4e50, 1.3, 8);
    floorGlow.position.set(-1.8, -2.1, 2.6);
    scene.add(floorGlow);

    const group = new THREE.Group();
    group.scale.setScalar(isMobile ? 0.76 : 0.95);
    scene.add(group);

    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.55, 56), shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.22;
    shadow.position.z = -0.08;
    group.add(shadow);

    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xd6b24a,
      metalness: 1,
      roughness: 0.14,
      clearcoat: 0.9,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.35,
    });

    const ceramicMat = new THREE.MeshPhysicalMaterial({
      color: 0xfff1de,
      roughness: 0.14,
      metalness: 0.02,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      sheen: 0.35,
      sheenColor: new THREE.Color(0xfff6e6),
      envMapIntensity: 0.9,
    });

    const espressoMat = new THREE.MeshPhysicalMaterial({
      color: 0x321405,
      emissive: 0x2b0d02,
      emissiveIntensity: 0.25,
      roughness: 0.18,
      metalness: 0.02,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
    });

    const cityGroup = new THREE.Group();
    cityGroup.position.y = isBeachRef.current ? 8 : 0;

    const saucer = new THREE.Mesh(makeLathe([
      [0, -0.94], [0.42, -0.94], [0.82, -0.9], [1.02, -0.82],
      [0.9, -0.74], [0.5, -0.72], [0.18, -0.75], [0, -0.77],
    ]), ceramicMat);
    saucer.castShadow = true;
    saucer.receiveShadow = true;
    cityGroup.add(saucer);

    const saucerRing = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.024, 12, 84), goldMat);
    saucerRing.rotation.x = Math.PI / 2;
    saucerRing.position.y = -0.735;
    cityGroup.add(saucerRing);

    const cupBody = new THREE.Mesh(makeLathe([
      [0, -0.78], [0.32, -0.76], [0.47, -0.45], [0.55, -0.04],
      [0.5, 0.1], [0.42, 0.14], [0.28, 0.08], [0, 0.06],
    ]), ceramicMat);
    cupBody.castShadow = true;
    cityGroup.add(cupBody);

    const cupRim = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.032, 14, 84), goldMat);
    cupRim.rotation.x = Math.PI / 2;
    cupRim.position.y = 0.12;
    cityGroup.add(cupRim);

    const espresso = new THREE.Mesh(new THREE.CircleGeometry(0.47, 56), espressoMat);
    espresso.rotation.x = -Math.PI / 2;
    espresso.position.y = 0.125;
    cityGroup.add(espresso);

    const cremaMat = new THREE.MeshPhysicalMaterial({
      color: 0xc9823b,
      roughness: 0.34,
      clearcoat: 0.45,
      transparent: true,
      opacity: 0.86,
    });
    const cremaA = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.028, 8, 56), cremaMat);
    cremaA.rotation.x = -Math.PI / 2;
    cremaA.position.set(-0.04, 0.13, 0.03);
    cityGroup.add(cremaA);

    const cremaB = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.018, 8, 40), cremaMat);
    cremaB.rotation.x = -Math.PI / 2;
    cremaB.position.set(0.16, 0.132, -0.04);
    cityGroup.add(cremaB);

    const handle = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CubicBezierCurve3(
          new THREE.Vector3(0.51, -0.1, 0),
          new THREE.Vector3(1.02, -0.04, 0),
          new THREE.Vector3(1.0, -0.68, 0),
          new THREE.Vector3(0.45, -0.62, 0)
        ),
        26,
        0.055,
        12,
        false
      ),
      ceramicMat
    );
    handle.castShadow = true;
    cityGroup.add(handle);

    const handleGold = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CubicBezierCurve3(
          new THREE.Vector3(0.58, -0.13, 0.01),
          new THREE.Vector3(0.9, -0.12, 0.01),
          new THREE.Vector3(0.88, -0.55, 0.01),
          new THREE.Vector3(0.53, -0.55, 0.01)
        ),
        24,
        0.012,
        8,
        false
      ),
      goldMat
    );
    cityGroup.add(handleGold);

    const beanMat = new THREE.MeshPhysicalMaterial({
      color: 0x4a2410,
      roughness: 0.42,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
    });
    [
      [-0.72, -0.735, 0.32, 0.4],
      [-0.84, -0.74, 0.12, 1.9],
      [-0.62, -0.73, -0.38, 3.4],
      [0.6, -0.735, 0.52, 2.6],
      [0.74, -0.73, 0.28, 1.2],
      [0.68, -0.735, -0.42, 5.1],
      [-1.28, -1.2, 0.55, 0.9],
      [-1.16, -1.2, 0.72, 2.2],
      [1.24, -1.2, 0.48, 4.3],
      [1.38, -1.2, 0.3, 1.6],
    ].forEach(([x, y, z, ry], i) => {
      const bean = new THREE.Mesh(new THREE.SphereGeometry(0.062, 24, 18), beanMat);
      bean.scale.set(1, 0.62, 0.78);
      bean.position.set(x, y, z);
      bean.rotation.set(0.2 + (i % 3) * 0.3, ry, 0.1 + (i % 4) * 0.2);
      cityGroup.add(bean);
    });

    const cityShimmer = [
      new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.006, 6, 72), goldMat.clone()),
      new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.005, 6, 72), goldMat.clone()),
    ];
    cityShimmer.forEach((ring, index) => {
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.92 + index * 0.08;
      (ring.material as THREE.MeshPhysicalMaterial).transparent = true;
      (ring.material as THREE.MeshPhysicalMaterial).opacity = 0.42 - index * 0.12;
      cityGroup.add(ring);
    });

    const steamCount = isMobile ? 70 : 105;
    const steamPositions = new Float32Array(steamCount * 3);
    const steamVelocities = new Float32Array(steamCount);
    for (let i = 0; i < steamCount; i++) {
      steamPositions[i * 3] = (Math.random() - 0.5) * 0.38;
      steamPositions[i * 3 + 1] = Math.random() * 1.45 + 0.12;
      steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.32;
      steamVelocities[i] = 0.005 + Math.random() * 0.012;
    }
    const steamGeo = new THREE.BufferGeometry();
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
    const steamMat = new THREE.PointsMaterial({
      color: 0xfff8e9,
      size: isMobile ? 0.06 : 0.046,
      transparent: true,
      opacity: 0.36,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const steam = new THREE.Points(steamGeo, steamMat);
    cityGroup.add(steam);

    cityGroup.scale.setScalar(1.08);
    group.add(cityGroup);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xe7ffff,
      roughness: 0.02,
      metalness: 0,
      transmission: 0.92,
      transparent: true,
      opacity: 0.42,
      ior: 1.5,
      thickness: 0.46,
      side: THREE.DoubleSide,
      clearcoat: 1,
      clearcoatRoughness: 0,
      iridescence: 0.25,
      iridescenceIOR: 1.3,
      envMapIntensity: 1.2,
    });
    glassMat.depthWrite = false;

    const beachGroup = new THREE.Group();
    beachGroup.position.y = isBeachRef.current ? 0 : -8;

    const cocktailBowl = new THREE.Mesh(makeLathe([
      [0, -0.44], [0.13, -0.36], [0.42, -0.02], [0.82, 0.55],
      [0.76, 0.68], [0.28, 0.55], [0.07, -0.32], [0, -0.44],
    ]), glassMat);
    cocktailBowl.castShadow = true;
    beachGroup.add(cocktailBowl);

    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0xff5364,
      emissive: 0xd91d36,
      emissiveIntensity: 0.42,
      roughness: 0.08,
      metalness: 0,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
    });
    const cocktailLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.16, 0.56, 48), liquidMat);
    cocktailLiquid.position.y = 0.18;
    beachGroup.add(cocktailLiquid);

    const liquidTop = new THREE.Mesh(new THREE.CircleGeometry(0.69, 48), liquidMat);
    liquidTop.rotation.x = -Math.PI / 2;
    liquidTop.position.y = 0.46;
    beachGroup.add(liquidTop);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.78, 0.026, 8, 56),
      new THREE.MeshPhysicalMaterial({ color: 0xf8ffff, roughness: 0.04, transmission: 0.4, transparent: true, opacity: 0.72, clearcoat: 1 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.63;
    beachGroup.add(rim);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.062, 0.86, 24), glassMat);
    stem.position.y = -0.82;
    beachGroup.add(stem);

    const base = new THREE.Mesh(makeLathe([
      [0, -1.3], [0.48, -1.3], [0.62, -1.24], [0.42, -1.16],
      [0.08, -1.1], [0.05, -0.98], [0, -0.96],
    ]), glassMat);
    beachGroup.add(base);

    const iceMat = new THREE.MeshPhysicalMaterial({
      color: 0xe5ffff,
      roughness: 0.03,
      transmission: 0.8,
      transparent: true,
      opacity: 0.62,
      clearcoat: 1,
    });
    [
      [-0.22, 0.24, 0.16, 0.36],
      [0.18, 0.12, -0.08, -0.24],
      [0.04, 0.34, 0.02, 0.68],
      [0.3, 0.32, 0.18, 0.12],
    ].forEach(([x, y, z, rz]) => {
      const ice = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), iceMat);
      ice.position.set(x, y, z);
      ice.rotation.set(0.48, 0.28, rz);
      beachGroup.add(ice);
    });

    const strawMat = new THREE.MeshStandardMaterial({ color: 0xfff2d2, roughness: 0.28, metalness: 0.05 });
    const straw = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CubicBezierCurve3(
          new THREE.Vector3(0.16, -0.22, 0.08),
          new THREE.Vector3(0.2, 0.32, 0.08),
          new THREE.Vector3(0.38, 0.72, 0.08),
          new THREE.Vector3(0.52, 1.02, 0.08)
        ),
        20,
        0.026,
        8,
        false
      ),
      strawMat
    );
    beachGroup.add(straw);

    const strawAccent = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.LineCurve3(new THREE.Vector3(0.47, 0.92, 0.1), new THREE.Vector3(0.68, 1.0, 0.1)),
        10,
        0.022,
        10,
        false
      ),
      new THREE.MeshStandardMaterial({ color: 0xff4e50, roughness: 0.25 })
    );
    beachGroup.add(strawAccent);

    const garnishMat = new THREE.MeshPhysicalMaterial({ color: 0xa9db32, roughness: 0.44, clearcoat: 0.35 });
    const lime = new THREE.Mesh(new THREE.SphereGeometry(0.23, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), garnishMat);
    lime.position.set(0.72, 0.58, 0.02);
    lime.rotation.set(0.05, 0.15, -0.72);
    beachGroup.add(lime);

    const peel = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.014, 6, 30, Math.PI * 1.5),
      new THREE.MeshPhysicalMaterial({ color: 0xffc64a, roughness: 0.34, clearcoat: 0.55 })
    );
    peel.position.set(-0.44, 0.62, 0.1);
    peel.rotation.set(1.1, 0.2, -0.75);
    beachGroup.add(peel);

    const cherryMat = new THREE.MeshPhysicalMaterial({
      color: 0xc4132e,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      emissive: 0x5c0313,
      emissiveIntensity: 0.3,
    });
    const cherry = new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 18), cherryMat);
    cherry.position.set(0.55, 0.7, 0.14);
    beachGroup.add(cherry);

    const cherryStem = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CubicBezierCurve3(
          new THREE.Vector3(0.55, 0.76, 0.14),
          new THREE.Vector3(0.53, 0.9, 0.14),
          new THREE.Vector3(0.6, 0.96, 0.12),
          new THREE.Vector3(0.64, 1.0, 0.12)
        ),
        12,
        0.011,
        6,
        false
      ),
      new THREE.MeshStandardMaterial({ color: 0x3f5b1e, roughness: 0.5 })
    );
    beachGroup.add(cherryStem);

    const umbrella = new THREE.Mesh(
      new THREE.ConeGeometry(0.34, 0.16, 14, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xffd84c, side: THREE.DoubleSide, roughness: 0.42 })
    );
    umbrella.position.set(-0.46, 0.9, 0.06);
    umbrella.rotation.set(0.18, 0, 0.34);
    beachGroup.add(umbrella);

    const umbrellaStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.65, 12),
      new THREE.MeshStandardMaterial({ color: 0xf7df9e, roughness: 0.35 })
    );
    umbrellaStem.position.set(-0.32, 0.62, 0.06);
    umbrellaStem.rotation.z = -0.32;
    beachGroup.add(umbrellaStem);

    const beachShimmer = [
      new THREE.Mesh(new THREE.TorusGeometry(1.14, 0.006, 6, 72), goldMat.clone()),
      new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.005, 6, 72), goldMat.clone()),
    ];
    beachShimmer.forEach((ring, index) => {
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -1.27 + index * 0.08;
      const mat = ring.material as THREE.MeshPhysicalMaterial;
      mat.color.setStyle(index ? '#00d6c0' : '#ff6b6d');
      mat.transparent = true;
      mat.opacity = 0.34 - index * 0.08;
      beachGroup.add(ring);
    });

    const bubbleCount = isMobile ? 58 : 82;
    const bubblePositions = new Float32Array(bubbleCount * 3);
    for (let i = 0; i < bubbleCount; i++) {
      const radius = Math.random() * 0.54;
      const angle = Math.random() * Math.PI * 2;
      bubblePositions[i * 3] = Math.cos(angle) * radius;
      bubblePositions[i * 3 + 1] = Math.random() * 0.45 - 0.02;
      bubblePositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const bubbleGeo = new THREE.BufferGeometry();
    bubbleGeo.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3));
    const bubbleMat = new THREE.PointsMaterial({
      color: 0xcfffff,
      size: isMobile ? 0.045 : 0.036,
      transparent: true,
      opacity: 0.62,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const bubbles = new THREE.Points(bubbleGeo, bubbleMat);
    beachGroup.add(bubbles);

    beachGroup.scale.setScalar(1.06);
    group.add(beachGroup);

    const bgCount = isMobile ? 70 : 120;
    const bgPositions = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) {
      bgPositions[i * 3] = (Math.random() - 0.5) * 12;
      bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 8.5;
      bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1.8;
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    const bgMat = new THREE.PointsMaterial({
      color: isBeachRef.current ? 0x00a896 : 0xd4af37,
      size: isMobile ? 0.04 : 0.05,
      transparent: true,
      opacity: 0.46,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const particles = new THREE.Points(bgGeo, bgMat);
    scene.add(particles);

    const mouse = { x: 0, y: 0 };
    const targetRot = { x: 0, y: 0 };
    const currentRot = { x: 0, y: 0 };
    const startedAt = performance.now();
    let morphProgress = isBeachRef.current ? 1 : 0;

    const state = {
      renderer,
      scene,
      camera,
      group,
      cityGroup,
      beachGroup,
      particles,
      steam,
      bubbles,
      shimmer: [...cityShimmer, ...beachShimmer],
      animId: 0,
      mouse,
      targetRot,
      currentRot,
      targetMorph: morphProgress,
      morphProgress,
      isBeach: isBeachRef.current,
    };
    sceneRef.current = state;

    const onMouseMove = (event: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    function animate() {
      state.animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startedAt) / 1000;

      state.morphProgress = lerp(state.morphProgress, state.targetMorph, 0.06);
      const mp = state.morphProgress;

      cityGroup.position.y = lerp(0, 8, mp);
      cityGroup.scale.setScalar(lerp(1.08, 0.38, mp));
      cityGroup.rotation.z = Math.sin(elapsed * 0.55) * 0.015;

      beachGroup.position.y = lerp(-8, 0, mp);
      beachGroup.scale.setScalar(lerp(0.38, 1.06, mp));
      beachGroup.rotation.z = Math.sin(elapsed * 0.48 + 0.7) * 0.018;

      targetRot.x = mouse.y * 0.14;
      targetRot.y = mouse.x * 0.2;
      currentRot.x = lerp(currentRot.x, targetRot.x, 0.035);
      currentRot.y = lerp(currentRot.y, targetRot.y, 0.035);

      group.rotation.x = currentRot.x;
      group.rotation.y = currentRot.y + elapsed * 0.055;
      group.position.y = (isMobile ? -1.2 : -1.02) + Math.sin(elapsed * 0.78) * 0.06;

      cremaA.rotation.z = elapsed * 0.28;
      cremaB.rotation.z = -elapsed * 0.38;
      liquidTop.rotation.z = Math.sin(elapsed * 0.45) * 0.08;
      lime.rotation.z = -0.72 + Math.sin(elapsed * 0.72) * 0.03;
      umbrella.rotation.z = 0.34 + Math.sin(elapsed * 0.9) * 0.035;
      shadow.scale.setScalar(1 + Math.sin(elapsed * 0.78) * 0.025);

      cityShimmer.forEach((ring, index) => {
        ring.rotation.z = elapsed * (0.16 + index * 0.08);
        ring.scale.setScalar(1 + Math.sin(elapsed * 0.9 + index) * 0.025);
        (ring.material as THREE.MeshPhysicalMaterial).opacity = (1 - mp) * (0.42 - index * 0.12);
      });

      beachShimmer.forEach((ring, index) => {
        ring.rotation.z = -elapsed * (0.14 + index * 0.1);
        ring.scale.setScalar(1 + Math.cos(elapsed * 0.86 + index) * 0.025);
        (ring.material as THREE.MeshPhysicalMaterial).opacity = mp * (0.34 - index * 0.08);
      });

      const steamArray = steam.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < steamCount; i++) {
        steamArray[i * 3 + 1] += steamVelocities[i];
        steamArray[i * 3] += Math.sin(elapsed * 1.4 + i * 0.33) * 0.0018;
        if (steamArray[i * 3 + 1] > 1.72) {
          steamArray[i * 3 + 1] = 0.1;
          steamArray[i * 3] = (Math.random() - 0.5) * 0.34;
        }
      }
      steam.geometry.attributes.position.needsUpdate = true;
      (steam.material as THREE.PointsMaterial).opacity = (1 - mp) * 0.38;

      const bubbleArray = bubbles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < bubbleCount; i++) {
        bubbleArray[i * 3 + 1] += 0.0048 + (i % 5) * 0.0005;
        bubbleArray[i * 3] += Math.sin(elapsed + i) * 0.0008;
        if (bubbleArray[i * 3 + 1] > 0.55) {
          bubbleArray[i * 3 + 1] = -0.04;
        }
      }
      bubbles.geometry.attributes.position.needsUpdate = true;
      (bubbles.material as THREE.PointsMaterial).opacity = mp * 0.64;

      particles.rotation.y = elapsed * 0.018;
      particles.rotation.x = Math.sin(elapsed * 0.16) * 0.025;
      (particles.material as THREE.PointsMaterial).color.setStyle(state.isBeach ? '#00d6c0' : '#d4af37');
      (particles.material as THREE.PointsMaterial).opacity = state.isBeach ? 0.5 : 0.42;

      rimLight.color.setStyle(state.isBeach ? '#00d6c0' : '#7c3f13');
      fillLight.color.setStyle(state.isBeach ? '#ff4e50' : '#d4af37');
      floorGlow.color.setStyle(state.isBeach ? '#00a896' : '#d4af37');
      shadowMat.opacity = state.isBeach ? 0.25 : 0.32;

      renderer.render(scene, camera);
    }

    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(state.animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else if (material) material.dispose();
      });
      envTexture.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" style={{ cursor: 'none' }} />;
}
