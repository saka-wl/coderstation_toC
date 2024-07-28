import { getImgsMD5 } from "./upload";

onmessage = async (e) => {
    const res = await getImgsMD5(e.data)
    postMessage(res);
};