import {
    AmbientLight,
    AxesHelper,
    BoxGeometry,
    BoxBufferGeometry,
    BufferGeometry, Clock,
    Color,
    DirectionalLight,
    Float32BufferAttribute,
    GridHelper, Group, Line, LineBasicMaterial,
    MathUtils,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    MeshStandardMaterial,
    PerspectiveCamera,
    PointLight,
    PointLightHelper, Points, PointsMaterial,
    Scene,
    SphereGeometry,
    TextureLoader,
    TorusGeometry, VertexColors,
    WebGLRenderer,
    WebGLRenderTarget,
    DoubleSide,
    Vector2,
    Raycaster,
    Object3D
} from "https://unpkg.com/three@0.120.1/build/three.module.js";
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.120.1/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'https://cdn.skypack.dev/three@0.120.1/examples/jsm/controls/PointerLockControls.js';
import {DeviceOrientationControls} from 'https://cdn.skypack.dev/three@0.120.1/examples/jsm/controls/DeviceOrientationControls.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.120.1/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'https://cdn.skypack.dev/three@0.120.1/examples/jsm/loaders/MTLLoader';



let INTERSECTED;

const scene=new Scene();
const camera = new PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);
camera.position.y=2;


let controls = new DeviceOrientationControls(camera);

const renderer = new WebGLRenderer({
    canvas:document.querySelector('#rendu'),
    antialias:true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);

window.addEventListener('resize',resize);

renderer.render(scene,camera);

const pointLight=new PointLight(0xffffff);
pointLight.position.set(0,0,0);

const ambientLight= new AmbientLight(0xffffff);
scene.add(pointLight,ambientLight);

let start=document.querySelector("#rendu");
start.addEventListener("click",function () {

});

//Environnement
const textureDecor = new MTLLoader();
textureDecor.load(
    'assets/decor_v2.mtl',
    (materials) => {
        materials.preload()
        console.log(materials)
        const decor = new OBJLoader();
        decor.setPath('assets/');
        decor.setMaterials(materials)
         decor.load(
             'decor_v2.obj',
             (object) => {
                 scene.add(object)
             },
             (xhr) => {
                 console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
             },
             (error) => {
                 console.log('An error happened')
             }
         )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log('An error happened')
    }
);

//image environnement
const fontaineTexture= new TextureLoader().load('assets/affiche_film/fontaine_neptune.jpg');

const fontaine_neptune = new Mesh(
    new BoxGeometry(1,0.5,0.01),
    new MeshBasicMaterial({
        map:fontaineTexture,
    }),
);
fontaine_neptune.position.y=1.2;
fontaine_neptune.position.z=-0.5;
fontaine_neptune.position.x=3;
fontaine_neptune.rotation.y=1.5;
fontaine_neptune.userData.draggable=true;
fontaine_neptune.name='fontaineNeptune';

const archereTexture= new TextureLoader().load('assets/affiche_film/arc_here.jpg');

const arc_here = new Mesh(
    new BoxGeometry(1.5,0.7,0.01),
    new MeshBasicMaterial({
        map:archereTexture,
    }),
);
arc_here.rotation.y=1.5;
arc_here.position.y=1.2;
arc_here.position.z=0.5;
arc_here.position.x=-2.8;
arc_here.userData.draggable=true;
arc_here.name='arcHere';

const beauxartTexture= new TextureLoader().load('assets/affiche_film/beaux-art.jpg');

const beaux_art = new Mesh(
    new BoxGeometry(1.5,0.7,0.01),
    new MeshBasicMaterial({
        map:beauxartTexture,
    }),
);
beaux_art.position.y=1.2;
beaux_art.position.z=2.8;
beaux_art.position.x=0.7;
beaux_art.userData.draggable=true;
beaux_art.name='beauxArt';

const grandhotelHenryTexture= new TextureLoader().load('assets/affiche_film/grand_hotel_placeStan_Henry.jpg');

const grandhotelHenry = new Mesh(
    new BoxGeometry(1,0.5,0.01),
    new MeshBasicMaterial({
        map:grandhotelHenryTexture,
    }),
);
grandhotelHenry.rotation.y=2;
grandhotelHenry.position.y=1.2;
grandhotelHenry.position.z=-2;
grandhotelHenry.position.x=2.8;
grandhotelHenry.userData.draggable=true;
grandhotelHenry.name='grandHotelHenry';

const grandhotelTexture= new TextureLoader().load('assets/affiche_film/grand_hotel_placeStan.jpg');

const grandhotel = new Mesh(
    new BoxGeometry(1,0.5,0.01),
    new MeshBasicMaterial({
        map:grandhotelTexture,
    }),
);
grandhotel.rotation.y=2;
grandhotel.position.y=0.5;
grandhotel.position.z=-2.3;
grandhotel.position.x=2.8;
grandhotel.userData.draggable=true;
grandhotel.name='grandHotel';

const vuelumiereTexture= new TextureLoader().load('assets/affiche_film/vue-lumiere.jpg');

const vuelumiere = new Mesh(
    new BoxGeometry(1,0.5,0.01),
    new MeshBasicMaterial({
        map:vuelumiereTexture,
    }),
);
vuelumiere.rotation.y=1.2;
vuelumiere.position.y=1;
vuelumiere.position.z=2;
vuelumiere.position.x=2.8;
vuelumiere.userData.draggable=true;
vuelumiere.name='vueLumiere';

scene.add(fontaine_neptune,arc_here,beaux_art,grandhotelHenry,grandhotel,vuelumiere);


function tick(){
    requestAnimationFrame(tick);
    renderer.render(scene,camera);
    controls.update();
}

//Raycast pour le clique
var raycaster,mouse = { x : 0, y : 0 };
renderer.domElement.addEventListener( 'click', raycast, false );
raycaster=new Raycaster();

function raycast(e) {
    let carte=document.getElementsByClassName("carte");
    for (let k = 0; k < carte.length; k++) {
        carte[k].style.display="none";
    }

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    console.log(mouse);

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children);
    for (var i = 0; i < intersects.length; i++) {
        console.log(intersects[i].object.name);
        if (intersects[i].distance<4) {
            intersects[i].object.scale.set(1.2, 1.2);
            let imgOpen=document.querySelector("#"+intersects[i].object.name);
            imgOpen.style.display="flex";
            let close=document.querySelector("#close"+intersects[i].object.name);
            close.addEventListener("click",function(){
                for (let j = 0; j < carte.length; j++) {
                    carte[j].style.display="none";
                }
            });
        }
    }
}

//Adapter la page à l'écran
function resize(){
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
};



tick();
resize();
scene.add(camera);