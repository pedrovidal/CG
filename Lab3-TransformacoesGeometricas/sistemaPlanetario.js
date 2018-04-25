var scene 		= null;
var renderer	= null;
var camera 		= null;
var earth 		= null;
var sun 		= null;
var moon 		= null;
var day 		= 0.0;
var year		= 0.0;
var month		= 0.0;

function init() {

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(window.innerWidth*0.7, window.innerHeight*0.7);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	camera = new THREE.OrthographicCamera( -1.0, 1.0, 1.0, -1.0, -1.0, 1.0 );
	scene.add( camera );
		
	// Eixo do Sol
	var sAxis = new THREE.AxesHelper(0.6);

	// Sol
	var sphereGeometry = new THREE.SphereGeometry( 0.4, 20, 20);                 
	var sphereMat = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe:true} );
	sun = new THREE.Mesh( sphereGeometry, sphereMat );
	// sun.add(sAxis);
	scene.add(sun);	
	
	// Eixo da Terra
	var tAxis = new THREE.AxesHelper(0.15);

	// Terra
	
	sphereGeometry = new THREE.SphereGeometry( 0.1, 20, 20);                 
	sphereMat = new THREE.MeshBasicMaterial( {color: 0x0000ff, wireframe:true} );
	earth = new THREE.Mesh( sphereGeometry, sphereMat );
	earth.add(tAxis);
	scene.add( earth );	
		
	// Eixo da Lua
	var lAxis = new THREE.AxesHelper(0.04);

	// Lua
	
	sphereGeometry = new THREE.SphereGeometry( 0.03, 10, 10 );                 
	sphereMat = new THREE.MeshBasicMaterial( {color: 0xaaaaaa, wireframe:true} );
	moon = new THREE.Mesh( sphereGeometry, sphereMat );
	moon.add(lAxis);
	scene.add( moon );	
		
	renderer.clear();
	render();
};

function render() {
	var sunMatrix = new THREE.Matrix4();
	var earthMatrix = new THREE.Matrix4();
	var moonMatrix = new THREE.Matrix4();
	
	day 	+= 0.07;
	year 	+= 0.01;
	month 	+= 0.04;
	
	// sun
	sunMatrix.identity();
	sun.matrix.copy(sunMatrix);

	sunMatrix.makeRotationY(year);
	sun.applyMatrix(sunMatrix);
	
	sun.updateMatrix();

	// earth
	earthMatrix.identity();
	earth.matrix.copy(earthMatrix);

	earthMatrix.makeTranslation(0.0, 0.0, 0.0);
	earth.applyMatrix(earthMatrix);

	earthMatrix.makeRotationY(day);
	earth.applyMatrix(earthMatrix);

	earthMatrix.makeTranslation(0.7, 0.0, 0.0);
	earth.applyMatrix(earthMatrix);

	earthMatrix.makeRotationY(year);
	earth.applyMatrix(earthMatrix);

	earth.updateMatrix();

	// moon
	moonMatrix.identity();
	moon.matrix.copy(moonMatrix);

	moonMatrix.makeTranslation(0.15, 0.0, 0.0);
	moon.applyMatrix(moonMatrix);

	moonMatrix.makeRotationY(month);
	moon.applyMatrix(moonMatrix);

	moonMatrix.makeTranslation(0.7, 0.0, 0.0);
	moon.applyMatrix(moonMatrix);

	moonMatrix.makeRotationY(year);
	moon.applyMatrix(moonMatrix);

	moon.updateMatrix();

	renderer.render(scene, camera);
	
	requestAnimationFrame(render);
}

