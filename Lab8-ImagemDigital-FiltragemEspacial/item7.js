var renderer;
var scene;
var camera;
var composer;
var texture;
var texture2;
var shaderPass;

function init() {

	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	
	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	camera = new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, -1.0, 1.0 );
	scene.add( camera );
	
	var textureLoader = new THREE.TextureLoader();
	texture = textureLoader.load("../../Assets/Images/lena.png", onLoadTexture);
	texture2 = textureLoader.load("../../Assets/Images/grayscale_lena.png", onLoadTexture);
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
		
	prewittShader = new THREE.ShaderMaterial( {
			uniforms: {
				tDiffuse: 	{ type: "t", value:texture },
				uPixelSize:	{ type: "v2", value: new THREE.Vector2(1.0/texture.image.width, 1.0/texture.image.height) }
			},
			vertexShader: document.getElementById( 'base-vs' ).textContent,
			fragmentShader: document.getElementById( 'prewitt-fs' ).textContent
		});

	sobelShader = new THREE.ShaderMaterial( {
			uniforms: {
				tDiffuse: 	{ type: "t", value:texture },
				uPixelSize:	{ type: "v2", value: new THREE.Vector2(1.0/texture.image.width, 1.0/texture.image.height) }
			},
			vertexShader: document.getElementById( 'base-vs' ).textContent,
			fragmentShader: document.getElementById( 'sobel-fs' ).textContent
		});

	grayscaleShader = new THREE.ShaderMaterial( {
			uniforms: {
				tDiffuse: 	{ type: "t", value:texture },
			},
			vertexShader: document.getElementById( 'base-vs' ).textContent,
			fragmentShader: document.getElementById( 'grayscale-fs' ).textContent
		});

	suavizaShader = new THREE.ShaderMaterial( {
			uniforms: {
				tDiffuse: 	{ type: "t", value:texture },
				uPixelSize:	{ type: "v2", value: new THREE.Vector2(1.0/texture.image.width, 1.0/texture.image.height) },
			},
			vertexShader: document.getElementById( 'base-vs' ).textContent,
			fragmentShader: document.getElementById( 'suaviza-fs' ).textContent
		});


	composer = new THREE.EffectComposer(renderer);
	
	// Cria os passos de renderizacao
	var renderPass 	= new THREE.RenderPass(scene, camera);
	composer.addPass(renderPass);

	grayscalePass 	= new THREE.ShaderPass(grayscaleShader);
	// grayscalePass.needsSwap = false;
	composer.addPass(grayscalePass);

	var n_smoothing = 1;

	for (var i = 0; i < n_smoothing; i++){
		suavizaPass 	= new THREE.ShaderPass(suavizaShader);
		if (i == n_smoothing - 1){
			// suavizaPass.renderToScreen = true;
		}
		composer.addPass(suavizaPass);
	}

	// prewittPass 	= new THREE.ShaderPass(prewittShader);
	// prewittPass.renderToScreen = true;
	// composer.addPass(prewittPass);

	sobelPass 	= new THREE.ShaderPass(sobelShader);
	// sobelPass.renderToScreen = true;
	composer.addPass(sobelPass);
	
	binaryShader = new THREE.ShaderMaterial( {
			uniforms: {
				tDiffuse: 	{ type: "t", value:texture  },
				texA: 		{ type: "t", value:texture2 }, 
				threshold: 	{ type: "float", value: 0.0 },
				k: 	{ type: "float", value: 1.0},
			},
			vertexShader: document.getElementById( 'base-vs' ).textContent,
			fragmentShader: document.getElementById( 'binary-fs' ).textContent
		});

	binaryPass 	= new THREE.ShaderPass(binaryShader);
	binaryPass.renderToScreen = true;
	composer.addPass(binaryPass);


	composer.render();

}