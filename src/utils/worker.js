import { createChunk } from './upload';


onmessage = async (e) => {
    const proms = [];
    const { file, CHUNK_SIZE, startIndex, endIndex } = e.data;
    for (let i = startIndex; i < endIndex; i++) {
        proms.push(createChunk(file, i, CHUNK_SIZE));
    }
    const chunks = await Promise.all(proms);
    postMessage(chunks);
};


