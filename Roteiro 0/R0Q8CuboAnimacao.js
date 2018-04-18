
function init() {

	var scene = new THREE.Scene();

	var renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	renderer.setSize(500, 500);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	var camera = new THREE.OrthographicCamera( -1.0, 1.0, 1.0, -1.0, -1.0, 1.0 );
	scene.add( camera );

	var cubeGeometry = new THREE.Geometry(); 
	
	cubeGeometry.vertices.push(new THREE.Vector3( 0.5,  0.5,  0.5)); 
	cubeGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5,  0.5)); 
	cubeGeometry.vertices.push(new THREE.Vector3( 0.5, -0.5,  0.5)); 
	cubeGeometry.vertices.push(new THREE.Vector3(-0.5,  0.5,  0.5)); 
	cubeGeometry.vertices.push(new THREE.Vector3( 0.5,  0.5, -0.5)); 
	cubeGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5, -0.5)); 
	cubeGeometry.vertices.push(new THREE.Vector3( 0.5, -0.5, -0.5)); 
	cubeGeometry.vertices.push(new THREE.Vector3(-0.5,  0.5, -0.5)); 

	// Front
	cubeGeometry.faces.push(new THREE.Face3(1, 2, 0)); 
	cubeGeometry.faces.push(new THREE.Face3(1, 0, 3)); 
	cubeGeometry.faces[0].materialIndex =
	cubeGeometry.faces[1].materialIndex = 0;
	// Back
	cubeGeometry.faces.push(new THREE.Face3(5, 4, 6)); 
	cubeGeometry.faces.push(new THREE.Face3(5, 7, 4)); 
	cubeGeometry.faces[2].materialIndex =
	cubeGeometry.faces[3].materialIndex = 1;
	// Top
	cubeGeometry.faces.push(new THREE.Face3(3, 0, 4)); 
	cubeGeometry.faces.push(new THREE.Face3(3, 4, 7)); 
	cubeGeometry.faces[4].materialIndex =
	cubeGeometry.faces[5].materialIndex = 2;
	// Bottom
	cubeGeometry.faces.push(new THREE.Face3(1, 6, 2)); 
	cubeGeometry.faces.push(new THREE.Face3(1, 5, 6)); 
	cubeGeometry.faces[6].materialIndex =
	cubeGeometry.faces[7].materialIndex = 3;
	// Right
	cubeGeometry.faces.push(new THREE.Face3(2, 6, 4)); 
	cubeGeometry.faces.push(new THREE.Face3(2, 4, 0)); 
	cubeGeometry.faces[8].materialIndex =
	cubeGeometry.faces[9].materialIndex = 4;
	// Left
	cubeGeometry.faces.push(new THREE.Face3(5, 1, 3)); 
	cubeGeometry.faces.push(new THREE.Face3(5, 3, 7));
	cubeGeometry.faces[10].materialIndex =
	cubeGeometry.faces[11].materialIndex = 5;
	
	var boxMaterials = 	[ 	new THREE.MeshBasicMaterial({color:0x00FF00}), 
							new THREE.MeshBasicMaterial({color:0x00FFFF}), 
							new THREE.MeshBasicMaterial({color:0x0000FF}), 
							new THREE.MeshBasicMaterial({color:0xFFFF00}), 
							new THREE.MeshBasicMaterial({color:0xFFFFFF}), 
							new THREE.MeshBasicMaterial({color:0xFF0000}) 
						]; 
                 
	var cubeMaterial = new THREE.MeshFaceMaterial(boxMaterials); 
	
	var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial); 

	scene.add( cubeMesh );

	var animate = function () {
				requestAnimationFrame( animate );

				cubeMesh.rotation.x += 0.01;
				cubeMesh.rotation.y += 0.01;

				renderer.render(scene, camera);
			};

	animate();
};