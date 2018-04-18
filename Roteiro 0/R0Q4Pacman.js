function init(){
	var scene = new THREE.Scene();
	var renderer = new THREE.WebGLRenderer();
	var camera = new THREE.OrthographicCamera( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );
	
	scene.add(camera);

	var globalAxis = new THREE.AxesHelper(1.0);
	//scene.add(globalAxis);

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(500, 500);

	var pacmanGeometry = new THREE.Geometry();

	var numVertices = 60;
	var raio = 0.8;

	pacmanGeometry.vertices.push(new THREE.Vector3(0.0, 0.0, 0.0));

	for (i = Math.PI/6; i < (2*Math.PI)-Math.PI/6; i+=(2*Math.PI)/numVertices){
		var x = raio * Math.cos(i);
		var y = raio * Math.sin(i);
		pacmanGeometry.vertices.push(new THREE.Vector3(x, y, 0.0));
	}

	for (i = 0; i<= numVertices; i++){
		pacmanGeometry.faces.push(new THREE.Face3(0, i, i+1));
		pacmanGeometry.faces[i].vertexColors[0] = new THREE.Color( 1.0, 1.0, 0.0); 
		pacmanGeometry.faces[i].vertexColors[1] = new THREE.Color( 1.0, 1.0, 0.0); 
		pacmanGeometry.faces[i].vertexColors[2] = new THREE.Color( 1.0, 1.0, 0.0);
	}

	var pacmanMaterial = new THREE.MeshBasicMaterial({
		color:0xffffff, 
		vertexColors:THREE.VertexColors,
		side:THREE.DoubleSide,
		wireframe:false
	})

	var pacmanMesh = new THREE.Mesh(pacmanGeometry, pacmanMaterial);

	scene.add(pacmanMesh);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);
	renderer.clear();
	renderer.render(scene, camera);
}