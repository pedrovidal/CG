function init(){
	var scene = new THREE.Scene();
	var renderer = new THREE.WebGLRenderer();
	var camera = new THREE.OrthographicCamera( -1.0, 1.0, 1.0, -1.0, -1.0, 1.0 );
	
	scene.add(camera);

	var globalAxis = new THREE.AxesHelper(1.0);
	//scene.add(globalAxis);

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(500, 500);

	var planeGeometry = new THREE.Geometry();

	planeGeometry.vertices.push(new THREE.Vector3( 0.3,  0.3, 0.0)); 
	planeGeometry.vertices.push(new THREE.Vector3(-0.3, -0.3, 0.0)); 
	planeGeometry.vertices.push(new THREE.Vector3( 0.5, -0.5, 0.0)); 
	planeGeometry.vertices.push(new THREE.Vector3(-0.5, 0.5, 0.0));

	planeGeometry.faces.push(new THREE.Face3(0, 1, 2));
	planeGeometry.faces.push(new THREE.Face3(1, 0, 3));

	planeGeometry.faces[0].vertexColors[0] = new THREE.Color(1.0, 0.0, 0.0);
	planeGeometry.faces[0].vertexColors[1] = new THREE.Color(0.0, 1.0, 0.0);
	planeGeometry.faces[0].vertexColors[2] = new THREE.Color(0.0, 0.0, 1.0);
	
	planeGeometry.faces[1].vertexColors[0] = new THREE.Color(0.6, 0.0, 0.41);
	planeGeometry.faces[1].vertexColors[1] = new THREE.Color(0.2, 0.6, 0.8);
	planeGeometry.faces[1].vertexColors[2] = new THREE.Color(0.3, 0.2, 0.0);

	var planeMaterial = new THREE.MeshBasicMaterial({
		vertexColors:THREE.VertexColors,
		wireframe:false
	});

	var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

	scene.add(planeMesh);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);
	renderer.clear();
	renderer.render(scene, camera);
}