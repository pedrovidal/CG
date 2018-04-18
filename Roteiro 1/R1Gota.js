var dropGeometry;
var dropMaterial
var dropMesh;

function init(){
	var scene = new THREE.Scene();
	var renderer = new THREE.WebGLRenderer();
	var camera = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, -1.0, -1.0, 1.0);
	scene.add(camera);

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(700, 700);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	dropGeometry = createGeometry(64);

	// colorVertices(dropGeometry);

	dropMaterial = createMaterial(true);

	dropMesh = new THREE.Mesh(dropGeometry, dropMaterial);

	scene.add(dropMesh);

	// dropMesh.rotation.x -= Math.PI / 2;


	var controls = {
		numVertices: 60,
		color: dropMaterial.color.getStyle(),
		wireframe: dropMaterial.wireframe,
		reset: function(){
			dropGeometry = createGeometry(Math.round(this.numVertices));
			dropMaterial = createMaterial(this.wireframe);
			dropMesh = new THREE.Mesh(dropGeometry, dropMaterial);
			scene.add(dropMesh);
			renderer.clear();
			animate();
		}
    };

	// Cria GUI
	var gui = new dat.GUI();
	var cor = gui.addFolder('Cor');
	cor.add(dropMesh.material, 'wireframe').listen();
	cor.addColor(controls, 'color').onChange(function (cor) {
            dropMaterial.color.setStyle(cor);
    });
	cor.open();

	var meshGui = gui.addFolder('Mesh');
	meshGui.add(controls, 'reset');
	meshGui.add(controls, 'numVertices', 3, 120).name('Numero de Vertices').listen();
	meshGui.open();

	var animate = function () {
				requestAnimationFrame( animate );

				dropMesh.rotation.x += 0.01;
				dropMesh.rotation.y += 0.01;
				dropMesh.rotation.z += 0.01;
				renderer.clear();
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

function createGeometry(numVertices){
	console.log(numVertices);

	var geometry = new THREE.Geometry();

	var minz = 5000;
	var maxz = -5000;

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

		v1 = geometry.vertices[i + numVertices + 1];
		v2 = geometry.vertices[i + numVertices + 2];
		v3 = geometry.vertices[i + 1];

		minzlocal = Math.min(minzlocal, v1.z, v2.z, v3.z);
		maxzlocal = Math.max(maxzlocal, v1.z, v2.z, v3.z);

		if (!(minzlocal == minz && maxzlocal == maxz)){
			geometry.faces.push(new THREE.Face3(i + numVertices + 1, i + numVertices + 2, i + 1));
		}

	}

	return geometry;
}