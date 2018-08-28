precision highp float;
precision highp int;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

attribute vec3 morphTarget0;
attribute vec3 morphTarget1;
attribute vec3 morphTarget2;
attribute vec3 morphTarget3;
attribute vec3 morphTarget4;

uniform float morphTargetInfluences[ 4 ];

void main() {
    vec3 transformed = vec3( position );

    transformed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];
    transformed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];
    transformed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];
    transformed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];

    vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}