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

	dropGeometry = createGeometry(60);
	dropMaterial = createMaterial(0x0000ff, true);
	dropMesh = new THREE.Mesh(dropGeometry, dropMaterial);
	dropMesh.rotation.x -= Math.PI / 2;

	scene.add(dropMesh);

	var controls = {
		numVertices: 60,
		color: dropMaterial.color.getStyle(),
		actualColor: 0x0000ff,
		wireframe: true,
		velx: 0,
		vely: 0,
		velz: 0,
		colorSolid:true,
		colorXYZ: false,
		colorCircle: false,
		// wireframe: dropMaterial.wireframe,

		debug: function(){
			// console.log(this.velx, this.vely, this.velz);
			// console.log(dropMesh.rotation.x, dropMesh.rotation.y, dropMesh.rotation.z);
			console.log(this.colorSolid, this.colorXYZ, this.colorCircle);
		}
    };

	var reset = function(){
		dropGeometry = createGeometry(Math.round(controls.numVertices));
		if (controls.colorSolid){
			dropMaterial = createMaterial(controls.actualColor, controls.wireframe);
		}
		else if (controls.colorXYZ){
			dropGeometry = colorXYZBased(dropGeometry);
			dropMaterial = createMaterial(0xffffff, controls.wireframe);
		}
		else{
			// DEBUG
			console.log('else', Math.trunc(controls.colorOption));
		}
		dropMesh = new THREE.Mesh(dropGeometry, dropMaterial);
		clearScene(scene);

		controls.velx = 0.0000;
		controls.vely = 0.0000;
		controls.velz = 0.0000;

		dropMesh.rotation.x = -Math.PI/2;
		dropMesh.rotation.y = 0;
		dropMesh.rotation.z = 0;
		scene.add(dropMesh);
		scene.add(camera);
		
		renderer.clear();
		animate();
	}

	// Cria GUI
	var gui = new dat.GUI();
	var colorGui = gui.addFolder('Cor');
	colorGui.addColor(controls, 'color').onChange(function (cor) {
		controls.actualColor = cor;
		if (controls.colorSolid){
			dropMaterial.color.setStyle(cor);
		}
    });
    var colorSolidOpt = colorGui.add(controls, 'colorSolid',).listen();
    colorSolidOpt.onChange(function(){
    	if (controls.colorSolid){
    		controls.colorXYZ = controls.colorCircle = false;
    	}
    	reset();
    });
    
    var colorXYZOpt = colorGui.add(controls, 'colorXYZ',).listen();
    colorXYZOpt.onChange(function(){
    	if (controls.colorXYZ){
    		controls.colorSolid = controls.colorCircle = false;
    	}
    	reset();
    });
    
    var colorCircleOpt = colorGui.add(controls, 'colorCircle',).listen();
    colorCircleOpt.onChange(function(){
    	if (controls.colorCircle){
    		controls.colorXYZ = controls.colorSolid = false;
    	}
    	reset();
    });

	colorGui.open();

	var meshGui = gui.addFolder('Mesh');
	var wireframeOpt = meshGui.add(controls, 'wireframe').listen();
	wireframeOpt.onChange(reset);
	var numVerticesOpt = meshGui.add(controls, 'numVertices', 3, 80).name('Numero de Vertices').listen();
	numVerticesOpt.onChange(reset);
	meshGui.open();

	var rotationGui = gui.addFolder('Rotation');
	rotationGui.add(controls, 'velx', -0.01, 0.01);
	rotationGui.add(controls, 'vely', -0.01, 0.01);
	rotationGui.add(controls, 'velz', -0.01, 0.01);
	rotationGui.add(controls, 'debug');
	rotationGui.open()


	var animate = function () {
				requestAnimationFrame( animate );
				dropMesh.rotation.x += controls.velx;
				dropMesh.rotation.y += controls.vely;
				dropMesh.rotation.z += controls.velz;
				renderer.clear();
				renderer.render(scene, camera);
	};

	animate();
}

function createMaterial(actualColor, wireframeStatus){
	// DEBUG
	// console.log(wireframeStatus);
	var dropMaterial = new THREE.MeshBasicMaterial({
		color:actualColor,
		vertexColors:THREE.FaceColors,
		// side:THREE.DoubleSide,
		wireframe:wireframeStatus
	})
	return dropMaterial;
}

function createGeometry(numVertices){
	// DEBUG
	// console.log(numVertices);

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

function clearScene(scene){
	while(scene.children.length > 0){ 
    	scene.remove(scene.children[0]); 
	}
}

function colorXYZBased(geometry){
	var minx = miny = minz = 500;
	var maxx = maxy = maxz = -500;

	for (i = 0; i < geometry.vertices.length; i++){
		minx = Math.min(geometry.vertices[i].x, minx);
		maxx = Math.max(geometry.vertices[i].x, maxx);
		miny = Math.min(geometry.vertices[i].y, miny);
		maxy = Math.max(geometry.vertices[i].y, maxy);
		minz = Math.min(geometry.vertices[i].z, minz);
		maxz = Math.max(geometry.vertices[i].z, maxz);
	}

	for (i = 0; i < geometry.faces.length; i++){
		var r1 = (geometry.vertices[geometry.faces[i].a].x - minx) / (maxx - minx);
		var g1 = (geometry.vertices[geometry.faces[i].a].y - miny) / (maxy - miny);
		var b1 = (geometry.vertices[geometry.faces[i].a].z - minz) / (maxz - minz);
		var color1 = new THREE.Color(r1, g1, b1);
		geometry.faces[i].vertexColors[0] = color1;

		var r2 = (geometry.vertices[geometry.faces[i].b].x - minx) / (maxx - minx);
		var g2 = (geometry.vertices[geometry.faces[i].b].y - miny) / (maxy - miny);
		var b2 = (geometry.vertices[geometry.faces[i].b].z - minz) / (maxz - minz);
		var color2 = new THREE.Color(r2, g2, b2);
		geometry.faces[i].vertexColors[1] = color2;

		var r3 = (geometry.vertices[geometry.faces[i].c].x - minx) / (maxx - minx);
		var g3 = (geometry.vertices[geometry.faces[i].c].y - miny) / (maxy - miny);
		var b3 = (geometry.vertices[geometry.faces[i].c].z - minz) / (maxz - minz);
		var color3 = new THREE.Color(r3, g3, b3);
		geometry.faces[i].vertexColors[2] = color3;
	}

	return geometry;
}