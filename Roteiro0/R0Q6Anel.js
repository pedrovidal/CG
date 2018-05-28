
function init() {

	var scene = new THREE.Scene();

	var renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(1.0, 0.0, 0.0));

	renderer.setSize(500, 500);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	var camera = new THREE.OrthographicCamera( -1.0, 1.0, 1.0, -1.0, -1.0, 1.0 );
	scene.add( camera );

	// var axesHelper = new THREE.AxesHelper(1.0);
	// scene.add(axesHelper);
 
	var ringGeometry = new THREE.Geometry();

	var numVertices = 60;
	var raio1 = 0.8;
	var raio2 = 0.5;
	var raio3 = raio1 - (raio1-raio2)/2;
	var numFaces = 0;
	
	for (i = 0 ; i < 2*Math.PI ; i += (2*Math.PI)/numVertices) {
		var x1 = raio1 * Math.cos(i);
		var y1 = raio1 * Math.sin(i);
		ringGeometry.vertices.push(new THREE.Vector3(x1, y1, 0.0)); 

		var x2 = raio2 * Math.cos(i);
		var y2 = raio2 * Math.sin(i);
		ringGeometry.vertices.push(new THREE.Vector3(x2, y2, 0.0));

		var x3 = raio3 * Math.cos(i);
		var y3 = raio3 * Math.sin(i);
		ringGeometry.vertices.push(new THREE.Vector3(x3, y3, 0.0));
	}

	for (i = 0 ; i < ringGeometry.vertices.length-3; i++) {
		if (i % 3 == 0)	
			ringGeometry.faces.push(new THREE.Face3(i, i+2, i+3));
		if (i % 3 == 1)	{
			ringGeometry.faces.push(new THREE.Face3(i, i+1, i+3));
		}
		else{
			ringGeometry.faces.push(new THREE.Face3(i, i+2, i+1));
			ringGeometry.faces.push(new THREE.Face3(i, i+2, i+3));
		}
	}

	for (i = 0; i < ringGeometry.faces.length; i++){
		ringGeometry.faces[i].vertexColors[0] = new THREE.Color(i / ringGeometry.faces.length, i / ringGeometry.faces.length, i / ringGeometry.faces.length); 
		ringGeometry.faces[i].vertexColors[1] = new THREE.Color(i / ringGeometry.faces.length, i / ringGeometry.faces.length, i / ringGeometry.faces.length); 
		ringGeometry.faces[i].vertexColors[2] = new THREE.Color(i / ringGeometry.faces.length, i / ringGeometry.faces.length, i / ringGeometry.faces.length);
	}

	var ringMaterial1 = new THREE.MeshBasicMaterial({ 
		color:0xffffff, 
		vertexColors:THREE.VertexColors,
		side:THREE.DoubleSide,
		wireframe:false
		}); 
	
	var ringMesh = new THREE.Mesh(ringGeometry, ringMaterial1); 

	scene.add(ringMesh);

	var animate = function () {
				requestAnimationFrame( animate );

				// ringMesh.rotation.x += 0.01;
				// ringMesh.rotation.y += 0.01;
				ringMesh.rotation.z -= 0.01;

				renderer.render(scene, camera);
			};

	animate();
};


