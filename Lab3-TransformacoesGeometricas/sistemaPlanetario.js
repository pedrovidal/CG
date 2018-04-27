var scene 		= null;
var renderer	= null;
var camera 		= null;
var earth 		= null;
var sun 		= null;
var moon 		= null;
var day 		= 0.0;
var year		= 0.0;
var month		= 0.0;
var groupEarth 	= new THREE.Object3D();
var groupSun 	= new THREE.Object3D();


function init() {

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(window.innerWidth*0.7, window.innerHeight);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	camera = new THREE.OrthographicCamera( -1.0, 1.0, 1.0, -1.0, -1.0, 1.0 );
	scene.add( camera );
		
	// Eixo do Sol
	var sAxis = new THREE.AxesHelper(0.6);

	// Sol
	var sphereGeometry = new THREE.SphereGeometry( 0.4, 20, 20);                 
	var sphereMat = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe:true} );
	sun = new THREE.Mesh( sphereGeometry, sphereMat );
	sun.add(sAxis);
	scene.add(sun);	
	
	// Eixo da Terra
	var tAxis = new THREE.AxesHelper(0.15);

	// Terra
	
	sphereGeometry = new THREE.SphereGeometry( 0.1, 20, 20);                 
	sphereMat = new THREE.MeshBasicMaterial( {color: 0x0000ff, wireframe:true} );
	earth = new THREE.Mesh( sphereGeometry, sphereMat );
	earth.add(tAxis);
	earth.position.set(0.7, 0.0, 0.0);
	scene.add( earth );	
		
	// Eixo da Lua
	var lAxis = new THREE.AxesHelper(0.04);

	// Lua
	
	sphereGeometry = new THREE.SphereGeometry( 0.03, 10, 10 );                 
	sphereMat = new THREE.MeshBasicMaterial( {color: 0xaaaaaa, wireframe:true} );
	moon = new THREE.Mesh( sphereGeometry, sphereMat );
	moon.add(lAxis);
	moon.position.set(0.55, 0.0, 0.0);
	scene.add( moon );	
	
	groupEarth.add(earth);
	groupEarth.add(moon);
	scene.add(groupEarth);

	groupSun.add(sun);
	groupSun.add(groupEarth);
	scene.add(groupSun);

		
	renderer.clear();
	// renderWithoutGroups();
	renderWithGroups();
};

function renderWithoutGroups() {
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

	// girar em torno do proprio eixo
	earthMatrix.makeRotationY(day);
	earth.applyMatrix(earthMatrix);
	earthMatrix.makeTranslation(0.7, 0.0, 0.0);
	earth.applyMatrix(earthMatrix);

	// girar em torno do sol
	earthMatrix.makeRotationY(year);
	earth.applyMatrix(earthMatrix);

	earth.updateMatrix();

	// moon
	moonMatrix.identity();
	moon.matrix.copy(moonMatrix);

	// girar em torno do proprio eixo
	moonMatrix.makeRotationY(day);
	moon.applyMatrix(moonMatrix);

	// girar em torno da terra
	moonMatrix.makeTranslation(0.15, 0.0, 0.0);
	moon.applyMatrix(moonMatrix);
	moonMatrix.makeRotationY(month);
	moon.applyMatrix(moonMatrix);
	moonMatrix.makeTranslation(0.7, 0.0, 0.0);
	moon.applyMatrix(moonMatrix);

	// girar em torno do sol
	moonMatrix.makeRotationY(year);
	moon.applyMatrix(moonMatrix);

	moon.updateMatrix();

	renderer.render(scene, camera);
	
	requestAnimationFrame(renderWithoutGroups);
}

function renderWithGroups(){	
	var groupSunMatrix = new THREE.Matrix4();
	var groupEarthMatrix = new THREE.Matrix4();
	var moonMatrix = new THREE.Matrix4();
	var sunMatrix = new THREE.Matrix4();
	var earthMatrix = new THREE.Matrix4();

	year += 0.01
	month += 0.04;
	day += 0.07

	// sun
	sunMatrix.identity();
	sun.matrix.copy(sunMatrix);

	sunMatrix.makeRotationX(day);
	sun.applyMatrix(sunMatrix);

	sunMatrix.makeRotationY(-year);
	sun.applyMatrix(sunMatrix);

	sun.updateMatrix();
	
	// moon
	moonMatrix.identity();
	moon.matrix.copy(moonMatrix);

	// girar em torno do proprio eixo
	moonMatrix.makeRotationY(day);
	moon.applyMatrix(moonMatrix);
	moonMatrix.makeTranslation(0.55, 0.0, 0.0);
	moon.applyMatrix(moonMatrix);

	moon.updateMatrix();

	// earth
	earthMatrix.identity();
	earth.matrix.copy(earthMatrix);

	// girar em torno do proprio eixo
	earthMatrix.makeRotationY(day);
	earth.applyMatrix(earthMatrix);
	earthMatrix.makeTranslation(0.7, 0.0, 0.0);
	earth.applyMatrix(earthMatrix);

	earth.updateMatrix();

	// groupSun
	groupSunMatrix.identity();
	groupSun.matrix.copy(groupSunMatrix);

	// rotacionar terra e lua ao redor do sol
	groupSunMatrix.makeRotationY(year);
	groupSun.applyMatrix(groupSunMatrix);

	groupSun.updateMatrix();


	// groupEarth
	groupEarthMatrix.identity();
	groupEarth.matrix.copy(groupEarthMatrix);

	// rotacionar lua ao redor da terra 
	groupEarthMatrix.makeTranslation(-0.7, 0.0, 0.0);
	groupEarth.applyMatrix(groupEarthMatrix);
	groupEarthMatrix.makeRotationY(month);
	groupEarth.applyMatrix(groupEarthMatrix);
	groupEarthMatrix.makeTranslation(0.7, 0.0, 0.0);
	groupEarth.applyMatrix(groupEarthMatrix);

	groupEarth.updateMatrix();

	renderer.render(scene, camera);
	requestAnimationFrame(renderWithGroups);
}