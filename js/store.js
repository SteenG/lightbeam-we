const store = {
  _websites: null,

  init() {
    this._read();
  },

  async _read() {
    const data = await browser.storage.local.get('websites');
    this._websites = clone(data.websites);

    return this._websites;
  },

  async _write(websites) {
    this._websites = clone(websites);

    return await browser.storage.local.set({ websites });
  },

  async getAll() {
    return await this._read();
  },

  async getFirstParty(hostname) {
    if (!hostname) {
      throw new Error('getFirstParty requires a valid hostname argument');
    }

    const storage = await this.getAll();
    return storage.websites[hostname];
  },

  async getThirdParties(hostname) {
    if (!hostname) {
      throw new Error('getThirdParties requires a valid hostname argument');
    }

    const firstParty = await this.getFirstParty(hostname);
    if ('thirdPartyRequests' in firstParty) {
      return firstParty.thirdPartyRequests;
    }

    return null;
  },

  async setFirstParty(hostname, data) {
    if (!hostname) {
      throw new Error('setFirstParty requires a valid domain argument');
    }

    const websites = await this._read();
    websites[hostname] = data;
    this._write(websites);
  },

  async setThirdParty(origin, target, data) {
    if (!origin) {
      throw new Error('setThirdParty requires a valid parent argument');
    }

    const websites = await this._read();
    const firstParty = websites[origin];

    if (!firstParty) {
      throw new Error('There is no firstParty matching the parent');
    }

    if (!('thirdPartyRequests' in firstParty)) {
      firstParty['thirdPartyRequests'] = {};
    }
    firstParty['thirdPartyRequests'][target] = data;

    this.setFirstParty(origin, firstParty);
  },

  async remove() {
    return await browser.storage.local.remove('websites');
  }
};

// @todo move this function to utils
function clone(obj) {
  return Object.assign({}, obj);
}

store.init();
