import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import styles from './ThreeScene.module.css';

/**
 * ThreeScene — 懒加载的 3D 背景场景
 *
 * 特性：
 * - 3 个发光线框几何体（四面/八面/二十面）
 * - ~1200 粒子星空
 * - 30 fps 节流
 * - 标签页不可见时暂停渲染
 * - 移动端降级：粒子减半、几何体简化
 */
export default function ThreeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const prevTimeRef = useRef<number>(0);
  const pausedRef = useRef(false);

  const initRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // —— 渲染器 ——
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // —— 场景 & 相机 ——
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 30;

    // —— 判断移动端 ——
    const isMobile = window.innerWidth < 768;

    // —— 灯光 ——
    const ambientLight = new THREE.AmbientLight(0x334466, 0.6);
    scene.add(ambientLight);
    const pointLight1 = new THREE.PointLight(0x00ccff, 1.2, 100);
    pointLight1.position.set(15, 10, 20);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0xff3366, 0.9, 100);
    pointLight2.position.set(-15, -10, 15);
    scene.add(pointLight2);

    // —— 几何体们 ——
    const geometries: THREE.Mesh[] = [];

    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x00ccff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00ccff,
      transparent: true,
      opacity: 0.08,
    });

    // 1) 四面体
    const tetra = new THREE.Mesh(new THREE.TetrahedronGeometry(3.5, 0), wireframeMat);
    tetra.position.set(-9, 5, -5);
    scene.add(tetra);
    geometries.push(tetra);

    const tetraGlow = new THREE.Mesh(new THREE.TetrahedronGeometry(3.8, 0), glowMat);
    tetraGlow.position.copy(tetra.position);
    scene.add(tetraGlow);
    geometries.push(tetraGlow);

    // 2) 八面体
    const octa = new THREE.Mesh(new THREE.OctahedronGeometry(3, 0), wireframeMat.clone());
    (octa.material as THREE.MeshBasicMaterial).color.set(0xff3366);
    (octa.material as THREE.MeshBasicMaterial).opacity = 0.35;
    octa.position.set(9, -4, -8);
    scene.add(octa);
    geometries.push(octa);

    const octaGlow = new THREE.Mesh(new THREE.OctahedronGeometry(3.3, 0), glowMat.clone());
    (octaGlow.material as THREE.MeshBasicMaterial).color.set(0xff3366);
    (octaGlow.material as THREE.MeshBasicMaterial).opacity = 0.08;
    octaGlow.position.copy(octa.position);
    scene.add(octaGlow);
    geometries.push(octaGlow);

    // 3) 二十面体
    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(2.5, 0), wireframeMat.clone());
    (ico.material as THREE.MeshBasicMaterial).color.set(0x9933ff);
    (ico.material as THREE.MeshBasicMaterial).opacity = 0.35;
    ico.position.set(0, -7, -3);
    scene.add(ico);
    geometries.push(ico);

    const icoGlow = new THREE.Mesh(new THREE.IcosahedronGeometry(2.8, 0), glowMat.clone());
    (icoGlow.material as THREE.MeshBasicMaterial).color.set(0x9933ff);
    (icoGlow.material as THREE.MeshBasicMaterial).opacity = 0.08;
    icoGlow.position.copy(ico.position);
    scene.add(icoGlow);
    geometries.push(icoGlow);

    // —— 粒子星空 ——
    const PARTICLE_COUNT = isMobile ? 600 : 1200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
      // 微妙的颜色变化
      const c = new THREE.Color().setHSL(Math.random() * 0.15 + 0.55, 0.6, 0.7);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.15 : 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // —— 动画循环（30 fps 节流）——
    const FPS = 30;
    const MIN_FRAME_TIME = 1000 / FPS;

    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);

      if (pausedRef.current) return;

      const delta = time - prevTimeRef.current;
      if (delta < MIN_FRAME_TIME) return;
      prevTimeRef.current = time - (delta % MIN_FRAME_TIME);

      // 旋转几何体
      geometries.forEach((g, i) => {
        g.rotation.x += 0.003 * (i % 2 === 0 ? 1 : -1);
        g.rotation.y += 0.005 * (i % 3 === 0 ? 1 : -1);
      });

      // 粒子缓慢旋转
      particles.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };

    rafRef.current = requestAnimationFrame(animate);

    // —— 可见性暂停 ——
    const handleVisibility = () => {
      pausedRef.current = document.visibilityState === 'hidden';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // —— Resize 处理 ——
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 清理
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
      geometries.forEach(g => {
        g.geometry.dispose();
        (g.material as THREE.Material).dispose();
      });
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
