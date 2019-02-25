import Router from 'koa-router';
import Cart from '../dbs/models/cart'
import Order from '../dbs/models/order'
import md5 from 'crypto-js/md5'

let router = new Router({prefix: '/order'});

router.post('/createOrder', async ctx => {   //创建订单
  let {id, price, count} = ctx.request.body;    // 从购物车拿这些数据
  let time = Date();
  let orderID = md5(Math.random() * 1000 + time).toString();
  if (!ctx.isAuthenticated()) {   // 判断当前是否登陆
    ctx.body = {
      code: -1,
      msg: 'please login'
    }
  } else {
    let findCart = await Cart.findOne({cartNo: id});
    let order = new Order({ // 创建订单
      id: orderID,
      count,
      total: price * count,
      time,
      user: ctx.session.passport.user,
      name: findCart.detail[0].name,
      imgs: findCart.detail[0].imgs,
      status: 0  // 0是待付款状态
    });
    try {
      let result = await order.save();
      if (result) {
        await findCart.remove(); // 删除对应的购物车，因为订单已经生成了
        ctx.body = {
          code: 0,
          id: orderID  //返回orderID
        }
      } else {
        ctx.body = {
          code: -1
        }
      }
    } catch (e) {
      ctx.body = {
        code: -1
      }
    }
  }
});

router.post('/getOrders', async ctx => {
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      list: [],
      msg: 'please login'
    }
  } else {
    try {
      let result = await Order.find();  //查询所有订单
      if (result) {
        ctx.body = {
          code: 0,
          list: result
        }
      } else {
        ctx.body = {
          code: -1,
          list: []
        }
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        list: []
      }
    }
  }
});

export default router
