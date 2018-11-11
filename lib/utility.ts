import * as compress from 'zlib';
import { is, MimeType, Encoding, CharSet } from './index';

type Hash = { [key: string]: any };

/**
 * Merge additions into a base object, only replacing base values if the
 * additions are not null or undefined. Arrays will not be merged but will be
 * treated as values meaning additions supersede the base.
 */
export function merge<T extends object>(base: T, ...additions: any[]): T {
   return additions.reduce(
      (existing, add: Hash) => {
         //for (const key of Reflect.ownKeys(add)) {
         if (is.value<Hash>(add)) {
            for (const key of Object.keys(add)) {
               const v: any = add[key];
               const exists = is.value(existing[key]);
               if (is.value(v) || !exists) {
                  // only replace base value if addition is non-null
                  if (
                     !exists ||
                     Array.isArray(v) ||
                     typeof v != is.Type.Object ||
                     typeof existing[key] != is.Type.Object
                  ) {
                     existing[key] = v;
                  } else {
                     existing[key] = merge(existing[key], v);
                  }
               }
            }
         }
         return existing;
      },
      Object.assign({}, base) as any
   );
}

/**
 * Deep clone an object.
 */
export function clone<T extends Object | any[]>(thing: T): T {
   if (is.array(thing)) {
      return thing.map(v => clone(v)) as T;
   }
   const copy: { [key: string]: any } = {};

   for (const i in thing) {
      const value = thing[i];
      if (value != null) {
         if (is.array(value)) {
            copy[i] = value.map(v => clone(v));
         } else if (typeof value == is.Type.Object) {
            copy[i] = clone(value);
         } else {
            copy[i] = value;
         }
      } else {
         copy[i] = null;
      }
   }
   return copy as T;
}

/**
 * GZip compress a string.
 */
export function gzip(text: string) {
   return new Promise<Buffer>((resolve, reject) => {
      compress.gzip(Buffer.from(text), (err, buffer) => {
         if (is.value(err)) {
            reject(err);
         } else {
            resolve(buffer);
         }
      });
   });
}

/**
 * GZip decompress a string.
 */
export function unzip(value: Buffer): Promise<string> {
   return new Promise<string>((resolve, reject) => {
      compress.unzip(value, (err, buffer) => {
         if (is.value(err)) {
            reject(err);
         } else {
            resolve(buffer.toString(Encoding.UTF8));
         }
      });
   });
}

/**
 * Only handling the very simple cases of strings and Buffers.
 *
 * @see https://stackoverflow.com/questions/1248302/how-to-get-the-size-of-a-javascript-object
 */
export function byteSize(obj: any): number {
   if (typeof obj === is.Type.String) {
      return obj.length;
   }
   if (obj instanceof Buffer) {
      return obj.length;
   }
   return -1;
}

/**
 * Coordinates for a mouse click or a touch depending on the event.
 */
export function eventCoord(
   e: MouseEvent | TouchEvent
): { x: number; y: number } {
   if (e) {
      if (e instanceof TouchEvent) {
         if (e.changedTouches && e.changedTouches.length > 0) {
            const touch = e.changedTouches[0];
            return { x: touch.clientX, y: touch.clientY };
         }
      } else if (e.pageX !== undefined) {
         return { x: e.pageX, y: e.pageY };
      }
   }
   return { x: 0, y: 0 };
}

/**
 * Generate random letter/number sequence.
 */
export function randomID(size: number = 7): string {
   const chars: string[] = [];
   const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const length = possible.length;

   for (let i = 0; i < size; i++) {
      chars.push(possible.charAt(Math.floor(Math.random() * length)));
   }
   return chars.join('');
}

/**
 * Infer MIME type from file extension.
 */
export function inferMimeType(fileName: string): MimeType | null {
   if (!fileName.includes('.')) {
      return null;
   }
   const parts = fileName.split('.');
   const ext = parts[parts.length - 1].toLowerCase();

   switch (ext) {
      case 'png':
         return MimeType.PNG;
      case 'jpg':
      case 'jpeg':
         return MimeType.JPEG;
      case 'txt':
      case 'text':
         return MimeType.Text;
      case 'xml':
         return MimeType.XML;
      case 'gpx':
         return MimeType.GPX;
      case 'zip':
         return MimeType.Zip;
      case 'htm':
      case 'html':
         return MimeType.HTML;
      case 'json':
         return MimeType.JSON;
      case 'pdf':
         return MimeType.PDF;
      case 'gif':
         return MimeType.GIF;
      case 'css':
         return MimeType.CSS;
      case 'svg':
         return MimeType.SVG;
      case 'rss':
         return MimeType.RSS;
      case 'atom':
         return MimeType.Atom;
      default:
         return null;
   }
}

export const addCharSet = (
   type: MimeType,
   charSet: CharSet = CharSet.UTF8
): string => `${type}; charset=${charSet}`;

/**
 * Return environment value. If the key doesn't exist then return the alternate
 * value. If no alternate is given for a missing key then throw an error.
 */
export function env(key: string, alternate?: string): string {
   if (!is.value(process)) {
      throw new Error(
         'Environment variables are not accessible in this context'
      );
   }
   const value = process.env[key];
   if (value === undefined) {
      if (alternate !== undefined) {
         return alternate;
      }
      throw new Error(`Environment value ${key} does not exist`);
   }
   return value;
}
