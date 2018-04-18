function init(){
	var scene = new THREE.Scene();
	var renderer = new THREE.WebGLRenderer();
	var camera = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, -1.0, -1.0, 1.0);
	scene.add(camera);

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(700, 700);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	var dropGeometry = crateGeometry(5);

	// colorVertices(dropGeometry);

	var dropMaterial = createMaterial(true);

	var dropMesh = new THREE.Mesh(dropGeometry, dropMaterial);

	scene.add(dropMesh);

	// dropMesh.rotation.x -= Math.PI / 2;


	var controls = new function () {
		this.color = dropMaterial.color.getStyle();
		this.wireframe = dropMaterial.wireframe;
    };

	// Cria GUI
	var gui = new dat.GUI();
	var cor = gui.addFolder('Cor');
	cor.add(dropMesh.material, 'wireframe').listen();
	cor.open();

	cor.addColor(controls, 'color').onChange(function (cor) {
            dropMaterial.color.setStyle(cor);
            //animate();
    });


	var animate = function () {
				requestAnimationFrame( animate );

				dropMesh.rotation.x += 0.01;
				dropMesh.rotation.y += 0.01;
				// dropMesh.rotation.z += 0.01;
				renderer.render(scene, camera);
	};

	animate();
}

function createMaterial(wireframeStatus){
	var dropMaterial = new THREE.MeshBasicMaterial({
		color:0x7777ff,
		vertexColors:THREE.VertexColors,
		// side:THREE.DoubleSide,
		// wireframe:wireframeStatus
	})
	return dropMaterial;
}

