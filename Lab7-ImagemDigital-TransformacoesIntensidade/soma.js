var texture;
var renderer;
var scene;
var camera;

function init() {

	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	
	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	camera = new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, -1.0, 1.0 );
	scene.add( camera );
	
	var textureLoader = new THREE.TextureLoader();
	texture = textureLoader.load("../../Assets/Images/lena.png");
	texture2 = textureLoader.load("../../Assets/Images/barbara.png");
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
			textureB: { type: "t", value:texture2 },
			// textureC: { type: "t", value:texture3 },
		};
		
		var matShader = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: document.getElementById( 'base-vs' ).textContent,
				fragmentShader: document.getElementById( 'base-fs' ).textContent
			} );
		
		// Plane
		var planeGeometry = new THREE.PlaneBufferGeometry(1.0, 1.0, 20, 20);                 
		var plane = new THREE.Mesh( planeGeometry, matShader );
		plane.position.set(0.0, 0.0, -0.5);
		scene.add( plane );	

		renderer.setSize(texture.image.width, texture.image.height);
		renderer.render(scene, camera);
		}
}

