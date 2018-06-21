var texture;
var renderer;
var scene;
var camera;

function init() {

	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	
	renderer.setClearColor(new THREE.Color(1.0, 0.0, 0.0));

	camera = new THREE.OrthographicCamera( -1.2, 1.2, 1.2, -1.2, -1.0, 1.0 );
	scene.add( camera );
	
	var textureLoader = new THREE.TextureLoader();
	texture = textureLoader.load("./over-exposed_image.png");
	// texture3 = textureLoader.load("../../Assets/Images/brick-house.png");
	
	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	// Global Axes
	// var globalAxes = new THREE.AxesHelper( 1.0 );
	// scene.add( globalAxes );

	renderer.clear();
	requestAnimationFrame(render);
};


function render() {

	if (!texture.image) 
		requestAnimationFrame(render);
	else {
		uniforms = {
			textureA: { type: "t", value:texture },
			// textureB: { type: "t", value:texture2 },
			// textureC: { type: "t", value:texture3 },
		};
		
		var matShader = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: document.getElementById( 'base-vs' ).textContent,
				fragmentShader: document.getElementById( 'base-fs' ).textContent
			} );
		
		var negativeShader = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: document.getElementById( 'base-vs' ).textContent,
				fragmentShader: document.getElementById( 'negative-fs' ).textContent
			} );

		// Plane
		var planeGeometry = new THREE.PlaneBufferGeometry(1.0, 1.0, 20, 20);                 
		var plane = new THREE.Mesh( planeGeometry, matShader );
		plane.position.set(-0.6, 0.5, -1);
		scene.add( plane );	

		var planeEq = new THREE.Mesh( planeGeometry, matShader );
		planeEq.position.set(0.6, 0.5, -0.5);
		scene.add( planeEq );

		var histogram = new Array(256);

		for (var i = 0; i < 256; i++)
			histogram[i] = Math.floor(Math.random() * 255);;
			// histogram[i] = 255-i;

		geometryHistogram(histogram, texture.image.width, 1);

		for (var i = 0; i < 256; i++)
			histogram[i] = Math.floor(Math.random() * 255);;

		geometryHistogram(histogram, texture.image.width, 2);


		renderer.setSize(texture.image.width*3, texture.image.height*3);
		renderer.render(scene, camera);
		}
}

function geometryHistogram(histogram, width, histogramNumber){
	
	// var barGeometry = new THREE.PlaneGeometry(1/255, 1, 1, 1);

	var barMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});

	var initialPos = -1.1;

	if (histogramNumber == 2){
		initialPos = 0.1;
		barMaterial.color = new THREE.Color(0x0000ff);
	}

	for (var i = 0; i < 256; i++){
	
		var barGeometry = new THREE.PlaneGeometry(1/width, ((histogram[i]+1)/width), 1, 1);
	
		var barMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(i/255, i/255, i/255)});
	
		var barMesh = new THREE.Mesh(barGeometry, barMaterial);
	
		barMesh.position.set(initialPos + i / width, -1.1 + (histogram[i]+1)/(256*2), 0);
	
		scene.add(barMesh);
	}
}