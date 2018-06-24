var texture;
var renderer;
var scene;
var camera;
var matShader;
var grayscaleShader;
var binaryShader;

binaryControls = {
	threshold: 0.00000
};

blendingControls = {
	alpha: 0.00000
};

flagControls = {
	sepia: false,
	grayscale: false,
	negative: false,
};

function init() {

	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	
	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	initGui();

	camera = new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, -1.0, 1.0 );
	scene.add( camera );
	
	var textureLoader = new THREE.TextureLoader();
	texture = textureLoader.load("../../Assets/Images/lena.png");
	texture2 = textureLoader.load("../../Assets/Images/barbara.png");
	// texture2 = textureLoader.load("../../Assets/Images/grayscale_lena.png");
	
	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	// Global Axes
	// var globalAxes = new THREE.AxesHelper( 1.0 );
	// scene.add( globalAxes );

	renderer.clear();
	requestAnimationFrame(render);
};

function initGui(){
	var gui = new dat.GUI({width: 250});

	// opcoes de cor
	var binaryGui = gui.addFolder('Binary Shader');

	var thresholdOpt = binaryGui.add(binaryControls, 'threshold', 0.00000, 1.00000, 0.00001).name('Threshold').listen();
	thresholdOpt.onChange(function(){requestAnimationFrame(render)});

	binaryGui.open();

	var blendingGui = gui.addFolder('Blending Shader');

	var alphaOpt = blendingGui.add(blendingControls, 'alpha', 0.00000, 1.00000, 0.00001).name('Blending alpha').listen();
	alphaOpt.onChange(function(){requestAnimationFrame(render)});

	blendingGui.open();

	var flagGui = gui.addFolder('flag Shader');

	var negativeOpt = flagGui.add(flagControls, 'negative').name('Negative flag').listen();
	negativeOpt.onChange(function(){
		requestAnimationFrame(render);
		// flagControls.sepia = false;
		// flagControls.grayscale = false;
	});

	var sepiaOpt = flagGui.add(flagControls, 'sepia').name('Sepia flag').listen();
	sepiaOpt.onChange(function(){
		requestAnimationFrame(render);
		// flagControls.negative = false;
		flagControls.grayscale = false;
	});

	var grayscaleOpt = flagGui.add(flagControls, 'grayscale').name('Grayscale flag').listen();
	grayscaleOpt.onChange(function(){
		requestAnimationFrame(render);
		// flagControls.negative = false;
		flagControls.sepia = false;
	});

	flagGui.open();

}

function render() {

	if (!texture.image) 
		requestAnimationFrame(render);
	else {
		uniforms = {
			textureA: {type: "t", value:texture },
			textureB: {type: "t", value: texture2},
			threshold: {type: "t", value:binaryControls.threshold},
			negativeFlag: {type: "t", value:flagControls.negative},
			sepiaFlag: {type: "t", value:flagControls.sepia},
			grayscaleFlag: {type: "t", value:flagControls.grayscale},
			alpha: {type: "t", value:blendingControls.alpha},
		};

		matShader = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: document.getElementById( 'base-vs' ).textContent,
				fragmentShader: document.getElementById( 'base-fs' ).textContent
			} );
		
		// grayscaleShader = new THREE.ShaderMaterial( {
		// 		uniforms: uniforms,
		// 		vertexShader: document.getElementById( 'base-vs' ).textContent,
		// 		fragmentShader: document.getElementById( 'grayscale-fs' ).textContent
		// 	} );
		
		// sepiaShader = new THREE.ShaderMaterial( {
		// 		uniforms: uniforms,
		// 		vertexShader: document.getElementById( 'base-vs' ).textContent,
		// 		fragmentShader: document.getElementById( 'sepia-fs' ).textContent
		// 	} );

		shader = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: document.getElementById( 'base-vs' ).textContent,
				fragmentShader: document.getElementById( 'shader-fs' ).textContent
			} );

		// Plane
		var planeGeometry = new THREE.PlaneBufferGeometry(1.0, 1.0, 20, 20);                 
		var plane = new THREE.Mesh( planeGeometry, matShader );
		plane.position.set(0.0, 0.0, -0.5);
		scene.add( plane );	

		renderer.setSize(texture.image.width, texture.image.height);

		composer = new THREE.EffectComposer(renderer);

		var renderPass 	= new THREE.RenderPass(scene, camera);
	
		// shaderPass1 		= new THREE.ShaderPass(grayscaleShader);
		// shaderPass1.renderToScreen = true;

		shaderPass2 		= new THREE.ShaderPass(shader);
		shaderPass2.renderToScreen = true;

		composer.addPass(renderPass);
		// composer.addPass(shaderPass1);
		composer.addPass(shaderPass2);
		composer.render();

		}
}