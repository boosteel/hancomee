


export namespace XHR {

    export function get(url: string) {
        return new Promise<string>((o, x) => {

                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200)
                            o(xhr.responseText);
                        else x(xhr);
                    }
                }
                xhr.open('GET', url, true);
                xhr.send(null);
            }
        );
    }

}