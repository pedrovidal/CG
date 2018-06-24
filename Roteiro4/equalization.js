var texture = null;
var textureRGB = null;
var textureGrayscale = null;
var renderer;
var scene;
var camera;
var histogramR = new Array(256);
var histogramG = new Array(256);
var histogramB = new Array(256);
var histogramHSV = new Array(256);

var colorControls = {
	rgb: true,
	grayscale: false
};

var equalizationControls = {
	rgb: true,
	hsv: false,
	hsl: false,
};

function init() {

	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	
	renderer.setClearColor(new THREE.Color(1.0, 1.0, 1.0));

	initGui();
	
	camera = new THREE.OrthographicCamera( -1.2, 1.2, 1.2, -1.2, -1.0, 1.0 );
	scene.add( camera );
	
	var textureLoader = new THREE.TextureLoader();

	texture = textureLoader.load("../../Assets/Images/lena.png");
	textureRGB = textureLoader.load("../../Assets/Images/lena.png");
	textureGrayscale = textureLoader.load("../../Assets/Images/grayscale_lena.png");

	// textureGrayscale = textureLoader.load("./over-exposed_image.png");
	
	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	// Global Axes
	// var globalAxes = new THREE.AxesHelper( 1.0 );
	// scene.add( globalAxes );

	renderer.clear();
	requestAnimationFrame(render);
};

function clearScene(){
	while(scene.children.length > 0){ 
    	scene.remove(scene.children[0]); 
	}
}

function initGui(){
	var gui = new dat.GUI({width: 150});

	// opcoes de cor
	var colorGui = gui.addFolder('Color');


	var colorRGBOpt = colorGui.add(colorControls, 'rgb').name('RGB').listen();
    colorRGBOpt.onChange(function(){
    	if (colorControls.rgb == false){
    		colorControls.rgb = true;
    	}

    	equalizationGui.open();

    	colorControls.grayscale = false;
    
    	equalizationControls.rgb = true;
    	equalizationControls.hsv = false;
    	equalizationControls.hsl = false;

    	texture = textureRGB;
    	
    	clearScene();

    	requestAnimationFrame(render);
    });
    
    var colorGrayscaleOpt = colorGui.add(colorControls, 'grayscale').name('Grayscale').listen();
    colorGrayscaleOpt.onChange(function(){
    	if (colorControls.grayscale == false){
    		colorControls.grayscale = true;
    	}

    	equalizationGui.close();

    	colorControls.rgb = false;

    	equalizationControls.rgb = false;
    	equalizationControls.hsv = false;
    	equalizationControls.hsl = false;

    	texture = textureGrayscale;

    	clearScene();

    	requestAnimationFrame(render);
    });

    colorGui.open();

    var equalizationGui = gui.addFolder('Equalization');
	

	var equalizationRGBOpt = equalizationGui.add(equalizationControls, 'rgb').name('RGB').listen();
	equalizationRGBOpt.onChange(function(){
		if (equalizationControls.rgb == false){
			equalizationControls.rgb = true;
		}
		if (colorControls.rgb == false){
			equalizationControls.rgb = false;
		}
		equalizationControls.hsl = false;
		equalizationControls.hsv = false;

		clearScene();

		requestAnimationFrame(render);
	});

	var equalizationHSVOpt = equalizationGui.add(equalizationControls, 'hsv').name('HSV').listen();
	equalizationHSVOpt.onChange(function(){
		if (equalizationControls.hsv == false){
			equalizationControls.hsv = true;
		}
		if (colorControls.rgb == false){
			equalizationControls.hsv = false;
		}
		equalizationControls.hsl = false;
		equalizationControls.rgb = false;

		clearScene();

		requestAnimationFrame(render);
	});

	var equalizationHSLOpt = equalizationGui.add(equalizationControls, 'hsl').name('HSL').listen();
	equalizationHSLOpt.onChange(function(){
		if (equalizationControls.hsl == false){
			equalizationControls.hsl = true;
		}
		if (colorControls.rgb == false){
			equalizationControls.hsl = false;
		}
		equalizationControls.hsv = false;
		equalizationControls.rgb = false;

		clearScene();

		requestAnimationFrame(render);
	});

	equalizationGui.open();

}

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
    return new THREE.Color(data[ position ], data[ position + 1], data[ position + 2]);

}

function isGrayscale(imagedata){

	for (var i = 0; i < imagedata.height; i++){
		for (var j = 0; j < imagedata.width; j++){
			var color = getPixel(imagedata, i, j);
			if (color.r != color.g || color.r != color.b || color.g != color.b){
				renderer.setClearColor(new THREE.Color(1.0, 1.0, 1.0));
				return false;
			}
		}
	}

	renderer.setClearColor(new THREE.Color(1.0, 0.0, 0.0));
	return true;
}

function calcHist(imagedata, isGrayscale){

	for (var i = 0; i < 256; i++){
		histogramR[i] = 0;
		histogramG[i] = 0;
		histogramB[i] = 0;
		
		histogramHSV[i] = 0;
	
	}

	for (var i = 0; i < imagedata.height; i++){
		for (var j = 0; j < imagedata.width; j++){
			var color = getPixel(imagedata, i, j);
			// console.log(color.r);
			histogramR[color.r]++;
			histogramG[color.g]++;
			histogramB[color.b]++;
	
			var colorHSV = rgbToHsv(color);

			histogramHSV[colorHSV.b]++;

		}
	}

}

