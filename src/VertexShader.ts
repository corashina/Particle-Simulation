const VertexShader: string = `

    uniform float uTime;
    uniform float uScale;

    attribute vec3 positionStart;
    attribute float startTime;
    attribute vec3 velocity;
    attribute vec3 color;
    attribute float size;
    attribute float life;

    varying vec4 vColor;
    varying float lifeLeft;
        
    void main() {

    	vColor = vec4( color, 1.0 );

    	vec3 newPosition;
    	vec3 v;

    	float timeElapsed = uTime - startTime;

    	lifeLeft = 1.0 - ( timeElapsed / life );

    	gl_PointSize = ( uScale * size ) * lifeLeft ;

    	v.x = ( velocity.x - 0.5 ) * 5.0;
    	v.y = ( velocity.y - 0.5 ) * 5.0;
    	v.z = ( velocity.z - 0.5 ) * 5.0;

    	newPosition = positionStart + ( v * 1.0 ) * timeElapsed;

    	newPosition = mix( newPosition, newPosition + vec3( 0.1, 0.1, 0.1), ( timeElapsed / life ) );

    	if( v.y > 0. && v.y < .05 ) lifeLeft = 0.0;

    	if( v.x < - 1.45 ) lifeLeft = 0.0;

    	if( timeElapsed > 0.0 ) {

    		gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

    	} else {

    		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 0.0 );

    	}

    }

`

export { VertexShader };