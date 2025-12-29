module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define(
    "Todo",
    {
      todo_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      due_date: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "todos",
      timestamps: true,
    }
  );

  return Todo;
};
