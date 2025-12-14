const config = {
  port: process.env.PORT || 3000,
  apiVersion: 'v1',
  get basePath() {
    return `/api/${this.apiVersion}`;
  },
  dataPath: '../data/mockData.json'
};

config.basePath = `/api/${config.apiVersion}`;

module.exports = config;