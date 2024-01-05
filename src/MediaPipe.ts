import { FilesetResolver, TextEmbedder } from '@mediapipe/tasks-text';

let textEmbedder: TextEmbedder;

export async function createEmbedder() {
    // Downloaded from https://cdn.jsdelivr.net/npm/@mediapipe/tasks-text@latest/wasm
    // Specifying the CDN URL was resulting in CORS errors, so the wasm files are being supplied from the public folder
    // process.env.PUBLIC_URL is the base URL for the app, which is the public folder - this environment variable is set by create-react-app
    const textTaskWasmFiles = await FilesetResolver.forTextTasks(process.env.PUBLIC_URL);
    textEmbedder = await TextEmbedder.createFromOptions(
        textTaskWasmFiles,
        {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/text_embedder/universal_sentence_encoder.tflite`,
                // delegate: 'CPU' | 'GPU'
            },
            quantize: true
        }
    );
    return true;
}

export function getCosineSimilarity(text1: string, text2: string) {
    const embeddings = [textEmbedder.embed(text1), textEmbedder.embed(text2)];
    const similarity = TextEmbedder.cosineSimilarity(embeddings[0].embeddings[0], embeddings[1].embeddings[0]);
    return similarity;
}