// geometria, material e mesh da gota
var dropGeometry;
var dropMaterial
var dropMesh;

// guardam rotacao da malha
var rotx;
var roty;
var rotz;

var minz = 5000;
var maxz = -5000;

// Guarda cores com base nas coordenadas circulares pra cada vertice
var circleColor = [];

function init(){
	var scene = new THREE.Scene();
	var renderer = new THREE.WebGLRenderer();
	var camera = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, -1.0, -1.0, 1.0);
	scene.add(camera);

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(600, 600);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	// Inicializa geometria, material e mesh
	dropGeometry = createGeometry(40);
	dropMaterial = createMaterial(0x0000ff, true);
	dropMesh = new THREE.Mesh(dropGeometry, dropMaterial);

	// Rotaciona para poder visualizar gota "em pe"
	dropMesh.rotation.x -= Math.PI / 2;

	scene.add(dropMesh);

	// controles da gui
	var controls = {
		numVertices: 40,
		color: dropMaterial.color.getStyle(),

		// guarda cor atual da mesh
		actualColor: 0x0000ff,
		
		wireframe: true,
		
		// guardam velocidade de rotacao da mesh
		velx: 0,
		vely: 0,
		velz: 0,

		// controles de opcao de cor
		colorSolid:true,
		colorXYZ: false,
		colorCircle: false,
		twist: false,
		
		// wireframe: dropMaterial.wireframe,

		// funcao para debug
		// debug: function(){
		// 	console.log(this.velx, this.vely, this.velz);
		// 	console.log(dropMesh.rotation.x, dropMesh.rotation.y, dropMesh.rotation.z);
		// 	// console.log(this.colorSolid, this.colorXYZ, this.colorCircle);
		// },

		// para rotacao e volta para posicao inicial da mesh
		iniPos: function(){
			rotx = - Math.PI / 2;
			roty = 0;
			rotz = 0;
			this.velx = 0.0000;
			this.vely = 0.0000;
			this.velz = 0.0000;
			reset();
		},

    };

    // funcao para recriar a gota caso algo mude
	var reset = function(){
		
		dropGeometry = createGeometry(Math.round(controls.numVertices));
		
		// checa opcoes de cor
		if (controls.colorSolid){
			dropMaterial = createMaterial(controls.actualColor, controls.wireframe);
		}
		else if (controls.colorXYZ){
			dropGeometry = colorXYZBased(dropGeometry);
			dropMaterial = createMaterial(0xffffff, controls.wireframe);
		}
		else{
			dropGeometry = colorCircleBased(dropGeometry);
			dropMaterial = createMaterial(0xffffff, controls.wireframe);
			// DEBUG
			// console.log('else', Math.trunc(controls.colorOption));
		}

		if (controls.twist){
			dropGeometry = twistGeometry(dropGeometry);
		}

		//cria mesh
		dropMesh = new THREE.Mesh(dropGeometry, dropMaterial);
		
		// tira mesh antiga da cena
		clearScene(scene);

		// rotaciona a nova mesh com base nos valores de rotacao da mesh antiga, para que possa rotacionar e mudar
		// atributos sem atrapalhar animacao
		dropMesh.rotation.x = rotx;
		dropMesh.rotation.y = roty;
		dropMesh.rotation.z = rotz;

		scene.add(dropMesh);
		scene.add(camera);
		
		renderer.clear();
		animate();
	}

	// Cria GUI
	var gui = new dat.GUI({width: 400});

	// opcoes de cor
	var colorGui = gui.addFolder('Color');
	
	// painel de escolha de cor
	colorGui.addColor(controls, 'color').name('RGB Color').onChange(function (cor) {
		controls.actualColor = cor;
		if (controls.colorSolid){ // se padrao escolhido for cor solida
			dropMaterial.color.setStyle(cor); // troca para a cor escolhida
		}
    });

    var colorSolidOpt = colorGui.add(controls, 'colorSolid').name('Solid color').listen();
    colorSolidOpt.onChange(function(){
    	if (controls.colorSolid){
    		controls.colorXYZ = controls.colorCircle = false;
    	}
    	else{
    		controls.colorSolid = true; // Uma opção tem q ser verdadeira sempre
    	}
    	reset();
    });
    
    var colorXYZOpt = colorGui.add(controls, 'colorXYZ').name('Color based on XYZ').listen();
    colorXYZOpt.onChange(function(){
    	if (controls.colorXYZ){
    		controls.colorSolid = controls.colorCircle = false;
    	}
    	else{
    		controls.colorXYZ = true; // Uma opção tem q ser verdadeira sempre
    	}
    	reset();
    });
    
    var colorCircleOpt = colorGui.add(controls, 'colorCircle').name('Color based on spherical coordinates').listen();
    colorCircleOpt.onChange(function(){
    	if (controls.colorCircle){
    		controls.colorXYZ = controls.colorSolid = false;
    	}
    	else{
    		controls.colorCircle = true; // Uma opção tem q ser verdadeira sempre
    	}
    	reset();
    });

	colorGui.open();

	// opcoes de mesh (numero de vertices e wireframe)
	var meshGui = gui.addFolder('Mesh');
	var wireframeOpt = meshGui.add(controls, 'wireframe').name('Wireframe').listen();
	wireframeOpt.onChange(reset);
	var numVerticesOpt = meshGui.add(controls, 'numVertices', 3, 80).name('Number of Vertices').listen();
	numVerticesOpt.onChange(reset);
	var twistOpt = meshGui.add(controls, 'twist').name('Twist').listen();
	twistOpt.onChange(reset);
	meshGui.open();

	// opcoes de velocidade de rotacao
	var rotationGui = gui.addFolder('Rotation Speed');
	rotationGui.add(controls, 'velx', -0.001, 0.001).name('X').listen();
	rotationGui.add(controls, 'vely', -0.001, 0.001).name('Y').listen();
	rotationGui.add(controls, 'velz', -0.001, 0.001).name('Z').listen();
	rotationGui.add(controls, 'iniPos').name('Return to initial position').listen();
	//rotationGui.add(controls, 'debug').listen();
	rotationGui.open()

	// funcao para rotacionar malha automaticamente
	var animate = function () {
				requestAnimationFrame( animate );

				// salva rotacao para que se outra malha precise ser criada
				// seja colocada na mesma posicao
				rotx = dropMesh.rotation.x;
				roty = dropMesh.rotation.y;
				rotz = dropMesh.rotation.z;

				// rotaciona malha com base nas velocidades escolhidas
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
		side:THREE.DoubleSide,
		wireframe:wireframeStatus
	})
	return dropMaterial;
}

