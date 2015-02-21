//Classes related functions

Function.prototype.extends = function( parent ){ 
    
	if ( parent.constructor == Function ) 
	{ 
		//Normal Inheritance 
		this.prototype = new parent;
		this.prototype.constructor = this;
		this.prototype.parent = parent.prototype;
	} 
	else 
	{ 
		//Pure Virtual Inheritance 
		this.prototype = parent;
		this.prototype.constructor = this;
		this.prototype.parent = parent;
	} 
    return this;
}

//Base Entity Class


//Model

var modelId = 0;

function Model()
{
    this.id = modelId;
    modelId++;
    
    this.parts = new Array();
}

function Room(x,y,parent)
{
    this.parent = parent = parent;
    if(x == undefined)x = 0;
    if(y == undefined)Y = 0;
    this.position = new THREE.Vector2(x,y);
    this.type = ["wood","concrete"][Math.floor(Math.random()*2)];
    this.models = new THREE.Group();
    this.obstacles = [];
    
    this.allocation =
    {
        top:"doorframe",
        right:"doorframe",
        bottom:"doorframe",
        left:"doorframe"
    }
    /*
    if(x-1 < 0)this.allocation.left = (Math.random() < 0.5)?"wall":"window";
    if( x+1 >= worldSize.x)this.allocation.right = (Math.random() < 0.5)?"wall":"window";
    
    if(y-1 < 0)this.allocation.top = (Math.random() < 0.5)?"wall":"window";
    if( y+1 >= worldSize.y)this.allocation.bottom = (Math.random() < 0.5)?"wall":"window";
    */
    for(var i = 0; i < 4;i++)
    {
        var angle = (i/4) * (Math.PI * 2) - Math.PI/2;
        var n = this.allocation[["top","right","bottom","left"][i]];
        var model = loadModel(ModelData[this.type][n]);
        this.models.add(model);
        model.position.x = Math.cos(angle) * 2;
        model.position.z = Math.sin(angle) * 2;
        model.rotation.y = angle;
    }
    
    this.models.add(loadModel(ModelData[this.type]["floor"]));
    
    var m;
    
    //Decorations
    //Solid
    if((!generated && (x != 1 || y != 1)) || generated)
    {
        if(Math.random() < 0.1)
        {
            m = loadModel(ModelData["decorative"]["table"]);
            m.rotation.y = Math.random() * Math.PI;
            m.rotation.x = Math.random()/10;
            this.models.add(m);
            this.obstacles.push("table");
            if(Math.random() < 0.4)
            {
                m = loadModel(ModelData["decorative"]["lamp"]);
                m.position.x = Math.random()*0.1 - 0.5;
                m.position.y = 0.33;
                m.rotation.y = Math.random()*Math.PI;
                this.models.add(m);
            }
        }
        else if(Math.random() < 0.05)
        {
            m = loadModel(ModelData["decorative"]["shrinePillar"]);
            this.obstacles.push("shrinePillar");
            this.models.add(m);
        }
    }
    //Walkthrough
    //General
    if(Math.random() < 0.2)
    {
        m = loadModel(ModelData["decorative"]["puddle1"]);
        m.position.x = Math.random()*3.8 - 2;
        m.position.y -= Math.random()/4;
        m.rotation.y = Math.random()*Math.PI;
        this.models.add(m);
    }
    //Wood only
    //Concrete only
    if(this.type == "concrete")
    {
        if(Math.random() < 0.2)
        {
            
            var color = (Math.random() < 0.5)?"Yellow":"Red";
            var angle = Math.floor(Math.random()*4) * (Math.PI/2);
            m = loadModel(ModelData["decorative"]["light"+color]);
            
            m.rotation.y = -angle;
            m.rotation.z = Math.PI/2;
            
            m.position.y = 2;
            m.position.x = Math.cos(angle)*1.94;
            m.position.z = Math.sin(angle)*1.94;
            
            this.models.add(m);
        }
    }
}

/*
{
    name:"string",
    type:"type",
    description:"description"
    parts:
    [
        {
            size:[x,y,z],
            color:[r,g,b,a],
            position:[x,y,z],
            rotation:[x,y,z,w] || rotation:[x,y,z]
        },
        {}...
    ]
}
*/