import { PosenetRenderer } from './posenet-renderer.js';
const addPosenetToHeader = () => {
  let scriptTags = [];
  for (let script of [
    { url: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs' },
    {
      url: 'https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet',
    },
  ]) {
    const scriptEl = document.createElement('script');
    if (script.module) {
      scriptEl.setAttribute('type', 'module');
    }
    scriptEl.setAttribute('src', script.url);
    scriptTags.push(scriptEl);
  }
  document.head.append(...scriptTags);
};
class PosenetStream {
  constructor(stream) {
    console.log('Posenet Filter to Stream', stream);
    addPosenetToHeader();
    this.stream = stream;
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    this.canvas = canvas;

    this.renderer = new PosenetRenderer(this.canvas, video);

    video.addEventListener('playing', () => {
      // Use a 2D Canvas.
      // this.canvas.width = this.video.videoWidth;
      // this.canvas.height = this.video.videoHeight;

      // Use a WebGL Renderer.
      console.log('playing');
      this.renderer.setSize(this.video.videoWidth, this.video.videoHeight);
      //this.update();
      this.renderer.render();
    });
    video.srcObject = stream;
    video.autoplay = true;
    this.video = video;
    this.ctx = this.canvas.getContext('2d');
    this.outputStream = this.canvas.captureStream();
  }

  update() {
    console.log('PosenetStream.update');
    // Use a 2D Canvas
    /*   this.ctx.filter = 'invert(1)';
    this.ctx.drawImage(this.video, 0, 0);
    this.ctx.fillStyle = '#ff00ff';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText('Virtual', 10, 10); */

    // Use a WebGL renderer.
    // this.renderer.render();
    //requestAnimationFrame(() => this.update());
  }
}

export { PosenetStream };
