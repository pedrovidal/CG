var scene 					= null;
var renderer				= null;
var cameraPerspective		= null;
var cameraOrthographic		= null;
var angleX					= 0.007;
var angleY					= 0.0;
var angleZ					= 0.0;
var box 					= null;
var zBuffer 				= true;
var faceCull				= "FrontFace";
var guiChanged				= false;
var clock;
var params;

function init() {

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9);
	document.getElementById("WebGL-output").appendChild(renderer.domElement);

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
		
	controlsPerspective = new THREE.FlyControls(cameraPerspective, renderer.domElement);
	controlsPerspective.autoRotate = false;

	controlsOrthographic = new THREE.FlyControls(cameraOrthographic, renderer.domElement);
	controlsOrthographic.autoRotate = false;

	initGUI();

	renderer.clear();
	render();

};

function initGUI() {
	
	params = 	{	zBuffer		: true,
					faceCulling	: "FrontFace"
				};

	var gui = new dat.GUI();	
	gui.add( params, 'zBuffer').onChange(function(){
				guiChanged = true;
    			});
	gui.add( params, 'faceCulling', [ "FrontFace", "BackFace", "DoubleSide" ] ).onChange(function(){
				guiChanged = true;
    			});
	gui.open();
		
};


function render() {

	// var obj = scene.getObjectByName("myObj");
	// obj.rotateX(angleX);

	if (guiChanged) {

		guiChanged = false;
		
		if (zBuffer !== params.zBuffer) 
			zBuffer = params.zBuffer;
			
		if (faceCull !== params.faceCulling) 
			faceCull = params.faceCulling;
			
		if (mesh) {
			scene.getObjectByName("city").children.forEach(function (child) {
				child.material.depthTest = zBuffer;
				switch( faceCull ) {
					case "FrontFace"	: 	child.material.side = THREE.FrontSide; 
											break;
					case "BackFace"		: 	child.material.side = THREE.BackSide; 
											break;
					case "DoubleSide"	: 	child.material.side = THREE.DoubleSide; 
											break;
					}
				});
			}
		}
	
	controlsPerspective.update(0.5);
	controlsOrthographic.update(0.5);
	// todo viewport
	// renderer.render(scene, cameraPerspective);

	var left = 0;
	var top = 0;
	var width = window.innerWidth * 0.45;
	var height = window.innerHeight;

	renderer.setViewport(left, top, width, height);
	renderer.setScissor(left, top, width, height);
	renderer.setScissorTest(true);    
	renderer.render(scene, cameraPerspective);

	left = window.innerWidth * 0.45;

	renderer.setViewport(left, top, width, height);
 	renderer.setScissor(left, top, width, height);
	renderer.setScissorTest(true);  
	renderer.render(scene, cameraOrthographic);

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
	
	cameraPerspective.position.set(box.max.x, box.max.y / 2, box.max.z);
	cameraPerspective.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
	controlsPerspective.update(0.5);
	
	cameraOrthographic.bottom = box.min.y;
	cameraOrthographic.top = box.max.y;
	cameraOrthographic.left = box.min.x;
	cameraOrthographic.right = box.max.x;
	cameraOrthographic.near = 0.1;
	cameraOrthographic.far = 10000.0;
	cameraOrthographic.zoom *= 0.5;
	cameraOrthographic.position.set(box.max.x, box.max.y / 2, box.max.z);
	cameraOrthographic.lookAt(new THREE.Vector3(0, 0, 0));
	cameraOrthographic.updateProjectionMatrix();
	controlsOrthographic.update(0.5);

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