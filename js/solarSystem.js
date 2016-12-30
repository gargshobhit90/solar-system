
var canvas;
var gl;

var numTimesToSubdivide = 3;

var pointsArray1 = [];
var normalsArray1 = [];
var vertexNormals1 = [];

var pointsArray2 = [];
var normalsArray2 = [];
var vertexNormals2 = [];

var pointsArray3 = [];
var normalsArray3 = [];
var vertexNormals3 = [];

var show = 1; //if show is 1, world view, else if 0, attach to planet

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
    
var lightPosition = vec4(1.0, 1.0, 1.0, 1.0 );

var m_lr = 0; //control heading when camera is attached to planet

function triangle(a, b, c, normalsArray, pointsArray, vertexNormals) {

     pointsArray.push(a);
     pointsArray.push(b);      
     pointsArray.push(c);

    vertexNormal = cross(vec3(subtract(b, c)), vec3(subtract(a, c)));

    if(length(add(vertexNormal, vec3(a)) < length(vec3(a)))) //means wrong direction
        vertexNormal = -vertexNormal; //ensures we are pointing outside the shape

    vertexNormals.push(vec4( vertexNormal, 0 ) );
    vertexNormals.push(vec4( vertexNormal, 0 ) );
    vertexNormals.push(vec4( vertexNormal, 0 ) );
     
          // normals are vectors
     
     normalsArray.push(a[0],a[1], a[2], 0.0);
     normalsArray.push(b[0],b[1], b[2], 0.0);
     normalsArray.push(c[0],c[1], c[2], 0.0);
}


function divideTriangle(a, b, c, count, normalsArray, pointsArray, vertexNormals) {
    if ( count > 0 ) {
                
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
                
        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);
                                
        divideTriangle( a, ab, ac, count - 1, normalsArray, pointsArray, vertexNormals );
        divideTriangle( ab, b, bc, count - 1, normalsArray, pointsArray, vertexNormals );
        divideTriangle( bc, c, ac, count - 1, normalsArray, pointsArray, vertexNormals );
        divideTriangle( ab, bc, ac, count - 1, normalsArray, pointsArray, vertexNormals );
    }
    else { 
        triangle( a, b, c, normalsArray, pointsArray, vertexNormals );
    }
}


