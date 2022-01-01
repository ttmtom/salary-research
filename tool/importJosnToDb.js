/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.argv[3] || 'localhost',
    port: process.argv[4] || 5432,
    user: 'postgres',
    password: 'password',
    database: 'workspace',
  },
});

const convertAddresStrToArr = (str) => {
  const arr = str
    .split(/([^A-Za-z. ])/)
    .filter((text) => !text.match(/([,/])/));
  return arr;
};

const convertExperienceStrToEnum = (str) => {
  let handledStr = str.replace(/ /g, '').match(/[0-9-]+/)[0];
  if (handledStr === '1') {
    return '0-1';
  }
  if (handledStr === '41') {
    return '41-';
  }
  return handledStr;
};

const convertAgeStrToEnum = (str) => {
  let handledStr = str.replace(/ /g, '').match(/[0-9-]+/)[0];
  if (handledStr === '18') {
    return '0-18';
  }
  if (handledStr === '65') {
    return '65-';
  }
  return handledStr;
};

const convertSalaryStrToNum = (str) => {
  // remove all space and , mark
  let handledStr = str.replace(/ /g, '').replace(/,/g, '');

  // if str use k/K to represent 1000
  if (handledStr.match(/([0-9]+[kK])/)) {
    handledStr = handledStr.replace(/[kK]/, '000');
  }

  // get all number in string and return the large number as salary
  const numReg = /[0-9.]+/g;
  const numArr = [...handledStr.matchAll(numReg)];

  return Math.max(numArr.map((match) => parseFloat(match[0])));
};

const insertToTable = async (dbName, row) => {
  const dbObj = await knex(dbName).insert(row).returning('*');
  return dbObj[0];
};

const getOrCreate = async (dbName, name) => {
  if (!name || name === '') {
    return;
  }
  const dbData = await knex(dbName).select('id').where('name', name);

  if (dbData.length === 0) {
    const insertData = await knex(dbName).insert({ name }).returning('*');
    return insertData[0];
  } else {
    return dbData[0];
  }
};

const loadDataToDb = async () => {
  const filePath = process.argv[2];
  const data = fs.readFileSync(filePath, 'utf8');
  const importJson = JSON.parse(data);

  for (let i = 0; i < importJson.length; i++) {
    console.log(`---- insert ${i} row ----`);
    const [
      timestamp,
      ageGroup,
      industry,
      title,
      salary,
      curreny,
      address,
      experience,
      additional,
      other,
    ] = Object.values(importJson[i]);

    const [city, state, country] = convertAddresStrToArr(address);
    const dbCountry = country ? await getOrCreate('country', country) : null;
    const dbState = state ? await getOrCreate('state', state) : null;
    const dbCity = city ? await getOrCreate('city', city) : null;
    const dbAddress = await insertToTable('address', {
      cityId: dbCity ? dbCity.id : null,
      stateId: dbState ? dbState.id : null,
      countryId: dbCountry ? dbCountry.id : null,
    });
    const ageEnum = convertAgeStrToEnum(ageGroup);
    const dbRespondentInfo = await insertToTable('respondent_info', {
      ageGroup: ageEnum,
      addressId: dbAddress.id,
    });

    const dbIndustry = industry
      ? await getOrCreate('industry', industry)
      : null;
    const dbTitle = title ? await getOrCreate('title', title) : null;
    const salaryNum = convertSalaryStrToNum(salary);
    const dbSalary = await insertToTable('salary', {
      amount: salaryNum,
      curreny,
    });
    const experienceGroup = convertExperienceStrToEnum(experience);
    const dbCareerInfo = await insertToTable('career_info', {
      experienceGroup,
      additional,
      industryId: dbIndustry ? dbIndustry.id : null,
      titleId: dbTitle ? dbTitle.id : null,
      salaryId: dbSalary.id,
    });

    await insertToTable('survey', {
      timestamp,
      other,
      respondentInfoId: dbRespondentInfo.id,
      careerInfoId: dbCareerInfo.id,
    });
    console.log(`---- insert ${i} row done ----`);
    if (i === importJson.length - 1) {
      knex.destroy();
    }
  }
};

try {
  loadDataToDb();
} catch (err) {
  knex.destroy();
}
