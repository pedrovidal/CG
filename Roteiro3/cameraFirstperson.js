var scene 				= null;
var renderer			= null;
var cameraAvatar 		= null;
var cameraMiniMap 		= null;
var box 				= null;

function init() {

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(window.innerWidth*0.9, window.innerHeight*0.9);
	aspectRatio = window.innerWidth/window.innerHeight;

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	circleGeometry = new THREE.CircleGeometry( 2, 32);
	circleMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } );
	circle = new THREE.Mesh( circleGeometry, circleMaterial );
	circle.rotation.x -= Math.PI / 2;
	circle.position.set(5, 1.7, 17);

	scene.add( circle );
	

	cameraAvatar = new THREE.PerspectiveCamera( 45.0, aspectRatio, 0.1, 10000.0 );
	cameraAvatar.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add( cameraAvatar );

	controlsAvatar = new THREE.FirstPersonControls( cameraAvatar );
	controlsAvatar.lookSpeed = 0.07;
	controlsAvatar.movementSpeed = 5;
	controlsAvatar.target = new THREE.Vector3(0,0,0);
	clock = new THREE.Clock( true );

	cameraMiniMap = new THREE.OrthographicCamera(100, -100, -100, 100, -100, 100);
	scene.add( cameraMiniMap );
	
	// Load Mesh
	var loader = new THREE.OBJLoader();
	loader.load('./city.obj', loadMesh);
		

	renderer.clear();
	render();
};


function render() {
	controlsAvatar.update(clock.getDelta());
	
	// cameraMiniMap.lookAt(cameraAvatar.position);
	cameraMiniMap.position.x = cameraAvatar.position.x;
	cameraMiniMap.position.z = cameraAvatar.position.z;

	cameraMiniMap.rotation = cameraAvatar.rotation;

	scene.remove(circle);
	circle.position.x = cameraAvatar.position.x;
	circle.position.z = cameraAvatar.position.z;
	scene.add(circle);

	var left = 0;
	var top = 0;
	var width = window.innerWidth * 0.45;
	var height = window.innerHeight;

	renderer.setViewport(left, top, width, height);
	renderer.setScissor(left, top, width, height);
	renderer.setScissorTest(true);    
	renderer.render(scene, cameraAvatar);

	left = window.innerWidth * 0.45

	renderer.setViewport(left, top, width, height);
 	renderer.setScissor(left, top, width, height);
	renderer.setScissorTest(true);  
	renderer.render(scene, cameraMiniMap);

	requestAnimationFrame(render);
}


function loadMesh(loadedMesh) {
	
	loadedMesh.name = "city";
	var material = new THREE.MeshPhongMaterial();
	material.bothsides	= false;
	material.side 		= THREE.DoubleSide;
	
	loadedMesh.children.forEach(function (child) {
		child.material = material;
	});

	mesh = loadedMesh;
	scene.add(loadedMesh);
	
	box = new THREE.Box3();
	box.expandByObject(mesh);

	
	controlsAvatar.lookVertical = true;
	controlsAvatar.constrainVertical = true;
	controlsAvatar.verticalMin = 1.1;
	controlsAvatar.verticalMax = 2.0;

	cameraAvatar.position.set(5, 1.7, 15); // y = altura visao camera avatar
	cameraAvatar.lookAt(mesh.position);

	cameraMiniMap.position.set(5, box.max.y, 15);
	cameraMiniMap.lookAt(5, 1.7, 17);
	cameraMiniMap.rotation.z = Math.PI / 2;

	//Add point light Source
	var pointLight1 = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0));
	pointLight1.distance = 0.0;
	pointLight1.position.set(box.max.x*1.2, box.max.y*1.2, box.max.z*1.2);
	scene.add(pointLight1);

	var pointLight2 = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0));
	pointLight2.distance = 0.0;
	pointLight2.position.set(-box.max.x*1.2, box.max.y*1.2, -box.max.z*1.2);
	scene.add(pointLight2);
	
	// Global Axis
	var globalAxis = new THREE.AxesHelper	( Math.max(	(box.max.x - box.min.x),
														(box.max.y - box.min.y),
														(box.max.z - box.min.z)
				  									  )
											);
	scene.add( globalAxis );
};