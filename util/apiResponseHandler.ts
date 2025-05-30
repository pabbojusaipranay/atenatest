export {};
const ApiError = require('./errors');


function success(res, data, meta) {
  const response: any = { success: true, data };
  if (meta) response.meta = meta;
  return res.json(response);
}


function badRequest(message, details) {
  throw new ApiError(400, message, details);
}

module.exports = {
  success,
  badRequest,
};