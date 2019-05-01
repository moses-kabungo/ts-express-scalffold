import axios from 'axios';
import * as moxios from 'moxios';

let axiosInstance: any;
let baseURL: string;

beforeEach(() => {

    baseURL = `http://127.0.0.1:${process.env.PORT}`;

    axiosInstance = axios.create({
        baseURL
    });
    moxios.install(axiosInstance);
});

afterEach(() => {
    moxios.uninstall(axiosInstance);
});

test('it should return a greeting', async () => {
    moxios.stubRequest(baseURL + '/hello', {
        status: 200,
        responseText: 'Hello World!'
    });
    const promise = axiosInstance.get('/hello').then((res: any) => res.data);
    await expect(promise).resolves.toBe("Hello World!");
});