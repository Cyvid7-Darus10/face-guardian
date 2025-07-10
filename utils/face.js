import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';
const DEFAULT_INPUT_SIZE = 512;
const DEFAULT_SCORE_THRESHOLD = 0.6;
const MAX_DESCRIPTOR_DISTANCE = 0.4;

// Smile thresholds
const EXPRESSIONS_THRESH = {
  SMILE: 0.25,
  NEGATIVE_MAX: 0.2,
};
const LANDMARKS_THRESH = {
  WIDTH_RATIO: 0.52,
  ASPECT_RATIO: 2.5,
  CURVE_OFFSET_RATIO: 0.12,
};

let expressionsLoaded = false;

/**
 * Load all face-api.js models, including expressions if available.
 */
export async function loadModels() {
  try {
    await Promise.all([
      faceapi.loadTinyFaceDetectorModel(MODEL_URL),
      faceapi.loadFaceLandmarkTinyModel(MODEL_URL),
      faceapi.loadFaceRecognitionModel(MODEL_URL),
    ]);

    try {
      await faceapi.loadFaceExpressionModel(MODEL_URL);
      expressionsLoaded = true;
      console.log('Expression model loaded');
    } catch {
      console.warn(
        'Expression model not found; falling back to landmarks only'
      );
    }
  } catch (err) {
    console.error('Error loading models:', err);
    throw err;
  }
}

/** Build a TinyFaceDetectorOptions instance */
function getDetectorOptions(inputSize = DEFAULT_INPUT_SIZE) {
  return new faceapi.TinyFaceDetectorOptions({
    inputSize,
    scoreThreshold: DEFAULT_SCORE_THRESHOLD,
  });
}

/**
 * Detects faces + landmarks + descriptors (+ expressions if loaded).
 * @param {Blob|HTMLImageElement|HTMLCanvasElement|string} source
 */
export async function getFullFaceDescription(source, inputSize) {
  const img = await prepareImageSource(source);
  const options = getDetectorOptions(inputSize);

  // Always get landmarks + descriptors
  let results = await faceapi
    .detectAllFaces(img, options)
    .withFaceLandmarks(true)
    .withFaceDescriptors();

  // If we have expressions, re-run to include them
  if (expressionsLoaded) {
    results = await faceapi
      .detectAllFaces(img, options)
      .withFaceLandmarks(true)
      .withFaceExpressions()
      .withFaceDescriptors();
  }

  return results;
}

/**
 * Simple face bounding‐box detection.
 * @param {Blob|HTMLImageElement|HTMLCanvasElement|string} source
 */
export async function detectFaces(source, inputSize) {
  const img = await prepareImageSource(source);
  return faceapi.detectAllFaces(img, getDetectorOptions(inputSize));
}

/**
 * Prepares image source for face-api.js processing
 * @param {Blob|HTMLImageElement|HTMLCanvasElement|string} source
 */
async function prepareImageSource(source) {
  if (typeof source === 'string') {
    // Handle data URL strings from webcam screenshots
    return await faceapi.fetchImage(source);
  } else if (source instanceof Blob) {
    return await faceapi.fetchImage(source);
  } else {
    // Already an HTMLElement or Canvas
    return source;
  }
}

/**
 * Build a FaceMatcher from a profile object { label: { descriptors: [...] } }.
 * @param {Object} faceProfiles
 */
export async function createMatcher(faceProfiles) {
  const labeledDescriptors = Object.entries(faceProfiles).map(
    ([label, { descriptors }]) =>
      new faceapi.LabeledFaceDescriptors(
        label,
        descriptors.map(d => new Float32Array(d))
      )
  );
  return new faceapi.FaceMatcher(labeledDescriptors, MAX_DESCRIPTOR_DISTANCE);
}

/**
 * Returns true if the face description indicates a smile.
 * @param {Object} desc — output from getFullFaceDescription()
 */
export function isSmiling(desc) {
  if (expressionsLoaded && desc.expressions) {
    const { happy, sad, angry, fearful } = desc.expressions;
    return (
      happy > EXPRESSIONS_THRESH.SMILE &&
      sad < EXPRESSIONS_THRESH.NEGATIVE_MAX &&
      angry < EXPRESSIONS_THRESH.NEGATIVE_MAX &&
      fearful < EXPRESSIONS_THRESH.NEGATIVE_MAX
    );
  }
  return isSmilingLandmarks(desc.landmarks);
}

/** Fallback smile detection using just landmarks. */
function isSmilingLandmarks(landmarks) {
  const p = landmarks.positions;
  const leftEye = p[36],
    rightEye = p[45],
    noseBot = p[33];
  const mouthL = p[48],
    mouthR = p[54],
    mouthT = p[51],
    mouthB = p[57];

  const faceW = faceapi.euclideanDistance(
    [leftEye.x, leftEye.y],
    [rightEye.x, rightEye.y]
  );
  const mouthW = faceapi.euclideanDistance(
    [mouthL.x, mouthL.y],
    [mouthR.x, mouthR.y]
  );
  const mouthH = faceapi.euclideanDistance(
    [mouthT.x, mouthT.y],
    [mouthB.x, mouthB.y]
  );

  const widthRatio = mouthW / faceW;
  const aspectRatio = mouthW / mouthH;
  const mouthCenterY = (mouthL.y + mouthR.y) / 2;
  const curveLine = noseBot.y + faceW * LANDMARKS_THRESH.CURVE_OFFSET_RATIO;

  return (
    widthRatio > LANDMARKS_THRESH.WIDTH_RATIO &&
    aspectRatio > LANDMARKS_THRESH.ASPECT_RATIO &&
    mouthCenterY < curveLine
  );
}

/**
 * Returns a [0–1] confidence that the face is smiling.
 * @param {Object} desc
 */
export function getSmileConfidence(desc) {
  if (expressionsLoaded && desc.expressions) {
    return desc.expressions.happy;
  }
  const p = desc.landmarks.positions;
  const leftEye = p[36],
    rightEye = p[45];
  const mouthL = p[48],
    mouthR = p[54],
    mouthT = p[51],
    mouthB = p[57];

  const mouthW = faceapi.euclideanDistance(
    [mouthL.x, mouthL.y],
    [mouthR.x, mouthR.y]
  );
  const mouthH = faceapi.euclideanDistance(
    [mouthT.x, mouthT.y],
    [mouthB.x, mouthB.y]
  );
  const faceW = faceapi.euclideanDistance(
    [leftEye.x, leftEye.y],
    [rightEye.x, rightEye.y]
  );

  const widthScore = Math.min(Math.max((mouthW / faceW - 0.45) / 0.15, 0), 1);
  const aspectScore = Math.min(Math.max((mouthW / mouthH - 2.0) / 2.0, 0), 1);

  return (widthScore + aspectScore) / 2;
}

/**
 * Checks if a detected face is well‐centered and sized within the image.
 * @param {Object} desc
 * @param {number} imgW
 * @param {number} imgH
 */
export function isFaceWellPositioned(desc, imgW, imgH) {
  const { box } = desc.detection;
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  const offsetW = imgW * 0.2;
  const offsetH = imgH * 0.2;
  const areaRatio = (box.width * box.height) / (imgW * imgH);

  return (
    Math.abs(centerX - imgW / 2) < offsetW &&
    Math.abs(centerY - imgH / 2) < offsetH &&
    areaRatio >= 0.08 &&
    areaRatio <= 0.85
  );
}
