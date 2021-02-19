
const CLIENT_CONFIG: S3ClientConfig = {
    region: "eu-central-1"
}

const BUCKET_CONFIG: S3BucketConfig = {
    bucketName: "gaspiseere"
}

type S3ClientConfig = {
    readonly region: string
}

type S3BucketConfig = {
    readonly bucketName: string
}

export {
    S3BucketConfig,
    S3ClientConfig,
    CLIENT_CONFIG,
    BUCKET_CONFIG
}
