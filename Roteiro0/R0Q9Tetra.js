
function init() {

	var scene = new THREE.Scene();

	var renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	renderer.setSize(500, 500);

	var axesHelper = new THREE.AxesHelper(1.0);
	//scene.add(axesHelper);


	var camera = new THREE.OrthographicCamera(-1.0, 1.0, 1.0, -1.0, -1.0, 1.0);
	scene.add(camera);

	var tetraGeometry = new THREE.Geometry();
	
	tetraGeometry.vertices.push(new THREE.Vector3( 0.0,  0.5,  0.0)); 
	tetraGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5,  0.0)); 
	tetraGeometry.vertices.push(new THREE.Vector3( 0.5, -0.5,  0.0));
	tetraGeometry.vertices.push(new THREE.Vector3( 0.0,  0.0,  0.5)); 

	// Bottom
	tetraGeometry.faces.push(new THREE.Face3(0, 1, 2));
	tetraGeometry.faces[0].materialIndex = 0;
	
	// NO 
	tetraGeometry.faces.push(new THREE.Face3(3, 0, 1));
	tetraGeometry.faces[1].materialIndex = 1;
	
	// NE
	tetraGeometry.faces.push(new THREE.Face3(3, 1, 2));
	tetraGeometry.faces[2].materialIndex = 2;

	// S
	tetraGeometry.faces.push(new THREE.Face3(3, 2, 0));
	tetraGeometry.faces[3].materialIndex = 3;
	
	
	var boxMaterials = 	[ 	new THREE.MeshBasicMaterial({color:0x0000FF,side:THREE.DoubleSide}), 
							new THREE.MeshBasicMaterial({color:0xFF0000,side:THREE.DoubleSide}), 
							new THREE.MeshBasicMaterial({color:0x00FF00,side:THREE.DoubleSide}), 
							new THREE.MeshBasicMaterial({color:0xFFFF00,side:THREE.DoubleSide})
						]; 
                 
	var tetraMaterial = new THREE.MeshFaceMaterial(boxMaterials);
	
	var tetraMesh = new THREE.Mesh(tetraGeometry, tetraMaterial); 
	
	scene.add(tetraMesh);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	var animate = function () {
				requestAnimationFrame( animate );

				tetraMesh.rotation.x += 0.02;
				tetraMesh.rotation.y += 0.01;
				//tetraMesh.rotation.z += 0.01;

				renderer.render(scene, camera);
			};

	animate();
};
