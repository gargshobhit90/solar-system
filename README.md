# Mini-Solar System

## Goal
Create a small solar system. One sun with four orbiting planets.

##Implementation
I started off with a shaded sphere provided in WebGL example online. I separated the modelViewMatrix into two separate matrices: model_transform and camera_transform. 

##How to view
Just download the folder as a zip, or pull, and open solarSystem.html in a web browser.

##Coloring
Instead of passing various light and material characteristics (ambience, shininess, specular) as vectors, I pass them in as scalar quantities. This helped reduce the size and number of variables being passed from my .js file to .html file. In the html file, I modified the code to account for these changes. 

##Shading
Implementation of FLAT shading: I create a buffer in the triangle function that is computed every time it is called. 
```javascript
	vertexNormal = cross(vec3(subtract(b, c)), vec3(subtract(a, c)));

    if(length(add(vertexNormal, vec3(a)) < length(vec3(a)))) //means wrong direction
        vertexNormal = -vertexNormal; //ensures we are pointing outside the shape

    vertexNormals.push(vec4( vertexNormal, 0 ) );
    vertexNormals.push(vec4( vertexNormal, 0 ) );
    vertexNormals.push(vec4( vertexNormal, 0 ) );
```
Later, when it is finally time to draw the sphere, we pass a flag for FLAT to the drawSpheres() function. If it is true, it uses a vertexNormals buffer. Otherwise, it uses the regular normalsArray buffer.

In the html file, I made changes to make shading work for flat or smooth (Phong or Gouraud), depending on the planet. I use a flag called GOURAUD, which is passed in by the .js file.

If the shading is Gouraud, color is computed in the following way:
```html
GOURAUDColor = (ambient + diffuseProduct) * materialColor + specularProduct * lightColor;
```

I also made several changes to the fragment-shader and vertex-shader, which are self-explanatory and can be seen in the code. 

## Other features
* Added a moon to one of the planets. 
* The 'a' key attaches/detaches the view to the first planet. 



