var scene 		= null;
var renderer	= null;
var camera 		= null;
var earth 		= null;
var sun 		= null;
var moon 		= null;
var mars 		= null;
var day 		= 0.0;
var year		= 0.0;
var month		= 0.0;
var groupEarth 	= new THREE.Object3D();
var groupSun 	= new THREE.Object3D();
var groupMoon 	= new THREE.Object3D();
var sunMatrix = new THREE.Matrix4();
var earthMatrix = new THREE.Matrix4();
var moonMatrix = new THREE.Matrix4();
var marsMatrix = new THREE.Matrix4();


function init() {

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(window.innerWidth*0.7, window.innerHeight*0.7);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	camera = new THREE.OrthographicCamera( -1.7, 1.7, 1.0, -1.0, -2.0, 2.0 );
	scene.add( camera );

	// esfera inicial
	var sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
		
	// Eixo do Sol
	var sAxis = new THREE.AxesHelper(0.5);

	// Sol
	var sunGeometry = new THREE.Geometry();
	sunGeometry.copy(sphereGeometry);
	var sunMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe:false} );
	sunGeometry.scale(0.4, 0.4, 0.4);
	sun = new THREE.Mesh( sunGeometry, sunMaterial );
	sun.add(sAxis);



	scene.add(sun);	
	
	// Eixo da Terra
	var tAxis = new THREE.AxesHelper(0.15);

	// Terra
	
	var earthGeometry = new THREE.Geometry();
	earthGeometry.copy(sphereGeometry);
	var earthMaterial = new THREE.MeshPhongMaterial( {color: 0x0000ff, wireframe:false} );
	earthGeometry.scale(0.1, 0.1, 0.1);
	earth = new THREE.Mesh( earthGeometry, earthMaterial );
	earth.add(tAxis);
	earth.position.set(0.7, 0.0, 0.0);
	scene.add( earth );	
		
	// Eixo da Lua
	var lAxis = new THREE.AxesHelper(0.04);

	// Lua
	
	var moonGeometry = new THREE.Geometry();
	moonGeometry.copy(sphereGeometry);
	moonGeometry.scale(0.03, 0.03, 0.03);
	var moonMaterial = new THREE.MeshPhongMaterial( {color: 0xaaaaaa, wireframe:false} );
	moon = new THREE.Mesh( moonGeometry, moonMaterial );
	moon.add(lAxis);
	moon.position.set(0.55, 0.0, 0.0);
	scene.add( moon );

	// Eixo de marte
	var marsAxis = new THREE.AxesHelper(0.3);

	// Marte
	
	var marsGeometry = new THREE.Geometry();
	marsGeometry.copy(sphereGeometry);
	marsGeometry.scale(0.2, 0.2, 0.2);
	var marsMaterial = new THREE.MeshPhongMaterial( {color: 0xff0000, wireframe:false} );
	mars = new THREE.Mesh( marsGeometry, marsMaterial );
	mars.add(marsAxis);
	mars.position.set(1.5, 0.0, 0.0);
	scene.add( mars );	
	
	var moonLight = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0), 2, 2);
	moonLight.position.set(0.565, 0.0, 0.0);

	groupEarth.add(moonLight);
	groupEarth.add(earth);
	groupEarth.add(moon);
	scene.add(groupEarth);

	groupSun.add(sun);
	groupSun.add(mars);
	groupSun.add(groupEarth);
	scene.add(groupSun);

	//Add point light Source
	var sunLight = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0), 2, 2);
	// sunLight.distance = 0.0;
	sunLight.position.set(0, 0, 0);
	// sunLight.position.set(0, 70, 0);
	scene.add(sunLight);

		
	renderer.clear();
	// renderWithoutGroups();
	renderWithGroups();
};

function renderWithoutGroups() {
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

	// mars
	marsMatrix.identity();
	mars.matrix.copy(marsMatrix);

	// girar em torno do proprio eixo
	marsMatrix.makeRotationY(day);
	mars.applyMatrix(marsMatrix);
	marsMatrix.makeTranslation(1.5, 0.0, 0.0);
	mars.applyMatrix(marsMatrix);

	// girar em torno do sol
	marsMatrix.makeRotationY(-year/2);
	mars.applyMatrix(marsMatrix);

	mars.updateMatrix();

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