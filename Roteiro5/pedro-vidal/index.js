var camera, scene, renderer, video, mesh;


function init() {
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.z = 10;

	scene = new THREE.Scene();

	video = document.getElementById( 'video' );
	var texture = new THREE.VideoTexture( video );
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.format = THREE.RGBFormat;

	var textureLoader = new THREE.TextureLoader();
  	var normalMap = textureLoader.load("earth_normal_2048.jpg");
  	// var displacementMap = textureLoader.load("dispMap1.jpg");
  	// var displacementMap = textureLoader.load("dispMap2.png");
  	// var displacementMap = textureLoader.load("dispMap3.png");
  	// var displacementMap = textureLoader.load("dispMap4.jpg");
  	var displacementMap = textureLoader.load("dispMap6.png");

	// var axis = new THREE.AxesHelper(10);
	// scene.add(axis);

	scene.background = new THREE.CubeTextureLoader()
	.setPath( 'Park3Med/' )
	.load( [
		'px.jpg',
		'nx.jpg',
		'py.jpg',
		'ny.jpg',
		'pz.jpg',
		'nz.jpg'
	] );

	var geometry = new THREE.BoxGeometry( 9, 9, 9, 100, 100, 100 );
	geometry.scale( 0.5, 0.5, 0.5 );
	var materials = [
		new THREE.MeshStandardMaterial( { map: texture, normalMap: normalMap, /*normalScale: new THREE.Vector2(1.0, 1.0)*/ } ), // right
		new THREE.MeshPhongMaterial( { map: texture, alphaMap: texture, transparent: true } ), // left
		new THREE.MeshPhongMaterial( { color: 0x000000, specularMap: texture, shininess: 100 } ), // Top
		new THREE.MeshStandardMaterial( { map: texture, bumpMap: texture, /*bumpScale: 1.0*/ } ), // Bottom
		new THREE.MeshStandardMaterial( { map: texture, displacementMap: displacementMap, displacementScale: 0.4, displacementBias: -0.3 } ), // front
		new THREE.MeshStandardMaterial( { envMap: scene.background, metalness: 1.0, roughness: 0.00 } ), // back
	];

	mesh = new THREE.Mesh( geometry, materials );
	mesh.lookAt( camera.position );	
	scene.add( mesh );

	// var sphereGeom = new THREE.SphereGeometry(0.5, 50, 50);
	// var sphereMat = new THREE.MeshBasicMaterial( {color: 0xff0000} );
	// var sphere = new THREE.Mesh( sphereGeom, sphereMat );
	// scene.add( sphere );

	addLights();

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth - 100, window.innerHeight - 100);
	document.body.appendChild( renderer.domElement );

	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	// controls.enableZoom = false;
	// controls.enablePan = false;

	if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {

		var constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };

		navigator.mediaDevices.getUserMedia( constraints ).then( function( stream ) {

				// apply the stream to the video element used in the texture

				video.src = window.URL.createObjectURL( stream );
				video.play();

		} ).catch( function( error ) {

			console.error( 'Unable to access the camera/webcam.', error );

		} );

	} else {

		console.error( 'MediaDevices interface not available.' );

	}

render();
}

function render() {

	mesh.rotation.y += 0.007;

	requestAnimationFrame( render );
	renderer.render( scene, camera );

}

function addLights(){

	var lightLeft = new THREE.DirectionalLight();
	lightLeft.position.x = -90;
	lightLeft.position.y = 0;
	lightLeft.position.z = 0;
	scene.add(lightLeft);

	var lightRight = new THREE.DirectionalLight();
	lightRight.position.x = 90;
	lightRight.position.y = 0;
	lightRight.position.z = 0;
	scene.add(lightRight);

	var lightBottom = new THREE.DirectionalLight();
	lightBottom.position.x = 0;
	lightBottom.position.y = -90;
	lightBottom.position.z = 0;
	scene.add(lightBottom);

	var lightTop = new THREE.DirectionalLight();
	lightTop.position.x = 0;
	lightTop.position.y = 90;
	lightTop.position.z = 0;
	scene.add(lightTop);

	var lightFront = new THREE.DirectionalLight();
	lightFront.position.x = 0;
	lightFront.position.y = 0;
	lightFront.position.z = 90;
	scene.add(lightFront);

	var lightBack = new THREE.DirectionalLight();
	lightBack.position.x = 0;
	lightBack.position.y = 0;
	lightBack.position.z = -90;
	scene.add(lightBack);
}