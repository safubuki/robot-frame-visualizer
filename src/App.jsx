import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- Helper Functions & Components ---

const quaternionToURRotationVector = (q) => {
    if (q.w > 1) q.normalize();
    const angle = 2 * Math.acos(q.w);
    if (angle < 0.0001) return [0, 0, 0];
    const s = Math.sqrt(1 - q.w * q.w);
    return [q.x / s * angle, q.y / s * angle, q.z / s * angle];
};

const AXIS_VECTORS = {
    '+X': new THREE.Vector3(1, 0, 0), '-X': new THREE.Vector3(-1, 0, 0),
    '+Y': new THREE.Vector3(0, 1, 0), '-Y': new THREE.Vector3(0, -1, 0),
    '+Z': new THREE.Vector3(0, 0, 1), '-Z': new THREE.Vector3(0, 0, -1),
};

// カスタム座標軸を生成する関数
const createCustomAxes = (isTarget = false) => {
    const group = new THREE.Group();
    const axes = [
        { dir: new THREE.Vector3(1, 0, 0), hex: 0xff4d4d }, // Red
        { dir: new THREE.Vector3(0, 1, 0), hex: 0x4dff4d }, // Green
        { dir: new THREE.Vector3(0, 0, 1), hex: 0x4d4dff }, // Blue
    ];
    const length = isTarget ? 0.45 : 0.4;
    axes.forEach(({ dir, hex }) => {
        const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), length, hex, 0.05, 0.03);
        if (isTarget) {
            arrow.line.material = new THREE.LineBasicMaterial({ color: hex, transparent: true, opacity: 0.6, linewidth: 2 });
            arrow.cone.material = new THREE.MeshBasicMaterial({ color: hex, wireframe: true, transparent: true, opacity: 0.6 });
        }
        group.add(arrow);
    });
    return group;
};


