var scene;
var renderer;
var camera;

// geometria, material e mesh da gota
var objectGeometry;
var objectMaterial;
var objectMesh;

var bunnyGeometry;
var dropGeometry;

var flag = false;

var minx = 5000;
var maxx = -5000;

var miny = 5000;
var maxy = -5000;

var minz = 5000;
var maxz = -5000;

// Guarda cores com base nas coordenadas circulares pra cada vertice
var circleColor = [];

var controls;

function init(){
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	camera = new THREE.OrthographicCamera(-2, 2, 2, -2, -5000.0, 5000.0);
	scene.add(camera);

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(500, 500);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	// Load Mesh
	var loader = new THREE.OBJLoader();
	loader.load('./bunnyPlastic.obj', loadMesh);
	
	// Inicializa geometria, material e mesh
	dropGeometry = createGeometry(40);
	dropGeometry = colorXYZBased(dropGeometry, minx, maxx, miny, maxy, minz, maxz);
	
	// Rotaciona para poder visualizar gota "em pe"
	dropGeometry.rotateX(-Math.PI / 2);

	var aux = miny;
	miny = minz;
	minz = aux;

	aux = maxy;
	maxy =maxz;
	maxz = aux;

	objectGeometry = dropGeometry.clone();

	objectMaterial = createMaterial(0xffffff, false);
	objectMesh = new THREE.Mesh(objectGeometry, objectMaterial);

	scene.add(objectMesh);


	// controles da gui
	controls = {
		// numVertices: 40,
		// color: objectMaterial.color.getStyle(),

		// // guarda cor atual da mesh
		// actualColor: 0x0000ff,
		
		wireframe: false,
		drop: true,
		bunny: false,
		
		// guardam velocidade de rotacao da mesh
		velx: 0.0,
		vely: 0.0,
		velz: 0.0,

		// // controles de opcao de cor
		// colorSolid:false,
		// colorXYZ: true,
		// colorCircle: false,

		// controles de deformacao
		twist: false,
		twistIntensityX: 0,
		twistIntensityY: 0,
		twistIntensityZ: 0,
		taper: false,
		normieX: 0.0,
		normieY: 0.0,
		normieZ: 0.0,
		shear: false,
		Sxy: 0.0,
		Sxz: 0.0,
		Syx: 0.0,
		Syz: 0.0,
		Szx: 0.0,
		Szy: 0.0,

		// para rotacao e volta para posicao inicial da mesh
		iniPos: function(){
			flag = true;
			this.velx = 0.0000;
			this.vely = 0.0000;
			this.velz = 0.0000;
			reset();
		},

		// retorna para forma inicial
		iniForm: function(){
			this.twist = false;
			this.twistIntensityX = 0;
			this.twistIntensityY = 0;
			this.twistIntensityZ = 0;

			this.taper = false;
			this.normie = 0;

			this.shear = false;
			this.Sxy = 0.0;
			this.Sxz = 0.0;
			this.Syx = 0.0;
			this.Syz = 0.0;
			this.Szx = 0.0;
			this.Szy = 0.0;

			reset();
		} 

    };


	// Cria GUI
	var gui = new dat.GUI({width: 400});

	// // opcoes de cor
	// var colorGui = gui.addFolder('Color');
	
	// // painel de escolha de cor
	// colorGui.addColor(controls, 'color').name('RGB Color').onChange(function (cor) {
	// 	controls.actualColor = cor;
	// 	if (controls.colorSolid){ // se padrao escolhido for cor solida
	// 		objectMaterial.color.setStyle(cor); // troca para a cor escolhida
	// 	}
 //    });

 //    var colorSolidOpt = colorGui.add(controls, 'colorSolid').name('Solid color').listen();
 //    colorSolidOpt.onChange(function(){
 //    	if (controls.colorSolid){
 //    		controls.colorXYZ = controls.colorCircle = false;
 //    	}
 //    	else{
 //    		controls.colorSolid = true; // Uma opcao tem q ser verdadeira sempre
 //    	}
 //    	reset();
 //    });
    
 //    var colorXYZOpt = colorGui.add(controls, 'colorXYZ').name('Color based on XYZ').listen();
 //    colorXYZOpt.onChange(function(){
 //    	if (controls.colorXYZ){
 //    		controls.colorSolid = controls.colorCircle = false;
 //    	}
 //    	else{
 //    		controls.colorXYZ = true; // Uma opcao tem q ser verdadeira sempre
 //    	}
 //    	reset();
 //    });
    
 //    var colorCircleOpt = colorGui.add(controls, 'colorCircle').name('Color based on spherical coordinates').listen();
 //    colorCircleOpt.onChange(function(){
 //    	if (controls.colorCircle){
 //    		controls.colorXYZ = controls.colorSolid = false;
 //    	}
 //    	else{
 //    		controls.colorCircle = true; // Uma opcao tem q ser verdadeira sempre
 //    	}
 //    	reset();
 //    });

	// colorGui.open();

	// opcoes de mesh (numero de vertices e wireframe)
	var meshGui = gui.addFolder('Mesh');
	var wireframeOpt = meshGui.add(controls, 'wireframe').name('Wireframe').listen();
	wireframeOpt.onChange(reset);
	// var numVerticesOpt = meshGui.add(controls, 'numVertices', 3, 80).name('Number of Vertices').listen();
	// numVerticesOpt.onChange(reset);

	// opcoes para alterar a malha (bunny ou drop)
	var objectMeshOpt = meshGui.add(controls, 'drop').name('Drop Mesh').listen();
	objectMeshOpt.onChange(function(){
		controls.bunny = false;
		reset();
	});

	var bunnyMeshOpt = meshGui.add(controls, 'bunny').name('Bunny Mesh').listen();
	bunnyMeshOpt.onChange(function(){
		controls.drop = false;
		reset();
	});

	meshGui.open();

	// opcoes de deformacao
	var deformsGui = gui.addFolder("Deformacoes");	
	
	var twistOpt = deformsGui.add(controls, 'twist').name('Twist').listen();
	twistOpt.onChange(function (cor) {
		
		// so permite uma deformacao por vez
		controls.taper = controls.shear = false;
		controls.normieX = controls.normieY = controls.normieZ = 0;
		controls.Sxy = controls.Sxz = 0;
		controls.Syx = controls.Syz = 0;
		controls.Szx = controls.Szy = 0;
		if (!controls.twist){ // se desmarcar opcao de twist
			controls.twistIntensityX = controls.twistIntensityY = controls.twistIntensityZ = 0; // retorna intensidade para 0
		}
		reset();
	});

	var twistIntensityXOpt = deformsGui.add(controls, 'twistIntensityX', -10, 10).name('Intensidade do Twist em X').listen();
	twistIntensityXOpt.onChange(function(){
		controls.twistIntensityY = controls.twistIntensityZ = 0;
		if (controls.twist){ // se opcao estiver marcada, torce a mesh com base na intensidade
			reset();
		}
	});
	var twistIntensityYOpt = deformsGui.add(controls, 'twistIntensityY', -10, 10).name('Intensidade do Twist em Y').listen();
	twistIntensityYOpt.onChange(function(){
		controls.twistIntensityX = controls.twistIntensityZ = 0;
		if (controls.twist){ // se opcao estiver marcada, torce a mesh com base na intensidade
			reset();
		}
	});
	var twistIntensityZOpt = deformsGui.add(controls, 'twistIntensityZ', -10, 10).name('Intensidade do Twist em Z').listen();
	twistIntensityZOpt.onChange(function(){
		controls.twistIntensityX = controls.twistIntensityY = 0;
		if (controls.twist){ // se opcao estiver marcada, torce a mesh com base na intensidade
			reset();
		}
	});
	// twistIntensityOpt.onFinishChange(function(){ // se opcao estiver desmarcada nao permite mudar intensidade
	// 	if (!controls.twist){
	// 		controls.twistIntensity = 0;
	// 	}
	// });

	var taperOpt = deformsGui.add(controls, 'taper').name('Taper').listen();
	taperOpt.onChange(function(){

		// so permite uma deformacao por vez
		controls.twist = controls.shear = false;
		controls.twistIntensityX = controls.twistIntensityY = controls.twistIntensityZ = 0;
		controls.Sxy = controls.Sxz = 0;
		controls.Syx = controls.Syz = 0;
		controls.Szx = controls.Szy = 0;

		reset();
	});

	var normieXopt = deformsGui.add(controls, 'normieX', minx, maxx - 0.01).name('Em X').listen();
	normieXopt.onChange(function(){
		controls.normieY = controls.normieZ = 0;
		reset();
	});

	var normieYopt = deformsGui.add(controls, 'normieY', miny, maxy - 0.01).name('Em Y').listen();
	normieYopt.onChange(function(){
		controls.normieX = controls.normieZ = 0;
		reset();
	});

	var normieZopt = deformsGui.add(controls, 'normieZ', minz, maxz - 0.01).name('Em Z').listen();
	normieZopt.onChange(function(){
		controls.normieX = controls.normieY = 0;
		reset();
	});

	var shearOpt = deformsGui.add(controls, 'shear').name('Shear').listen();
	shearOpt.onChange(function(){
		
		// so permite uma deformacao por vez
		controls.twist = controls.taper = false;
		controls.twistIntensityX = controls.twistIntensityY = controls.twistIntensityZ = 0;
		controls.normieX = controls.normieY = controls.normieZ = 0;
		
		if (!controls.shear){
			controls.Sxy = controls.Sxz = 0;
			controls.Syx = controls.Syz = 0;
			controls.Szx = controls.Szy = 0;
			reset();
		}
		reset();
	});

	var shearXYOpt = deformsGui.add(controls, 'Sxy', -1, 1).name('Shear de X em Y').listen();
	shearXYOpt.onChange(function(){
		if (controls.shear){
			reset();
		}
	});


	var shearXzOpt = deformsGui.add(controls, 'Sxz', -1, 1).name('Shear de X em Z').listen();
	shearXzOpt.onChange(function(){
		if (controls.shear){
			reset();
		}
	});


	var shearYXOpt = deformsGui.add(controls, 'Syx', -1, 1).name('Shear de Y em X').listen();
	shearYXOpt.onChange(function(){
		if (controls.shear){
			reset();
		}
	});


	var shearYZOpt = deformsGui.add(controls, 'Syz', -1, 1).name('Shear de Y em Z').listen();
	shearYZOpt.onChange(function(){
		if (controls.shear){
			reset();
		}
	});


	var shearZXOpt = deformsGui.add(controls, 'Szx', -1, 1).name('Shear de Z em X').listen();
	shearZXOpt.onChange(function(){
		if (controls.shear){
			reset();
		}
	});


	var shearZYOpt = deformsGui.add(controls, 'Szy', -1, 1).name('Shear de Z em Y').listen();
	shearZYOpt.onChange(function(){
		if (controls.shear){
			reset();
		}
	});

	deformsGui.add(controls, 'iniForm').name('Return to initial form').listen();


	deformsGui.open();

	// opcoes de velocidade de rotacao
	var rotationGui = gui.addFolder('Rotation Speed');
	rotationGui.add(controls, 'velx', -0.0001, 0.0001).name('X').listen();
	rotationGui.add(controls, 'vely', -0.0001, 0.0001).name('Y').listen();
	rotationGui.add(controls, 'velz', -0.0001, 0.0001).name('Z').listen();
	rotationGui.add(controls, 'iniPos').name('Return to initial position').listen();
	//rotationGui.add(controls, 'debug').listen();
	rotationGui.open()

	animate();
}

