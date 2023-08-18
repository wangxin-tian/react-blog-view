import dayjs, { Dayjs } from 'dayjs';
import { ArrayBuffer } from 'spark-md5';

type DEBANCE_OR_THROTTLE = <A extends (...argu: any) => any> (
    type: 'D' | 'T',
    callBack: A,
    time?: number
) => (this: any, ...argu: Parameters<A>) => any;

/* 节流防抖 */
export const dot: DEBANCE_OR_THROTTLE = (
    type,
    callBack,
    time = 1000 / 60
) => {
    if (type === 'D') {
        let timeOut: NodeJS.Timeout;
        return function (...argu) {
            timeOut && clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                window.requestAnimationFrame(() => { //window.requestAnimationFrame()则是推迟到浏览器下一次重绘时就执行回调
                    callBack.apply(this, argu);
                });
            }, time);
        }
    } else if (type === 'T') {
        let timeOut: NodeJS.Timeout;
        return function (...argu) {
            !timeOut && (timeOut = setTimeout(() => {
                window.requestAnimationFrame(() => {
                    callBack.apply(this, argu);
                })
            }, time));
        }
    } else {
        console.error("tools: function dot expected 'type'");
        return () => { }
    }
}

/* 1. 先将base64转换为blob */
// base64地址转Blob对象，blob也可以直接接收字节数组
export const dataURLtoBlob = (dataStr: string) => {
    let arr = dataStr.split(','),
        mime = arr[0].match(/:(.*?);/)![1], // 使用 ! 操作符可以忽略 null 和 undefined，这里确保结构不会是 null 和 undefined
        bstr = atob(arr[1]), // 对经过 base-64 编码的字符串进行解码
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
};
/* 2. Blob转file */
export const blobToFile = (theBlob: Blob, fileName: string = 'file') => {
    return new File([theBlob], fileName, {
        type: theBlob.type,
        lastModified: Date.now(),
    });
};

/* 获取后缀名 */
export const getSuffix = (fileName: string) => {
    return fileName.substring(fileName.lastIndexOf('.') + 1);
}

export const articleDateInit = <
    A extends {
        createTime: string | Dayjs,
        modiTime: string | Dayjs,
    }
>(origin: A) => {
    origin.createTime = dayjs(origin.createTime);
    origin.modiTime = dayjs(origin.modiTime);
    return origin;
}

interface ChangeBufferResolve {
    buffer: globalThis.ArrayBuffer,
    hash: string,
    suffix: string,
    filename: string
}

/* 生成md5的 */
export const changeBuffer = (file: File) => {
    return new Promise<ChangeBufferResolve>((resolve, reject) => {
        const fr = new FileReader();
        if (file) {
            fr.readAsArrayBuffer(file);
            fr.onload = (ev) => {
                const buffer = ev.target!.result;
                if (!buffer || typeof buffer === 'string') return reject();
                const spark = new ArrayBuffer();
                spark.append(buffer);
                const hash = spark.end();
                const suffix = getSuffix(file.name);
                return resolve({ buffer, hash, suffix, filename: `${hash}.${suffix}` });
            };
        }
    });
}