function crateGeometry(numVertices){
	var geometry = new THREE.Geometry();

	var minz = 5000;
	var maxz = -5000;

	// for (omega = 0; omega <= 2*Math.PI; omega += (2*Math.PI)/numVertices){
	// 	for (theta = 0; theta <= Math.PI; theta += (Math.PI)/numVertices){
	// 		var x = 0.5 * ( (1 - Math.cos(theta)) * Math.sin(theta) * Math.cos(omega) );
	// 		var y = 0.5 * ( (1 - Math.cos(theta)) * Math.sin(theta) * Math.sin(omega) );
	// 		var z = Math.cos(theta);
	// 		minz = Math.min(minz, z);
	// 		maxz = Math.max(maxz, z);
	// 		geometry.vertices.push(new THREE.Vector3(x, y, z));
	// 	}
	// }

	for (i = 0; i <= numVertices; i++){
		var omega = i * 2* Math.PI / numVertices;
		for (j = 0; j <= numVertices; j++){
			var theta = j * Math.PI / numVertices;
			var x = 0.5 * ( (1 - Math.cos(theta)) * Math.sin(theta) * Math.cos(omega) );
			var y = 0.5 * ( (1 - Math.cos(theta)) * Math.sin(theta) * Math.sin(omega) );
			var z = Math.cos(theta);
			minz = Math.min(minz, z);
			maxz = Math.max(maxz, z);
			geometry.vertices.push(new THREE.Vector3(x, y, z));
		}
	}

	for (i = 0; i < geometry.vertices.length - (numVertices + 2); i++){
		var minzlocal = maxz;
		var maxzlocal = minz;

		var v1 = geometry.vertices[i];
		var v2 = geometry.vertices[i + numVertices + 1];
		var v3 = geometry.vertices[i + 1];

		minzlocal = Math.min(minzlocal, v1.z, v2.z, v3.z);
		maxzlocal = Math.max(maxzlocal, v1.z, v2.z, v3.z);
		if (!(minzlocal == minz && maxzlocal == maxz)){
			geometry.faces.push(new THREE.Face3(i, i + numVertices + 1, i + 1));
		}

		// geometry.faces[geometry.faces.length - 1].vertexColors[0] = new THREE.Color(0.0, 0.0, 1.0);
		// geometry.faces[geometry.faces.length - 1].vertexColors[1] = new THREE.Color(0.0, 0.0, 1.0);
		// geometry.faces[geometry.faces.length - 1].vertexColors[2] = new THREE.Color(0.0, 0.0, 1.0);

		v1 = geometry.vertices[i + numVertices + 1];
		v2 = geometry.vertices[i + numVertices + 2];
		v3 = geometry.vertices[i + 1];

		minzlocal = Math.min(minzlocal, v1.z, v2.z, v3.z);
		maxzlocal = Math.max(maxzlocal, v1.z, v2.z, v3.z);

		if (!(minzlocal == minz && maxzlocal == maxz)){
			geometry.faces.push(new THREE.Face3(i + numVertices + 1, i + numVertices + 2, i + 1));
		}

		// geometry.faces[geometry.faces.length - 1].vertexColors[0] = new THREE.Color(0.0, 0.0, 1.0);
		// geometry.faces[geometry.faces.length - 1].vertexColors[1] = new THREE.Color(0.0, 0.0, 1.0);
		// geometry.faces[geometry.faces.length - 1].vertexColors[2] = new THREE.Color(0.0, 0.0, 1.0);
	}

	// for (i = 0; i < numVertices; i++){
	// 	var minzlocal = maxz;
	// 	var maxzlocal = minz;

	// 	var v1 = geometry.vertices[i];
	// 	var v2 = geometry.vertices[geometry.vertices.length - numVertices + i];
	// 	var v3 = geometry.vertices[i + 1];

	// 	minzlocal = Math.min(minzlocal, v1.z, v2.z, v3.z);
	// 	maxzlocal = Math.max(maxzlocal, v1.z, v2.z, v3.z);
	// 	if (!(minzlocal == minz && maxzlocal == maxz)){
	// 		geometry.faces.push(new THREE.Face3(i, i + 1, geometry.vertices.length - numVertices + i));
	// 	}

	// 	// geometry.faces[geometry.faces.length - 1].vertexColors[0] = new THREE.Color(0.0, 0.0, 1.0);
	// 	// geometry.faces[geometry.faces.length - 1].vertexColors[1] = new THREE.Color(0.0, 0.0, 1.0);
	// 	// geometry.faces[geometry.faces.length - 1].vertexColors[2] = new THREE.Color(0.0, 0.0, 1.0);

	// 	minzlocal = maxz;
	// 	maxzlocal = minz;

	// 	v1 = geometry.vertices[i];
	// 	v2 = geometry.vertices[geometry.vertices.length - numVertices + i];
	// 	v3 = geometry.vertices[geometry.vertices.length - numVertices + i - 1];

	// 	minzlocal = Math.min(minzlocal, v1.z, v2.z, v3.z);
	// 	maxzlocal = Math.max(maxzlocal, v1.z, v2.z, v3.z);
	// 	if (!(minzlocal == minz && maxzlocal == maxz)){
	// 		geometry.faces.push(new THREE.Face3(i, geometry.vertices.length - numVertices + i, geometry.vertices.length - numVertices + i - 1));
	// 	}

	// 	// geometry.faces[geometry.faces.length - 1].vertexColors[0] = new THREE.Color(0.0, 0.0, 1.0);
	// 	// geometry.faces[geometry.faces.length - 1].vertexColors[1] = new THREE.Color(0.0, 0.0, 1.0);
	// 	// geometry.faces[geometry.faces.length - 1].vertexColors[2] = new THREE.Color(0.0, 0.0, 1.0);
	// }

	return geometry;
}

// function colorVertices(geometry){
// 	for (i = 0; i < geometry.faces.length; i++){
// 		geometry.faces[i].vertexColors[0] = new THREE.Color(0.0 , 0.0, 1.0);
// 		geometry.faces[i].vertexColors[1] = new THREE.Color(0.0 , 0.0, 1.0);
// 		geometry.faces[i].vertexColors[2] = new THREE.Color(0.0 , 0.0, 1.0);
// 	}
// }