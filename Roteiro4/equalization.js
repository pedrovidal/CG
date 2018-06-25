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

	// carrega texturas
	texture = textureLoader.load(/*"../../Assets/Images/ */"lena.png");
	textureRGB = textureLoader.load(/*"../../Assets/Images/ */"lena.png");
	textureGrayscale = textureLoader.load(/*"../../Assets/Images/ */"grayscale_lena.png");
	
	document.getElementById("WebGL-output").appendChild(renderer.domElement);

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

	// opcao de imagem em rgb ou em grayscale

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
	
    // opcao de equalizar imagem pelos canais rgb ou equalizar o v

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

	// recupera canais rgb do pixel (0-255)

    var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
    return new THREE.Color(data[ position ], data[ position + 1], data[ position + 2]);

}

function calcHist(imagedata){

	// calculo dos histogramas R, G, B e HSV(apenas para o V)

	for (var i = 0; i < 256; i++){
		histogramR[i] = 0;
		histogramG[i] = 0;
		histogramB[i] = 0;
		
		histogramHSV[i] = 0;
	
	}

	for (var i = 0; i < imagedata.height; i++){
		for (var j = 0; j < imagedata.width; j++){
			var color = getPixel(imagedata, i, j);

			histogramR[Math.round(color.r)]++;
			histogramG[Math.round(color.g)]++;
			histogramB[Math.round(color.b)]++;
	
			var colorHSV = rgbToHsv(color);

			histogramHSV[Math.round(colorHSV.b * 255)]++;

		}
	}

}

function render() {

	if (!texture.image) 
		requestAnimationFrame(render);
	else {


		// recupera dados da imagem
		var imagedata = getImageData( texture.image );

		// opcao de grayscale
		var grayscale = colorControls.grayscale;

		// carrega textura usando shader

		uniforms = {
			textureA: { type: "t", value:texture },
		};
		
		var matShader = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: document.getElementById( 'base-vs' ).textContent,
				fragmentShader: document.getElementById( 'base-fs' ).textContent
			} );
		
		// cria plano
		var planeGeometry = new THREE.PlaneBufferGeometry(0.8, 0.8, 20, 20);                 
		var plane = new THREE.Mesh( planeGeometry, matShader );
		plane.position.set(-0.6, 0.6, -1);
		scene.add( plane );	

		// checa se opcao grayscale e verdadeira
		if (grayscale){
			renderer.setClearColor(new THREE.Color(1.0, 0.0, 0.0));

			// calcula histogramas

			calcHist(imagedata);

			// como os canais R, G e B tem mesmo valor na imagem grayscale
			// utiliza o histograma calculado para o canal R

			var grayscaleHistogram = histogramR;
			
			// equaliza imagem

			equalization(imagedata);

			// plota histograma da imagem grayscale original
			
			plotHistogram(grayscaleHistogram, imagedata.width, 1, 'grayscale');
		}

		else{
			renderer.setClearColor(new THREE.Color(1.0, 1.0, 1.0));

			// calcula histogramas

			calcHist(imagedata);

			// checa metodo de equalizacao da imagem
			
			// se metodo rgb
			if (equalizationControls.rgb){
				equalization(imagedata);
			}

			// senao metodo hsv
			else if (equalizationControls.hsv){
				equalizationHSV(imagedata);
			}

			// plota histogramas R, G e B da imagem RGB original

			plotHistogram(histogramR, imagedata.width, 1, 'r');
			plotHistogram(histogramG, imagedata.width, 1, 'g');
			plotHistogram(histogramB, imagedata.width, 1, 'b');
		}
		
		renderer.setSize(imagedata.width*2.5, imagedata.height*2.5);
		renderer.render(scene, camera);
		}
}

function plotHistogram(histogram, width, histogramNumber, color){

	var maxV = - 1;

	for (var i = 0; i < 256; i++){
		maxV = Math.max(maxV, histogram[i])
	}
	
	var initialPos = -1;

	if (histogramNumber == 2){
		initialPos = 0.3;
	}

	var heightOffsetByColor = -0.2;

	if (color == 'g'){
		heightOffsetByColor = -0.6;
	}

	if (color == 'b'){
		heightOffsetByColor = -1.0;
	}

	for (var i = 0; i < 256; i++){
	
		histogram[i] = 	histogram[i] / maxV;

		if (histogram[i] == 0) {
			continue;
		}
		
		var barHeight = (histogram[i])/4;

		var barGeometry = new THREE.PlaneGeometry(2/width, barHeight, 1, 1);
	
		if (color == 'grayscale'){
			var barMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(i/255, i/255, i/255)});
		}
		else if (color == 'r'){
			var barMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(i/255, 0, 0)});
		}
		else if (color == 'g'){
			var barMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(0, i/255, 0)});
		}
		else if (color == 'b'){
			var barMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(0, 0, i/255)});
		}

		var barMesh = new THREE.Mesh(barGeometry, barMaterial);
	
		barMesh.position.set(initialPos + ((i / width) * 1.6), heightOffsetByColor + (barHeight/2) , 0);

		if (color == 'g'){
			barMesh.position.set(initialPos + ((i / width) * 1.6), heightOffsetByColor + (barHeight/2) , 0);
		}
		
		if (color == 'b'){
			barMesh.position.set(initialPos + ((i / width) * 1.6), heightOffsetByColor + (barHeight/2) , 0);
		}
	
		scene.add(barMesh);
	}
}