function tetrahedron(a, b, c, d, n, normalsArray, pointsArray, vertexNormals) {
    divideTriangle(a, b, c, n, normalsArray, pointsArray, vertexNormals);
    divideTriangle(d, c, b, n, normalsArray, pointsArray, vertexNormals);
    divideTriangle(a, d, b, n, normalsArray, pointsArray, vertexNormals);
    divideTriangle(a, c, d, n, normalsArray, pointsArray, vertexNormals);
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    vPosition = gl.getAttribLocation(program, "vPosition");
    vNormal = gl.getAttribLocation(program, "vNormal");
    
    
    //first - medium-low
    tetrahedron(va, vb, vc, vd, 3, normalsArray1, pointsArray1, vertexNormals1);

    nBuffer1 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer1);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray1), gl.STATIC_DRAW );

    vertexNormalBuffer1 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexNormalBuffer1);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexNormals1), gl.STATIC_DRAW );
    
    vBuffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer1);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray1), gl.STATIC_DRAW);

    
    //two - medium-high
    tetrahedron(va, vb, vc, vd, 4, normalsArray2, pointsArray2, vertexNormals2);

    nBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer2);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray2), gl.STATIC_DRAW );
    
     vertexNormalBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexNormalBuffer2);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexNormals2), gl.STATIC_DRAW );

    vBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray2), gl.STATIC_DRAW);
    

    //three - high
    tetrahedron(va, vb, vc, vd, 5, normalsArray3, pointsArray3, vertexNormals3);

    nBuffer3 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer3);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray3), gl.STATIC_DRAW );
    
    vertexNormalBuffer3 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexNormalBuffer3);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexNormals3), gl.STATIC_DRAW );
    
    vBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray3), gl.STATIC_DRAW);

    model_transform_loc = gl.getUniformLocation( program, "model_transform" );
    camera_transform_loc = gl.getUniformLocation( program, "camera_transform" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

    

    //light properties
    ambientLoc = gl.getUniformLocation(program, "ambient");
    diffuseLoc = gl.getUniformLocation(program, "diffuse");
    specularLoc = gl.getUniformLocation(program, "specular");
    shininessLoc = gl.getUniformLocation(program, "shininess");
    lightColorLoc = gl.getUniformLocation(program, "lightColor");
    materialColorLoc = gl.getUniformLocation(program, "materialColor");
    lightPositionLoc = gl.getUniformLocation(program, "lightPosition");

    FLATLoc = gl.getUniformLocation(program, "FLAT");
    GOURAUDLoc = gl.getUniformLocation(program, "GOURAUD");
       

    window.addEventListener("keydown", function() {
        switch(event.keyCode) {
            case 38: //uparrow
                camera_transform = mult(translate(0,-.25,0), camera_transform);                
                break;
            case 40: //downarrow
                camera_transform = mult(translate(0,+.25,0), camera_transform);                            
                break;            
            case 37: //leftarrow   
                camera_transform = mult(rotate(1, 0,-1,0), camera_transform);
                m_lr -= 1; //to change heading when camera is attached to planet
                break;
            case 39: //rightarrow
                camera_transform = mult(rotate(1, 0,+1,0), camera_transform);            
                m_lr += 1; //to change heading when camera is attached to planet
                break;
            case 73: //i - forward
                camera_transform = mult(translate(0,0,+.25), camera_transform);
                break;
            case 77: //m - backward
                camera_transform = mult(translate(0,0,-.25), camera_transform);
                break;
            case 74: //j - left
                camera_transform = mult(translate(+.25,0,0), camera_transform);
                //m_left_right += .25;
                break;
            case 75: //k - right
                camera_transform = mult(translate(-.25,0,0), camera_transform);
                break;
            case 82: //r - reset
                camera_transform = mult(translate(0,-2,-50), rotate(30, 1, 0, 0));
                break;
            case 65: //a - attach/detach
                (show == 0) ? (show = 1) : (show = 0); 
                //show = 0 means camera is attached to planet, 1 means it is not
                break;
        }
    });    
      
    camera_transform = mult(translate(0,-2,-50), rotate(30, 1, 0, 0));
    
    render();
}

function drawSphere(complexity, boolFlat)
{
        normalMatrix = [
        vec3(model_transform[0][0], model_transform[0][1], model_transform[0][2]),
        vec3(model_transform[1][0], model_transform[1][1], model_transform[1][2]),
        vec3(model_transform[2][0], model_transform[2][1], model_transform[2][2])
    ];

    gl.uniformMatrix4fv(model_transform_loc, false, flatten(model_transform) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
           
    if(complexity == "low")
    {     
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer1);
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);    
        gl.bindBuffer(gl.ARRAY_BUFFER, boolFlat ? vertexNormalBuffer1 : nBuffer1);
        gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vNormal);  
        gl.drawArrays( gl.TRIANGLES, 0, pointsArray1.length );

    }
    else if(complexity == "medium")
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);   
        gl.bindBuffer(gl.ARRAY_BUFFER, boolFlat ? vertexNormalBuffer2 : nBuffer2);
        gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vNormal);  
        gl.drawArrays( gl.TRIANGLES, 0, pointsArray2.length );
    }
    else 
    {        
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer3);   
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);   
        gl.bindBuffer(gl.ARRAY_BUFFER, boolFlat ? vertexNormalBuffer3 : nBuffer3);
        gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vNormal);                
        gl.drawArrays( gl.TRIANGLES, 0, pointsArray3.length );
    }
}

