import { PersistencyProvider } from "./persistency-provider";
import { BUCKET_CONFIG, CLIENT_CONFIG } from "../../../configuration/s3-config";
import { asyncScheduler, Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";
import { GetObjectCommand, GetObjectCommandOutput, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

class S3PersistencyProvider implements PersistencyProvider {
    private static readonly PERSIST_INTERVAL = 5 * 60 * 1000;

    private readonly persistObjectRequestSubject: Subject<null>;
    private readonly keyName: string;
    private readonly s3Client: S3Client;

    private cached: string | null;

    constructor(keyName: string) {
        this.persistObjectRequestSubject = new Subject();
        this.keyName = keyName;
        this.s3Client = new S3Client({ region: CLIENT_CONFIG.region });

        const throttledObservable = this.persistObjectRequestSubject.pipe(
            throttleTime(S3PersistencyProvider.PERSIST_INTERVAL, asyncScheduler, { trailing: false, leading: true })
        );
        throttledObservable.subscribe(this.putObjectInBucket);

        this.cached = null;
    }

    public readonly updateOrCreate = (data: string): boolean => {
        this.cached = data;
        this.persistObjectRequestSubject.next()

        return true;
    }

    public readonly fetch = (): string => {
        if (this.cached === null) {
            throw new Error("NULL-CACHE - cache was not initialized in constuction")
        }

        return this.cached;
    }

    private readonly putObjectInBucket = async () => {
        if (this.cached === null) {
            throw new Error("NULL-CACHE - cache was uninitialized when requesting object upload to bucket");
        }

        try {
            await this.s3Client.send(new PutObjectCommand({
                Bucket: BUCKET_CONFIG.bucketName,
                Key: this.keyName,
                Body: this.cached
            }));
        } catch (error: unknown) {
            console.error(`Error was thrown when uploading object to bucket: ${error}`);
            throw error;
        };
    }

    private readonly initializeCache = async () => {
        this.cached = await this.s3Client.send(new GetObjectCommand({
            Bucket: BUCKET_CONFIG.bucketName,
            Key: this.keyName,
        })).then((value: GetObjectCommandOutput) => {
            if (!value || !value.Body) {
                console.warn(`Recieved unexpected response when requesting '${this.keyName}' from bucket ${value}.`)
                return "";
            }

            return value.Body.toString();
        }).catch((error: unknown) => {
            console.error(`Unable to read '${this.keyName}' from bucket: ${error}`);
            throw error;
        })
    }
}
