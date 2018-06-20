var scene 			= null;
var renderer		= null;
var camera 			= null;
var orbitControls	= null;
var day 			= 0.0;
var year			= 0.0;
var month			= 0.0;
var clock;

function init() {

	clock = new THREE.Clock();
	
	scene = new THREE.Scene();

	loadMesh();

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(window.innerWidth*0.7, window.innerHeight*0.7);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(60.0, 1.0, 0.1, 30.0);
	
	// Controle de Camera Orbital
	orbitControls = new THREE.OrbitControls(camera);
	orbitControls.autoRotate = false;
		
	renderer.clear();
}

function loadMesh() {

	// Load Mesh
	var loader = new THREE.OBJLoader();
	loader.load('Pikachu.obj', buildScene);		
}

function render() {
	var delta = clock.getDelta();
    orbitControls.update(delta);

	renderer.render(scene, camera);
	requestAnimationFrame(render);
}

function buildScene(loadedMesh) {

	var material 		= new THREE.MeshStandardMaterial();
	material.color 		= new THREE.Color(1.0, 1.0, 0.0);

	material.roughness = 4;
	material.metalness = 2;

	loadedMesh.children.forEach(function (child) {
		child.material = material;
		});

	scene.add(loadedMesh);

	// Bounding Box	
	var BBox = new THREE.Box3();
	BBox.setFromObject(loadedMesh);
	// BBox.update();

	var pointMax = new THREE.SpotLight(new THREE.Color(1.0, 1.0, 1.0), 1.0, Math.PI / 2, 0.5, 10);

	pointMax.target = loadedMesh;

	pointMax.position.x = BBox.max.x;
	pointMax.position.y = BBox.max.y;
	pointMax.position.z = BBox.max.z;

	pointMax.intensity = 1;

	scene.add(pointMax);
	
	var pointMin = new THREE.AmbientLight(new THREE.Color(1.0, 1.0, 1.0));
	pointMin.position.x = BBox.min.x;
	pointMin.position.y = BBox.min.y;
	pointMin.position.z = BBox.min.z;

	pointMin.intensity = 1;

	pointMin.lookAt(new THREE.Vector3(1, 1, 1));

	scene.add(pointMin);

	// Adjust Camera Position and LookAt	
	var maxCoord = Math.max(BBox.max.x,BBox.max.y,BBox.max.z);
	
	camera.position.x 	= 
	camera.position.y 	= 
	camera.position.z 	= maxCoord*1.5;
	camera.far 			= new THREE.Vector3(	maxCoord*2.5, 
												maxCoord*2.5, 
												maxCoord*2.5).length();

	camera.lookAt(new THREE.Vector3(	(BBox.max.x + BBox.min.x)/2.0,
										(BBox.max.y + BBox.min.y)/2.0,
										(BBox.max.z + BBox.min.z)/2.0));
	camera.updateProjectionMatrix();

	// Global Axis
	var globalAxis = new THREE.AxisHelper(maxCoord*1.3);
	scene.add( globalAxis );
	
	// Ground
	var groundGeom = new THREE.PlaneBufferGeometry(maxCoord*20.5, maxCoord*20.5, 50, 50);

	var groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({color: 0x555555}));
	groundMesh.material.side 	= THREE.DoubleSide;
	groundMesh.material.shading	= THREE.SmoothShading;
	groundMesh.rotation.x = -Math.PI / 2;
	groundMesh.position.y = -0.1;
	scene.add(groundMesh);
	
	render();
}

