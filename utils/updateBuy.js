// let buyData = [
//   { id: "1", quantity: 50, price: 5, user: "1", createdAt: "1" },
//   { id: "2", quantity: 15, price: 10, user: "2", createdAt: "2" },
//   { id: "3", quantity: 30, price: 12, user: "3", createdAt: "3" },
//   { id: "4", quantity: 40, price: 3, user: "4", createdAt: "4" },
//   { id: "5", quantity: 20, price: 6, user: "5", createdAt: "5" },
// ];

// let sellData = [
//   { id: "1", quantity: 10, price: 1, user: "1", createdAt: "1" },
//   { id: "2", quantity: 20, price: 2, user: "2", createdAt: "2" },
//   { id: "3", quantity: 20, price: 5, user: "3", createdAt: "3" },
//   { id: "4", quantity: 10, price: 7, user: "4", createdAt: "4" },
//   { id: "5", quantity: 30, price: 3, user: "5", createdAt: "5" },
// ];
const update = (buyData, sellData) => {
  buyData = buyData.sort((a, b) => b.price - a.price);
  sellData = sellData.sort((a, b) => a.price - b.price);
  buyData = buyData.map((i) => ({ ...i, int_qua: i.quantity }));
  sellData = sellData.map((i) => ({ ...i, int_qua: i.quantity }));
  console.log("Start it:");
  console.log(buyData, sellData);
  let bg = [];
  buyData.forEach((o, i) => {
    for (let j = 0; j < o.quantity; j++) {
      bg.push(o.price);
    }
  });
  let sg = [];
  sellData.forEach((o, i) => {
    for (let j = 0; j < o.quantity; j++) {
      sg.push(o.price);
    }
  });
  let pos = -1;
  for (let i = 0; i < sg.length && i < bg.length; i++) {
    if (sg[i] >= bg[i]) {
      pos = i;
      break;
    }
  }
  let pt_max = -1;
  for (let i = pos - 1; i >= 0; i--) {
    if (bg[pos] <= bg[i]) {
      pt_max = bg[i];
      break;
    }
  }
  let pt_min = -1;
  let pt_temp = sg[pos];
  for (let i = pos - 1; i >= 0; i--) {
    if (pt_temp > sg[i] && pt_temp !== sg[pos]) {
      pt_min = sg[i];
      break;
    }
    if (pt_temp > sg[i]) {
      pt_temp = sg[i];
    }
  }
  let upBuy = buyData.filter((i) => i.price > bg[pos]);
  let upSell = sellData.filter((i) => i.price < sg[pos]);
  // console.log(upBuy, upSell);
  const dp = 0.5;
  let vt = 0;
  upSell.map((i) => (vt += i.price));
  let at = 0;
  upBuy.map((i) => (at += i.price));
  let at_q = 0;
  upBuy.map((i) => (at_q += i.quantity));
  let theta = 0.05; //at / at_q;
  let asws_max = -1;
  let p_opt = -1;
  for (let p = pt_max; p >= pt_min; p -= dp) {
    let asws = (p - vt / upSell.length) * ((at / upBuy.length - p) / theta);
    if (asws_max < asws) {
      asws_max = asws;
      p_opt = p;
    }
  }
  let upBuy_opt_q = upBuy.map((i) => {
    let temp = (i.price - p_opt) / theta;
    return temp > i.quantity
      ? { ...i, opt_quantity: i.quantity }
      : { ...i, opt_quantity: temp };
  });
  // console.log(upBuy_opt_q, upSell);
  let tot_q = 0;
  upBuy_opt_q.map((i) => (tot_q += i.opt_quantity));
  let tot_q_sell = 0;
  upSell.map((i) => (tot_q_sell += i.quantity));
  let remSell = [];
  let remBuy = [];
  let remBuy_opt = [];
  let remSell_opt = [];
  if (tot_q_sell >= tot_q) {
    let tSell = upSell.sort((a, b) => a.createdAt - b.createdAt);
    let tSellId = [];
    tSell = tSell.map((i) => {
      if (tot_q > 0) {
        if (i.quantity > tot_q) {
          i.quantity -= tot_q;
          tot_q = 0;
        } else {
          tot_q -= i.quantity;
          i.quantity = 0;
        }
      }
      tSellId.push(i._id);
      return i;
    });
    remSell = sellData.filter((i) => {
      console.log(!tSellId.includes(i._id));
      return !tSellId.includes(i._id);
    });
    console.log("remSell", remSell, "sellData", sellData, "upSell", upSell);
    remSell_opt = remSell.map((i) => {
      return { ...i, isIn: false };
    });
    remSell_opt = [...remSell_opt, ...tSell.map((i) => ({ ...i, isIn: true }))];
    remSell = [...remSell, ...tSell];
    remSell = remSell.filter((i) => i.quantity > 0);
    // console.log("remSell_opt:", remSell_opt, "remSell", remSell);
    let remBuyId = [];
    upBuy_opt_q = upBuy_opt_q.map((i) => {
      remBuyId.push(i._id);
      remBuy_opt.push({
        ...i,
        quantity: i.quantity > i.opt_quantity ? i.quantity - i.opt_quantity : 0,
        isIn: true,
      });
      let { opt_quantity, ...rest } = i;
      return {
        ...rest,
        quantity: i.quantity > i.opt_quantity ? i.quantity - i.opt_quantity : 0,
      };
    });
    remBuy = buyData.filter((i) => !remBuyId.includes(i._id));
    remBuy_opt = [...remBuy_opt, ...remBuy.map((i) => ({ ...i, isIn: false }))];
    remBuy = [...remBuy, ...upBuy_opt_q];
    remBuy = remBuy.filter((i) => i.quantity > 0);
    // console.log("remBuy_opt:", remBuy_opt, "remBuy:", remBuy);
    console.log("qq");
  } else {
    console.log("eee");
    let tBuy = upBuy_opt_q.sort((a, b) => a.createdAt - b.createdAt);
    let tBuyId = [];
    tBuy = tBuy.map((i) => {
      if (tot_q_sell > 0) {
        if (i.opt_quantity > tot_q_sell) {
          i.quantity -= tot_q_sell;
          tot_q_sell = 0;
        } else {
          tot_q_sell -= i.opt_quantity;
          i.quantity -= i.opt_quantity;
        }
      }
      tBuyId.push(i._id);
      remBuy_opt.push({ ...i, isIn: true });
      let { opt_quantity, ...rest } = i;
      return {
        ...rest,
      };
    });
    remBuy = buyData.filter((i) => !tBuyId.includes(i._id));
    remBuy_opt = [...remBuy_opt, ...remBuy.map((i) => ({ ...i, isIn: false }))];
    remBuy = [...remBuy, ...tBuy];
    remBuy = remBuy.filter((i) => i.quantity > 0);
    let remSellId = upSell.map((i) => {
      remSell_opt.push({ ...i, quantity: 0, isIn: true });
      return i._id;
    });
    remSell = sellData.filter((i) => !remSellId.includes(i._id));
    remSell_opt = [
      ...remSell_opt,
      ...remSell.map((i) => ({ ...i, isIn: false })),
    ];
    remSell = remSell.filter((i) => i.quantity > 0);
  }
  remBuy = remBuy.map((i) => {
    let { int_qua, ...rest } = i;
    return { ...rest };
  });
  remSell = remSell.map((i) => {
    let { int_qua, ...rest } = i;
    return { ...rest };
  });
  return { remSell, remBuy, remSell_opt, remBuy_opt, opt_price: p_opt };
};
// console.log(update(buyData, sellData));
module.exports = update;