// --- Main Component ---
function App() {
    const mountRef = useRef(null);
    const scene = useMemo(() => new THREE.Scene(), []);
    const insetScene = useMemo(() => new THREE.Scene(), []);

    // --- State Management ---
    const [flangeQuaternion, setFlangeQuaternion] = useState(new THREE.Quaternion());
    const [targetQuaternion, setTargetQuaternion] = useState(new THREE.Quaternion()); // Relative to flange
    const [manipulatedQuaternion, setManipulatedQuaternion] = useState(new THREE.Quaternion()); // Relative to flange
    const [tcpOffset, setTcpOffset] = useState(new THREE.Vector3(0, 0, 0.5));

    const [presetEditMode, setPresetEditMode] = useState('flange'); // 'flange' or 'target'
    const [presetRotationMode, setPresetRotationMode] = useState('local');
    const [manipulationMode, setManipulationMode] = useState('local');

    // --- Refs for Three.js Objects ---
    const flangeFrameRef = useRef(null);
    const targetFrameRef = useRef(null);
    const insetFrameRef = useRef(null);

    // --- Logic ---
    const axisMappingResult = useMemo(() => {
        const qDiff = targetQuaternion.clone().multiply(manipulatedQuaternion.clone().invert());
        const angleDiff = 2 * Math.acos(Math.min(1, Math.abs(qDiff.w)));
        const isOk = THREE.MathUtils.radToDeg(angleDiff) < 0.1;
        return { okCount: isOk ? 3 : 0 };
    }, [manipulatedQuaternion, targetQuaternion]);

    // --- Three.js Initialization and Rendering ---
    useEffect(() => {
        const currentMount = mountRef.current;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.localClippingEnabled = true;
        renderer.autoClear = false; // Disable auto clearing for manual control
        currentMount.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(50, currentMount.clientWidth / currentMount.clientHeight, 0.1, 100);
        camera.position.set(0.7, 0.8, 1.1);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const insetWidth = 150, insetHeight = 150;
        const insetCamera = new THREE.PerspectiveCamera(50, insetWidth / insetHeight, 0.1, 100);
        insetCamera.position.set(0.8, 0.8, 0.8);
        insetCamera.lookAt(0,0,0);

        scene.background = new THREE.Color(0x111827);
        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
        dirLight.position.set(5, 10, 7.5);
        scene.add(dirLight);
        scene.add(new THREE.GridHelper(2, 20, 0x444444, 0x888888));

        flangeFrameRef.current = new THREE.Group();
        flangeFrameRef.current.add(new THREE.Mesh(new THREE.SphereGeometry(0.015), new THREE.MeshStandardMaterial({ color: 0xaaaaaa })));
        flangeFrameRef.current.add(createCustomAxes());
        scene.add(flangeFrameRef.current);

        targetFrameRef.current = new THREE.Group();
        targetFrameRef.current.add(createCustomAxes(true));
        scene.add(targetFrameRef.current);

        insetScene.background = new THREE.Color(0x222837);
        insetScene.add(new THREE.AmbientLight(0xffffff, 1.0));
        insetFrameRef.current = new THREE.Group();
        insetFrameRef.current.add(createCustomAxes());
        insetScene.add(insetFrameRef.current);

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();

            renderer.setScissorTest(true);

            // Main render
            renderer.setScissor(0, 0, currentMount.clientWidth, currentMount.clientHeight);
            renderer.setViewport(0, 0, currentMount.clientWidth, currentMount.clientHeight);
            renderer.clear();
            renderer.render(scene, camera);

            // Inset render
            const y = currentMount.clientHeight - insetHeight - 10;
            renderer.setScissor(currentMount.clientWidth - insetWidth - 10, y, insetWidth, insetHeight);
            renderer.setViewport(currentMount.clientWidth - insetWidth - 10, y, insetWidth, insetHeight);
            renderer.clearDepth(); // Only clear depth buffer for inset
            renderer.render(insetScene, insetCamera);

            renderer.setScissorTest(false);
        };
        animate();

        const handleResize = () => renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        window.addEventListener('resize', handleResize);
        return () => { currentMount.removeChild(renderer.domElement); window.removeEventListener('resize', handleResize); };
    }, [scene, insetScene]);

    useEffect(() => {
        if (!flangeFrameRef.current || !targetFrameRef.current || !insetFrameRef.current) return;

        const worldTargetQuat = flangeQuaternion.clone().multiply(targetQuaternion);
        const worldTargetPos = tcpOffset.clone().applyQuaternion(flangeQuaternion);

        const worldManipulatedQuat = flangeQuaternion.clone().multiply(manipulatedQuaternion);

        flangeFrameRef.current.quaternion.copy(flangeQuaternion);
        targetFrameRef.current.quaternion.copy(worldTargetQuat);
        targetFrameRef.current.position.copy(worldTargetPos);
        insetFrameRef.current.quaternion.copy(worldManipulatedQuat);

    }, [flangeQuaternion, targetQuaternion, manipulatedQuaternion, tcpOffset]);

    const handleRotate = (axis, angleDeg, mode, setter, currentQuaternion) => {
        const angleRad = THREE.MathUtils.degToRad(angleDeg);
        let rotationAxis = axis.clone();

        if (mode === 'local') {
            rotationAxis.applyQuaternion(currentQuaternion);
        }

        const q = new THREE.Quaternion().setFromAxisAngle(rotationAxis, angleRad);
        setter(prev => q.clone().multiply(prev));
    };

    const rotButtons = useMemo(() => [
        { axis: AXIS_VECTORS['+X'], label: '+X', className: 'bg-red-600 hover:bg-red-500' },
        { axis: AXIS_VECTORS['+X'], label: '−X', angle: -90, className: 'bg-red-600 hover:bg-red-500' },
        { axis: AXIS_VECTORS['+Y'], label: '+Y', className: 'bg-green-600 hover:bg-green-500' },
        { axis: AXIS_VECTORS['+Y'], label: '−Y', angle: -90, className: 'bg-green-600 hover:bg-green-500' },
        { axis: AXIS_VECTORS['+Z'], label: '+Z', className: 'bg-blue-600 hover:bg-blue-500' },
        { axis: AXIS_VECTORS['+Z'], label: '−Z', angle: -90, className: 'bg-blue-600 hover:bg-blue-500' },
    ], []);

    const presetHandler = presetEditMode === 'target'
        ? (axis, angle) => handleRotate(axis, angle, presetRotationMode, setTargetQuaternion, targetQuaternion)
        : (axis, angle) => handleRotate(axis, angle, presetRotationMode, setFlangeQuaternion, flangeQuaternion);

    return (
        <div className="bg-gray-900 text-gray-200 h-screen flex font-sans">
            <div className="relative flex-grow">
                <div ref={mountRef} className="w-full h-full" />
                <div className="absolute top-2 right-2 pointer-events-none border-2 border-gray-600 rounded-lg bg-gray-800/50">
                     <div style={{width: 150, height: 150, position: 'relative'}}>
                        <div className="absolute top-1 left-2 text-xs text-yellow-400">回転オフセット</div>
                     </div>
                </div>
            </div>

            <div className="w-96 bg-gray-800 p-4 flex flex-col space-y-3 overflow-y-auto">
                <h1 className="text-xl font-bold text-center">Robot Frame Visualizer</h1>

                <details className="p-3 bg-gray-900 rounded-lg">
                    <summary className="font-bold cursor-pointer text-sm">1. 事前設定</summary>
                    <div className="mt-2 pt-2 border-t border-gray-700 space-y-3">
                        <Panel title="編集対象">
                            <div className="flex space-x-2">{['flange', 'target'].map(m => (<button key={m} onClick={() => setPresetEditMode(m)} className={`flex-1 p-1 rounded text-xs ${presetEditMode === m ? 'bg-cyan-600' : 'bg-gray-600 hover:bg-gray-500'}`}>{m === 'flange' ? 'フランジ' : '目標TCP'}</button>))}</div>
                        </Panel>
                        <Panel title="回転設定">
                            <RotationModeSwitcher mode={presetRotationMode} setMode={setPresetRotationMode} />
                            <RotationButtons buttons={rotButtons} onRotate={presetHandler} />
                            <button onClick={() => { presetEditMode === 'target' ? setTargetQuaternion(new THREE.Quaternion()) : setFlangeQuaternion(new THREE.Quaternion()) }} className="w-full mt-2 p-1 rounded bg-gray-600 hover:bg-gray-500 text-xs">Reset {presetEditMode}</button>
                        </Panel>
                        <Panel title="TCP オフセット [m]">
                            {['x', 'y', 'z'].map(axis => (<div key={axis} className="flex items-center space-x-2 mb-1"><label className="w-4 font-mono">{axis.toUpperCase()}</label><input type="number" step="0.01" value={tcpOffset[axis]} onChange={e => setTcpOffset(p => p.clone()[`set${axis.toUpperCase()}`](parseFloat(e.target.value) || 0))} className="w-full bg-gray-800 p-1 rounded border border-gray-600 text-sm"/></div>))}
                        </Panel>
                    </div>
                </details>

                <Panel title="2. 回転オフセットの探索">
                    <SimpleMathInspector quaternion={manipulatedQuaternion} />
                    <RotationModeSwitcher mode={manipulationMode} setMode={setManipulationMode} />
                    <RotationButtons buttons={rotButtons} onRotate={(axis, angle) => handleRotate(axis, angle, manipulationMode, setManipulatedQuaternion, manipulatedQuaternion)} />
                    <button onClick={() => setManipulatedQuaternion(new THREE.Quaternion())} className="w-full mt-2 p-1 rounded bg-gray-600 hover:bg-gray-500 text-xs">Reset Manipulation</button>
                </Panel>

                <Panel title="3. マッピング確認 (操作 vs 目標)">
                    <div className="flex justify-between items-center">
                        <span className="font-bold">一致度</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${axisMappingResult.okCount === 3 ? 'bg-green-600' : 'bg-red-600'}`}>{axisMappingResult.okCount === 3 ? 'OK' : 'NG'}</span>
                    </div>
                </Panel>

                <Panel title="4. プリセット">
                     <button onClick={() => setManipulatedQuaternion(targetQuaternion.clone())} className="w-full p-2 rounded bg-teal-600 hover:bg-teal-500 text-sm">操作TCPを目標に一致させる</button>
                </Panel>

                <details className="p-3 bg-gray-700 rounded-lg">
                    <summary className="font-bold cursor-pointer text-sm">数式インスペクタ (操作TCP)</summary>
                    <MathInspector quaternion={manipulatedQuaternion} />
                </details>
            </div>
        </div>
    );
}

// --- Sub-components for UI clarity ---
const Panel = ({ title, children }) => (<div className="p-3 bg-gray-700/50 rounded-lg"><h2 className="font-bold mb-2 text-sm">{title}</h2>{children}</div>);
const RotationModeSwitcher = ({ mode, setMode }) => (<div className="flex space-x-2">{['local', 'global'].map(m => (<button key={m} onClick={() => setMode(m)} className={`flex-1 p-1 rounded text-xs ${mode === m ? 'bg-indigo-600' : 'bg-gray-600 hover:bg-gray-500'}`}>{m === 'local' ? 'Local' : 'Global'}</button>))}</div>);
const RotationButtons = ({ buttons, onRotate }) => (<div className="grid grid-cols-2 gap-2 mt-2">{buttons.map(({axis, label, angle = 90, className}) => (<button key={label} onClick={() => onRotate(axis, angle)} className={`p-1.5 rounded font-mono text-sm ${className}`}>{label}</button>))}</div>);
const SimpleMathInspector = ({ quaternion }) => {
    const eulerDeg = useMemo(() => {
        const euler = new THREE.Euler().setFromQuaternion(quaternion, 'XYZ');
        return [euler.x, euler.y, euler.z].map(rad => THREE.MathUtils.radToDeg(rad));
    }, [quaternion]);
    return (<div className="bg-gray-900 p-2 rounded mb-2 font-mono text-center text-sm">
        <span className="text-red-400">X: {eulerDeg[0].toFixed(1)}°</span>{' '}
        <span className="text-green-400">Y: {eulerDeg[1].toFixed(1)}°</span>{' '}
        <span className="text-blue-400">Z: {eulerDeg[2].toFixed(1)}°</span>
    </div>)
};
const MathInspector = ({ quaternion }) => {
    const matrix = useMemo(() => new THREE.Matrix4().makeRotationFromQuaternion(quaternion), [quaternion]);
    const urVec = useMemo(() => quaternionToURRotationVector(quaternion), [quaternion]);
    return (
        <div className="mt-2 pt-2 border-t border-gray-600 font-mono text-xs space-y-2">
            <div>UR Axis-Angle [rx,ry,rz]:</div>
            <pre className="bg-gray-900 p-2 rounded text-[10px]">[{urVec.map(v => v.toFixed(3)).join(', ')}]</pre>
            <div>Rotation Matrix:</div>
            <pre className="bg-gray-900 p-2 rounded text-[10px] leading-tight">{matrix.elements.slice(0, 16).reduce((acc, val, i) => acc + (i%4===0 ? '\n' : '') + val.toFixed(3).padStart(7, ' '), '').trim()}</pre>
        </div>
    );
};

export default App;
