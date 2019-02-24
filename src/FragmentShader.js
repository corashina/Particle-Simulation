"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FragmentShader = "\n\n    float scaleLinear( float value, vec2 valueDomain, vec2 valueRange ) {\n\n    \treturn mix( valueRange.x, valueRange.y, ( value - valueDomain.x ) / ( valueDomain.y - valueDomain.x ) );\n\n    }\n\n    varying vec4 vColor;\n    varying float lifeLeft;\n\n    uniform sampler2D tSprite;\n\n    void main() {\n\n    \tfloat alpha = 0.;\n\n    \tif( lifeLeft > 0.995 ) {\n\n    \t\talpha = scaleLinear( lifeLeft, vec2( 1.0, 0.995 ), vec2( 0.0, 1.0 ) );\n\n    \t} else alpha = lifeLeft * 0.75;\n\n    \tvec4 tex = texture2D( tSprite, gl_PointCoord );\n    \tgl_FragColor = vec4( vColor.rgb * tex.a, alpha * tex.a );\n\n    }\n\n";
exports.FragmentShader = FragmentShader;
