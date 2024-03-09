const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const portalLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const cookies = req.cookies;

  const user = await authService.loginUserWithEmailAndPasswordPortal(email, password);
  if(!user){
    res.status(httpStatus.UNAUTHORIZED).json({message:'Incorrect email or password'})
    return;
  }
  const tokens = await tokenService.generateAuthTokens(user);
  var newRefreshToken =tokens?.refresh?.token 

  // Detect RT Re use in here
  // To prevent RT reuse
  if (cookies?.jwt) {

    const refreshToken = cookies.jwt;
    // const foundToken = await User.findOne({ refreshToken }).exec();

    // // Detected refresh token reuse!
    // if (!foundToken) {
    //     // clear out ALL previous refresh tokens
    //     newRefreshTokenArray = [];
    // }

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  }

  // Creates Secure Cookie with refresh token
  res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });  
  
  res.send({ user, tokens });
});
const login = catchAsync(async (req, res) => {
  const { email, password,client_code,branch_id } = req.body;

  const cookies = req.cookies;

  const user = await authService.loginUserWithEmailAndPassword(email, password,client_code,branch_id);
  if(!user){
    res.status(httpStatus.UNAUTHORIZED).json({message:'Incorrect email or password'})
    return;
  }
  const tokens = await tokenService.generateAuthTokens(user);
  var newRefreshToken =tokens?.refresh?.token 

  // Detect RT Re use in here
  // To prevent RT reuse
  if (cookies?.jwt) {

    const refreshToken = cookies.jwt;
    // const foundToken = await User.findOne({ refreshToken }).exec();

    // // Detected refresh token reuse!
    // if (!foundToken) {
    //     // clear out ALL previous refresh tokens
    //     newRefreshTokenArray = [];
    // }

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  }

  let options = {
    maxAge: 1000 * 60 * 15, // would expire after 15 minutes
    httpOnly: true, // The cookie only accessible by the web server
    signed: true // Indicates if the cookie should be signed
}

// Set cookie
  res.cookie('client_code', client_code);  
  res.cookie('branch_id', branch_id);  
  // Creates Secure Cookie with refresh token
  res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });  
  
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  const logoutRes = await authService.logout(req.body.refreshToken);
  if(!logoutRes){
    res.status(httpStatus.NOT_FOUND).json({message:'Not found'})
    return;
  }
  res.clearCookie('client_code', { httpOnly: true, sameSite: 'None', secure: true });
  res.clearCookie('branch_id', { httpOnly: true, sameSite: 'None', secure: true });
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const validateToken = catchAsync(async (req, res) => {
  // const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({message:"Token Valid"});
});
const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  validateToken,
  portalLogin,
  login
};
