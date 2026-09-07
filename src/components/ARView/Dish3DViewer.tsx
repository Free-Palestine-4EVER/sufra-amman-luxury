import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { MenuItem } from '../../data/restaurantData';
import {
  RotateCw,
  Camera,
  X,
  Sparkles,
  Flame,
  Sun,
  Plus,
  Droplets,
  Layers,
  ZoomIn,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  dish: MenuItem;
  lang: 'en' | 'ar';
  onClose: () => void;
  onAddToCart: (dish: MenuItem) => void;
}

export const Dish3DViewer: React.FC<Props> = ({ dish, lang, onClose, onAddToCart }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'photogrammetry' | '3d_spatial'>('photogrammetry');
  const [isRotating, setIsRotating] = useState(true);
  const [lightingMode, setLightingMode] = useState<'candle' | 'terrace'>('candle');
  const [arCameraMode, setArCameraMode] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [isPouringJameed, setIsPouringJameed] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 3D Spatial Three.js Scene
  useEffect(() => {
    if (viewMode !== '3d_spatial' || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 6.4);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = lightingMode === 'candle' ? 1.3 : 1.5;

    mountRef.current.appendChild(renderer.domElement);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(
      lightingMode === 'candle' ? 0xffdfaa : 0xffffff,
      lightingMode === 'candle' ? 1.2 : 1.5
    );
    scene.add(ambientLight);

    const keyLight = new THREE.SpotLight(0xffb74d, 5.5);
    keyLight.position.set(4, 7, 5);
    keyLight.penumbra = 0.5;
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xd4af37, 4.0, 10);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // Base Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(3.3, 3.5, 0.4, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0f0d0b,
      roughness: 0.2,
      metalness: 0.8,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.3;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Platter Group
    const dishGroup = new THREE.Group();
    scene.add(dishGroup);

    // Hand-hammered Obsidian & Gold Rim Platter
    const plateGeo = new THREE.CylinderGeometry(2.4, 1.9, 0.22, 64);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x161310,
      roughness: 0.25,
      metalness: 0.7,
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.receiveShadow = true;
    dishGroup.add(plate);

    const rimGeo = new THREE.TorusGeometry(2.41, 0.07, 24, 80);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.15,
    });
    const rim = new THREE.Mesh(rimGeo, goldMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.08;
    dishGroup.add(rim);

    // Food Elements
    // Saffron Rice Dome
    const riceGeo = new THREE.SphereGeometry(1.85, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const riceMat = new THREE.MeshStandardMaterial({
      color: 0xf5b324,
      roughness: 0.65,
      metalness: 0.05,
    });
    const rice = new THREE.Mesh(riceGeo, riceMat);
    rice.position.y = 0.1;
    rice.scale.set(1, 0.58, 1);
    dishGroup.add(rice);

    // Organic Braised Lamb Chunks
    const lambMat = new THREE.MeshStandardMaterial({
      color: 0x442010,
      roughness: 0.45,
      metalness: 0.15,
    });
    for (let i = 0; i < 5; i++) {
      const lambGeo = new THREE.DodecahedronGeometry(0.44, 2);
      const lamb = new THREE.Mesh(lambGeo, lambMat);
      const angle = (i / 5) * Math.PI * 2;
      lamb.position.set(Math.cos(angle) * 0.65, 0.85, Math.sin(angle) * 0.65);
      dishGroup.add(lamb);
    }

    // Steam
    const steamGeo = new THREE.BufferGeometry();
    const count = 50;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 1.5;
      pos[i + 1] = 0.8 + Math.random() * 2.2;
      pos[i + 2] = (Math.random() - 0.5) * 1.5;
    }
    steamGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const steamMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.25,
      transparent: true,
      opacity: 0.25,
    });
    const steam = new THREE.Points(steamGeo, steamMat);
    dishGroup.add(steam);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (isRotating) {
        dishGroup.rotation.y += 0.007;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [viewMode, isRotating, lightingMode]);

  // AR Camera toggle
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

  // Trigger Jameed Pour Animation
  const handlePourJameed = () => {
    setIsPouringJameed(true);
    try {
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.4 },
        colors: ['#fff8e7', '#f4eedd', '#d4af37'],
      });
    } catch {}

    setTimeout(() => {
      setIsPouringJameed(false);
    }, 2800);
  };

  const handleAddWithFeedback = () => {
    onAddToCart(dish);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  // Drag to rotate photogrammetry
  const isDragging = useRef(false);
  const startX = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientX - startX.current;
    setRotationAngle((prev) => prev + delta * 0.4);
    startX.current = e.clientX;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Touch
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      startX.current = e.touches[0].clientX;
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const delta = e.touches[0].clientX - startX.current;
    setRotationAngle((prev) => prev + delta * 0.4);
    startX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/92 backdrop-blur-2xl">
      <div className="relative w-full max-w-3xl bg-[#120f0d] border border-[#d4af37]/45 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Luxury Gold Filigree Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#2d2417] bg-[#17130f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d4af37] via-[#f7ecd2] to-[#b89326] p-0.5 shadow-md">
              <div className="w-full h-full bg-[#171410] rounded-[14px] flex items-center justify-center text-[#d4af37]">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#d4af37] tracking-widest uppercase">
                {lang === 'en' ? 'Haute Cuisine 3D Gastronomy' : 'المعاينة الملكية ثلاثية الأبعاد'}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-serif-luxury">
                {lang === 'en' ? dish.nameEn : dish.nameAr}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#1e1913] p-1 rounded-2xl border border-white/10 text-xs">
              <button
                onClick={() => setViewMode('photogrammetry')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'photogrammetry'
                    ? 'gold-gradient-btn text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? '4K Photoreal' : 'واقعي 4K'}</span>
              </button>
              <button
                onClick={() => setViewMode('3d_spatial')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                  viewMode === '3d_spatial'
                    ? 'gold-gradient-btn text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? '3D Spatial' : 'مجسم ثلاثي'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Cart Feedback Toast */}
        {addedToast && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-[#d4af37] text-black font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{lang === 'en' ? 'Added to Table Order!' : 'تمت الإضافة للطلب!'}</span>
          </div>
        )}

        {/* Viewport Container */}
        <div
          className="relative w-full h-84 sm:h-[430px] bg-radial from-[#1e1913] via-[#0f0d0b] to-[#070605] overflow-hidden select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {arCameraMode && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
            />
          )}

          {/* MODE 1: 4K PHOTOGRAMMETRIC REALISTIC FOOD SHOWCASE */}
          {viewMode === 'photogrammetry' ? (
            <div className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing p-6">
              {/* Pedestal Stand Shadow */}
              <div className="absolute bottom-10 w-72 sm:w-96 h-12 bg-black/80 rounded-full blur-xl pointer-events-none" />

              {/* High-Resolution Rotating Mansaf Platter */}
              <div
                className="relative transition-transform duration-75 ease-out"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotationAngle}deg)`,
                }}
              >
                {/* 24K Gold Outer Platter Ring */}
                <div className="w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-gradient-to-tr from-[#997d26] via-[#f7ecd2] to-[#d4af37] p-2.5 shadow-2xl shadow-[#d4af37]/20 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#17130f] p-2 border-2 border-[#d4af37]/40 flex items-center justify-center overflow-hidden relative">
                    {/* Realistic Mouthwatering Food Image with Depth */}
                    <img
                      src={dish.image}
                      alt={dish.nameEn}
                      className="w-full h-full object-cover rounded-full filter contrast-105 brightness-105 pointer-events-none"
                      style={{
                        transform: `rotate(${-rotationAngle}deg)`, // keeps dish upright while platter rotates
                      }}
                    />

                    {/* Dynamic Steam Simulation Overlay */}
                    <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/30 pointer-events-none" />

                    {/* Jameed Pour Animation Overlay */}
                    {isPouringJameed && (
                      <div className="absolute inset-0 bg-[#fffbe6]/30 backdrop-blur-xs flex items-center justify-center animate-pulse pointer-events-none">
                        <div className="text-center">
                          <div className="text-3xl animate-bounce">🥛</div>
                          <div className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full shadow-lg mt-1 font-serif-luxury">
                            {lang === 'en' ? 'Pouring Baladi Jameed...' : 'صب جميد الكرك البلدي...'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hot Rising Steam Effect */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-36 bg-gradient-to-t from-white/15 to-transparent rounded-full blur-2xl animate-pulse pointer-events-none" />
              </div>

              {/* Ingredient Lore Hotspots */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-[#d4af37]/40 rounded-2xl p-2.5 text-xs text-white max-w-[200px] shadow-xl pointer-events-none">
                <div className="flex items-center gap-1.5 font-bold text-[#d4af37]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Authentic Details' : 'تفاصيل الأصالة'}</span>
                </div>
                <div className="text-[10px] text-white/70 mt-1 leading-tight">
                  {lang === 'en'
                    ? 'Karak Sun-Dried Jameed, Pasture Lamb, Amber Saffron Rice, & Toasted Pine Nuts.'
                    : 'جميد الكرك الشمسي، لحم بلدي رضيع، أرز الزعفران، والصنوبر المقلي بالسمن.'}
                </div>
              </div>
            </div>
          ) : (
            /* MODE 2: 3D SPATIAL THREE.JS SCENE */
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          )}

          {/* Interactive Floating Action Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Pour Jameed Button */}
              {dish.modelType === 'mansaf' && (
                <button
                  onClick={handlePourJameed}
                  className="px-3.5 py-2 rounded-2xl bg-[#d4af37]/25 hover:bg-[#d4af37] text-[#f7ecd2] hover:text-black border border-[#d4af37] text-xs font-bold transition flex items-center gap-1.5 shadow-lg backdrop-blur-md"
                  title="Simulate pouring warm Karak Jameed"
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Pour Karak Jameed' : 'صب الجميد'}</span>
                </button>
              )}

              {/* Zoom Toggle */}
              <button
                onClick={() => setZoomLevel((prev) => (prev === 1 ? 1.25 : 1))}
                className="p-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 hover:border-[#d4af37] text-white/80 hover:text-white transition text-xs font-semibold flex items-center gap-1"
                title="Zoom into food details"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{zoomLevel === 1 ? 'Zoom 4K' : 'Reset'}</span>
              </button>

              {/* Lighting Ambiance */}
              <button
                onClick={() => setLightingMode(lightingMode === 'candle' ? 'terrace' : 'candle')}
                className="p-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-[#d4af37]/30 text-xs text-[#f3e5ab] hover:border-[#d4af37] transition flex items-center gap-1.5 shadow-lg"
              >
                {lightingMode === 'candle' ? <Flame className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-yellow-300" />}
              </button>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Rotate Button */}
              <button
                onClick={() => {
                  setIsRotating((prev) => !prev);
                  setRotationAngle((prev) => prev + 45);
                }}
                className={`p-2.5 rounded-2xl backdrop-blur-md border text-xs font-semibold flex items-center gap-1 transition ${
                  isRotating
                    ? 'bg-[#d4af37]/25 border-[#d4af37] text-[#f7ecd2]'
                    : 'bg-black/60 border-white/20 text-white/80'
                }`}
                title="Toggle Turntable Rotation"
              >
                <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
              </button>

              {/* AR Table Projection */}
              <button
                onClick={toggleCamera}
                className={`p-2.5 rounded-2xl backdrop-blur-md border text-xs font-medium flex items-center gap-1.5 transition ${
                  arCameraMode
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
                    : 'bg-black/60 border-white/20 text-white/70'
                }`}
                title="Project onto table in AR"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">{arCameraMode ? 'AR Active' : 'AR Table View'}</span>
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
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{lang === 'en' ? 'Add Dish to Table' : 'إضافة هذا الطبق للطلب'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
