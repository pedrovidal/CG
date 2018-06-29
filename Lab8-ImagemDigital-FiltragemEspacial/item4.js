var renderer;
var scene;
var camera;
var composer;
var texture;
var shaderPass;

function init() {

	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	
	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	camera = new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, -1.0, 1.0 );
	scene.add( camera );
	
	var textureLoader = new THREE.TextureLoader();
	texture = textureLoader.load("../../Assets/Images/lena.png", onLoadTexture);
	var txtMaterial = new THREE.MeshBasicMaterial( { 
					map : texture
					} );
	// Plane
	var planeGeometry 	= new THREE.PlaneBufferGeometry(1.0, 1.0, 20, 20);                 
	var plane = new THREE.Mesh( planeGeometry, txtMaterial );
	plane.position.set(0.0, 0.0, -0.5);
	scene.add( plane );	

	document.getElementById("WebGL-output").appendChild(renderer.domElement);
};

function onLoadTexture() {

	renderer.setSize(texture.image.width, texture.image.height);
		
	suavizaShader = new THREE.ShaderMaterial( {
			uniforms: {
				tDiffuse: 	{ type: "t", value:texture },
				uPixelSize:	{ type: "v2", value: new THREE.Vector2(1.0/texture.image.width, 1.0/texture.image.height) }
			},
			vertexShader: document.getElementById( 'base-vs' ).textContent,
			fragmentShader: document.getElementById( 'suaviza-fs' ).textContent
		});

	grayscaleShader = new THREE.ShaderMaterial( {
			uniforms: {
				tDiffuse: 	{ type: "t", value:texture },
			},
			vertexShader: document.getElementById( 'base-vs' ).textContent,
			fragmentShader: document.getElementById( 'grayscale-fs' ).textContent
		});

	composer = new THREE.EffectComposer(renderer);
	
	// Cria os passos de renderizacao
	var renderPass 	= new THREE.RenderPass(scene, camera);
	composer.addPass(renderPass);

	shaderPass 	= new THREE.ShaderPass(grayscaleShader);
	composer.addPass(shaderPass);

	shaderPass2 	= new THREE.ShaderPass(suavizaShader);
	shaderPass2.renderToScreen = true;
	composer.addPass(shaderPass2);

	composer.render();

}