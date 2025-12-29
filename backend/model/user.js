module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    authType: {
      type: DataTypes.STRING,
      defaultValue: "local",
    },
    passwordSet: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    github_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebook_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },




  });

  return User;
};
