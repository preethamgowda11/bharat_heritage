import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';

let container;
let camera, scene, renderer;
let controller;
let reticle;
let hitTestSource = null;
let hitTestSourceRequested = false;
let model = null;
let modelData = null;

// --- Data Fetching ---
const modelMap = {
    'taj': { path: '/models/taj_mahal_3d_model.glb', title: { en: "Taj Mahal" }, description: { en: "An immense mausoleum of white marble, built in Agra."} },
    'qutub': { path: '/models/qutub_minar.glb', title: { en: "Qutub Minar" }, description: { en: "A minaret and 'victory tower' that forms part of the Qutb complex."} },
    'konark': { path: '/models/sun_temple.glb', title: { en: "Konark Sun Temple" }, description: { en: "A 13th-century CE sun temple at Konark in Odisha."} },
    'hampi': { path: '/models/hampi_high.glb', title: { en: "Hampi" }, description: { en: "The ruined city of Vijayanagara, the former capital of the Vijayanagara Empire."} },
    'mughal-painting': { path: '/models/mughal_painting.glb', title: { en: "Mughal Miniature Painting" }, description: { en: "A detailed miniature painting characteristic of the Mughal era."} },
    'vijayanagara-coin': { path: '/models/vijayanagara_coin.glb', title: { en: "Vijayanagara Coin" }, description: { en: "A gold coin from the Vijayanagara Empire."} },
    'iron-pillar': { path: '/models/iron_pillar_inscription.glb', title: { en: "Iron Pillar Inscription" }, description: { en: "A close-up view of the Sanskrit inscriptions on the Iron Pillar of Delhi."} },
    'rani-ki-vav': { path: '/models/rani-ki-vav.glb', title: { en: "Rani-ki-Vav" }, description: { en: "An intricately constructed stepwell situated in the town of Patan in Gujarat."} },
    'charminar': { path: '/models/charminar_hyderabad.glb', title: { en: "Charminar" }, description: { en: "A monument and mosque located in Hyderabad, Telangana, India."} },
    'jagannath-puri': { path: '/models/jagannath_puri_temple_model.glb', title: { en: "Jagannath Puri Temple" }, description: { en: "An important Hindu temple dedicated to Jagannath, a form of Vishnu."} },
    'ellora-caves': { path: '/models/ellora_caves__india.glb', title: { en: "Ellora Caves" }, description: { en: "A UNESCO World Heritage Site located in the Aurangabad district of Maharashtra."} },
    'sanchi-stupa': { path: '/models/great_stupa_in_sanchi.glb', title: { en: "Sanchi Stupa" }, description: { en: "A Buddhist complex, famous for its Great Stupa, on a hilltop at Sanchi Town."} },
    'lakshmi-narasimha': { path: '/models/lakshmi_narasimha.glb', title: { en: "Lakshmi Narasimha Statue" }, description: { en: "A colossal monolithic statue of Lakshmi Narasimha."} },
    'harihara': { path: '/models/harihara_statue.glb', title: { en: "Harihara Statue" }, description: { en: "A statue representing Harihara, a fused deity form of Vishnu and Shiva."} },
    'chhau-mask': { path: '/models/chhau_mask.glb', title: { en: "Chhau Mask" }, description: { en: "A traditional cultural heritage of Purulia, West Bengal."} },
    'konark-wheel': { path: '/models/konark_wheel.glb', title: { en: "Konark Wheel" }, description: { en: "One of the 24 intricately carved stone wheels of the Konark Sun Temple."} }
};


// --- TTS Engine ---
let utterance;
let voices = [];
const synth = window.speechSynthesis;

function loadVoices() {
    voices = synth.getVoices();
    const voice = voices.find(v => v.lang.startsWith('en') && v.default) || voices.find(v => v.lang.startsWith('en'));
    if (voice) {
        if (!utterance) utterance = new SpeechSynthesisUtterance();
        utterance.voice = voice;
        utterance.lang = voice.lang;
        utterance.rate = 0.9;
    }
}

function speak(text) {
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (text !== '') {
        utterance.text = text;
        synth.speak(utterance);
    }
}

function setupTTSControls() {
    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
    }

    const playBtn = document.getElementById('play-tts');
    const pauseBtn = document.getElementById('pause-tts');
    const stopBtn = document.getElementById('stop-tts');

    playBtn.onclick = () => {
        if (synth.paused) {
            synth.resume();
        } else {
            speak(modelData.description.en);
        }
    };
    pauseBtn.onclick = () => synth.pause();
    stopBtn.onclick = () => synth.cancel();
}


// --- WebXR ---
function init() {
    if (!navigator.xr) {
        document.getElementById('ar-unsupported').style.display = 'block';
        document.getElementById('ar-container').style.display = 'none';
        return;
    }

    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    const arButton = ARButton.createButton(renderer, { 
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.getElementById('ar-container') }
    });
    
    document.body.appendChild(arButton);
    arButton.addEventListener('click', () => {
         document.getElementById('interaction-prompt').style.display = 'block';
    });


    controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial()
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    const params = new URLSearchParams(window.location.search);
    const modelId = params.get('modelId') || 'qutub';
    modelData = modelMap[modelId];

    if (modelData) {
        document.getElementById('model-title').innerText = modelData.title.en;
        document.getElementById('model-description').innerText = modelData.description.en;
        const loader = new GLTFLoader();
        loader.load(modelData.path, function (gltf) {
            model = gltf.scene;
            document.getElementById('loader').style.display = 'none';
        }, undefined, function (error) {
            console.error(error);
            document.getElementById('loader').innerText = 'Error loading model.';
        });
    }

    setupTTSControls();
    window.addEventListener('resize', onWindowResize);
    renderer.setAnimationLoop(render);
}

function onSelect() {
    if (reticle.visible && model) {
        const newModel = model.clone();
        newModel.position.setFromMatrixPosition(reticle.matrix);
        // Scale models to a reasonable starting size
        newModel.scale.set(0.1, 0.1, 0.1); 
        scene.add(newModel);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render(timestamp, frame) {
    if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (hitTestSourceRequested === false) {
            session.requestReferenceSpace('viewer').then(function (referenceSpace) {
                session.requestHitTestSource({ space: referenceSpace }).then(function (source) {
                    hitTestSource = source;
                });
            });
            session.addEventListener('end', function () {
                hitTestSourceRequested = false;
                hitTestSource = null;
                document.getElementById('interaction-prompt').style.display = 'none';
            });
            hitTestSourceRequested = true;
        }

        if (hitTestSource) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);
            if (hitTestResults.length) {
                const hit = hitTestResults[0];
                reticle.visible = true;
                reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
            } else {
                reticle.visible = false;
            }
        }
    }
    renderer.render(scene, camera);
}

init();
