require('dotenv').config({ path: '../../.env' });
const bcrypt = require('bcrypt');

const SALT = Number(process.env.SALT);

const hashOne = bcrypt.hashSync(process.env.SEEDED_PASS_ONE, SALT);
const hashTwo = bcrypt.hashSync(process.env.SEEDED_PASS_TWO, SALT);
const hashThree = bcrypt.hashSync(process.env.SEEDED_PASS_THREE, SALT);

exports.seed = (knex) =>
  knex('users')
    .del()
    .then(() =>
      // Inserts seed entries
      knex('users').insert([
        {
          id: 0,
          username: 'Jean-Luck',
          email: 'jean-luc.picard@starfleet.com',
          password: hashOne,
          avatar_url:
            'https://upload.wikimedia.org/wikipedia/en/8/8e/Patrick_Steward_as_Jean-Luc_Picard_in_1996%27s_Star_Trek_First_Contact.jpg',
        },
        {
          id: 1,
          username: 'The_Riker',
          email: 'william.t.riker@starfleet.com',
          password: hashTwo,
          avatar_url:
            'https://upload.wikimedia.org/wikipedia/en/thumb/2/20/WilRiker.jpg/220px-WilRiker.jpg',
        },
        {
          id: 2,
          username: 'CMDR_Data',
          email: 'data.soong@starfleet.com',
          password: hashThree,
          avatar_url:
            'https://upload.wikimedia.org/wikipedia/en/thumb/0/09/DataTNG.jpg/220px-DataTNG.jpg',
        },
      ]),
    );
