
class CacheDriver {

    _cache: { [id: string]: any } = {}

    put(key: string, value: any) {
        this._cache[key] = value;
    }

    get(key: string) {
        return this._cache[key];
    }

    remove(key: string) {
        delete this._cache[key];
    }
}

export default CacheDriver
