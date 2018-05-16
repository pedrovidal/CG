var scene 				= null;
var renderer			= null;
var cameraAvatar 		= null;
var box 				= null;

function init() {

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(window.innerWidth*0.7, window.innerHeight*0.7);
	aspectRatio = window.innerWidth/window.innerHeight;

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	cameraAvatar = new THREE.PerspectiveCamera( 45.0, aspectRatio, 0.1, 10000.0 );
	cameraAvatar.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add( cameraAvatar );
	
	// Load Mesh
	var loader = new THREE.OBJLoader();
	loader.load('./city.obj', loadMesh);
		
	controls = new THREE.FirstPersonControls( cameraAvatar );
	controls.lookSpeed = 0.07;
	controls.movementSpeed = 5;
	controls.target = new THREE.Vector3(0,0,0);
	clock = new THREE.Clock( true );

	renderer.clear();
	render();
};


function render() {

	// var obj = scene.getObjectByName("myObj");
	// obj.rotateX(angleX);
	
	controls.update(clock.getDelta());
	renderer.render(scene, cameraAvatar);
	requestAnimationFrame(render);
}


function loadMesh(loadedMesh) {
	
	loadedMesh.name = "city";
	var material = new THREE.MeshPhongMaterial();
	material.bothsides	= false;
	material.side 		= THREE.FrontSide;
	
	loadedMesh.children.forEach(function (child) {
		child.material = material;
	});

	mesh = loadedMesh;
	scene.add(loadedMesh);
	
	box = new THREE.Box3();
	box.expandByObject(mesh);
	
	controls.lookVertical = true;
	controls.constrainVertical = true;
	controls.verticalMin = 1.0;
	controls.verticalMax = 2.1;
	// controls.verticalMin = 1.55;
	// controls.verticalMax = 1.56;
	// controls.lon = -140;
	// controls.lat = 0;
	cameraAvatar.position.set(5, 1.8, 0);
	cameraAvatar.lookAt(mesh.position);
	// controls.position.x = box.max.x;
	// controls.position.y = box.max.y;
	// controls.position.z = box.max.z;
	// controls.phi = 0;
	// controls.theta = 0;
	// controls.target = loadedMesh.position;
	
	//Add point light Source
	var pointLight1 = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0));
	pointLight1.distance = 0.0;
	pointLight1.position.set(box.max.x*1.2, box.max.y*1.2, box.max.z*1.2);
	// pointLight1.position.set(0, 70, 0);
	scene.add(pointLight1);
	
	// Global Axis
	var globalAxis = new THREE.AxesHelper	( Math.max(	(box.max.x - box.min.x),
														(box.max.y - box.min.y),
														(box.max.z - box.min.z)
				  									  )
											);
	scene.add( globalAxis );
};