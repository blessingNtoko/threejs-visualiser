// Simplex Noise instance
const noise = new SimplexNoise();

// main function
const initVisualiser = () => {
    const file = document.getElementById('file');
    const audio = document.getElementById('audio');
    const fileLabel = document.querySelector('label.file');

    document.onload = (e) => {
        console.log(e);
        audio.play();
        play();
    }

    file.onchange = () => {
        fileLabel.classList.add('normal');
        audio.classList.add('active');
        const files = this.files;

        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
        play();
    }

    function play() {
        const context = new AudioContext();
        const src = context.createMediaElementSource(audio);
        const analyser = context.createAnalyser();
        src.connect(analyser);
        analyser.connect(context.destination);
        analyser.fftSize = 512;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // The webgl cometh
        const scene = new THREE.Scene();
        const group = new THREE.Group();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000);
        camera.position.set(0, 0, 100);
        camera.lookAt(scene.position);
        scene.add(camera);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const planeGeometry = new THREE.planeGeometry(800, 800, 20, 20);
        const planeMaterial = new THREE.MeshLambertMaterial({
            color: 0x6904CE,
            side: THREE.DoubleSide,
            wireframe: true
        });

        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -.5 * Math.PI;
        plane.position.set(0, 30, 0);
        group.add(plane);

        const plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -.5 * Math.PI;
        plane.position.set(0, -30, 0);
        group.add(plane2);

        const icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
        const lambertMaterial = new THREE.MeshLambertMaterial({
            color: 0xFF00EE,
            wireframe: true
        });

        const ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
        ball.position.set(0, 0, 0);
        group.add(ball);

        const ambientLight = new THREE.AmbientLight(0xAAAAAA);
        scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xFFFFFF);
        spotLight.intensity = .9;
        spotLight.position.set(-10, 40, 20);
        spotLight.lookAt(ball);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
        // orbitControls.autoRotate = true;

        scene.add(group);

        document.getElementById('out').appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);

        renderer();

        function render() {
            analyser.getByteFrequencyData(dataArray);

            const lowerHalfArray = dataArray.slice(0, (dataArray.length / 2) -1);
            const upperHalfArray = dataArray.slice((dataArray.length / 2) -1, dataArray.length - 1);

            const overAllAvg = avg(dataArray);
        }
    }

}

// Little Helpers

function fractionate(val, minVal, maxVal) {
    return (val - minVal) / (maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
    const fr = fractionate(val, minVal, maxVal);
    const delta = outMax - outMin;
    return outMin + (fr * delta);
}

function avg(arr) {
    const total = arr.reduce((sum, b) => sum + b);
    return total / arr.length;
}

function max(arr) {
    return arr.reduce((a, b) => Math.max(a, b));
}