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
    }

}