function equalization(imagedata, color){

	var height = imagedata.height, width = imagedata.width;

	var cdfR = new Array(256);
	var cdfG = new Array(256);
	var cdfB = new Array(256);
	var equalizedR = new Array(256);
	var equalizedG = new Array(256);
	var equalizedB = new Array(256);

	for (var i = 0; i < 256; i++){
		equalizedR[i] = 0;
		equalizedG[i] = 0;
		equalizedB[i] = 0;
	}

	// calcula cdf

	cdfR[0] = histogramR[0];
	cdfG[0] = histogramG[0];
	cdfB[0] = histogramB[0];

	for (var i = 1; i < 256; i++){
		cdfR[i] = histogramR[i] + cdfR[i - 1];
		cdfG[i] = histogramG[i] + cdfG[i - 1];
		cdfB[i] = histogramB[i] + cdfB[i - 1];
	}

	for (var i = 1; i < 256; i++){
		cdfR[i] /= height * width;
		cdfG[i] /= height * width;
		cdfB[i] /= height * width;
	}

	const pixelValues = [];

	for (var i = 0; i < height; i++){
		for (var j = 0; j < width ; j++){
			var colorR = cdfR[Math.round(getPixel(imagedata, i, j).r)]*255;
			var colorG = cdfG[Math.round(getPixel(imagedata, i, j).g)]*255;
			var colorB = cdfB[Math.round(getPixel(imagedata, i, j).b)]*255;

			// calcula novos histogramas da imagem equalizada

			equalizedR[Math.round(colorR)]++;
			equalizedG[Math.round(colorG)]++;
			equalizedB[Math.round(colorB)]++;

			// guarda valores dos novos pixeis (imagem equalizada)

			pixelValues.push(colorR, colorG, colorB);
		}
	}

	// plota histogramas equalizados

	if (colorControls.grayscale){
		plotHistogram(equalizedR, width, 2, 'grayscale');
	}
	else{
		plotHistogram(equalizedR, width, 2, 'r');
		plotHistogram(equalizedG, width, 2, 'g');
		plotHistogram(equalizedB, width, 2, 'b');
	}

	// carrega imagem equalizada

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

	var planeGeometry = new THREE.PlaneBufferGeometry(0.8, 0.8, 20, 20);                
	var equalizedPlane = new THREE.Mesh( planeGeometry, matShader );
	equalizedPlane.position.set(0.7, 0.6, -0.5);
	equalizedPlane.rotation.z = - Math.PI / 2;
	scene.add( equalizedPlane );

}

function rgbToHsv(colorRGB){
	// conversao rgb para hsv

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
	colorHSV.b = v;

	return colorHSV;
}

function hsvToRgb(colorHSV){
	// conversao hsv para rgb

	var colorRGB = colorHSV;

	var h = colorHSV.r;
	var s = colorHSV.g;
	var v = colorHSV.b;

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

	// equalizacao no V

	var height = imagedata.height, width = imagedata.width;
	var cdf = new Array(256);
	var equalizedR = new Array(256);
	var equalizedG = new Array(256);
	var equalizedB = new Array(256);

	for (var i = 0; i < 256; i++){
		equalizedR[i] = 0;
		equalizedG[i] = 0;
		equalizedB[i] = 0;
	}

	cdf[0] = histogramHSV[0];

	for (var i = 1; i < 256; i++){
		cdf[i] = histogramHSV[i] + cdf[i - 1];
	}

	for (var i = 1; i < 256; i++){
		cdf[i] /= height * width;
	}
	
	// vetor para guardar novos pixeis

	const pixelValues = [];

	var colorRGB = new THREE.Color(0, 0, 0);

	for (var i = 0; i < height; i++){
		for (var j = 0; j < width ; j++){
			
			colorRGB.r = getPixel(imagedata, i, j).r;
			colorRGB.g = getPixel(imagedata, i, j).g;
			colorRGB.b = getPixel(imagedata, i, j).b;
			
			// converte de rgb para hsv

			colorHSV = rgbToHsv(colorRGB);

			// calcula novo valor de v com base na equalizacao

			colorHSV.b = cdf[Math.round(colorHSV.b * 255)];

			// converte de hsv para rgb

			colorRGB = hsvToRgb(colorHSV);

			// calcula histogramas equalizados

			equalizedR[Math.round(colorRGB.r)]++;
			equalizedG[Math.round(colorRGB.g)]++;
			equalizedB[Math.round(colorRGB.b)]++;

			// guarda novos valores de pixeis

			pixelValues.push(colorRGB.r, colorRGB.g, colorRGB.b);
		}
	}

	// plota histogramas equalizados

	plotHistogram(equalizedR, width, 2, 'r');
	plotHistogram(equalizedG, width, 2, 'g');
	plotHistogram(equalizedB, width, 2, 'b');

	// carrega imagem equalizada
	
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

	var planeGeometry = new THREE.PlaneBufferGeometry(0.8, 0.8, 20, 20);                
	var equalizedPlane = new THREE.Mesh( planeGeometry, matShader );
	equalizedPlane.position.set(0.7, 0.6, -0.5);
	equalizedPlane.rotation.z = - Math.PI / 2;
	scene.add( equalizedPlane );

}