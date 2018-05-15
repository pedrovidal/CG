var scene 					= null;
var rendererPerspective		= null;
var rendererOrthographic	= null;
var cameraPerspective		= null;
var angleX					= 0.007;
var angleY					= 0.0;
var angleZ					= 0.0;
var box 					= null;

function init() {

	scene = new THREE.Scene();

	rendererOrthographic = new THREE.WebGLRenderer();
	rendererOrthographic.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	rendererOrthographic.setSize(window.innerWidth*0.5, window.innerHeight*0.5);
	document.getElementById("WebGL-output").appendChild(rendererOrthographic.domElement);

	rendererPerspective = new THREE.WebGLRenderer();
	rendererPerspective.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	rendererPerspective.setSize(window.innerWidth*0.5, window.innerHeight*0.5);
	document.getElementById("WebGL-output2").appendChild(rendererPerspective.domElement);

	aspectRatio = window.innerWidth/window.innerHeight;

	cameraPerspective = new THREE.PerspectiveCamera( 100.0, aspectRatio, 0.1, 10000.0 );
	cameraPerspective.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add( cameraPerspective );

	cameraOrthographic = new THREE.OrthographicCamera( 1, -1, -1, 1, -1, 1);
	cameraOrthographic.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add( cameraOrthographic );
	
	// Load Mesh
	var loader = new THREE.OBJLoader();
	loader.load('./city.obj', loadMesh);
		
	orbitControlsPerspective = new THREE.OrbitControls(cameraPerspective/*, rendererPerspective.domElement*/);
	orbitControlsPerspective.autoRotate = false;

	orbitControlsOrthographic = new THREE.OrbitControls(cameraOrthographic/*, rendererOrthographic.domElement*/);
	orbitControlsOrthographic.autoRotate = false;

	rendererPerspective.clear();
	renderPerspective();

	rendererOrthographic.clear();
	renderOrthographic();
};


function renderPerspective() {

	// var obj = scene.getObjectByName("myObj");
	// obj.rotateX(angleX);
	
	orbitControlsPerspective.update();
	rendererPerspective.render(scene, cameraPerspective);
	requestAnimationFrame(renderPerspective);
}

function renderOrthographic() {

	// var obj = scene.getObjectByName("myObj");
	// obj.rotateX(angleX);
	
	orbitControlsOrthographic.update();
	rendererOrthographic.render(scene, cameraOrthographic);
	requestAnimationFrame(renderOrthographic);
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
	
	cameraPerspective.position.set(box.max.x, box.max.y, box.max.z);
	cameraPerspective.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
	orbitControlsPerspective.update();
	
	cameraOrthographic.bottom = box.min.y;
	cameraOrthographic.top = box.max.y;
	cameraOrthographic.left = box.min.x;
	cameraOrthographic.right = box.max.x;
	cameraOrthographic.near = 0.1;
	cameraOrthographic.far = 10000;
	cameraOrthographic.zoom *= 0.5;
	cameraOrthographic.position.set(box.max.x, box.max.y / 2, box.max.z);
	cameraOrthographic.lookAt(new THREE.Vector3(0, 0, 0));
	cameraOrthographic.updateProjectionMatrix();

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