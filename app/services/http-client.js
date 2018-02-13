export class HttpClient {

    public get(url, cb) {
        const req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if (req.readyState === 4 && req.status === 200) {
                cb(req.responseText);
            }
        };

        req.open('GET', url, true);
        req.send(null);
    }

}
