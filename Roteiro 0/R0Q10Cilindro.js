function init(){
	var scene = new THREE.Scene();
	var renderer = new THREE.WebGLRenderer();
	var camera = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, -1.0, -1.0, 1.0);
	scene.add(camera);

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(500, 500);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	var numVertices = 60;
	var raio = 0.5;
	
	var cilindroGeometry = new THREE.Geometry();
	cilindroGeometry.vertices.push(new THREE.Vector3(0.0, 0.0, 0.5));

	for (i = 0; i <= 2*Math.PI; i+=(2*Math.PI)/numVertices){
		var x = raio * Math.cos(i);
		var y = raio * Math.sin(i);
		cilindroGeometry.vertices.push(new THREE.Vector3(x, y, 0.5));	
	}

	var numFaces = 0;
	for (i = 0; i <= numVertices; i++){
		cilindroGeometry.faces.push(new THREE.Face3(0, i, i+1));
		cilindroGeometry.faces[i].vertexColors[0] = new THREE.Color( 1.0, 0.0, 1.0); 
		cilindroGeometry.faces[i].vertexColors[1] = new THREE.Color( 1.0, 0.0, 1.0); 
		cilindroGeometry.faces[i].vertexColors[2] = new THREE.Color( 1.0, 0.0, 1.0);	
		numFaces++;
	}

	cilindroGeometry.vertices.push(new THREE.Vector3(0.0, 0.0, -0.5));

	for (i = 0; i <= 2*Math.PI; i+=(2*Math.PI)/numVertices){
		var x = raio * Math.cos(i);
		var y = raio * Math.sin(i);
		cilindroGeometry.vertices.push(new THREE.Vector3(x, y, -0.5));	
	}

	var vertice = 1;

	for (i = numVertices + 3; i <= 2*(numVertices + 1); i++){

		cilindroGeometry.faces.push(new THREE.Face3(numVertices + 2, i, i + 1));
		cilindroGeometry.faces[numFaces].vertexColors[0] = new THREE.Color( 0.0, 1.0, 1.0); 
		cilindroGeometry.faces[numFaces].vertexColors[1] = new THREE.Color( 0.0, 1.0, 1.0); 
		cilindroGeometry.faces[numFaces].vertexColors[2] = new THREE.Color( 0.0, 1.0, 1.0);	
		numFaces++;
	
		cilindroGeometry.faces.push(new THREE.Face3(i, i + 1, vertice));
		cilindroGeometry.faces[numFaces].vertexColors[0] = new THREE.Color( 0.0, 0.0, 1.0); 
		cilindroGeometry.faces[numFaces].vertexColors[1] = new THREE.Color( 0.0, 0.0, 1.0); 
		cilindroGeometry.faces[numFaces].vertexColors[2] = new THREE.Color( 0.0, 0.0, 1.0);
		numFaces++;
		
		cilindroGeometry.faces.push(new THREE.Face3(i + 1, vertice + 1, vertice));
		cilindroGeometry.faces[numFaces].vertexColors[0] = new THREE.Color( 0.0, 0.0, 1.0); 
		cilindroGeometry.faces[numFaces].vertexColors[1] = new THREE.Color( 0.0, 0.0, 1.0); 
		cilindroGeometry.faces[numFaces].vertexColors[2] = new THREE.Color( 0.0, 0.0, 1.0);
		numFaces++;

		vertice++;
	}

	var cilindroMaterial = new THREE.MeshBasicMaterial({
		color:0xffffff, 
		vertexColors:THREE.VertexColors,
		side:THREE.DoubleSide,
		wireframe:false
	})

	var cilindroMesh = new THREE.Mesh(cilindroGeometry, cilindroMaterial);

	scene.add(cilindroMesh);

	cilindroMesh.rotation.x += Math.PI/2;

	var animate = function () {
				requestAnimationFrame( animate );

				cilindroMesh.rotation.x += 0.01;
				cilindroMesh.rotation.y += 0.01;

				renderer.render(scene, camera);
			};

	animate();
}