function render() {

	if (!texture.image) 
		requestAnimationFrame(render);
	else {

		var imagedata = getImageData( texture.image );

		var grayscale = isGrayscale(imagedata);

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
		
		// Plane
		var planeGeometry = new THREE.PlaneBufferGeometry(0.8, 0.8, 20, 20);                 
		var plane = new THREE.Mesh( planeGeometry, matShader );
		plane.position.set(-0.6, 0.6, -1);
		scene.add( plane );	

		if (grayscale){
			calcHist(imagedata);

			var grayscaleHistogram = histogramR;
			
			equalization(imagedata, 'grayscale');
			
			plotHistogram(grayscaleHistogram, imagedata.height, imagedata.width, 1, 'grayscale');
		}

		else{
			calcHist(imagedata);
			
			if (equalizationControls.rgb){
				equalization(imagedata, 'rgb');
			}

			else if (equalizationControls.hsv){
				equalizationHSV(imagedata);
			}

			else if (equalizationControls.hsl){
				//equalizationHSL(histogramR, imagedata.height, imagedata.width, imagedata);
				alert("TODO hsl equalization");
			}

			plotHistogram(histogramR, imagedata.height, imagedata.width, 1, 'r');
			plotHistogram(histogramG, imagedata.height, imagedata.width, 1, 'g');
			plotHistogram(histogramB, imagedata.height, imagedata.width, 1, 'b');
		}
		
		renderer.setSize(imagedata.width*2.5, imagedata.height*2.5);
		renderer.render(scene, camera);
		}
}

function plotHistogram(histogram, height, width, histogramNumber, color){
	
	// var barGeometry = new THREE.PlaneGeometry(1/255, 1, 1, 1);

	var maxV = - 1, minV = height * width + 1;


	for (var i = 0; i < 256; i++){
		maxV = Math.max(maxV, histogram[i])
		minV = Math.min(minV, histogram[i]);	
	}
	
	var barMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});

	var initialPos = -1;

	if (histogramNumber == 2){
		initialPos = 0.3;
		barMaterial.color = new THREE.Color(0x0000ff);
	}


	var heightColor = -0.2;

	if (color == 'g'){
		heightColor = -0.6;
	}

	if (color == 'b'){
		heightColor = -1.0;
	}

	for (var i = 0; i < 256; i++){
	
		histogram[i] = 	histogram[i] / maxV;
		// console.log(histogram[i])

		var barHeight = (histogram[i])/4;

		if (histogram[i] == 0) barHeight = 0.0000001;

		var barGeometry = new THREE.PlaneGeometry(2/width, barHeight, 1, 1);
	
		if (color == 'grayscale')
			var barMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(i/255, i/255, i/255)});
		else if (color == 'r')
			var barMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(i/255, 0, 0)});
		else if (color == 'g')
			var barMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(0, i/255, 0)});
		else if (color == 'b')
			var barMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(0, 0, i/255)});

		var barMesh = new THREE.Mesh(barGeometry, barMaterial);
	
		barMesh.position.set(initialPos + ((i / width) * 1.6), heightColor + (barHeight/2) , 0);

		if (color == 'g'){
			barMesh.position.set(initialPos + ((i / width) * 1.6), heightColor + (barHeight/2) , 0);
		}
		
		if (color == 'b'){
			barMesh.position.set(initialPos + ((i / width) * 1.6), heightColor + (barHeight/2) , 0);
		}
	
		scene.add(barMesh);
	}
}

function equalization(imagedata, color){

	var height = imagedata.height, width = imagedata.width;

	var cR = new Array(256);
	var cG = new Array(256);
	var cB = new Array(256);
	var equalizedR = new Array(256);
	var equalizedG = new Array(256);
	var equalizedB = new Array(256);

	for (var i = 0; i < 256; i++){
		equalizedR[i] = 0;
		equalizedG[i] = 0;
		equalizedB[i] = 0;
	}

	cR[0] = histogramR[0];
	cG[0] = histogramG[0];
	cB[0] = histogramB[0];

	for (var i = 1; i < 256; i++){
		cR[i] = histogramR[i] + cR[i - 1];
		cG[i] = histogramG[i] + cG[i - 1];
		cB[i] = histogramB[i] + cB[i - 1];
	}

	for (var i = 1; i < 256; i++){
		cR[i] /= height * width;
		cG[i] /= height * width;
		cB[i] /= height * width;
	}
	
	// console.log(height, width, height * width)

	const pixelValues = [];

	for (var i = 0; i < height; i++){
		for (var j = 0; j < width ; j++){
			var colorR = cR[getPixel(imagedata, i, j).r]*255;
			var colorG = cG[getPixel(imagedata, i, j).g]*255;
			var colorB = cB[getPixel(imagedata, i, j).b]*255;
			// console.log(color)
			if (color == 'grayscale'){
				colorG = colorB = colorR = 0.299 * colorR + 0.587 * colorG + 0.114 * colorB;
			}
			equalizedR[Math.round(colorR)]++;
			equalizedG[Math.round(colorG)]++;
			equalizedB[Math.round(colorB)]++;
			pixelValues.push(colorR, colorG, colorB);
		}
	}

	if (color == 'grayscale'){
		plotHistogram(equalizedR, height, width, 2, 'grayscale');
	}
	else{
		plotHistogram(equalizedR, height, width, 2, 'r');
		plotHistogram(equalizedG, height, width, 2, 'g');
		plotHistogram(equalizedB, height, width, 2, 'b');
	}
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
		var planeGeometry = new THREE.PlaneBufferGeometry(0.8, 0.8, 20, 20);                 
		var equalizedPlane = new THREE.Mesh( planeGeometry, matShader );
		equalizedPlane.position.set(0.7, 0.6, -0.5);
		equalizedPlane.rotation.z = - Math.PI / 2;
		scene.add( equalizedPlane );	

}