function render(time)
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(ambientLoc, 1);    
    gl.uniform1f(diffuseLoc, .5);
    gl.uniform1f(specularLoc, .9);
    gl.uniform1f(shininessLoc, 50);
    gl.uniform4fv(lightColorLoc, vec4(1.0, 1.0, 1.0, 1.0));
    gl.uniform4fv(materialColorLoc, vec4(0.5,0.5,1.0,0.5));
    gl.uniform4fv(lightPositionLoc, lightPosition);
   
    model_transform = mat4();
    projectionMatrix = perspective(45, canvas.width/canvas.height, 0.1, 100);

    //Sun
    model_transform = mult(model_transform, translate(1.0,1.0,1.0));
    model_transform = mult(model_transform, scale(0.8,0.8,0.8));
    sun = model_transform;
    drawSphere("high",true);

    //First planet
    gl.uniform1f(ambientLoc, 0.4);  
    gl.uniform1f(shininessLoc, 200);  
    gl.uniform4fv(materialColorLoc, vec4(1.0,1.0,1.0,1.0));
       
    model_transform = mult(model_transform, rotate(time/10.0,0,1,0));
    model_transform = mult(model_transform, translate(-5,0,0));
    model_transform = mult(model_transform, scale(0.7,0.7,0.7));

    planet1 = model_transform;

    gl.uniform1i(FLATLoc, true);     
    drawSphere("low", true);
    gl.uniform1i(FLATLoc, false);     

    //Second planet
    model_transform = sun;
    gl.uniform1f(ambientLoc, 0.2);    
    gl.uniform4fv(materialColorLoc, vec4(0.0,1.0,0.0,1.0));

    model_transform = mult(model_transform, rotate(time/12.0,0,1,0));
    model_transform = mult(model_transform, translate(-12,0,0));

    gl.uniform1i(GOURAUDLoc, true);  
    drawSphere("low",false);
    gl.uniform1i(GOURAUDLoc, false);  

    //Second planet's satellite
    gl.uniform1f(ambientLoc, 0.2);    
    gl.uniform4fv(materialColorLoc, vec4(1.0,0.54,1.0,1.0));

    model_transform = mult(model_transform, rotate(time/12.0,0,1,0));
    model_transform = mult(model_transform, translate(-4,0,0));
    model_transform = mult(model_transform, scale(0.5,0.5,0.5));

    drawSphere("low",false);

    //Third planet
    model_transform = sun;
    gl.uniform1f(ambientLoc, 0.2);    

    gl.uniform4fv(materialColorLoc, vec4(0.0,1.0,1.0,1.0));

    model_transform = mult(model_transform, rotate(time/17.0,0,1,0));    
    model_transform = mult(model_transform, translate(-19,0,0));
    model_transform = mult(model_transform, scale(1.4,1.4,1.4));

    drawSphere("high",false);

    //Fourth planet
    model_transform = sun;
    gl.uniform1f(ambientLoc, 0.2);    
    gl.uniform4fv(materialColorLoc, vec4(244.0/244.0, 164.0/244.0, 96.0/244.0, 1.0));
    gl.uniform1f(specularLoc, 0); //no specular highlight

    model_transform = mult(model_transform, rotate(time/14.0,0,1,0));
    model_transform = mult(model_transform, translate(-24,0,0));
    model_transform = mult(model_transform, scale(1.2,1.2,1.2));

    drawSphere("medium",false);

    if(show == 0) //camera is attached to planet
    {
        camera_transform1 = mat4();        
        camera_transform1 = mult(translate(-1.0,-1.0,-1.0), camera_transform1);        
        camera_transform1 = mult(scale(1.0/0.8, 1.0/0.8, 1.0/0.8), camera_transform1);
        camera_transform1 = mult(rotate(time/10.0,0,-1,0), camera_transform1);
        camera_transform1 = mult(translate(+5,0,0), camera_transform1);
        camera_transform1 = mult(scale(1.0/0.7, 1.0/0.7, 1.0/0.7), camera_transform1);
        camera_transform1 = mult(translate(0.0,-1.0,-7.0), camera_transform1);        
        camera_transform1 = mult(rotate(m_lr,vec3(0,1,0)), camera_transform1);
        gl.uniformMatrix4fv(camera_transform_loc, false, flatten(camera_transform1) );        
    }
    else //camera is not attached to planet
    {
        gl.uniformMatrix4fv(camera_transform_loc, false, flatten(camera_transform));
    }                

    window.requestAnimFrame(render);
}