function createGeometry(numVertices){
	// DEBUG
	// console.log(numVertices);

	var geometry = new THREE.Geometry();

	var cont = 0;

	minz = 5000;
	maxz = -5000;


	circleColor = [];

	// calculo das coordenadas
	for (i = 0; i <= numVertices; i++){
		var omega = i * 2 * Math.PI / numVertices;
		for (j = 0; j <= numVertices; j++){
			var theta = j * Math.PI / numVertices;
			var x = 0.5 * ( (1 - Math.cos(theta)) * Math.sin(theta) * Math.cos(omega) );
			var y = 0.5 * ( (1 - Math.cos(theta)) * Math.sin(theta) * Math.sin(omega) );
			var z = Math.cos(theta);
			minz = Math.min(minz, z);
			maxz = Math.max(maxz, z);
			geometry.vertices.push(new THREE.Vector3(x, y, z));

			// vetor com cores baseadas nas coordenadas esfericas
			var hslColor = "hsl(" + (omega * 180 / Math.PI).toString() +  ",  100%, " + (Math.round( 100 - ( 100 * (theta / Math.PI)  ) ) ).toString() + "%)";
			// Debug
			// console.log(z , Math.round( ( 100 * ((z + 1) / 2))));
			circleColor.push(new THREE.Color(hslColor));

			cont++
		}
	}

	// criacao das faces
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

// remove tudo da cena
function clearScene(scene){
	while(scene.children.length > 0){ 
    	scene.remove(scene.children[0]); 
	}
}

// colore faces com base nas posicoes x, y, e z dos vertices
function colorXYZBased(geometry){
	var minx = miny = minz = 2;
	var maxx = maxy = maxz = -2;

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

function colorCircleBased(geometry){
	// atribui cores precalculadas
	for (i = 0; i < geometry.faces.length; i++){
		geometry.faces[i].vertexColors[0] = circleColor[geometry.faces[i].a];
		geometry.faces[i].vertexColors[1] = circleColor[geometry.faces[i].b];
		geometry.faces[i].vertexColors[2] = circleColor[geometry.faces[i].c];
	}

	return geometry;
}

function twistGeometry(oldGeometry){
	console.log('On twist: ');
	var geometry = new THREE.Geometry();
	geometry = oldGeometry;
	var twistMatrix = new THREE.Matrix4();
	for (i = 0; i < geometry.vertices.length; i++){
		var fz = f(geometry.vertices[i].z);
		twistMatrix.makeRotationZ(fz * 10);
		geometry.vertices[i].applyMatrix4(twistMatrix);
	}
	return geometry;
}

function taperGeometry(oldGeometry){
	console.log('On taper: ');
	var geometry = new THREE.Geometry();
	geometry = oldGeometry;
	var taperMatrix = new THREE.Matrix4();
	for (i = 0; i < geometry.vertices.length; i++){
		var fz = f(geometry.vertices[i].z);
		twistMatrix.set(fz,  0, 0, 0,
						 0, fz, 0, 0,
						 0,  0, 1, 0,
						 0,  0, 0, 1);
		geometry.vertices[i].applyMatrix4(twistMatrix);
	}
	return geometry;
}

function f(z){
	return (z - minz) / (maxz - minz) * Math.PI * 2;
}