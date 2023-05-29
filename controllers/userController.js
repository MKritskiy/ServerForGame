const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { User, Level } = require("../models/models");

/**
 * Description placeholder
 * @date 5/24/2023 - 1:49:27 AM
 *
 * @param {*} id
 * @param {*} name
 * @returns {*}
 */
const generateJwt = (id, name) => {
  return jwt.sign({ id, name }, process.env.SECRET_KEY, { expiresIn: "24h" });
};

/**
 * @class
 */
class UserController {
  /**
   * Description placeholder
   * @date 5/24/2023 - 1:49:27 AM
   *
   * @async
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {unknown}
   */
  async registration(req, res, next) {
    const { name, password } = req.body;
    if (!name || !password) {
      return next(ApiError.badRequest("Некорректный name или password"));
    }
    const candidate = await User.findOne({
      where: { name },
    });
    if (candidate) {
      return next(
        ApiError.badRequest("Пользователь с таким name уже существует")
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ name: name, password: hashPassword });
    const level = await Level.create({ userId: user.id });
    let levelId = level.id;
    const token = generateJwt(user.id, user.name);
    return res.json({ token, user, level: { id: levelId } });
  }

  /**
   * Description placeholder
   * @date 5/24/2023 - 1:49:27 AM
   *
   * @async
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {unknown}
   */
  async login(req, res, next) {
    const { name, password } = req.body;
    const user = await User.findOne({
      where: { name },
      include: { model: Level, attributes: ["id"] },
    });

    if (!user) {
      return next(ApiError.internal("Пользователь не найден!"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("Указан неверный пароль!"));
    }
    const token = generateJwt(user.id, user.name);
    const [level, created] = await Level.findCreateFind({
      where: { userId: user.id },
    });
    let levelId = level.id;
    return res.json({ token, user});
  }

  /**
   * Description placeholder
   * @date 5/24/2023 - 1:49:26 AM
   *
   * @async
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {unknown}
   */
  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.name);
    return res.json({ token });
  }

  /**
   * Description placeholder
   * @date 5/24/2023 - 1:49:26 AM
   *
   * @async
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {unknown}
   */
  async remove(req, res, next) {
    const { id } = req.query;
    let usersRemoved;
    let levelDelReqAdress = "http://" + req.headers.host + "/api/level/delete";
    try {
      if (id) {
        const user = await User.findByPk(id);
        const level = await Level.findOne({ where: { userId: id } });
        usersRemoved = user.destroy();
        if (level) axios.delete(levelDelReqAdress, { data: { id: level.id } });
        return res.json(usersRemoved);
      } else {
        usersRemoved = (await User.findAll()).length;
        await User.destroy({
          where: {},
        });
        axios.delete(levelDelReqAdress);
        return res.json(usersRemoved);
      }
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  /**
   * Description placeholder
   * @date 5/24/2023 - 1:49:26 AM
   *
   * @async
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {unknown}
   */
  async download(req, res, next) {
    let { id } = req.query;
    let user;
    try {
      if (!id) {
        user = await User.findAll({
          include: [
            {
              model: Level,
              attributes: ["id"],
            },
          ],
        });

        return res.json(user);
      }

      user = await User.findByPk(id, {
        include: [
          {
            model: Level,
            attributes: ["id"],
          },
        ],
      });
      if (!user) {
        return next(ApiError.internal("Пользователь не найден!"));
      }
      return res.json(user);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new UserController();
