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
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.120.1/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'https://cdn.skypack.dev/three@0.120.1/examples/jsm/loaders/MTLLoader';


let INTERSECTED;

const scene=new Scene();


const camera = new PerspectiveCamera(
    50,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);
camera.position.y=2;
const renderer = new WebGLRenderer({
    canvas:document.querySelector('#rendu'),
    antialias:true,
});

/*let gyro = new THREE.Gyroscope();
gyro.position.set(0,4,0);

scene.add(gyro);
gyro.add(camera)*/

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);


renderer.render(scene,camera);

const pointLight=new PointLight(0xffffff);
pointLight.position.set(0,0,0);

const ambientLight= new AmbientLight(0xffffff);
scene.add(pointLight,ambientLight);

const controls= new PointerLockControls(camera, renderer.domElement);
let start=document.querySelector("#rendu");
start.addEventListener("click",function (){
    controls.lock();
});


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
fontaine_neptune.userData.name='Fontaine_neptune';

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
arc_here.userData.name='arc_here';

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
beaux_art.userData.name='beaux_art';

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
grandhotelHenry.userData.name='grandhotelHenry';

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
grandhotel.userData.name='grandhotel';

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
vuelumiere.userData.name='vuelumiere';

scene.add(fontaine_neptune,arc_here,beaux_art,grandhotelHenry,grandhotel,vuelumiere);

function tick(){
    requestAnimationFrame(tick);
    renderer.render(scene,camera);
    render();
    // find intersections

}
const mouseMove = new Vector2();
document.addEventListener( 'click', onDocumentMouseMove );
function onDocumentMouseMove( event ) {

    //event.preventDefault();

    mouseMove.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouseMove.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
//const mouseClick=new Vector2();
const raycaster = new Raycaster();
//var draggable= new Object3D();

/*window.addEventListener('click',function (event){
    mouseMove.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouseMove.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(mouseClick,camera);
    const clique= raycaster.intersectObject(scene.children, false);
    if (clique.length>0 && clique[0].object.userData.draggable){
        draggable=clique[0].object;
        console.log('trouvé un cliquable' + draggable.userData.name);
    }
})*/

function render(){
    raycaster.setFromCamera( mouseMove, camera );

    const intersects = raycaster.intersectObjects( scene.children, false );

    if ( intersects.length > 0 ) {

        if ( INTERSECTED !== intersects[ 0 ].object ) {
            if ( INTERSECTED ) {
                //INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            }

            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.scale.set(1,1);
            //INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            //INTERSECTED.material.emissive.setHex( 0xff0000 );

        }

    } else {

        if ( INTERSECTED ) {
            //INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            //console.log(INTERSECTED.scale);
            INTERSECTED.scale.set(1.2,1.2);

        }


        INTERSECTED = null;

    }
}
tick();
render();
scene.add(camera);
//scene.add(cube1);
