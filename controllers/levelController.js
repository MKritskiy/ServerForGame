const { Level, User } = require("../models/models");
const uuid = require("uuid");
const path = require("path");
const ApiError = require("../error/ApiError");
const { log } = require("console");
const { where } = require("sequelize");
const fs = require("fs");
const { Sequelize, Op } = require("sequelize");

class LevelController {
  async create(req, res, next) {
    try {
      const { userId } = req.body;
      const { level_address } = req.body;
      const [level, created] = await Level.findCreateFind({
        where: { userId: userId },
      });
      let filePath;
      if (!level.level_address) {
        let fileName = uuid.v4() + ".json";
        level.setAttributes({ level_address: fileName });
        filePath = path.resolve(__dirname, "..", "static", fileName);
      } else {
         filePath = path.resolve(__dirname, "..", "static", level.level_address);
      }
      fs.writeFileSync(filePath, level_address, {flag:"w"});
      level.save();
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

  async download(req, res, next) {
    let { id } = req.query;
    let level;
    try {
        if (!id) {
            level = await Level.findAll();
            return res.json(level);
        }
    level = await Level.findByPk(id);
    if (!level){
        return next(ApiError.internal("Уровень не найден!"));
    }
    let fileText = await fs.readFileSync(
      path.resolve(__dirname, "..", "static", level.level_address),
      { encoding: "utf8" }
    );
    return res.json(fileText);
    } catch(e) {
        next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res) {
    let { id } = req.body;
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

  async random(req, res, next) {
    const { userId } = req.query;
    try {
      const randomLevel = await Level.findOne({
        // Подзапрос для выбора случайного пользовател��, различного от текущего
        where: {
          userId: { [Op.ne]: userId },
          level_address: { [Op.ne]: userId },
        },
        include: [
          {
            model: User,
            attributes: {exclude: ['password', 'createdAt','updatedAt']},
          },
        ],
        order: Sequelize.literal("rand()"),
        limit: 1,
        attributes: {exclude: ['createdAt','updatedAt']}
      });
      if (!randomLevel || !randomLevel.user) {
        return next(ApiError.internal("Уровня не существует не найден!"));
      }
      let fileText = await fs.readFileSync(
        path.resolve(__dirname, "..", "static", randomLevel.level_address),
        { encoding: "utf8" }
      );
      const result = {level: {id: randomLevel.id, level_content: fileText}, user: randomLevel.user}
      return res.json(result)
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new LevelController();
