"use strict";

import * as THREE from "three";

import { OrbitControls as e } from "three/addons/controls/OrbitControls.js";

import { ImprovedNoise as t } from "three/addons/math/ImprovedNoise.js";

import { OBJExporter as o } from "three/addons/exporters/OBJExporter.js";

import { GLTFExporter as n } from "three/addons/exporters/GLTFExporter.js";

import { GUI as i } from "three/addons/libs/lil-gui.module.min.js";

!(function () {
	function a() {
		(R = 1e3), (P = 400), (L = 0), (C = 501), (G = !0), (H = 3), (M = 4), (j = 5);
	}
	function r() {
		E.remove(T), T.material.dispose(), T.geometry.dispose(), d();
	}
	function d() {
		const e = (function (e, o) {
			const n = e * o;
			let i = [...Array(n)].map(() => 0),
				a = new t(),
				r = 100 * Math.random(),
				d = 1;
			for (let t = 0; t < M; t++) {
				for (let t = 0; t < n; t++) {
					let o = t % e,
						n = ~~(t / e);
					i[t] += Math.abs(a.noise(o / d, n / d, r) * d);
				}
				d *= j;
			}
			let l = new THREE.Vector3(e / 2, o / 2, 0),
				s = Math.floor(Math.min(e / 2, o / 2)),
				c = (Math.floor(Math.max(e / 2, o / 2)), (s * P * 2) / R),
				m = (s * (P + L) * 2) / R;
			for (let t = 0; t < n; t++) {
				let o = t % e,
					n = ~~(t / e),
					a = new THREE.Vector3(o, n, 0);
				var u = Math.abs(a.distanceTo(l));
				if (u >= s - 0.5) i[t] = -11;
				else if (u >= c && u < m) i[t] = 0;
				else if (u >= m) {
					if (!G) {
						i[t] = -11;
						continue;
					}
					(i[t] = -Math.abs(i[t])), (i[t] *= Math.tan(((u - m) / s) * Math.PI) * H), i[t] < -11 && (i[t] = -11);
				} else i[t] *= Math.cos((u / c) * (Math.PI / 2)) * H;
			}
			return i;
		})(C, C);
		(v = new THREE.PlaneGeometry(R, R, C - 1, C - 1)).rotateX(-Math.PI / 2);
		const o = v.attributes.position.array;
		let n,
			i = 0;
		for (let t = 0, a = 0, r = o.length; t < r; t++, a += 3) (n = 1 * e[t]), (o[a + 1] = n), i < n && (i = n);
		v.translate(0, -1 * H, 0), (v.attributes.position.needsUpdate = !0), v.computeVertexNormals(), v.computeBoundingBox();
		let a = {
			colorTexture: {
				value: _,
			},
			limits: {
				value: i,
			},
		};
		(y = new THREE.MeshLambertMaterial({
			side: THREE.DoubleSide,
			onBeforeCompile: (e) => {
				(e.uniforms.colorTexture = a.colorTexture),
					(e.uniforms.limits = a.limits),
					(e.vertexShader = `\n      varying vec3 vPos;\n      ${e.vertexShader}\n    `.replace(
						"#include <fog_vertex>",
						"#include <fog_vertex>\n      vPos = vec3(position);\n      "
					)),
					(e.fragmentShader =
						`\n      uniform float limits;\n      uniform sampler2D colorTexture;\n      \n      varying vec3 vPos;\n      ${e.fragmentShader}\n    `.replace(
							"vec4 diffuseColor = vec4( diffuse, opacity );",
							"\n        float h = (vPos.y - (-limits))/(limits * 2.);\n        h = clamp(h, 0., 1.);\n        vec4 diffuseColor = texture2D(colorTexture, vec2(0, h));\n      "
						));
			},
		})),
			((T = new THREE.Mesh(v, y)).castShadow = !0),
			(T.receiveShadow = !0),
			E.add(T);
	}
	function l() {
		m(new o().parse(T), "object.obj");
	}
	function s() {
		new n().parse(
			T,
			function (e) {
				if (e instanceof ArrayBuffer)
					(t = "object.glb"),
						c(
							new Blob([e], {
								type: "application/octet-stream",
							}),
							t
						);
				else {
					m(JSON.stringify(e, null, 2), "object.gltf");
				}
				var t;
			},
			function () {},
			{
				trs: !1,
				onlyVisible: !0,
				binary: !1,
				maxTextureSize: 4096,
			}
		);
	}
	function c(e, t) {
		(D.href = URL.createObjectURL(e)), (D.download = t), D.click();
	}
	function m(e, t) {
		c(
			new Blob([e], {
				type: "text/plain",
			}),
			t
		);
	}
	function u() {
		(g.aspect = window.innerWidth / window.innerHeight),
			g.updateProjectionMatrix(),
			x.setSize(window.innerWidth, window.innerHeight);
	}
	function p() {
		S.position.set(g.position.x, g.position.y, g.position.z), x.render(E, g);
	}
	let f = document.createElement("canvas"),
		h = f.getContext("2d");
	var w = h.createLinearGradient(0, f.height, 0, 0);
	w.addColorStop(0, "royalblue"),
		w.addColorStop(0.48, "royalblue"),
		w.addColorStop(0.49, "aquamarine"),
		w.addColorStop(0.49, "greenyellow"),
		w.addColorStop(0.55, "limegreen"),
		w.addColorStop(0.78, "peru"),
		w.addColorStop(0.9, "peru"),
		w.addColorStop(1, "white"),
		(h.fillStyle = w),
		h.fillRect(0, 0, f.width, f.height);
	let g,
		E,
		x,
		b,
		v,
		y,
		T,
		S,
		R,
		C,
		H,
		M,
		j,
		P,
		L,
		G,
		B,
		_ = new THREE.CanvasTexture(f);
	a(),
		(function () {
			(B = {
				size: R,
				mountainsArea_radius: P,
				flatGround_radius: L,
				shallows: G,
				dynamic_scale: H,
				seg: C,
				dynamic_scale: H,
				complexity: M,
				quality_ratio: j,
				regenerate: function () {
					r(), p();
				},
				reset: function () {
					o.children[0].controllers.forEach((e) => e.setValue(e.initialValue)), a(), r(), p();
				},
				exportToObj: l,
				exportGLTF: s,
			}),
				((E = new THREE.Scene()).background = 0),
				(x = new THREE.WebGLRenderer({
					antialias: !0,
				})).setPixelRatio(window.devicePixelRatio),
				x.setSize(window.innerWidth, window.innerHeight),
				document.body.appendChild(x.domElement),
				(g = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 3 * R)).position.set(
					0,
					0.3 * R,
					0.8 * R
				),
				g.lookAt(0, 0, 0);
			const t = new THREE.AmbientLight("white", 1);
			E.add(t), (S = new THREE.DirectionalLight("white", 1)).position.set(0, 3, 8), (S.castShadow = !0), E.add(S);
			const o = new i();
			let n = o.addFolder("Settings");
			n
				.add(B, "flatGround_radius", 0, 100)
				.name("flat margin")
				.step(1)
				.onChange(function (e) {
					(L = e), r(), p();
				}),
				n
					.add(B, "seg", 200, 800)
					.name("segment")
					.step(1)
					.onChange(function (e) {
						(C = e), r(), p();
					}),
				n
					.add(B, "shallows", !0)
					.name("shallows")
					.onChange(function (e) {
						(G = e), r(), p();
					}),
				n.add(B, "reset").name("Reset"),
				n.add(B, "regenerate").name("Regenerate"),
				(n = o.addFolder("Export")).add(B, "exportToObj").name("Export OBJ"),
				n.add(B, "exportGLTF").name("Export GLTF"),
				o.open(),
				d(),
				((b = new e(g, x.domElement)).autoRotate = !0),
				(b.autoRotateSpeed = 2),
				(b.enableDamping = !0),
				(b.enablePan = !1),
				(b.minDistance = 0.1),
				(b.maxDistance = 2 * R),
				b.target.set(0, 0, 0),
				b.update(),
				window.addEventListener("resize", u);
		})(),
		(function e() {
			requestAnimationFrame(e), b.update(), p();
		})();
	const D = document.createElement("a");
	(D.style.display = "none"), document.body.appendChild(D);
})();
