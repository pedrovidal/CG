var scene 				= null;
var renderer			= null;
var cameraAvatar 		= null;
var cameraMiniMap 		= null;
var cameraRearview 		= null;
var box 				= null;
var mesh 				= null;

function init() {

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(/*new THREE.Color(0.0, 0.0, 0.0)*/0x87CEEB);
	renderer.setSize(window.innerWidth*0.9, window.innerHeight*0.9);
	// aspectRatio = window.innerWidth/window.innerHeight;
	aspectRatio = 2.35;

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	avatarGeometry = new THREE.CircleGeometry( 2, 32);
	avatarMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.FrontSide } );
	avatar = new THREE.Mesh( avatarGeometry, avatarMaterial );
	avatar.rotation.x -= Math.PI / 2;

	scene.add( avatar );
	
	cameraRearview = new THREE.PerspectiveCamera( 45.0, aspectRatio, 0.1, 10000.0 );
	// cameraRearview.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add( cameraRearview );

	cameraAvatar = new THREE.PerspectiveCamera( 45.0, aspectRatio, 0.1, 10000.0 );
	// cameraAvatar.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add( cameraAvatar );

	controlsAvatar = new THREE.FirstPersonControls( cameraAvatar );
	controlsAvatar.lookSpeed = 0.07;
	controlsAvatar.movementSpeed = 5;
	controlsAvatar.originalMovementSpeed = 5;
	controlsAvatar.target = new THREE.Vector3(0,0,0);
	clock = new THREE.Clock( true );

	cameraMiniMap = new THREE.OrthographicCamera(100, -100, -100, 100, 0.1, 100);
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


	// cameraMiniMap.rotation = cameraAvatar.rotation;

	var matrix = new THREE.Matrix4();
	matrix.extractRotation( cameraAvatar.matrix );

	var direction = new THREE.Vector3( 0, 0, 1 );
	direction.applyMatrix4(matrix);// = matrix.multiplyVector3( direction );

	// console.log(direction, cameraMiniMap.up, cameraMiniMap.up.angleTo(direction))
	var cross = new THREE.Vector3();
	cross.crossVectors(cameraMiniMap.up, direction.projectOnPlane(new THREE.Vector3(0, 1, 0)))
	if (cross.y > 0)
		cameraMiniMap.rotateZ(cameraMiniMap.up.angleTo(direction.projectOnPlane(new THREE.Vector3(0, 1, 0))));
	else if (cross.y < 0)
		cameraMiniMap.rotateZ(-cameraMiniMap.up.angleTo(direction.projectOnPlane(new THREE.Vector3(0, 1, 0))));
	cameraMiniMap.up = direction;

	cameraAvatar.updateProjectionMatrix();
	cameraMiniMap.updateProjectionMatrix();

	scene.remove(avatar);
	avatar.position.x = cameraAvatar.position.x;
	avatar.position.z = cameraAvatar.position.z;
	scene.add(avatar);


	// cameraRearview.position.x = cameraAvatar.position.x;
	// cameraRearview.position.z = cameraAvatar.position.z;

	cameraRearview = cameraAvatar.clone();
	cameraRearview.rotateY(-Math.PI);
	cameraRearview.updateProjectionMatrix();

	var left = 0;
	var top = 0;
	var width = window.innerWidth * 0.9;
	var height = window.innerHeight * 0.9;

	renderer.setViewport(left, top, width, height);
	renderer.setScissor(left, top, width, height);
	renderer.setScissorTest(true);    
	renderer.render(scene, cameraAvatar);
	
	left = window.innerWidth * 0.7515;
	height = window.innerHeight * 0.9 - window.innerHeight * 0.6;
	width = height; // para q MiniMapa seja um quadrado

	renderer.setViewport(left, top, width, height);
 	renderer.setScissor(left, top, width, height);
	renderer.setScissorTest(true);  
	renderer.render(scene, cameraMiniMap);

	left = 0;
	height = window.innerHeight * 0.9 - window.innerHeight * 0.6;
	width = height; // para q MiniMapa seja um quadrado

	renderer.setViewport(left, top, width, height);
 	renderer.setScissor(left, top, width, height);
	renderer.setScissorTest(true);  
	renderer.render(scene, cameraRearview);

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

	avatar.position.set(5, box.max.y, 17);
	
	controlsAvatar.lookVertical = true;
	controlsAvatar.constrainVertical = true;
	controlsAvatar.verticalMin = 1.1;
	controlsAvatar.verticalMax = 2.0;

	controlsAvatar.maxx = box.max.x;
	controlsAvatar.minx = box.min.x;
	controlsAvatar.maxz = box.max.z;
	controlsAvatar.minz = box.min.z;

	cameraAvatar.position.set(5, 1.7, 15); // y = altura visao camera avatar
	cameraAvatar.lookAt(mesh.position);

	cameraMiniMap.position.set(5, box.max.y * 1.1, 15);
	cameraMiniMap.lookAt(cameraAvatar.position);
	cameraMiniMap.rotation.z = Math.PI / 2;

	cameraRearview = cameraAvatar.clone();
	cameraRearview.rotateY(Math.PI);
	cameraRearview.updateProjectionMatrix();

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
	// var globalAxis = new THREE.AxesHelper	( Math.max(	(box.max.x - box.min.x),
	// 													(box.max.y - box.min.y),
	// 													(box.max.z - box.min.z)
	// 			  									  )
	// 										);
	// scene.add( globalAxis );
};