import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { MenuItem } from '../../data/restaurantData';
import { RotateCw, Camera, X, Sparkles, Flame, Sun, Plus } from 'lucide-react';

interface Props {
  dish: MenuItem;
  lang: 'en' | 'ar';
  onClose: () => void;
  onAddToCart: (dish: MenuItem) => void;
}

export const Dish3DViewer: React.FC<Props> = ({ dish, lang, onClose, onAddToCart }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [lightingMode, setLightingMode] = useState<'candle' | 'terrace'>('candle');
  const [arCameraMode, setArCameraMode] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 6.2);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = lightingMode === 'candle' ? 1.25 : 1.45;

    mountRef.current.appendChild(renderer.domElement);

    // 2. High-End Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(
      lightingMode === 'candle' ? 0xffdfa9 : 0xfff3e6,
      lightingMode === 'candle' ? 1.1 : 1.4
    );
    scene.add(ambientLight);

    // Main Warm Key Light
    const keyLight = new THREE.SpotLight(
      lightingMode === 'candle' ? 0xffb74d : 0xfff0db,
      lightingMode === 'candle' ? 4.5 : 5.0
    );
    keyLight.position.set(4, 7, 5);
    keyLight.angle = Math.PI / 4;
    keyLight.penumbra = 0.6;
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Golden Rim Light (creates luxury highlights on food edges)
    const rimLight = new THREE.PointLight(0xd4af37, 3.5, 12);
    rimLight.position.set(-4, 3.5, -4);
    scene.add(rimLight);

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0xdcd1c4, 1.2);
    fillLight.position.set(-5, 4, 3);
    scene.add(fillLight);

    // 3. Realistic Pedestal / Table Base
    const pedestalGeo = new THREE.CylinderGeometry(3.2, 3.4, 0.4, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x110f0d,
      roughness: 0.15,
      metalness: 0.8,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.3;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Gold Pedestal Inlay Ring
    const inlayGeo = new THREE.TorusGeometry(3.22, 0.03, 16, 64);
    const inlayMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.15,
    });
    const inlay = new THREE.Mesh(inlayGeo, inlayMat);
    inlay.rotation.x = Math.PI / 2;
    inlay.position.y = -0.1;
    scene.add(inlay);

    // Root Group for the rotating dish
    const dishGroup = new THREE.Group();
    dishGroup.position.y = 0.05;
    scene.add(dishGroup);

    // 4. Photorealistic Procedural Texture Generators
    const createNoiseTexture = (baseColor: string, grainColor: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 4000; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        ctx.fillStyle = grainColor;
        ctx.fillRect(x, y, 1.5, 1.5);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const isFukhara = dish.modelType === 'fukhara';

    // 5. Artisanal Luxury Tableware Platter
    if (!isFukhara) {
      // Hand-hammered Jordanian Royal Brass / Obsidian Platter
      const plateGeo = new THREE.CylinderGeometry(2.35, 1.9, 0.22, 64);
      const plateMat = new THREE.MeshStandardMaterial({
        color: 0x181512,
        roughness: 0.25,
        metalness: 0.75,
      });
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.receiveShadow = true;
      dishGroup.add(plate);

      // 24K Fluted Gold Outer Rim
      const rimGeo = new THREE.TorusGeometry(2.36, 0.065, 24, 80);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.92,
        roughness: 0.18,
      });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.08;
      dishGroup.add(rim);

      // Inner Gold Filigree Inlay Ring
      const innerRimGeo = new THREE.TorusGeometry(1.65, 0.02, 16, 64);
      const innerRim = new THREE.Mesh(innerRimGeo, rimMat);
      innerRim.rotation.x = Math.PI / 2;
      innerRim.position.y = 0.11;
      dishGroup.add(innerRim);
    }

    // 6. Food Modeling according to Dish Type
    if (dish.modelType === 'mansaf') {
      // A. Layer of Shrak Flatbread draped under the rice
      const shrakGeo = new THREE.CylinderGeometry(2.1, 2.0, 0.05, 36);
      const shrakMat = new THREE.MeshStandardMaterial({
        color: 0xd6c29e,
        roughness: 0.9,
      });
      const shrak = new THREE.Mesh(shrakGeo, shrakMat);
      shrak.position.y = 0.12;
      dishGroup.add(shrak);

      // B. Golden Saffron & Turmeric Rice Dome with micro-surface displacement
      const riceTexture = createNoiseTexture('#e5aa24', '#c4850c');
      riceTexture.repeat.set(16, 16);
      const riceGeo = new THREE.SphereGeometry(1.8, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.45);
      const riceMat = new THREE.MeshStandardMaterial({
        color: 0xefa718,
        roughness: 0.75,
        metalness: 0.05,
        bumpMap: riceTexture,
        bumpScale: 0.06,
      });
      const rice = new THREE.Mesh(riceGeo, riceMat);
      rice.position.y = 0.1;
      rice.scale.set(1, 0.58, 1);
      rice.castShadow = true;
      rice.receiveShadow = true;
      dishGroup.add(rice);

      // C. Braised Baladi Lamb Shanks (Organic multi-faceted sculpted chunks)
      const lambMat = new THREE.MeshStandardMaterial({
        color: 0x4a2412,
        roughness: 0.55,
        metalness: 0.15,
      });
      const lambPositions = [
        [0, 0.95, 0, 0.48],
        [0.65, 0.78, 0.5, 0.42],
        [-0.6, 0.82, 0.4, 0.44],
        [0.55, 0.8, -0.55, 0.39],
        [-0.65, 0.76, -0.45, 0.41],
      ];
      lambPositions.forEach(([x, y, z, s]) => {
        const lambGeo = new THREE.DodecahedronGeometry(s, 2);
        // Distort vertices slightly for organic meat appearance
        const posAttr = lambGeo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const vx = posAttr.getX(i) + (Math.random() - 0.5) * 0.08;
          const vy = posAttr.getY(i) + (Math.random() - 0.5) * 0.08;
          const vz = posAttr.getZ(i) + (Math.random() - 0.5) * 0.08;
          posAttr.setXYZ(i, vx, vy, vz);
        }
        lambGeo.computeVertexNormals();

        const lamb = new THREE.Mesh(lambGeo, lambMat);
        lamb.position.set(x, y, z);
        lamb.rotation.set(Math.random(), Math.random(), Math.random());
        lamb.castShadow = true;
        dishGroup.add(lamb);
      });

      // D. Golden Toasted Baladi Pine Nuts & Slivered Almonds (45 individual nuts)
      const nutMat = new THREE.MeshStandardMaterial({
        color: 0xd9a857,
        roughness: 0.35,
        metalness: 0.25,
      });
      for (let i = 0; i < 48; i++) {
        const nutGeo = new THREE.CapsuleGeometry(0.038, 0.14, 6, 8);
        const nut = new THREE.Mesh(nutGeo, nutMat);
        const r = 0.35 + Math.random() * 1.15;
        const theta = Math.random() * Math.PI * 2;
        nut.position.set(Math.cos(theta) * r, 0.45 + (1 - r / 1.5) * 0.45, Math.sin(theta) * r);
        nut.rotation.set(Math.PI / 3 + Math.random() * 0.2, Math.random() * Math.PI, Math.random() * 0.5);
        nut.castShadow = true;
        dishGroup.add(nut);
      }

      // E. Chopped Fresh Green Parsley & Sumac Flakes
      const parsleyMat = new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.8 });
      const sumacMat = new THREE.MeshStandardMaterial({ color: 0x800020, roughness: 0.8 });
      for (let i = 0; i < 50; i++) {
        const isSumac = i % 3 === 0;
        const flakeGeo = new THREE.PlaneGeometry(0.045, 0.045);
        const flake = new THREE.Mesh(flakeGeo, isSumac ? sumacMat : parsleyMat);
        const r = 0.2 + Math.random() * 1.35;
        const theta = Math.random() * Math.PI * 2;
        flake.position.set(Math.cos(theta) * r, 0.48 + (1 - r / 1.5) * 0.42, Math.sin(theta) * r);
        flake.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        dishGroup.add(flake);
      }

      // F. Small Ceremonial Karak Jameed Pouring Bowl on Platter Edge
      const jameedBowlGeo = new THREE.CylinderGeometry(0.42, 0.32, 0.35, 24);
      const jameedBowlMat = new THREE.MeshStandardMaterial({
        color: 0x1f1b17,
        roughness: 0.2,
        metalness: 0.6,
      });
      const jameedBowl = new THREE.Mesh(jameedBowlGeo, jameedBowlMat);
      jameedBowl.position.set(1.6, 0.22, 1.1);
      dishGroup.add(jameedBowl);

      // Steaming Warm White Jameed Surface
      const jameedLiquidGeo = new THREE.CircleGeometry(0.38, 24);
      const jameedLiquidMat = new THREE.MeshStandardMaterial({
        color: 0xf4eedd,
        roughness: 0.1,
        metalness: 0.1,
      });
      const jameedLiquid = new THREE.Mesh(jameedLiquidGeo, jameedLiquidMat);
      jameedLiquid.rotation.x = -Math.PI / 2;
      jameedLiquid.position.set(1.6, 0.38, 1.1);
      dishGroup.add(jameedLiquid);

    } else if (dish.modelType === 'grill') {
      // --- ROYAL CHARCOAL MIXED GRILL ---
      // Bed of warm Arabic pita with sumac rub
      const pitaGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.05, 36);
      const pitaMat = new THREE.MeshStandardMaterial({ color: 0xdfcbab, roughness: 0.85 });
      const pita = new THREE.Mesh(pitaGeo, pitaMat);
      pita.position.y = 0.12;
      dishGroup.add(pita);

      // Kebab Skewers (Charred grooved lamb kebab)
      const kebabMat = new THREE.MeshStandardMaterial({
        color: 0x3b1f12,
        roughness: 0.65,
        metalness: 0.1,
      });
      for (let k = 0; k < 2; k++) {
        const skewer = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.7, 16), kebabMat);
        skewer.rotation.z = Math.PI / 2;
        skewer.position.set(0, 0.26, -0.45 + k * 0.45);
        skewer.castShadow = true;
        dishGroup.add(skewer);
      }

      // Shish Tawook saffron chicken cubes
      const tawookMat = new THREE.MeshStandardMaterial({ color: 0xc8762b, roughness: 0.5 });
      for (let t = -3; t <= 3; t++) {
        const cube = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.28, 0.32), tawookMat);
        cube.position.set(t * 0.38, 0.26, 0.45);
        cube.rotation.set(Math.random() * 0.2, Math.random() * 0.2, 0);
        cube.castShadow = true;
        dishGroup.add(cube);
      }

      // Blistered Charred Plum Tomato
      const tomMat = new THREE.MeshStandardMaterial({ color: 0xaa2211, roughness: 0.35 });
      const tomato = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 24), tomMat);
      tomato.position.set(-1.15, 0.36, 0.85);
      tomato.scale.y = 0.8;
      tomato.castShadow = true;
      dishGroup.add(tomato);

      // Charred Spicy Green Chili
      const chiliMat = new THREE.MeshStandardMaterial({ color: 0x226b2b, roughness: 0.4 });
      const chili = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.03, 1.4, 16), chiliMat);
      chili.rotation.z = Math.PI / 3;
      chili.position.set(0.65, 0.26, 0.95);
      chili.castShadow = true;
      dishGroup.add(chili);

    } else if (dish.modelType === 'fukhara') {
      // --- ARTISANAL TERRACOTTA CLAY POT (FUKHARA) ---
      const potWallGeo = new THREE.CylinderGeometry(2.1, 1.7, 0.9, 48, 1, true);
      const potMat = new THREE.MeshStandardMaterial({
        color: 0x8b3a1d,
        roughness: 0.85,
        metalness: 0.08,
      });
      const pot = new THREE.Mesh(potWallGeo, potMat);
      pot.position.y = 0.45;
      pot.castShadow = true;
      dishGroup.add(pot);

      // Pot Rim Lip
      const potLipGeo = new THREE.TorusGeometry(2.1, 0.09, 16, 48);
      const potLip = new THREE.Mesh(potLipGeo, potMat);
      potLip.rotation.x = Math.PI / 2;
      potLip.position.y = 0.9;
      dishGroup.add(potLip);

      // Bubbling Rich Baked Tahini / Tomato Glaze
      const sauceMat = new THREE.MeshStandardMaterial({
        color: 0xcfb267,
        roughness: 0.25,
        metalness: 0.15,
      });
      const sauce = new THREE.Mesh(new THREE.CircleGeometry(1.98, 48), sauceMat);
      sauce.rotation.x = -Math.PI / 2;
      sauce.position.y = 0.72;
      dishGroup.add(sauce);

      // Caramelized Minced Lamb Kufta Medallions
      const meatMat = new THREE.MeshStandardMaterial({ color: 0x3d1c0b, roughness: 0.6 });
      for (let m = 0; m < 5; m++) {
        const meat = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.2, 18), meatMat);
        const angle = (m / 5) * Math.PI * 2;
        meat.position.set(Math.cos(angle) * 0.95, 0.78, Math.sin(angle) * 0.95);
        meat.castShadow = true;
        dishGroup.add(meat);
      }

      // Toasted Pine Nuts floating in sauce
      const nutMat = new THREE.MeshStandardMaterial({ color: 0xd9a857, roughness: 0.4 });
      for (let n = 0; n < 24; n++) {
        const nut = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.12, 4, 8), nutMat);
        const r = Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        nut.position.set(Math.cos(theta) * r, 0.76, Math.sin(theta) * r);
        nut.rotation.x = Math.PI / 2;
        dishGroup.add(nut);
      }

    } else {
      // --- DESSERT: UM ALI ROYALE & OSMALIEH ---
      const bakerGeo = new THREE.CylinderGeometry(1.9, 1.7, 0.65, 48);
      const bakerMat = new THREE.MeshStandardMaterial({
        color: 0x1f1a14,
        roughness: 0.2,
        metalness: 0.5,
      });
      const baker = new THREE.Mesh(bakerGeo, bakerMat);
      baker.position.y = 0.3;
      dishGroup.add(baker);

      // Golden baked puff pastry & Ashta cream
      const creamMat = new THREE.MeshStandardMaterial({ color: 0xfff6e6, roughness: 0.3 });
      const cream = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), creamMat);
      cream.position.y = 0.45;
      cream.scale.set(1, 0.3, 1);
      dishGroup.add(cream);

      // Vibrant Crushed Aleppo Pistachios (60 emerald specks)
      const pistMat = new THREE.MeshStandardMaterial({ color: 0x558b2f, roughness: 0.7 });
      for (let p = 0; p < 70; p++) {
        const speck = new THREE.Mesh(new THREE.DodecahedronGeometry(0.045), pistMat);
        const r = Math.random() * 1.35;
        const theta = Math.random() * Math.PI * 2;
        speck.position.set(Math.cos(theta) * r, 0.62 + Math.random() * 0.05, Math.sin(theta) * r);
        dishGroup.add(speck);
      }

      // Dried Damascus Rose Petals (Crimson red specks)
      const roseMat = new THREE.MeshStandardMaterial({ color: 0x9c1a3b, roughness: 0.6 });
      for (let r = 0; r < 20; r++) {
        const petal = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.09), roseMat);
        const dist = Math.random() * 1.2;
        const theta = Math.random() * Math.PI * 2;
        petal.position.set(Math.cos(theta) * dist, 0.65, Math.sin(theta) * dist);
        petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        dishGroup.add(petal);
      }
    }

    // 7. Translucent Rising Hot Steam Particle Simulation
    const particleCount = 60;
    const steamGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 1.5;
      positions[i + 1] = 0.9 + Math.random() * 2.5;
      positions[i + 2] = (Math.random() - 0.5) * 1.5;
    }
    steamGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const steamMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.22,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const steamParticles = new THREE.Points(steamGeo, steamMat);
    dishGroup.add(steamParticles);

    // 8. Interactive Mouse & Touch Dragging
    let isDragging = false;
    let prevMouseX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - prevMouseX;
      dishGroup.rotation.y += delta * 0.009;
      prevMouseX = e.clientX;
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = mountRef.current;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch
    let prevTouchX = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) prevTouchX = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const delta = e.touches[0].clientX - prevTouchX;
        dishGroup.rotation.y += delta * 0.009;
        prevTouchX = e.touches[0].clientX;
      }
    };
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });

    // 9. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isRotating && !isDragging) {
        dishGroup.rotation.y += 0.006;
      }

      // Animate hot steam drift
      const pos = steamParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += 0.015;
        pos[i - 1] += Math.sin(elapsedTime * 2 + i) * 0.002;
        if (pos[i] > 3.4) {
          pos[i] = 0.8;
          pos[i - 1] = (Math.random() - 0.5) * 1.5;
        }
      }
      steamParticles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [dish, isRotating, lightingMode]);

  const toggleCamera = async () => {
    if (!arCameraMode) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setArCameraMode(true);
        }
      } catch (err) {
        console.warn('Camera access unavailable:', err);
        setArCameraMode(true);
      }
    } else {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
      setArCameraMode(false);
    }
  };

  const handleAddWithFeedback = () => {
    onAddToCart(dish);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-3xl bg-[#120f0d] border border-[#d4af37]/45 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Luxury Gold Filigree Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#2d2417] bg-[#181410]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d4af37] to-[#f7ecd2] p-0.5 shadow-md">
              <div className="w-full h-full bg-[#171410] rounded-[14px] flex items-center justify-center text-[#d4af37]">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#d4af37] tracking-widest uppercase">
                {lang === 'en' ? 'Haute Cuisine 3D Inspection' : 'المعاينة الفاخرة ثلاثية الأبعاد'}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-serif-luxury">
                {lang === 'en' ? dish.nameEn : dish.nameAr}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 3D Canvas Viewport */}
        <div className="relative w-full h-84 sm:h-[420px] bg-radial from-[#1e1913] via-[#0f0d0b] to-[#070605] overflow-hidden">
          {arCameraMode && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
            />
          )}

          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Interactive Control Pill Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setLightingMode(lightingMode === 'candle' ? 'terrace' : 'candle')}
                className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#d4af37]/30 text-xs font-semibold text-[#f3e5ab] hover:border-[#d4af37] transition flex items-center gap-1.5 shadow-lg"
              >
                {lightingMode === 'candle' ? <Flame className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-yellow-300" />}
                <span>{lightingMode === 'candle' ? (lang === 'en' ? 'Candlelight Ambiance' : 'إضاءة الشموع الملكية') : (lang === 'en' ? 'Terrace Sunlight' : 'إضاءة الشرفة النهارية')}</span>
              </button>
            </div>

            <div className="text-[10px] text-white/50 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 hidden sm:block">
              {lang === 'en' ? 'Touch & Drag 360°' : 'اسحب للتدوير ٣٦٠ درجة'}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`p-2.5 rounded-full backdrop-blur-md border text-xs font-medium flex items-center gap-1.5 transition ${
                  isRotating
                    ? 'bg-[#d4af37]/25 border-[#d4af37] text-[#f7ecd2]'
                    : 'bg-black/60 border-white/20 text-white/70'
                }`}
                title="Toggle turntable rotation"
              >
                <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{lang === 'en' ? 'Turntable' : 'تدوير'}</span>
              </button>

              <button
                onClick={toggleCamera}
                className={`p-2.5 rounded-full backdrop-blur-md border text-xs font-medium flex items-center gap-1.5 transition ${
                  arCameraMode
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
                    : 'bg-black/60 border-white/20 text-white/70'
                }`}
                title="Project onto table in AR"
              >
                <Camera className="w-4 h-4" />
                <span>{arCameraMode ? (lang === 'en' ? 'AR Active' : 'الواقع نشط') : (lang === 'en' ? 'Project on Table (AR)' : 'إسقاط على الطاولة (AR)')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info & Add to Table */}
        <div className="p-4 sm:p-5 bg-[#17130f] border-t border-[#2d2417] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left rtl:sm:text-right">
            <div className="text-[#d4af37] font-serif-luxury font-bold text-xl">
              {dish.price.toFixed(2)} JOD
            </div>
            <p className="text-xs text-white/60 line-clamp-1 max-w-md">
              {lang === 'en' ? dish.descriptionEn : dish.descriptionAr}
            </p>
          </div>

          <button
            onClick={handleAddWithFeedback}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl gold-gradient-btn text-black font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-98 transition flex items-center justify-center gap-2"
          >
            {addedToast ? (
              <span className="flex items-center gap-1.5">
                <span>✓</span>
                <span>{lang === 'en' ? 'Added to Table Order!' : 'تمت الإضافة للطلب!'}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{lang === 'en' ? 'Add Dish to Table' : 'إضافة هذا الطبق للطلب'}</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
