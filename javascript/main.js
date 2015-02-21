//Three.js initialisation


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(90,(window.innerWidth) / window.innerHeight,0.001,1000);
var renderer = new THREE.WebGLRenderer();

camera.rotation.order = "YXZ";

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.domElement.id = "game";
renderer.domElement.style.width = "100%";
renderer.domElement.style.height = "100%";
document.getElementById("display").appendChild(renderer.domElement);

renderer.shadowMapEnabled = true;

var fogColor = new THREE.Color(0x3399aa);

scene.fog = new THREE.Fog( fogColor, 20,30 );
renderer.setClearColor(fogColor);

//PostProcessing
var composer = new THREE.EffectComposer( renderer );
composer.addPass( new THREE.RenderPass( scene, camera ) );

var effect = new THREE.ShaderPass( THREE.PixelShader );
effect.renderToScreen = true;
composer.addPass( effect );

/////////////////////////////////////////////
///////// Main programming section //////////
/////////////////////////////////////////////

//Global variables

var ambiantLightColor = new THREE.Color(0x001122);
var ambiantLight = new THREE.AmbientLight(ambiantLightColor);

var cameraLight = new THREE.PointLight(0xdd9a21,5,20);
cameraLight.position.copy(camera.position);
cameraLight.position.y += 10;

scene.add(ambiantLight);
scene.add(cameraLight);


//Functions

function updateRotation()//You can alter the algorithm at your will.
{
    var t = (new Date()).getTime();
    
    camera.rotation.x = (Math.sin(t/8083) / 4) - 1;
    camera.rotation.y = (Math.sin(t/60083) * Math.PI);
}

function addModel(model)
{
    scene.add(model);
}

function removeModel(model)
{
    scene.remove(model);
}

function AssignRandomModel()//Chance this at will
{
    var families =  Object.keys(ModelData);//Get the availble model families (eg. wood, concrete, fancy...)
    var familyAmount = families.length;
    var object = undefined;
    while(object == undefined)
    {
        var familyIndex = Math.floor(Math.random() * familyAmount);
        var modelFamily = ModelData[families[familyIndex]];
        
        var types = Object.keys(modelFamily);
        var typeAmount = types.length;
        var typeIndex = Math.floor(Math.random() * typeAmount);
        object = modelFamily[types[typeIndex]];
    }
    
    return object;//Returns the THREE.js compatible object that can be directly added to the scene
}

function generateModels()//Spawns the models.
{
    var model;
    
    var modelAmount = 8;//You can change the amount of model-creating iterations
    
    for(var i = 0; i < modelAmount; i++)
    {
        var object = AssignRandomModel();//Fetch a random model
        
        model = loadModel(object);
        model.position.x = Math.random() * 10 - 5;
        model.position.y = -4;
        model.position.z = Math.random() * 10 - 5
        
        model.rotation.y = Math.random() * 6.28;
        
        addModel(model);
    }
}

function render()
{
    renderer.render(scene,camera);
    composer.render();
}

function main()
{   
    updateRotation();
    render();
    requestAnimationFrame(main);
}

function init()
{
    console.log("game initiated.");
    generateModels();
    main();
}
init();

//Model Importation functions

function loadModel(model)//Load an already parsed JSON
{
    var loadedModel = new THREE.Group();
    var parts = model.parts;
    var l = parts.length;
    
    for(var i = 0; i < l; i++)//Parsing through the parts
    {
        var p = parts[i];
        var size = new THREE.Vector3(p.size[0], p.size[1], p.size[2]);
        var color = new THREE.Color(p.color[0],p.color[1],p.color[2]);
        var pos = new THREE.Vector3(p.position[0],p.position[1],p.position[2]);
        var rot;
        if(p.rotation.length == 3)
        {
            rot = new THREE.Euler(p.rotation[0],p.rotation[1],p.rotation[2]);
        }
        else
        {
            rot = new THREE.Quaternion(p.rotation[0],p.rotation[1],p.rotation[2],p.rotation[3]);
        }
        
        var material = new THREE.MeshPhongMaterial( { color:color } );
        var geometry = new THREE.BoxGeometry(size.x,size.y,size.z);
        
        var mesh = new THREE.Mesh(geometry,material);
        mesh.position.copy(pos);
        mesh.rotation.copy(rot);
       
        loadedModel.add(mesh);
    }
    
    l = model.lights.length;
    
    for(var i = 0; i < l;i++)//Parsing through lights
    {
        var light = model.lights[i];
        var resLight = new THREE[light.type](light.color);
        
        resLight.position.set(light.position[0],light.position[1]+1,light.position[2]);
        
        resLight.intensity = light.intensity;
        resLight.distance = light.distance;
        
        if(light.type == "SpotLight")
        {
            resLight.castShadow = true;
            resLight.shadowDarkness = 1;
            resLight.shadowCameraNear = 0.1;
            resLight.shadowCameraFar = 10;
            resLight.shadowCameraFov = 90;
        }
        
        loadedModel.add(resLight);
    }
    
    l = model.systems.length;
    
    for(var i = 0; i < l; i++)
    {
        var particle = model.systems[i];
        var material = new THREE.SpriteMaterial({color:particle.color});
        
        var resParticle = new THREE.Sprite(material);
        
        resParticle.position.set(particle.position[0],particle.position[1],particle.position[2]);
        
        resParticle.scale.x = particle.size.x;
        resParticle.scale.y = particle.size.y;
        
        loadedModel.add(resParticle);
    }
    
    return loadedModel;
}