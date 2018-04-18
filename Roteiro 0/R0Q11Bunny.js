var mesh;
var renderer;
var scene;
var camera;
var BBox;
var maxDim;

function init() {

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	renderer.setSize(800, 800);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	camera = new THREE.OrthographicCamera( -300.0, 300.0, 300.0, -300.0, -300.0, 300.0);
	
	scene.add( camera );
	
	// Load Mesh
	var loader = new THREE.OBJLoader();
	loader.load('../Assets/Models/bunnyExp.obj', loadMesh);

	renderer.clear();
	// Global Axis
	var globalAxis = new THREE.AxisHelper( 300.0 );
	scene.add( globalAxis );

	// render();

	var animate = function () {
		requestAnimationFrame(animate);

		mesh.rotation.x += 0.01;
		mesh.rotation.y += 0.01;
		mesh.rotation.z += 0.01;

		renderer.render(scene, camera);
	};

	animate();
}

function render() {

	if (mesh) 
		renderer.render(scene, camera);
	else
		requestAnimationFrame(render);	
	}

function loadMesh(loadedMesh) {
	var material = new THREE.MeshBasicMaterial({color: 0xffffff, vertexColors:THREE.VertexColors, side:THREE.DoubleSide, wireframe:false});
	var geometry;
	loadedMesh.children.forEach(function (child) {

		child.material = material;
		if (child instanceof THREE.Mesh){
			geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
		}
	});

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
	console.log(minx, miny, minz, maxx, maxy, maxz);


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
	
	mesh = new THREE.Mesh(geometry, material);

	
	scene.add(mesh);
	
};
