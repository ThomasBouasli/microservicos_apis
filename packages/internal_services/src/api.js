const axios = require("axios");

const clientSupportAPI = axios.create({
  baseURL: `http://client_support:${
    process.env.CLIENT_SUPPORT_PORT ?? process.env.PORT
  }`,
});

const personalDepartmentAPI = axios.create({
  baseURL: `http://personal_department:${
    process.env.PERSONAL_DEPARTMENT_PORT ?? process.env.PORT
  }`,
});

const internalServicesAPI = axios.create({
  baseURL: `http://internal_services:${
    process.env.INTERNAL_SERVICES_PORT ?? process.env.PORT
  }`,
});

module.exports = {
  clientSupportAPI,
  personalDepartmentAPI,
  internalServicesAPI,
};
