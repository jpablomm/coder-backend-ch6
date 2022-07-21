const fs = require("fs");

class Contenedor {
  constructor(name) {
    this.name = name;
  }
  async save(item) {
    // read file
    let fileInfo = null;
    try {
      fileInfo = await fs.promises.readFile(this.name, "utf-8");
    } catch (error) {
      await fs.promises.writeFile(this.name, "[]");
      fileInfo = await fs.promises.readFile(this.name, "utf-8");
    }

    // parse to JavaScript object
    const fileObject = await JSON.parse(fileInfo);
    let last_id = 0;

    // get the highest id
    if (fileObject.length > 0) {
      for (let index = 0; index < fileObject.length; index++) {
        if (fileObject[index].id > last_id) {
          last_id = fileObject[index].id;
        }
      }
    }

    // add new item
    const newItem = {
      id: last_id + 1,
      title: item.title,
      price: item.price,
      thumbnail: item.thumbnail,
    };

    fileObject.push(newItem);

    await fs.promises.writeFile(this.name, JSON.stringify(fileObject));

    return newItem.id;
  }
  async getById(id) {
    // read file
    let fileInfo = null;
    try {
      fileInfo = await fs.promises.readFile(this.name, "utf-8");
    } catch (error) {
      console.log("There are no items in this file yet! Please add one.");
      console.log(error);
      return;
    }

    // parse to JavaScript object
    const fileObject = await JSON.parse(fileInfo);

    // find item with ID
    let result = fileObject.filter((item) => id == item.id);

    // print result
    console.log(result);

    return result;
  }

  async getAll() {
    // read file
    let fileInfo = null;
    try {
      fileInfo = await fs.promises.readFile(this.name, "utf-8");
    } catch (error) {
      console.log("There are no files with that name yet.");
      console.log(error);
      return;
    }

    // parse to JavaScript object
    const fileObject = await JSON.parse(fileInfo);

    // print result
    // console.log(fileObject);

    return fileObject;
  }
  async deleteById(id) {
    // read file
    let fileInfo = null;
    try {
      fileInfo = await fs.promises.readFile(this.name, "utf-8");
    } catch (error) {
      console.log("There are no files with that name yet.");
      console.log(error);
      return;
    }

    // parse to JavaScript object
    const fileObject = await JSON.parse(fileInfo);

    // create new array with item with specified ID excluded
    let result = fileObject.filter((item) => id != item.id);

    // rewrite result
    await fs.promises.writeFile(this.name, JSON.stringify(result));

    // print result
    console.log(result);
    return;
  }
  async deleteAll() {
    await fs.promises.writeFile(this.name, "[]");
  }

  async updateById(id, newItem) {
    // read file
    let fileInfo = null;
    try {
      fileInfo = await fs.promises.readFile(this.name, "utf-8");
    } catch (error) {
      console.log("There are no files with that name yet.");
      console.log(error);
      return;
    }

    // parse to JavaScript object
    const fileObject = await JSON.parse(fileInfo);

    // create new array with item with specified ID replaced
    let result = [];
    fileObject.map((item) => {
      if (item.id == id) {
        result.push({
          id: id,
          title: newItem.title,
          price: parseFloat(newItem.price),
          thumbnail: newItem.thumbnail,
        });
      } else {
        result.push(item);
      }
    });

    // rewrite result
    await fs.promises.writeFile(this.name, JSON.stringify(result));

    // print result
    console.log(result);
    return;
  }
}

// module.exports = Contenedor;

const mockData = [
  {
    title: "pelota de futbol",
    price: 80,
    thumbnail: "http://futbol.com",
  },
  {
    title: "pelota de basketball",
    price: 95,
    thumbnail: "http://basket.com",
  },
  {
    title: "pelota de tenis",
    price: 190,
    thumbnail: "http://tenis.com",
  },
];

function initializeFile() {
  try {
    fs.unlink("data.txt", (err) => {
      if (err) {
        console.log("data.txt didn't exist so it was created");
      } else {
        console.log("data.txt file removed and recreated");
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function uploadData(container, data) {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    await container.save(item);
  }
}

exports.contenedor = Contenedor;
exports.mockData = mockData;
exports.initializeFile = initializeFile;
exports.uploadData = uploadData;
