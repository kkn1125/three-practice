import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export class Core {
  canvasApp: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  /* three options */
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  light: THREE.DirectionalLight;
  cube: THREE.Mesh;

  constructor() {
    this.clearElements();
    // this.initializeCanvas();
    this.initializeRendering();
    // this.initializeEvents();
  }

  initializeRendering() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

    const canvasApp = this.renderer.domElement;
    const ctx = canvasApp.getContext("2d") as CanvasRenderingContext2D;
    canvasApp.id = "app";
    document.body.insertAdjacentElement("afterbegin", canvasApp);

    this.canvasApp = canvasApp;
    this.ctx = ctx;

    this.scene = new THREE.Scene();

    this.setupCamera();
    this.setupLight();
    this.setupModels();
    this.setupControls();
    this.setupEvents();
  }

  private setupCamera() {
    const width = this.canvasApp.clientWidth;
    const height = this.canvasApp.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    camera.position.z = 2;

    this.camera = camera;
  }

  private setupLight() {
    const color = 0xf5d5f2;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);

    this.scene.add(light);
    this.light = light;
  }

  private setupModels() {
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshPhongMaterial({ color: 0x4422aa });
    // const cube = new THREE.Mesh(geometry, material);
    // this.scene.add(cube);
    // this.cube = cube;

    const meshMaterial = new THREE.MeshPhongMaterial({
      color: 0x156289,
      flatShading: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const mesh = new THREE.Mesh(geometry, meshMaterial);
    const line = new THREE.LineSegments(
      // new THREE.WireframeGeometry(geometry),
      new THREE.EdgesGeometry(geometry),
      lineMaterial
    );

    const group = new THREE.Group();
    group.name = "myModels";
    group.add(mesh, line);

    this.scene.add(group);
  }

  private setupControls() {
    const controls = new OrbitControls(this.camera, this.canvasApp);
    controls.enableDamping = true;
  }

  clearElements() {
    const oldCanvas = document.getElementById("app");
    oldCanvas?.remove();
    Object.assign(this, { ctx: undefined });
  }

  private handleResize() {
    const width = (this.canvasApp.width = innerWidth);
    const height = (this.canvasApp.height = innerHeight);

    const camera = this.camera;
    if (camera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    this.renderer.setSize(width, height);
  }

  setupEvents() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize.bind(this));
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  update(time: number) {
    time *= 0.001;

    const cube = /* this.cube; */ this.scene.getObjectByName("myModels");

    // if (cube) {
    //   cube.rotation.x = time;
    //   cube.rotation.y = time;
    // }
  }

  render(time: number = 0) {
    this.update(time);

    this.renderer.render(this.scene, this.camera!);
  }
}
