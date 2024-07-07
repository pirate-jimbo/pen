const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// ------------- Set renderer-------------
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
let angle = 0;

// // ---------------Light----------------
const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
pointLight.position.set(40, 80, 4);
pointLight.castShadow = true; // default false
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
scene.add(pointLight);

//0.6
const ambientLight = new THREE.AmbientLightProbe(0xffffff, 0.6);
ambientLight.position.set(40, 80, 4);
scene.add(ambientLight);



//----------------Floor------------------
const tilesTexture = new THREE.TextureLoader().load("textures/tiles.png");
tilesTexture.wrapS = THREE.RepeatWrapping;
tilesTexture.wrapT = THREE.RepeatWrapping;
tilesTexture.repeat.set(15, 15);
tilesTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

let floor = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({
  map: tilesTexture,
});
floor = new THREE.Mesh(floor, floorMaterial);
floor.rotation.x = (-90 * Math.PI) / 180;
floor.receiveShadow = true; //default
scene.add(floor);

// ---------------Table-----------------

// //----Table top----
const tableTextures = [
  "textures/text 1.png",
  "textures/text 2.png",
  "textures/text 3.png",
  "textures/text 4.png",
  "textures/text 5.png",
];
let tableTextureNo = 4;
let tableTexture = new THREE.TextureLoader().load(
  tableTextures[tableTextureNo]
);
tableTexture.wrapS = THREE.RepeatWrapping;
tableTexture.wrapT = THREE.RepeatWrapping;
tableTexture.repeat.set(1, 1);
tableTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
const tableMaterial = new THREE.MeshStandardMaterial({
  map: tableTexture,
});

let tableTop = new THREE.CapsuleGeometry( .5,12, 32, 32 );
tableTop = new THREE.Mesh(tableTop, tableMaterial);
tableTop.position.set(0, 7, 0);
tableTop.castShadow = true;
scene.add(tableTop);

// // -------Table Legs--------
let tableBottomRight = new THREE.ConeGeometry( 0.5, 2, 32 );
tableBottomRight = new THREE.Mesh(tableBottomRight, tableMaterial);
tableBottomRight.position.set(0,7,0);
tableBottomRight.castShadow = true;
tableTop.add(tableBottomRight);



// ----------- Chair --------------

//Chair

const chairTextures = [
  "textures/text 6.png",
  "textures/text 7.png",
  "textures/text 8.png",
  "textures/text 9.png",
  "textures/text 10.png",
];
let chairTextureNo = 2;
let chairTexture = new THREE.TextureLoader().load(
  chairTextures[chairTextureNo]
);
chairTexture.wrapS = THREE.RepeatWrapping;
chairTexture.wrapT = THREE.RepeatWrapping;
chairTexture.repeat.set(1, 1);
chairTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
const chairMaterial = new THREE.MeshStandardMaterial({
  map: chairTexture,
});

let chairTop = new THREE.CylinderGeometry( .5, .5, 4, 32 );
chairTop = new THREE.Mesh(chairTop, chairMaterial);
chairTop.position.set(0, 18, 0);
chairTop.castShadow = true;
scene.add(chairTop);

let chairBack = new THREE.BoxGeometry( 0.5,3,.5 );
chairBack = new THREE.Mesh(chairBack, chairMaterial);
chairBack.position.set(.5, .5, 0);
chairBack.castShadow = true;
chairTop.add(chairBack);










/////////////////piece ---------------  ------------
let vertexShaderShowPiece =
  `varying vec2 globecord;
   void main()	{
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
     globecord = uv;
   }`

let fragmantShaderShowPiece = 
`varying vec2 globecord;
 uniform sampler2D u_texture_globe;
 void main()
 {
     gl_FragColor = texture2D(u_texture_globe, globecord);
 }`
let showpiece = new THREE.DodecahedronGeometry(1.2, 10);

let showPieceMaterial = new THREE.ShaderMaterial({
  
  vertexShader: vertexShaderShowPiece,
  fragmentShader: fragmantShaderShowPiece
});

showpiece = new THREE.Mesh(showpiece, showPieceMaterial);


// -----------------Camera----------------
let cameraRotationVar = 0.3;
let cameraPositionY = 30;
const camera = new THREE.PerspectiveCamera(
  60,
  sizes.width / sizes.height,
  1,
  100
);
camera.position.x = Math.sin(cameraRotationVar) * 27;
camera.position.y = cameraPositionY;
camera.position.z = Math.cos(cameraRotationVar) * 27;
camera.lookAt(0, 5, 0);
scene.add(camera);


renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
renderer.setClearColor(0xffffff, 1);
renderer.clear();

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  renderer.render(scene, camera);

  requestAnimationFrame(loop);
};

loop();

var clock = new THREE.Clock();

function lightMove() {
  const time = clock.getElapsedTime();

  pointLight.position.x = Math.sin(time) * 80;
  pointLight.position.y = 60;
  pointLight.position.z = Math.cos(time) * 80;

  showpiece.rotation.y += 0.01;

  requestAnimationFrame(lightMove);
}

lightMove();

function moveCamera() {
  camera.position.x = Math.sin(cameraRotationVar) * 27;
  camera.position.y = cameraPositionY;
  camera.position.z = Math.cos(cameraRotationVar) * 27;
  camera.lookAt(0, 5, 0);
  renderer.render(scene, camera);
}

document.onkeydown = checkKey;

function checkKey(e) {
  if (e.keyCode == "38") {
    // up key
    cameraPositionY += 1;
    if (cameraPositionY > 50) {
      cameraPositionY = 50;
    }
    moveCamera();
  } else if (e.keyCode == "40") {
    // down arrow
    cameraPositionY -= 1;
    if (cameraPositionY < 20) {
      cameraPositionY = 20;
    }
    moveCamera();
  } else if (e.keyCode == "37") {
    // left arrow
    cameraRotationVar += 0.03;
    moveCamera();
  } else if (e.keyCode == "39") {
    // right arrow
    cameraRotationVar -= 0.03;
    moveCamera();
  }
}


// --------------For changing table texture with mouseclick--------------
addEventListener("click", (event) => {
  tableTextureNo += 1;
  tableTextureNo = tableTextureNo % 5;

  tableTexture.dispose();
  tableTexture = new THREE.TextureLoader().load(tableTextures[tableTextureNo]);
  tableTexture.wrapS = THREE.RepeatWrapping;
  tableTexture.wrapT = THREE.RepeatWrapping;
  tableTexture.repeat.set(1, 1);
  tableTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  tableMaterial.map = tableTexture;
  uniforms["u_texture"].value = tableTexture;
});
addEventListener("click", (event) => {  
  chairTextureNo += 1;
  chairTextureNo = chairTextureNo % 5;

  chairTexture.dispose();
  chairTexture = new THREE.TextureLoader().load(chairTextures[chairTextureNo]);
  chairTexture.wrapS = THREE.RepeatWrapping;
  chairTexture.wrapT = THREE.RepeatWrapping;
  chairTexture.repeat.set(1, 1);
  chairTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  chairMaterial.map = chairTexture;
  uniforms["u_texture"].value = chairTexture;

});

