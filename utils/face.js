import * as faceapi from "face-api.js";

// Load models and weights
export async function loadModels() {
	await faceapi.loadTinyFaceDetectorModel("/models");
	await faceapi.loadFaceLandmarkTinyModel("/models");
	await faceapi.loadFaceRecognitionModel("/models");
}

export async function getFullFaceDescription(blob, inputSize = 512) {
	// tiny_face_detector options
	let scoreThreshold = 0.5;
	const OPTION = new faceapi.TinyFaceDetectorOptions({
		inputSize,
		scoreThreshold,
	});
	const useTinyModel = true;

	// fetch image to api
	let img = await faceapi.fetchImage(blob);

	// detect all faces and generate full description from image
	// including landmark and descriptor of each face
	let fullDesc = await faceapi
		.detectAllFaces(img, OPTION)
		.withFaceLandmarks(useTinyModel)
		.withFaceDescriptors();
	return fullDesc;
}

export async function detectFace(blob, inputSize = 512) {
	// tiny_face_detector options
	let scoreThreshold = 0.85;
	const OPTION = new faceapi.TinyFaceDetectorOptions({
		inputSize,
		scoreThreshold,
	});
	let img = await faceapi.fetchImage(blob);
	let detected = await faceapi.detectAllFaces(img, OPTION);
	return detected;
}

const maxDescriptorDistance = 0.5;
export async function createMatcher(faceProfile) {
	// Create labeled descriptors of member from profile
	let members = Object.keys(faceProfile);
	let labeledDescriptors = members.map(
		(member) =>
			new faceapi.LabeledFaceDescriptors(
				faceProfile[member].name,
				faceProfile[member].descriptors.map(
					(descriptor) => new Float32Array(descriptor)
				)
			)
	);

	// Create face matcher (maximum descriptor distance is 0.5)
	let faceMatcher = new faceapi.FaceMatcher(
		labeledDescriptors,
		maxDescriptorDistance
	);
	return faceMatcher;
}
