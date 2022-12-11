import {PointerDrag, PointerLock, ThirdPersonControls, type ThirdPersonControlsConfig} from 'enable3d';
import {type Object3D, type OrthographicCamera, type PerspectiveCamera} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

export class AdvancedThirdPersonControls extends ThirdPersonControls {
	private delta = {x: 0, y: 0};
	private pointerLock?: PointerLock;
	private pointerDrag?: PointerDrag;
	private orbitControls?: OrbitControls;

	constructor(private readonly cam: PerspectiveCamera | OrthographicCamera, private readonly trgt: Object3D, private readonly element: HTMLElement, config: ThirdPersonControlsConfig) {
		super(cam, trgt, config);
	}

	public update() {
		if (this.orbitControls) {
			this.orbitControls.update();
			return;
		}

		const {x, y} = this.delta;
		super.update(x * 3, y * 3);
		this.delta = {x: 0, y: 0};
	}

	public useOrbitControls() {
		this.dispose();
		this.orbitControls = new OrbitControls(this.cam, this.element);
		this.orbitControls.target = this.trgt.position;
		this.cam.position.copy(this.trgt.position);
	}

	public useThirdPerson() {
		this.dispose();
		this.pointerLock = new PointerLock(this.element);
		this.pointerDrag = new PointerDrag(this.element);
		this.pointerDrag.onMove(delta => {
			this.delta = delta;
		});
	}

	public dispose() {
		this.orbitControls?.dispose();
		this.orbitControls = undefined;
		this.pointerLock?.removeListeners();
		this.pointerLock?.exit();
		this.pointerDrag?.removeListeners();
	}
}
