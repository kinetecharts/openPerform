

import Draw from './../util/draw'

class Sky {
	constructor(map) {
		this.draw = new Draw();
		var materialNames = ['mirror', 'light', 'diamond'];
		this.mouse = {value: new THREE.Vector2(40, 60)};
		this.shaders = {
			light: {
				fragmentShader: 'light-fs',
				vertexShader: 'vertexShader',
				uniforms: {
					time: {value: 0},
					resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
				}
			},
			diamond: {
				fragmentShader: 'diamond-fs',
				vertexShader: 'vertexShader',
				uniforms: {
					time: {value: 0},
					resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
					mouse: {value: new THREE.Vector2()}
				}
			},
			mirror: {
				fragmentShader: 'mirror-fs',
				vertexShader: 'vertexShader',
				uniforms: {
					time: {value: 0},
					resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
				}
			}
		};

		console.log(this.shaders);
		this.materials = [];
		for (var i = 0; i < materialNames.length; i++) {
			var name = materialNames[i];
			var shader = this.shaders[name];
			this.materials.push(new THREE.ShaderMaterial({
				vertexShader: document.getElementById(shader.vertexShader).textContent,
				fragmentShader: document.getElementById(shader.fragmentShader).textContent,
				uniforms: shader.uniforms,
				side: THREE.BackSide
			}));
		}

		var sphere = new THREE.SphereGeometry(4000, 32, 15);
		this.draw_object = new THREE.Mesh(sphere, this.materials[0]);
		map.add(this.draw_object);
		this.name = 'Sky';

		this.changeMaterial(0);
	}

	changeMaterial(m) {
		this.draw_object.material = this.materials[m];
	}

	toggle() {
		this.draw_object.visible = !this.draw_object.visible;
	}

	hide() {
		this.draw_object.visible = false;
	}

	show() {
		this.draw_object.visible = true;
	}

	position(pos) {
		this.draw_object.position.copy(this.startingPos.clone().add(pos));
	}
}

export default Sky;