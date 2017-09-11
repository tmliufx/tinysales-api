import Sequelize from 'sequelize';
import sequelize from '../lib/sequelize';

const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    account: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    unit: {
        type: Sequelize.STRING
    },
    prop: {
        type: Sequelize.STRING
    },
    attr: {
        type: Sequelize.STRING
    }
});

export default User;
