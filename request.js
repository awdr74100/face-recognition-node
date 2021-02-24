const path = require('path');
const { readFile } = require('fs').promises;
const axios = require('axios').default;

const post = {
  async register() {
    try {
      const folderPath = path.resolve(__dirname, 'photos');
      const base64Array = await Promise.all([
        readFile(`${folderPath}/img4.jpg`, { encoding: 'base64' }),
        readFile(`${folderPath}/img5.jpg`, { encoding: 'base64' }),
        readFile(`${folderPath}/img6.jpg`, { encoding: 'base64' }),
        // readFile(`${folderPath}/img7.png`, { encoding: 'base64' }),
      ]);
      const url = 'http://localhost:3000/api/register';
      const payload = { base64Array, username: '藍奕濡' };
      const { data } = await axios.post(url, payload);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  },
  async recognition() {
    try {
      const folderPath = path.resolve(__dirname, 'photos');
      const base64 = await readFile(`${folderPath}/img8.jpg`, {
        encoding: 'base64',
      });
      const url = 'http://localhost:3000/api/recognition';
      const payload = { base64 };
      const { data } = await axios.post(url, payload);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  },
};

// post.register();
post.recognition();
