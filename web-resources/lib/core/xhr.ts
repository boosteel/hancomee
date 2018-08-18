


export namespace XHR {

    export function get(url: string) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
    }

}