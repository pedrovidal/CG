var texture;
var renderer;
var scene;
var camera;
var matShader;
var grayscaleShader;
var binaryShader;

function init() {

	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	
	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	camera = new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, -1.0, 1.0 );
	scene.add( camera );
	
	var textureLoader = new THREE.TextureLoader();
	texture = textureLoader.load("../../Assets/Images/lena.png");
	texture2 = textureLoader.load("../../Assets/Images/barbara.png");
	
	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	// Global Axes
	var globalAxes = new THREE.AxesHelper( 1.0 );
	scene.add( globalAxes );

	renderer.clear();
	requestAnimationFrame(render);
};


function render() {

	if (!texture.image) 
		requestAnimationFrame(render);
	else {
		uniforms = {
			texture: { type: "t", value:texture }
		};

		matShader = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: document.getElementById( 'base-vs' ).textContent,
				fragmentShader: document.getElementById( 'base-fs' ).textContent
			} );
		
		grayscaleShader = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: document.getElementById( 'base-vs' ).textContent,
				fragmentShader: document.getElementById( 'grayscale-fs' ).textContent
			} );
		
		// binaryShader = new THREE.ShaderMaterial( {
		// 		uniforms: uniforms,
		// 		vertexShader: document.getElementById( 'base-vs' ).textContent,
		// 		fragmentShader: document.getElementById( 'binary-fs' ).textContent
		// 	} );

		// Plane
		var planeGeometry = new THREE.PlaneBufferGeometry(1.0, 1.0, 20, 20);                 
		var plane = new THREE.Mesh( planeGeometry, matShader );
		plane.position.set(0.0, 0.0, -0.5);
		scene.add( plane );	

		renderer.setSize(texture.image.width, texture.image.height);

		composer = new THREE.EffectComposer(renderer);

		var renderPass 	= new THREE.RenderPass(scene, camera);
	
		shaderPass1 		= new THREE.ShaderPass(grayscaleShader);
		shaderPass1.renderToScreen = true;

		// shaderPass2 		= new THREE.ShaderPass(binaryShader);
		// shaderPass2.renderToScreen = true;

		composer.addPass(renderPass);
		composer.addPass(shaderPass1);
		// composer.addPass(shaderPass2);
		composer.render();

		}
}