function rgbToHsv(colorRGB){
	var colorHSV = colorRGB;
	var rl = colorRGB.r / 255;
	var gl = colorRGB.g / 255;
	var bl = colorRGB.b / 255;

	var Cmax = Math.max(rl, gl, bl);
	var Cmin = Math.min(rl, gl, bl);

	var delta = Cmax - Cmin;

	var h, s, v;

	if (delta == 0){
		h = 0;
	}
	else if (Cmax == rl){
		h = 60 * ( ( (gl - bl) / delta) % 6);
	}
	else if (Cmax == gl){
		h = 60 * ( ( (bl - rl) / delta) + 2);
	}
	else if (Cmax == bl){
		h = 60 * ( ( (rl - gl) / delta) + 4);
	}

	if (h < 0){
		h += 360;
	}

	if (Cmax == 0){
		s = 0;
	}
	else{
		s = delta / Cmax;
	}

	v = Cmax;

	colorHSV.r = h;
	colorHSV.g = s;
	colorHSV.b = v * 255;

	return colorHSV;
}

function hsvToRgb(colorHSV){
	var colorRGB = colorHSV;

	var h = colorHSV.r;
	var s = colorHSV.g;
	var v = colorHSV.b / 255;

	var c = s * v;
	var x = c * (1 - Math.abs( (h/60) % 2 - 1) );
	var m = v - c;

	var rl = 0, gl = 0, bl = 0;

	if (0 <= h && h < 60){
		rl = c;
		gl = x;
	}
	else if (h < 120){
		rl = x;
		gl = c;
	}
	else if (h < 180){
		gl = c;
		bl = x;
	}
	else if (h < 240){
		gl = x;
		bl = c;
	}
	else if (h < 300){
		rl = x;
		bl = c;
	}
	else if (h < 360){
		rl = c;
		bl = x;
	}

	colorRGB.r = (rl+m)*255;
	colorRGB.g = (gl+m)*255;
	colorRGB.b = (bl+m)*255;

	return colorRGB;
}

function equalizationHSV(imagedata){

	var height = imagedata.height, width = imagedata.width;
	var c = new Array(256);
	var equalizedR = new Array(256);
	var equalizedG = new Array(256);
	var equalizedB = new Array(256);

	for (var i = 0; i < 256; i++){
		equalizedR[i] = 0;
		equalizedG[i] = 0;
		equalizedB[i] = 0;
	}

	c[0] = histogramHSV[0];

	for (var i = 1; i < 256; i++){
		c[i] = histogramHSV[i] + c[i - 1];
	}

	for (var i = 1; i < 256; i++){
		c[i] /= height * width;
		// console.log(c[i]);
	}
	
	// console.log(height, width, height * width)

	const pixelValues = [];

	var colorRGB = new THREE.Color(0, 0, 0);

	for (var i = 0; i < height; i++){
		for (var j = 0; j < width ; j++){
			
			colorRGB.r = getPixel(imagedata, i, j).r;
			colorRGB.g = getPixel(imagedata, i, j).g;
			colorRGB.b = getPixel(imagedata, i, j).b;
			
			colorHSV = rgbToHsv(colorRGB);

			colorHSV.b = c[colorHSV.b] * 255;

			colorRGB = hsvToRgb(colorHSV);

			equalizedR[Math.round(colorRGB.r)]++;
			equalizedG[Math.round(colorRGB.g)]++;
			equalizedB[Math.round(colorRGB.b)]++;

			pixelValues.push(colorRGB.r, colorRGB.g, colorRGB.b);
		}
	}

	plotHistogram(equalizedR, height, width, 2, 'r');
	plotHistogram(equalizedG, height, width, 2, 'g');
	plotHistogram(equalizedB, height, width, 2, 'b');
	
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
		var planeGeometry = new THREE.PlaneBufferGeometry(0.8, 0.8, 20, 20);                 
		var equalizedPlane = new THREE.Mesh( planeGeometry, matShader );
		equalizedPlane.position.set(0.7, 0.6, -0.5);
		equalizedPlane.rotation.z = - Math.PI / 2;
		scene.add( equalizedPlane );	

}