import { drawKeyPoints, drawSkeleton } from './posenet-utils.js';

const defaultConfig = {
  videoWidth: 900,
  videoHeight: 700,
  flipHorizontal: true,
  algorithm: 'single-pose',
  architecture: 'MobileNetV1',
  showVideo: true,
  showSkeleton: true,
  showPoints: true,
  minPoseConfidence: 0.1,
  minPartConfidence: 0.5,
  maxPoseDetections: 2,
  nmsRadius: 20,
  outputStride: 16,
  imageScaleFactor: 0.5,
  skeletonColor: '#ffadea',
  skeletonLineWidth: 6,
  loadingText: 'Loading...please be patient...',
  detectionSource: 'video',
};

class PosenetRenderer {
  constructor(canvas, video, config = {}) {
    this.canvas = canvas;
    this.video = video;
    this.config = { ...defaultConfig, ...config };
    console.log(this.config);
  }

  async startDetection() {
    try {
      this.loadedPosent = await posenet.load({
        architecture: this.config.architecture,
      });
    } catch (error) {
      throw error;
    }
    this.detectPose();
  }

  stopDetection(){
    posenet.un
  }

  detectPose() {
    const { videoWidth, videoHeight } = this.config;
    const canvasContext = this.canvas.getContext('2d');
    this.canvas.width = videoWidth;
    this.canvas.height = videoHeight;
    this.poseDetectionFrame(canvasContext);
  }

  setSize(w, h) {
    console.log('setSize', w, h);
    /*   this.canvas.width = w;
    this.canvas.height = h; */
  }

  render() {
    this.startDetection();
  }

  poseDetectionFrame(canvasContext) {
    const {
      algorithm,
      imageScaleFactor,
      flipHorizontal,
      outputStride,
      minPoseConfidence,
      minPartConfidence,
      maxPoseDetections,
      nmsRadius,
      videoWidth,
      videoHeight,
      showVideo,
      showPoints,
      showSkeleton,
      skeletonColor,
      skeletonLineWidth,
    } = this.config;

    const posenetModel = this.loadedPosent;
    //const video = video;

    const findPoseDetectionFrame = async () => {
      let poses = [];

      switch (algorithm) {
        case 'multi-pose': {
          poses = await posenetModel.estimateMultiplePoses(this.video, {
            imageScaleFactor,
            flipHorizontal,
            outputStride,
            maxPoseDetections,
            minPartConfidence,
            nmsRadius,
          });
          break;
        }
        case 'single-pose': {
          const pose = await posenetModel.estimateSinglePose(this.video, {
            imageScaleFactor,
            flipHorizontal,
            outputStride,
          });
          poses.push(pose);
          break;
        }
        default:
          return;
      }

      canvasContext.clearRect(0, 0, videoWidth, videoHeight);

      if (showVideo) {
        canvasContext.save();
        canvasContext.scale(-1, 1);
        canvasContext.translate(-videoWidth, 0);
        canvasContext.drawImage(this.video, 0, 0, videoWidth, videoHeight);
        canvasContext.restore();
      }

      poses.forEach(({ score, keypoints }) => {
        if (score >= minPoseConfidence) {
          if (showPoints) {
            drawKeyPoints(
              keypoints,
              minPartConfidence,
              skeletonColor,
              canvasContext
            );
          }
          if (showSkeleton) {
            drawSkeleton(
              keypoints,
              minPartConfidence,
              skeletonColor,
              skeletonLineWidth,
              canvasContext
            );
          }
        }
      });
      requestAnimationFrame(findPoseDetectionFrame);
    };
    findPoseDetectionFrame();
  }
}

export { PosenetRenderer };