// funcao para recriar a gota caso algo mude
function reset(){

	if (controls.drop){
		// objectGeometry = createGeometry(Math.round(controls.numVertices));
		objectGeometry = dropGeometry.clone();
	}
	else if (controls.bunny){
		objectGeometry = bunnyGeometry.clone();
	}

	// // checa opcoes de cor
	// if (controls.colorSolid){
	// 	objectMaterial = createMaterial(controls.actualColor, controls.wireframe);
	// }
	// else if (controls.colorXYZ){
	// 	objectGeometry = colorXYZBased(objectGeometry);
	// 	objectMaterial = createMaterial(0xffffff, controls.wireframe);
	// }
	// else{
	// 	objectGeometry = colorCircleBased(objectGeometry);
	// 	objectMaterial = createMaterial(0xffffff, controls.wireframe);
	// 	// DEBUG
	// 	// console.log('else', Math.trunc(controls.colorOption));
	// }

	if (controls.twist){
		objectGeometry = twistGeometry(objectGeometry, controls.twistIntensityX, controls.twistIntensityY, controls.twistIntensityZ);
	}

	if (controls.taper){
		objectGeometry = taperGeometry(objectGeometry);
	}

	if (controls.shear){
		objectGeometry = shearGeometry(objectGeometry);
	}

	// guardam rotacao da malha
	// var rotx = objectMesh.rotation.x, roty = objectMesh.rotation.y, rotz = objectMesh.rotation.z;

	objectMaterial = createMaterial(0xffffff, controls.wireframe);
	
	//cria mesh
	objectMesh = new THREE.Mesh(objectGeometry, objectMaterial);
	
	// tira mesh antiga da cena
	clearScene();

	// rotaciona a nova mesh com base nos valores de rotacao da mesh antiga, para que possa rotacionar e mudar
	// atributos sem atrapalhar animacao
	// if (flag){
	// 	// salva rotacao para que se outra malha precise ser criada
	// 	// seja colocada na mesma posicao
	// 	objectMesh.rotation.x = - Math.PI / 2;
	// 	objectMesh.rotation.y = 0;
	// 	objectMesh.rotation.z = 0;
	// }
	// else{
	// 	objectMesh.rotation.x = rotx;
	// 	objectMesh.rotation.y = roty;
	// 	objectMesh.rotation.z = rotz;
	// }
	// flag = false;

	scene.add(objectMesh);
	scene.add(camera);
	
	renderer.clear();
	animate();
}

