const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const productRoute = require('./product.route');
const blogRoute = require('./blog.route');
const prodCategoryRoute = require('./prodCategory.route');
const blogCategoryRoute = require('./blogCategory.route');
const brandRoute = require('./brand.route');
const couponRoute = require('./coupon.route');
const colorRoute = require('./color.route');
const cartRoute = require('./cart.route');
const orderRoute = require('./order.route');

const initRoutes = (app) => {
  app.use('/api/auth', authRoute);
  app.use('/api/user', userRoute);
  app.use('/api/product', productRoute);
  app.use('/api/blog', blogRoute);
  app.use('/api/pcategory', prodCategoryRoute);
  app.use('/api/bcategory', blogCategoryRoute);
  app.use('/api/brand', brandRoute);
  app.use('/api/coupon', couponRoute);
  app.use('/api/color', colorRoute);
  app.use('/api/cart', cartRoute);
  app.use('/api/order', orderRoute);
};

module.exports = initRoutes;
