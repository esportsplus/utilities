import { describe, expect, it, vi } from 'vitest';

import request from '~/request';


function mockResponse(body: unknown, contentType = 'application/json') {
    return {
        json: vi.fn().mockResolvedValue(body),
        text: vi.fn().mockResolvedValue(typeof body === 'string' ? body : JSON.stringify(body)),
    };
}


describe('request', () => {

    describe('GET', () => {

        it('should set default cache, headers, method, and redirect', async () => {
            let response = mockResponse({ ok: true });

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

            await request('https://example.com/api');

            expect(fetch).toHaveBeenCalledWith('https://example.com/api', expect.objectContaining({
                cache: 'no-cache',
                headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
                method: 'GET',
                redirect: 'follow',
            }));

            vi.restoreAllMocks();
        });

        it('should call r.json() when content-type is application/json', async () => {
            let body = { data: 'value' },
                response = mockResponse(body);

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

            let result = await request('https://example.com/api');

            expect(response.json).toHaveBeenCalled();
            expect(response.text).not.toHaveBeenCalled();
            expect(result).toEqual(body);

            vi.restoreAllMocks();
        });

        it('should call r.text() when content-type is not application/json', async () => {
            let response = mockResponse('plain text');

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

            let result = await request('https://example.com/api', {
                headers: { 'Content-Type': 'text/plain' },
            });

            expect(response.text).toHaveBeenCalled();
            expect(response.json).not.toHaveBeenCalled();
            expect(result).toBe('plain text');

            vi.restoreAllMocks();
        });

    });


    describe('POST', () => {

        it('should JSON.stringify object body and set cors + no-referrer', async () => {
            let body = { key: 'value' },
                response = mockResponse({ success: true });

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

            await request('https://example.com/api', {
                body,
                method: 'POST',
            });

            expect(fetch).toHaveBeenCalledWith('https://example.com/api', expect.objectContaining({
                body: JSON.stringify(body),
                method: 'POST',
                mode: 'cors',
                referrerPolicy: 'no-referrer',
            }));

            vi.restoreAllMocks();
        });

        it('should pass string body through unchanged', async () => {
            let body = 'raw string body',
                response = mockResponse({ success: true });

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

            await request('https://example.com/api', {
                body,
                method: 'POST',
            });

            expect(fetch).toHaveBeenCalledWith('https://example.com/api', expect.objectContaining({
                body: 'raw string body',
            }));

            vi.restoreAllMocks();
        });

    });


    describe('PUT, PATCH, DELETE', () => {

        it('should JSON.stringify object body and set cors + no-referrer for PUT', async () => {
            let body = { action: 'update' },
                response = mockResponse({ updated: true });

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

            await request('https://example.com/api', {
                body,
                method: 'PUT',
            });

            expect(fetch).toHaveBeenCalledWith('https://example.com/api', expect.objectContaining({
                body: JSON.stringify(body),
                method: 'PUT',
                mode: 'cors',
                referrerPolicy: 'no-referrer',
            }));

            vi.restoreAllMocks();
        });

        it('should JSON.stringify object body and set cors + no-referrer for PATCH', async () => {
            let body = { field: 'patched' },
                response = mockResponse({ patched: true });

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

            await request('https://example.com/api', {
                body,
                method: 'PATCH',
            });

            expect(fetch).toHaveBeenCalledWith('https://example.com/api', expect.objectContaining({
                body: JSON.stringify(body),
                method: 'PATCH',
                mode: 'cors',
                referrerPolicy: 'no-referrer',
            }));

            vi.restoreAllMocks();
        });

        it('should JSON.stringify object body and set cors + no-referrer for DELETE', async () => {
            let body = { id: 42 },
                response = mockResponse({ deleted: true });

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

            await request('https://example.com/api', {
                body,
                method: 'DELETE',
            });

            expect(fetch).toHaveBeenCalledWith('https://example.com/api', expect.objectContaining({
                body: JSON.stringify(body),
                method: 'DELETE',
                mode: 'cors',
                referrerPolicy: 'no-referrer',
            }));

            vi.restoreAllMocks();
        });

    });


    describe('search params', () => {

        it('should append search params to URL', async () => {
            let response = mockResponse({ ok: true });

            vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

            await request('https://example.com/api', {
                search: { bar: 'baz', foo: '1' },
            });

            let calledUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;

            expect(calledUrl).toContain('foo=1');
            expect(calledUrl).toContain('bar=baz');

            vi.restoreAllMocks();
        });

    });


    describe('request.url', () => {

        it('should append search params to URL', () => {
            let result = request.url('https://example.com/path', { key: 'value' });

            expect(result).toBe('https://example.com/path?key=value');
        });

        it('should replace existing search params', () => {
            let result = request.url('https://example.com/path?old=param', { new: 'param' });

            expect(result).toBe('https://example.com/path?new=param');
        });

        it('should clear search when no search param provided', () => {
            let result = request.url('https://example.com/path?old=param');

            expect(result).toBe('https://example.com/path');
        });

        it('should clear search when empty object provided', () => {
            let result = request.url('https://example.com/path?old=param', {});

            expect(result).toBe('https://example.com/path');
        });

    });

});
