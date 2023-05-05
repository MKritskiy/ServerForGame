const { Level, User } = require("../models/models");
const uuid = require("uuid");
const path = require("path");
const ApiError = require("../error/ApiError");
const { log } = require("console");
const { where } = require("sequelize");
const fs = require("fs");

class LevelController {
  async create(req, res, next) {
    try {
      const {userId} = req.body;
      const { level_address } = req.files;
      const level = await Level.findOne({
        where: { userId: userId },
      });
      if (level?.level_address){
        fs.unlinkSync(path.resolve(__dirname, "..", "static", level.level_address));
      }
      let fileName = uuid.v4() + ".json";
      level.setAttributes({level_address: fileName})
      level_address.mv(path.resolve(__dirname, "..", "static", fileName));
      level.save()
      return res.json(level);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res) {
    const { level_address } = req.body;
    const level = await Level.create({ level_address });
    return res.json(level);
  }

  async download(req, res) {
    let { id } = req.query;
    let level;
    if (!id) {
      level = await Level.findAll();
      return res.json(level);
    }
    level = await Level.findOne({ where: { id: id } });
    let fileText = await fs.readFileSync(
      path.resolve(__dirname, "..", "static", level.level_address),
      { encoding: "utf8" }
    );
    return res.json(fileText);
  }

  async delete(req, res) {
    let { id } = req.query;
    let level;
    let levelsRemoved = 0;
    let filePath = path.resolve(__dirname, "..", "static");
    if (id) {
      try {
        //удаление одного поля
        level = await Level.findOne({ where: { id } });
        filePath = path.join(filePath, level.level_address);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
            console.log(`${filePath} was deleted`);
          });
        }
        levelsRemoved = level.destroy();
        if (levelsRemoved) return res.json(levelsRemoved);
      } catch (e) {
        log(e);
        return res.json(levelsRemoved);
      }
    }
    try {
      //удаление всех полей
      fs.readdir(filePath, (err, files) => {
        if (err) throw err;
        for (const file of files) {
          fs.unlink(path.join(filePath, file), (err) => {
            if (err) throw err;
          });
        }
      });

      levelsRemoved = (await Level.findAll()).length;

      await Level.destroy({
        where: {},
        truncate: true,
      });
      return res.json(levelsRemoved);
    } catch (e) {
      log(e);
      return res.json(levelsRemoved);
    }
  }
}

module.exports = new LevelController();
