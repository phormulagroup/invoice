var db = require("./database");
var util = require("util");

module.exports = {
  uploadFile: function (file, type) {
    return new Promise(async (resolve, reject) => {
      let sampleFile = null;
      if (file) {
        db.getConnection(async (error, conn) => {
          if (error) throw error;
          try {
            let file_name = null;
            sampleFile = file;
            sampleFile.name = sampleFile.name.replace(" ", "_");

            let query_get = `SELECT * FROM media WHERE name LIKE '%${sampleFile.name.split(".")[0]}%'`;
            const query = util.promisify(conn.query).bind(conn);
            const queryResult = await query(query_get);

            if (queryResult.length === 0) {
              file_name = sampleFile.name;
            } else {
              file_name = `${sampleFile.name.split(".")[0]}-${queryResult.length}.${sampleFile.name.split(".")[1]}`;
            }

            await query("INSERT INTO media (name, type) VALUES (?, ?)", [file_name, type ? type : "multimedia"]);

            uploadPath = `./media/${file_name}`;
            sampleFile.mv(uploadPath, async (err) => {
              if (err) throw err;
              conn.release();
              resolve(file_name);
            });
          } catch (e) {
            throw e;
          }
        });
      } else {
        resolve(null);
      }
    });
  },
};
