const noise = new SimplexNoise();

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
    }

}