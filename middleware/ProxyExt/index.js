import b from "express";
import { DataTypes as t, Sequelize as k } from "sequelize";
var A = new k("database", "user", "password", { host: "localhost", dialect: "sqlite", logging: !1, storage: "database.sqlite" }),
  n = A.define("catalog_assets", {
    package_name: { type: t.TEXT, unique: !0 },
    title: { type: t.TEXT },
    description: { type: t.TEXT },
    author: { type: t.TEXT },
    image: { type: t.TEXT },
    tags: { type: t.JSON, allowNull: !0 },
    version: { type: t.TEXT },
    background_image: { type: t.TEXT, allowNull: !0 },
    background_video: { type: t.TEXT, allowNull: !0 },
    payload: { type: t.TEXT },
    type: { type: t.TEXT },
  });
n.sync();
async function c(p, s) {
  try {
    let a = p.query,
      o = parseInt(a.page) || 1,
      r = parseInt(a.amount) || 20,
      u = await n.count(),
      m = Math.ceil(u / r),
      d = o < m;
    if (o < 1) {
      s.status(400).json({ error: "Invalid page number!" });
      return;
    }
    if (parseInt(a.amount) < 10) {
      s.status(400).json({ error: "Amount must be at least 10!" });
      return;
    }
    let y = (o - 1) * r,
      f = (await n.findAll({ offset: y, limit: 20 })).map((e) => e.get()),
      T = {
        assets: Object.fromEntries(
          f.map((e) => [
            e.package_name,
            {
              title: e.title,
              description: e.description,
              author: e.author,
              image: e.image,
              tags: e.tags,
              version: e.version,
              background_image: e.background_image,
              background_video: e.background_video,
              payload: e.payload,
              type: e.type,
            },
          ])
        ),
        page: o.toString(),
        nextPage: d,
        amount: u,
      };
    s.send(T);
  } catch (a) {
    s.status(500).json({ error: a });
  }
}
async function l(p, s) {
  try {
    let a = p.params.package,
      o = await n.findOne({ where: { package_name: a } });
    if (!o) return s.status(404).json({ error: "Package not found" });
    let r = o.toJSON();
    return delete r.id, delete r.createdAt, delete r.updatedAt, s.send(r);
  } catch (a) {
    return s.status(500).json({ error: a });
  }
}
var i = { getCatalogAssets: c, getPackage: l };
var g = b.Router();
g.get("/api/catalog_assets", i.getCatalogAssets);
g.get("/api/packages/:package", i.getPackage);
var N = g;
export { N as default };
