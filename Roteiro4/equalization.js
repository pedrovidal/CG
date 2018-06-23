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

	// texture = textureLoader.load("../../Assets/Images/grayscale_lena.png");
	// texture2 = textureLoader.load("../../Assets/Images/barbara.png");
	
	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	// Global Axes
	// var globalAxes = new THREE.AxesHelper( 1.0 );
	// scene.add( globalAxes );

	renderer.clear();
	requestAnimationFrame(render);
};

function getImageData( image ) {

    var canvas = document.createElement( 'canvas' );
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext( '2d' );
    context.drawImage( image, 0, 0 );

    return context.getImageData( 0, 0, image.width, image.height );

}

function getPixel( imagedata, x, y ) {

    var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
    return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };

}



function render() {

	if (!texture.image) 
		requestAnimationFrame(render);
	else {
		var imagedata = getImageData( texture.image );
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
		//scene.add( planeEq );

		var histogram = new Array(256);

		for (var i = 0; i < 256; i++){
			histogram[i] = 0;
		}

		for (var i = 0; i < texture.image.height; i++){
			for (var j = 0; j < texture.image.width; j++){
				var color = getPixel(imagedata, i, j);
				// console.log(color.r);
				histogram[color.r]++;
			}
		}
		
		equalization(histogram, texture.image.height, texture.image.width, imagedata);

		geometryHistogram(histogram, texture.image.height, texture.image.width, 1);


		// geometryHistogram(histogram, texture.image.height, texture.image.width, 2);


		renderer.setSize(texture.image.width*3, texture.image.height*3);
		renderer.render(scene, camera);
		}
}

function geometryHistogram(histogram, height, width, histogramNumber){
	
	// var barGeometry = new THREE.PlaneGeometry(1/255, 1, 1, 1);

	var maxV = - 1, minV = height * width + 1;

	for (var i = 0; i < 256; i++){
		maxV = Math.max(maxV, histogram[i])
		minV = Math.min(minV, histogram[i]);	
	}
	
	var barMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});

	var initialPos = -1.1;

	if (histogramNumber == 2){
		initialPos = 0.1;
		barMaterial.color = new THREE.Color(0x0000ff);
	}

	for (var i = 0; i < 256; i++){
	
		histogram[i] = 	histogram[i] / maxV;
		// console.log(histogram[i])

		if (histogram[i] == 0) histogram[i] = 0.0000001;

		var barGeometry = new THREE.PlaneGeometry(1/width, (histogram[i]), 1, 1);
	
		var barMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(i/255, i/255, i/255)});
	
		var barMesh = new THREE.Mesh(barGeometry, barMaterial);
	
		barMesh.position.set(initialPos + i / width, -1.1 + (histogram[i]/2), 0);
	
		scene.add(barMesh);
	}
}

function equalization(histogram, height, width, imagedata){


	var c = new Array(256);
	var equalized = new Array(256);

	for (var i = 0; i < 256; i++)
		equalized[i] = 0;

	c[0] = histogram[0];

	for (var i = 1; i < 256; i++){
		c[i] = histogram[i] + c[i - 1];
	}

	for (var i = 1; i < 256; i++){
		c[i] /= height * width;
	}


	var size = width * height;
	var data = new Uint8Array( 3 * size );
	
	console.log(height, width, height * width)

	const pixelValues = [];

	for (var i = 0; i < height; i++){
		for (var j = 0; j < width ; j++){
			var color = Math.round(c[getPixel(imagedata, i, j).r]*255);
			// console.log(color)
			equalized[color]++;
			pixelValues.push(color, color, color);
		}
	}

	geometryHistogram(equalized, height, width, 2);

	equalizedTexture = new THREE.DataTexture( Uint8Array.from(pixelValues), width, height, THREE.RGBFormat );
	equalizedTexture.needsUpdate = true;


	uniforms = {
			textureA: { type: "t", value:equalizedTexture }
		};
		
		var matShader = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: document.getElementById( 'base-vs' ).textContent,
				fragmentShader: document.getElementById( 'base-fs' ).textContent
			} );

		// Plane
		var planeGeometry = new THREE.PlaneBufferGeometry(1.0, 1.0, 20, 20);                 
		var equalizedPlane = new THREE.Mesh( planeGeometry, matShader );
		equalizedPlane.position.set(0.6, 0.5, -0.5);
		equalizedPlane.rotation.z = - Math.PI / 2;
		scene.add( equalizedPlane );	

}