// funcao para rotacionar malha automaticamente
function animate() {
	requestAnimationFrame(animate);

	// rotaciona malha com base nas velocidades escolhidas
	objectMesh.rotation.x += controls.velx;
	objectMesh.rotation.y += controls.vely;
	objectMesh.rotation.z += controls.velz;
	
	renderer.clear();
	renderer.render(scene, camera);
}

function createMaterial(actualColor, wireframeStatus){
	// DEBUG
	// console.log(wireframeStatus);
	var objectMaterial = new THREE.MeshBasicMaterial({
		color:actualColor,
		vertexColors:THREE.FaceColors,
		side:THREE.DoubleSide,
		wireframe:wireframeStatus
	})
	return objectMaterial;
}

function createGeometry(numVertices){
	// DEBUG
	// console.log(numVertices);

	var geometry = new THREE.Geometry();

	var cont = 0;

	minx = 5000;
	maxx = -5000;

	miny = 5000;
	maxy = -5000;

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

			// calculo de minimos e maximos
			minx = Math.min(minx, x);
			miny = Math.min(miny, y);
			minz = Math.min(minz, z);
			maxx = Math.max(maxx, x);
			maxy = Math.max(maxy, y);
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
function clearScene(){
	while(scene.children.length > 0){ 
    	scene.remove(scene.children[0]); 
	}
}

// colore faces com base nas posicoes x, y, e z dos vertices
function colorXYZBased(geometry, mx, Mx, my, My, mz, Mz){
	for (i = 0; i < geometry.faces.length; i++){
		var r1 = (geometry.vertices[geometry.faces[i].a].x - mx) / (Mx - mx);
		var g1 = (geometry.vertices[geometry.faces[i].a].y - my) / (My - my);
		var b1 = (geometry.vertices[geometry.faces[i].a].z - mz) / (Mz - mz);
		var color1 = new THREE.Color(r1, g1, b1);
		geometry.faces[i].vertexColors[0] = color1;

		var r2 = (geometry.vertices[geometry.faces[i].b].x - mx) / (Mx - mx);
		var g2 = (geometry.vertices[geometry.faces[i].b].y - my) / (My - my);
		var b2 = (geometry.vertices[geometry.faces[i].b].z - mz) / (Mz - mz);
		var color2 = new THREE.Color(r2, g2, b2);
		geometry.faces[i].vertexColors[1] = color2;

		var r3 = (geometry.vertices[geometry.faces[i].c].x - mx) / (Mx - mx);
		var g3 = (geometry.vertices[geometry.faces[i].c].y - my) / (My - my);
		var b3 = (geometry.vertices[geometry.faces[i].c].z - mz) / (Mz - mz);
		var color3 = new THREE.Color(r3, g3, b3);
		geometry.faces[i].vertexColors[2] = color3;
	}

	return geometry;
}

// function colorCircleBased(geometry){
// 	// atribui cores precalculadas
// 	for (i = 0; i < geometry.faces.length; i++){
// 		geometry.faces[i].vertexColors[0] = circleColor[geometry.faces[i].a];
// 		geometry.faces[i].vertexColors[1] = circleColor[geometry.faces[i].b];
// 		geometry.faces[i].vertexColors[2] = circleColor[geometry.faces[i].c];
// 	}

// 	return geometry;
// }

function twistGeometry(oldGeometry, intensityX, intensityY, intensityZ){
	var geometry = new THREE.Geometry();
	geometry = oldGeometry;
	var twistMatrix = new THREE.Matrix4();
	for (i = 0; i < geometry.vertices.length; i++){
		var fx = f(geometry.vertices[i].x, minx, maxx);
		var fy = f(geometry.vertices[i].y, miny, maxy);
		var fz = f(geometry.vertices[i].z, minz, maxz);
		
		twistMatrix.makeRotationX(fx * intensityX);
		geometry.vertices[i].applyMatrix4(twistMatrix);

		twistMatrix.makeRotationY(fy * intensityY);
		geometry.vertices[i].applyMatrix4(twistMatrix);
		
		twistMatrix.makeRotationZ(fz * intensityZ);
		geometry.vertices[i].applyMatrix4(twistMatrix);
	}
	return geometry;
}

function taperGeometry(oldGeometry){
	var geometry = new THREE.Geometry();
	geometry = oldGeometry;
	var taperMatrixX = new THREE.Matrix4();
	var taperMatrixY = new THREE.Matrix4();
	var taperMatrixZ = new THREE.Matrix4();
	for (i = 0; i < geometry.vertices.length; i++){
		if (controls.normieX != 0){
			var fx = f(geometry.vertices[i].x, controls.normieX, maxx);
			taperMatrixX.set(1,  0,  0, 0,
							 0, fx,  0, 0,
							 0,  0, fx, 0,
							 0,  0,  0, 1);
			geometry.vertices[i].applyMatrix4(taperMatrixX);
		}

		if (controls.normieY != 0){
			var fy = f(geometry.vertices[i].y, controls.normieY, maxy);
			taperMatrixY.set(fy, 0,  0, 0,
							  0, 1,  0, 0,
							  0, 0, fy, 0,
							  0, 0,  0, 1);
			geometry.vertices[i].applyMatrix4(taperMatrixY);
		}
	
		if (controls.normieZ != 0){
			var fz = f(geometry.vertices[i].z, controls.normieZ, maxz);
			taperMatrixZ.set(fz,  0, 0, 0,
							 0, fz, 0, 0,
							 0,  0, 1, 0,
							 0,  0, 0, 1);
			geometry.vertices[i].applyMatrix4(taperMatrixZ);
		}
	}
	return geometry;
}

function shearGeometry(oldGeometry){
	var geometry = new THREE.Geometry();
	geometry = oldGeometry;
	var shearMatrix = new THREE.Matrix4();
	for (i = 0; i < geometry.vertices.length; i++){
		shearMatrix.set(            1, controls.Syx, controls.Szx, 0,
						 controls.Sxy,            1, controls.Szy, 0,
						 controls.Sxz, controls.Syz,            1, 0,
						             0,           0,            0, 1);
		geometry.vertices[i].applyMatrix4(shearMatrix);
	}
	return geometry;
}

function f(axes, point, maxAxes){
	return (axes - point) / (maxAxes - point) * Math.PI * 2;
}

function loadMesh(loadedMesh) {
	// var material = new THREE.MeshBasicMaterial({color: 0xffffff, vertexColors:THREE.VertexColors, side:THREE.DoubleSide, wireframe:true});
	var geometry;
	loadedMesh.children.forEach(function (child) {

		// child.material = material;
		if (child instanceof THREE.Mesh){
			geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
		}
	});

	var mx = my = mz = 500;
	var Mx = My = Mz = -500;

	for (i = 0; i < geometry.vertices.length; i++){
		mx = Math.min(geometry.vertices[i].x, mx);
		Mx = Math.max(geometry.vertices[i].x, Mx);
		my = Math.min(geometry.vertices[i].y, my);
		My = Math.max(geometry.vertices[i].y, My);
		mz = Math.min(geometry.vertices[i].z, mz);
		Mz = Math.max(geometry.vertices[i].z, Mz);
	}
	// console.log(mx, my, mz, Mx, My, Mz);

	bunnyGeometry = colorXYZBased(geometry, mx, Mx, my, My, mz, Mz);	
};