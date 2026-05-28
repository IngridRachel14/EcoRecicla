export const s3 = new Bun.S3Client({
  region: process.env.AWS_REGION!,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  bucket: process.env.AWS_S3_BUCKET_NAME,
});

export async function getSignedUrlForObject(key: string) {
  return s3.presign(key, {expiresIn: 3600,});
}

export function generateSignedCloudFrontUrl(objectPath: string): string {
  return `${process.env.BASE_URL}/${objectPath}`;
}

