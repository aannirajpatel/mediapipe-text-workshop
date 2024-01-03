import { FilesetResolver, TextEmbedder } from '@mediapipe/tasks-text';

let textEmbedder: TextEmbedder;

export async function createEmbedder() {
    const textFiles = await FilesetResolver.forTextTasks(process.env.NODE_ENV === 'production' ? 'https://www.aanpatel.tech/mediapipe-text-workshop' : process.env.PUBLIC_URL);
    textEmbedder = await TextEmbedder.createFromOptions(
        textFiles,
        {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/text_embedder/universal_sentence_encoder.tflite`
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
