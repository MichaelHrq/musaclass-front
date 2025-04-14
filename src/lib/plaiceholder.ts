import { getPlaiceholder } from "plaiceholder";

export default async function getBase64(imageUrl: string) {
  try {
    const buffer = await fetch(imageUrl).then(async (res) =>
      Buffer.from(await res.arrayBuffer())
    );

    const { base64 } = await getPlaiceholder(buffer);
    return base64;
  } catch (err) {
    err;
  }
}
